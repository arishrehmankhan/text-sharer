"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ViewPage() {
  const { id } = useParams<{ id: string }>();
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/text?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setText(data.text))
      .catch(() => setError("Text not found or link is invalid."));
  }, [id]);

  async function copyText() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">{error}</p>
          <a href="/" className="mt-4 inline-block text-sm text-zinc-500 underline hover:text-zinc-800 dark:hover:text-zinc-200">
            Share new text
          </a>
        </div>
      </div>
    );
  }

  if (text === null) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-1">Text Drop</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">Your shared text</p>

        <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 mb-4">
          <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed max-h-[70vh] overflow-y-auto font-sans">
            {text}
          </pre>
        </div>

        <button
          onClick={copyText}
          className="w-full rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
      </div>
    </div>
  );
}
