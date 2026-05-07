import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";



export async function getProjectHistory(req: Request, res: Response){
    try {
        const { userId } = getAuth(req);

         if(!userId) {
           return res.json({ success: false, message: "unauthorised login first." });
         }

         const project = await prisma.project.findMany({
            where: { userId },
            orderBy: {
              createdAt: "desc" // 🔥 latest first
            },
            select: {
              id: true,
              contractData: true
            }
         });

         if (!project) {
          return res.status(404).json({
             message: "Project not found or access denied"
          });
        }

         res.status(200).json({ success: true,  project });
    } catch (error: any) {
         return res.status(500).json({
           success: false,
           message: error.message || "Internal server error"
         });
    }   
}

export async function getProject(req: Request, res: Response) {
  try {
      const { projectId } = req.params;
      const { userId } = getAuth(req);

      if(!projectId && !userId) {
        return res.status(404).json({
         success: false,
         message: "projectId & userId needed"
        });
      }

      const project = await prisma.project.findFirst({
        where: {
          id: projectId as string,
          userId: userId as string
        },
        select: {
          id: true,
          imageUrl: true,
          contractData: true,
          email: true,
          expertData: true
        }
      })

      if (!project) {
        return res.status(404).json({
           message: "Project not found or access denied"
        });
      }

       res.status(200).json({ success: true,  project });
  } catch (error: any) {
      return res.status(500).json({
         success: false,
         message: error.message || "Internal server error"
      });
  }
}