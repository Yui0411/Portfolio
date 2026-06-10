"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Experience } from "@/types";
import {
  createExperience,
  updateExperience,
  type ExperienceInput,
} from "@/app/admin/experience/actions";

export default function ExperienceForm({ initial }: { initial?: Experience }) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [company, setCompany] = useState(initial?.company ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [startDate, setStartDate] = useState(initial?.start_date ?? "");
  const [endDate, setEndDate] = useState(initial?.end_date ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [techStack, setTechStack] = useState(
    (initial?.tech_stack ?? []).join(", "),
  );
  const [displayOrder, setDisplayOrder] = useState(
    String(initial?.display_order ?? 0),
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const input: ExperienceInput = {
      company: company.trim(),
      role: role.trim(),
      start_date: startDate,
      end_date: endDate || null, // empty = current job
      description: description.trim(),
      tech_stack: techStack
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      display_order: Number(displayOrder) || 0,
    };

    const result = editing
      ? await updateExperience(initial!.id, input)
      : await createExperience(input);

    if (result.error) {
      toast.error(result.error);
      setSaving(false);
      return;
    }

    toast.success(editing ? "Saved" : "Created");
    router.push("/admin/experience");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <div className="grid gap-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          required
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          required
          value={role}
          onChange={(event) => setRole(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="start_date">Start date</Label>
          <Input
            id="start_date"
            type="date"
            required
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end_date">End date</Label>
          <Input
            id="end_date"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty if this is your current job.
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tech_stack">Tech stack</Label>
        <Input
          id="tech_stack"
          value={techStack}
          onChange={(event) => setTechStack(event.target.value)}
          placeholder="C#, ASP.NET, PostgreSQL"
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated list.
        </p>
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
          Lower numbers appear first on the timeline.
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : editing ? "Save changes" : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/experience")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
