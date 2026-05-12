"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText } from "lucide-react";
import { useApi } from "@/config/axios";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";

// Point to the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// ─── Helper: convert first page of PDF → PNG File ────────────────────────────
async function pdfToImageFile(pdfFile) {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  // Extract only the first page (contracts are usually one page)
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2.0 }); // scale 2 = higher quality

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: canvas.getContext("2d"),
    viewport,
    canvas,
  }).promise;

  // Convert canvas → Blob → File
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas toBlob failed"));
      // Name it like the original PDF but with .png extension
      const imageName = pdfFile.name.replace(/\.pdf$/i, ".png");
      resolve(new File([blob], imageName, { type: "image/png" }));
    }, "image/png");
  });
}
// ─────────────────────────────────────────────────────────────────────────────

export default function UploadContract() {
  const navigate = useNavigate();
  const Api = useApi();
  const [file, setFile] = useState(null);        // raw file (image or PDF)
  const [preview, setPreview] = useState(null);  // preview URL
  const [isPdf, setIsPdf] = useState(false);
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false); // PDF → image progress

  const validateAndSetFile = async (selected) => {
    if (!selected) return;

    const isImage = selected.type.startsWith("image/");
    const isPdfFile = selected.type === "application/pdf";

    if (!isImage && !isPdfFile) {
      alert("Only images or PDF files are accepted");
      return;
    }

    setIsPdf(isPdfFile);
    setFile(selected);

    if (isImage) {
      setPreview(URL.createObjectURL(selected));
    } else {
      // Generate a preview from the first page of the PDF
      try {
        setConverting(true);
        const arrayBuffer = await selected.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: canvas.getContext("2d")!,
          viewport,
          canvas,
        }).promise;

        setPreview(canvas.toDataURL("image/png"));
      } catch (err) {
        console.error("PDF preview error:", err);
        setPreview(null); // fallback: no preview, show file info
      } finally {
        setConverting(false);
      }
    }
  };

  const handleFile = (e) => {
    e.preventDefault();
    validateAndSetFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handelSubmit = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    try {
      setLoading(true);

      let imageFile = file;

      // If it's a PDF, convert first page → PNG before sending
      if (isPdf) {
        imageFile = await pdfToImageFile(file);
      }

      const formData = new FormData();
      formData.append("image", imageFile); // backend expects 'image'

      const { data } = await Api.post("/addApi/addProject", formData);

      if (!data.success) {
        alert(data.message || "Failed to upload contract");
        return;
      }

      navigate(`/project/${data.projectId}`);
    } catch (error) {
      console.error(error?.response?.data?.message || error.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setIsPdf(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-white mb-3">
            Upload Your Contract
          </h1>
          <p className="text-gray-400 text-sm">
            Upload your contract image or PDF. PDFs will be automatically
            converted to an image before verification.
          </p>
        </div>

        {/* Upload Box */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative cursor-pointer border-2 border-dashed rounded-xl p-10 transition
            ${dragging ? "border-blue-500 bg-blue-500/5" : "border-blue-500/30"}`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleFile}
          />

          {/* Remove Button */}
          {file && (
            <button
              onClick={(e) => { e.stopPropagation(); removeFile(); }}
              className="absolute top-3 right-3 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full p-1 transition"
            >
              <X size={16} />
            </button>
          )}

          {/* Content */}
          {converting ? (
            // Converting spinner
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Generating PDF preview...</p>
            </div>

          ) : preview ? (
            // Image preview (works for both image uploads and PDF first-page preview)
            <div className="flex flex-col items-center gap-3">
              <img
                src={preview}
                alt="contract preview"
                className="max-h-64 mx-auto rounded-lg object-contain"
              />
              {isPdf && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                  📋 PDF · will be converted to image on upload
                </span>
              )}
            </div>

          ) : file ? (
            // Fallback file info (PDF preview failed)
            <div className="flex flex-col items-center gap-3">
              <FileText size={48} className="text-blue-400" />
              <p className="text-sm text-gray-200 font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                PDF · will be converted to image on upload
              </span>
            </div>

          ) : (
            // Empty state
            <div className="flex flex-col items-center gap-4">
              <Upload size={28} className="text-blue-400" />
              <p className="text-gray-300 text-sm">
                Drag & drop your contract here
              </p>
              <p className="text-gray-500 text-xs">
                Accepts images (JPG, PNG) and PDF files
              </p>
            </div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
          onClick={handelSubmit}
          disabled={loading || converting}
          className="w-full mt-8 bg-blue-600 flex justify-center items-center gap-4
            hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            "Verify Contract"
          )}
        </motion.button>
      </div>
    </div>
  );
}