"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";
import { updateProfile, type ProfileInput } from "@/app/admin/profile/actions";

export default function ProfileForm({ initial }: { initial: Profile | null }) {
  const router = useRouter();

  const [name, setName] = useState(initial?.name ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(initial?.linkedin_url ?? "");
  const [githubUrl, setGithubUrl] = useState(initial?.github_url ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const input: ProfileInput = {
      name: name.trim(),
      title: title.trim(),
      bio: bio.trim(),
      email: email.trim() || null,
      linkedin_url: linkedinUrl.trim() || null,
      github_url: githubUrl.trim() || null,
    };

    const result = await updateProfile(input);

    if (result.error) {
      toast.error(result.error);
      setSaving(false);
      return;
    }

    toast.success("Saved");
    router.refresh();
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Full-Stack Developer"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bio">Bio / welcome message</Label>
        <Textarea
          id="bio"
          rows={5}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            id="linkedin_url"
            value={linkedinUrl}
            onChange={(event) => setLinkedinUrl(event.target.value)}
            placeholder="https://linkedin.com/in/…"
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

      <div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
