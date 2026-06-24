"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// Shows the email address with a button to copy it to the clipboard.
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — ignore.
    }
  }

  return (
    <div className="flex items-center gap-1.5 text-sm text-foreground/70">
      <span className="select-all">{email}</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy email address"
        title={copied ? "Copied!" : "Copy email"}
        className="rounded p-1 transition-colors hover:bg-foreground/10 hover:text-foreground"
      >
        {copied ? (
          <Check className="size-4 text-green-600" />
        ) : (
          <Copy className="size-4" />
        )}
      </button>
    </div>
  );
}
