import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ListingForm from "@/components/listings/ListingForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateListing() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await base44.functions.invoke("createListing", data);
      if (res?.data?.error) throw new Error(res.data.error);
      toast.success("Listing posted — it'll auto-expire in 14 days.");
      navigate("/my-listings");
    } catch (e) {
      toast.error(e?.message || "Could not post listing. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="font-heading text-lg font-semibold">Post a room</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="mb-8 text-sm text-muted-foreground">Fill out the structured form — it takes about two minutes and gives students everything they need to decide.</p>
        <ListingForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}