import { motion } from "framer-motion";
import { FileText, Lightbulb } from "lucide-react";

const clauses = [
  { title: "Payment Terms", badge: "Danger", badgeClass: "bg-[#EF4444]/15 text-[#EF4444]", border: "#EF4444", bg: "#150a0a", desc: "Client can delay payment 90 days" },
  { title: "Confidentiality", badge: "Medium", badgeClass: "bg-[#F59E0B]/15 text-[#F59E0B]", border: "#F59E0B", bg: "#151005", desc: "Cannot share work for 2 years" },
  { title: "Governing Law", badge: "Safe", badgeClass: "bg-[#22C55E]/15 text-[#22C55E]", border: "#22C55E", bg: "#0a150a", desc: "Standard jurisdiction clause" },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const ContractCard = () => (
  <div className="relative">
    <div className="absolute -inset-8 rounded-3xl" style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
    <div className="relative rounded-2xl border border-subtle overflow-hidden animate-float bg-card-dark">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-subtle">
        <div className="flex items-center gap-2.5">
          <FileText className="h-4 w-4 text-[#EF4444]" />
          <span className="text-sm font-medium text-foreground">freelance-agreement</span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#EF4444]/15 text-[#EF4444] uppercase tracking-wider">High Risk</span>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="p-4 space-y-2.5">
        {clauses.map((c) => (
          <motion.div key={c.title} variants={fadeUp} className="rounded-lg px-4 py-3 border-l-[3px]" style={{ borderLeftColor: c.border, backgroundColor: c.bg }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">{c.title}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.badgeClass}`}>{c.badge}</span>
            </div>
            <p className="text-xs text-secondary-custom">{c.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.4 }} className="mx-4 mb-4 rounded-lg px-4 py-3 border-l-[3px] border-l-primary" style={{ backgroundColor: "rgba(59,130,246,0.06)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">Suggested Fix</span>
        </div>
        <p className="text-xs text-secondary-custom">Replace "Net 90" with "Net 30" payment terms and add a 1.5% monthly late fee clause to protect your cash flow.</p>
      </motion.div>
    </div>
  </div>
);

export default ContractCard;
