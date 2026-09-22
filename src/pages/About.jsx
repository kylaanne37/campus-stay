import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home as HomeIcon, Mail, ShieldCheck, GraduationCap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link to="/" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-heading text-lg font-semibold">About</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight">A sublease marketplace built for students, by students</h1>
        <p className="mt-6 text-base leading-relaxed text-foreground">
          CampusLease is a verified, searchable sublease marketplace built exclusively for college students to find
          and list housing without the noise of social media. Every member signs up with a verified <strong>.edu email
          address</strong>, so every listing comes from a real, enrolled student — not an anonymous account, a scammer,
          or a property-management bot. That single requirement is what makes the directory trustworthy: when you
          browse a room, you know the person posting it is a classmate.
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground">
          The platform is a focused bulletin board, not a payments or messaging app. Hosts post structured listings —
          rent, utilities, roommate count, gender makeup, photos, parking, and a short bio — and students search by
          term, year, price, and living dynamic. When you find a fit, you connect directly with the host through their
          preferred contact method. Listings auto-expire after 14 days and prompt owners to re-confirm availability, so
          the directory stays fresh and you never waste time chasing a room that was filled months ago.
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground">
          CampusLease is built and maintained by a small student team that got tired of scrolling through cluttered
          Facebook housing groups and spammy Craigslist posts. We keep the product simple, student-only, and free of
          the distractions that make other housing boards exhausting. If you have ideas, feedback, or a bug to report,
          we'd love to hear from you on our <Link to="/contact" className="font-medium text-primary underline">Contact</Link> page.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-heading text-base font-semibold">Verified students only</h2>
            <p className="mt-1 text-sm text-muted-foreground">A .edu email is required to join, post, or connect.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-heading text-base font-semibold">No stale listings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Posts auto-expire and owners re-confirm availability.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <Mail className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-heading text-base font-semibold">Direct connections</h2>
            <p className="mt-1 text-sm text-muted-foreground">Reach hosts through their preferred contact method — no middleman.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <HomeIcon className="h-4 w-4" /> Browse listings
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Mail className="h-4 w-4" /> Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}