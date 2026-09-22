import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Home as HomeIcon, Info } from "lucide-react";

const CONTACT_EMAIL = "hello@campuslease.app";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `CampusLease message from ${name || "a student"}`
  )}&body=${encodeURIComponent(`${message}\n\n— ${name}${email ? ` (${email})` : ""}`)}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link to="/" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-heading text-lg font-semibold">Contact</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Get in touch</h1>
        <p className="mt-4 text-base leading-relaxed text-foreground">
          Questions, feedback, or a bug to report? We're a small student team and we read every message. Reach us
          directly at <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary underline">{CONTACT_EMAIL}</a>,
          or send a note through the form below — it opens your email app with everything pre-filled.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <Mail className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-heading text-base font-semibold">Email</h2>
            <p className="mt-1 text-sm text-muted-foreground">The most reliable way to reach us.</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 inline-block text-sm font-medium text-primary underline">{CONTACT_EMAIL}</a>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Info className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-heading text-base font-semibold">About CampusLease</h2>
            <p className="mt-1 text-sm text-muted-foreground">Learn what we're building and who it's for.</p>
            <Link to="/about" className="mt-3 inline-block text-sm font-medium text-primary underline">Read the About page</Link>
          </div>
        </div>

        <form
          className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = mailtoHref;
          }}
        >
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted-foreground">Your name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Lee"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground">Your email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-muted-foreground">Message</label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind…"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Mail className="h-4 w-4" /> Send message
          </button>
        </form>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <HomeIcon className="h-4 w-4" /> Browse listings
          </Link>
          <Link to="/about" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Info className="h-4 w-4" /> About
          </Link>
        </div>
      </div>
    </div>
  );
}