import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck, AlertTriangle, X, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const u = await base44.auth.me();
        if (active) setMe(u);
      } catch {
        /* ignore */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await base44.entities.User.delete(me.id);
      await base44.auth.logout();
    } catch (err) {
      toast.error("Could not delete account. Please contact support.");
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-3">
          <h1 className="font-heading text-lg font-semibold">Settings</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {(me?.full_name || me?.email || "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-medium">{me?.full_name || "Verified student"}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="truncate">{me?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-2xl border border-border bg-card px-5 py-4 text-left text-sm font-medium transition active:opacity-60"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" /> Log out
            </button>

            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
              <h3 className="font-heading text-base font-semibold text-destructive">Delete account</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Permanently delete your account and remove your listings. This can't be undone.
              </p>
              <button
                onClick={() => setConfirmOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition hover:opacity-90"
              >
                <AlertTriangle className="h-4 w-4" /> Delete my account
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirmOpen(false)}>
            <motion.div
              className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <button onClick={() => setConfirmOpen(false)} className="rounded-full p-1 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>
              <h3 className="font-heading text-lg font-semibold">Delete account?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your profile and all your listings will be permanently removed. This action cannot be undone.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition hover:opacity-90 disabled:opacity-50"
                >
                  {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}