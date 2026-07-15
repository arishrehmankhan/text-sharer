"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json();
      const shareUrl = `${window.location.origin}/t/${data.id}`;
      setUrl(shareUrl);
      setText("");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyLink() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function createAnother() {
    setUrl(null);
    setCopied(false);
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-1">Text Drop</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
          Paste text, get a link, open it anywhere.
        </p>

        {url ? (
          <div className="space-y-4">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 flex items-center gap-2">
              <input
                readOnly
                value={url}
                className="flex-1 bg-transparent outline-none text-sm font-mono"
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={copyLink}
                className="shrink-0 px-3 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <button
              onClick={createAnother}
              className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              Share another text
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              rows={8}
              className="w-full resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 text-sm outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
              autoFocus
            />
            <button
              type="submit"
              disabled={!text.trim() || submitting}
              className="w-full rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {submitting ? "Creating..." : "Generate Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
