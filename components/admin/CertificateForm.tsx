"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Certificate } from "@/types";
import {
  createCertificate,
  updateCertificate,
  type CertificateInput,
} from "@/app/admin/certificates/actions";

export default function CertificateForm({
  initial,
}: {
  initial?: Certificate;
}) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [issuer, setIssuer] = useState(initial?.issuer ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [verifyUrl, setVerifyUrl] = useState(initial?.verify_url ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    String(initial?.display_order ?? 0),
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const input: CertificateInput = {
      name: name.trim(),
      issuer: issuer.trim(),
      image_url: imageUrl.trim() || null,
      verify_url: verifyUrl.trim() || null,
      display_order: Number(displayOrder) || 0,
    };

    const result = editing
      ? await updateCertificate(initial!.id, input)
      : await createCertificate(input);

    if (result.error) {
      toast.error(result.error);
      setSaving(false);
      return;
    }

    toast.success(editing ? "Saved" : "Created");
    router.push("/admin/certificates");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="issuer">Issuer</Label>
        <Input
          id="issuer"
          required
          value={issuer}
          onChange={(event) => setIssuer(event.target.value)}
          placeholder="e.g. AWS, Microsoft, Coursera"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="https://…"
        />
        <p className="text-xs text-muted-foreground">
          Paste an image URL for now — direct file upload is coming soon.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="verify_url">Verify URL</Label>
        <Input
          id="verify_url"
          value={verifyUrl}
          onChange={(event) => setVerifyUrl(event.target.value)}
          placeholder="https://… (optional)"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="display_order">Display order</Label>
        <Input
          id="display_order"
          type="number"
          value={displayOrder}
          onChange={(event) => setDisplayOrder(event.target.value)}
          className="w-32"
        />
        <p className="text-xs text-muted-foreground">
          Lower numbers appear first.
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : editing ? "Save changes" : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/certificates")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
