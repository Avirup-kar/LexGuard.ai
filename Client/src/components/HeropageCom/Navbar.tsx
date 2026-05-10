import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, ArrowRight } from "lucide-react";
import { Show, useClerk, UserButton } from "@clerk/react";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openSignIn, openSignUp } = useClerk();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-subtle"
        style={{ backgroundColor: scrolled ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.8)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="relative">
              <Shield className="h-10 w-10 text-primary" />
              <div className="absolute inset-0 blur-md bg-primary/20" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              <span className="text-foreground">Lex</span>
              <span className="gradient-text-blue">Guard</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-secondary-custom hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

        <Show when="signed-out">
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => openSignIn()} className="text-sm px-4 py-2 rounded-lg border border-subtle text-foreground hover:bg-secondary transition-colors">
              Login
            </button>
            <button onClick={() => openSignUp()} className="text-sm px-4 py-2 rounded-lg btn-blue text-foreground font-medium glow-blue-sm transition-all flex items-center gap-1.5">
              Try Free <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </Show>

        <Show when="signed-in">
          <UserButton />
        </Show>

          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="text-2xl text-foreground font-medium">
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4 w-64">
              <button className="text-base px-6 py-3 rounded-lg border border-subtle text-foreground w-full">Login</button>
              <button className="text-base px-6 py-3 rounded-lg btn-blue text-foreground font-medium glow-blue-sm w-full flex items-center justify-center gap-2">
                Try Free <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
