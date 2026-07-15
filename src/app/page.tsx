"use client";

import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/text")
      .then((r) => r.json())
      .then((data) => {
        if (data.text) setSavedText(data.text);
      });
  }, []);

  const save = useCallback(async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      setSavedText(text.trim());
      setText("");
    } finally {
      setSaving(false);
    }
  }, [text]);

  async function copyToClipboard() {
    if (!savedText) return;
    await navigator.clipboard.writeText(savedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-1">Text Drop</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
          Paste text here. Open this page on another device to see it.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          rows={6}
          className="w-full resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 text-sm outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors mb-3"
        />

        <button
          onClick={save}
          disabled={!text.trim() || saving}
          className="w-full rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 mb-8"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {savedText !== null && (
          <>
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">
              Saved text
            </h2>
            <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 mb-3">
              <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed max-h-[50vh] overflow-y-auto font-sans">
                {savedText || "(empty)"}
              </pre>
            </div>
            <button
              onClick={copyToClipboard}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
