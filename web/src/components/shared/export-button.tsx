"use client";

import { Download, FileText, FileSpreadsheet, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GeneratedCaption, GeneratedHashtag } from "@/types/caption";

interface ExportData {
  captions: GeneratedCaption[];
  hashtags: GeneratedHashtag[];
}

interface ExportButtonProps {
  data: ExportData;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportCSV(data: ExportData) {
  const header = "text,platform,charCount,hasEmojis,hasCta\n";
  const rows = data.captions
    .map((c) => {
      const escapedText = `"${c.text.replace(/"/g, '""')}"`;
      return `${escapedText},${c.platform},${c.charCount},${c.hasEmojis},${c.hasCta}`;
    })
    .join("\n");
  downloadFile(header + rows, "captions-export.csv", "text/csv;charset=utf-8");
}

function exportMarkdown(data: ExportData) {
  let md = "# Captions\n\n";
  data.captions.forEach((caption, i) => {
    md += `${i + 1}. **${caption.platform}** (${caption.charCount} chars)\n\n`;
    md += `   ${caption.text}\n\n`;
    if (caption.hasEmojis || caption.hasCta) {
      const tags: string[] = [];
      if (caption.hasEmojis) tags.push("Emoji");
      if (caption.hasCta) tags.push("CTA");
      md += `   _${tags.join(", ")}_\n\n`;
    }
  });

  if (data.hashtags.length > 0) {
    md += "## Hashtags\n\n";
    data.hashtags.forEach((h) => {
      md += `- #${h.tag} (${h.category}, ${Math.round(h.relevancy * 100)}%)\n`;
    });
    md += "\n";
  }

  downloadFile(md, "captions-export.md", "text/markdown;charset=utf-8");
}

function exportPlainText(data: ExportData) {
  const text = data.captions.map((c) => c.text).join("\n\n");
  downloadFile(text, "captions-export.txt", "text/plain;charset=utf-8");
}

export function ExportButton({
  data,
  variant = "outline",
  size = "sm",
}: ExportButtonProps) {
  const hasData = data.captions.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={!hasData}>
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-xs">
          Export Format
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => exportCSV(data)}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          CSV (.csv)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportMarkdown(data)}>
          <FileText className="h-4 w-4 mr-2" />
          Markdown (.md)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportPlainText(data)}>
          <FileType className="h-4 w-4 mr-2" />
          Plain Text (.txt)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
