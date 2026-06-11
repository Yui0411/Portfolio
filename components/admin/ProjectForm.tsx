"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Project } from "@/types";
import {
  createProject,
  updateProject,
  type ProjectInput,
} from "@/app/admin/projects/actions";

export default function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [techStack, setTechStack] = useState(
    (initial?.tech_stack ?? []).join(", "),
  );
  const [liveUrl, setLiveUrl] = useState(initial?.live_url ?? "");
  const [githubUrl, setGithubUrl] = useState(initial?.github_url ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    String(initial?.display_order ?? 0),
  );
  const [isVisible, setIsVisible] = useState(initial?.is_visible ?? true);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const input: ProjectInput = {
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      image_url: imageUrl.trim() || null,
      tech_stack: techStack
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      live_url: liveUrl.trim() || null,
      github_url: githubUrl.trim() || null,
      display_order: Number(displayOrder) || 0,
      is_visible: isVisible,
    };

    const result = editing
      ? await updateProject(initial!.id, input)
      : await createProject(input);

    if (result.error) {
      toast.error(result.error);
      setSaving(false);
      return;
    }

    toast.success(editing ? "Saved" : "Created");
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="summary">Summary</Label>
        <Input
          id="summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="Short label shown on the timeline dot"
        />
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
        <Label>Image</Label>
        <ImageUpload
          value={imageUrl || null}
          onChange={(url) => setImageUrl(url ?? "")}
          folder="projects"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tech_stack">Tech stack</Label>
        <Input
          id="tech_stack"
          value={techStack}
          onChange={(event) => setTechStack(event.target.value)}
          placeholder="Next.js, TypeScript, Supabase"
        />
        <p className="text-xs text-muted-foreground">Comma-separated list.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="live_url">Live URL</Label>
          <Input
            id="live_url"
            value={liveUrl}
            onChange={(event) => setLiveUrl(event.target.value)}
            placeholder="https://…"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            value={githubUrl}
            onChange={(event) => setGithubUrl(event.target.value)}
            placeholder="https://github.com/…"
          />
        </div>
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

      <div className="flex items-center gap-3">
        <Switch
          id="is_visible"
          checked={isVisible}
          onCheckedChange={setIsVisible}
        />
        <Label htmlFor="is_visible" className="font-normal">
          Visible on the public site
        </Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : editing ? "Save changes" : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
