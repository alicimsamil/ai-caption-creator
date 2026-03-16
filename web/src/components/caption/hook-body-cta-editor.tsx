"use client";

import { useMemo } from "react";
import { Combine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/shared/copy-button";

interface HookBodyCtaEditorProps {
  hook: string;
  body: string;
  cta: string;
  onHookChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onCtaChange: (value: string) => void;
  onCombine?: (combined: string) => void;
}

export function HookBodyCtaEditor({
  hook,
  body,
  cta,
  onHookChange,
  onBodyChange,
  onCtaChange,
  onCombine,
}: HookBodyCtaEditorProps) {
  const combined = useMemo(() => {
    return [hook, body, cta].filter(Boolean).join("\n\n");
  }, [hook, body, cta]);

  const totalChars = combined.length;

  const handleCombine = () => {
    onCombine?.(combined);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-4">
        <SectionEditor
          emoji="🎣"
          label="Hook"
          description="Attention-grabbing opening line"
          value={hook}
          onChange={onHookChange}
          placeholder="Stop scrolling! Here's why..."
          rows={2}
        />
        <SectionEditor
          emoji="📝"
          label="Body"
          description="Main content and message"
          value={body}
          onChange={onBodyChange}
          placeholder="The main content of your caption goes here..."
          rows={4}
        />
        <SectionEditor
          emoji="📢"
          label="CTA"
          description="Call to action"
          value={cta}
          onChange={onCtaChange}
          placeholder="Follow for more! Link in bio..."
          rows={2}
        />

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            Total: {totalChars} chars
          </Badge>
          <Button size="sm" onClick={handleCombine} disabled={!combined}>
            <Combine className="h-3 w-3 mr-1" />
            Combine
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Preview</CardTitle>
            {combined && <CopyButton text={combined} size="sm" variant="outline" />}
          </div>
        </CardHeader>
        <CardContent>
          {combined ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {combined}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Start typing in the sections to see a preview of your combined
              caption here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface SectionEditorProps {
  emoji: string;
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows: number;
}

function SectionEditor({
  emoji,
  label,
  description,
  value,
  onChange,
  placeholder,
  rows,
}: SectionEditorProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <span>{emoji}</span>
            {label}
          </Label>
          <Badge variant="outline" className="text-xs">
            {value.length} chars
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-sm resize-none"
          rows={rows}
        />
      </CardContent>
    </Card>
  );
}
