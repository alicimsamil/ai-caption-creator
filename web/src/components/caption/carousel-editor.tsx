"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Edit3, Copy, Check, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";

interface CarouselEditorProps {
  captions: string[];
  onChange: (captions: string[]) => void;
}

export function CarouselEditor({ captions, onChange }: CarouselEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);

  const moveSlide = (index: number, direction: "up" | "down") => {
    const newCaptions = [...captions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCaptions.length) return;
    [newCaptions[index], newCaptions[targetIndex]] = [
      newCaptions[targetIndex],
      newCaptions[index],
    ];
    onChange(newCaptions);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(captions[index]);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const newCaptions = [...captions];
    newCaptions[editingIndex] = editValue;
    onChange(newCaptions);
    setEditingIndex(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const addSlide = () => {
    onChange([...captions, ""]);
    setEditingIndex(captions.length);
    setEditValue("");
  };

  const removeSlide = (index: number) => {
    const newCaptions = captions.filter((_, i) => i !== index);
    onChange(newCaptions);
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditValue("");
    }
  };

  const handleCopyAll = async () => {
    const allText = captions.join("\n---\n");
    await navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Carousel Slides ({captions.length})
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            {copiedAll ? (
              <Check className="h-3 w-3 mr-1 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 mr-1" />
            )}
            Copy All
          </Button>
          <Button variant="outline" size="sm" onClick={addSlide}>
            <Plus className="h-3 w-3 mr-1" />
            Add Slide
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {captions.map((caption, index) => (
          <Card key={index} className="group hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <Badge
                    variant="secondary"
                    className="text-xs font-mono w-8 justify-center"
                  >
                    {index + 1}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveSlide(index, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveSlide(index, "down")}
                    disabled={index === captions.length - 1}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex-1 min-w-0">
                  {editingIndex === index ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="text-sm"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={saveEdit}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {caption || (
                        <span className="text-muted-foreground italic">
                          Empty slide - click edit to add content
                        </span>
                      )}
                    </p>
                  )}

                  {editingIndex !== index && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {caption.length} chars
                      </Badge>
                    </div>
                  )}
                </div>

                {editingIndex !== index && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={caption} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(index)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSlide(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
