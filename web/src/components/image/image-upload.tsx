"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onRemove: () => void;
  preview: string | null;
  isAnalyzing: boolean;
  analysis: string | null;
}

export function ImageUpload({
  onImageSelect,
  onRemove,
  preview,
  isAnalyzing,
  analysis,
}: ImageUploadProps) {
  const t = useTranslations("generate");
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  };

  if (preview) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isAnalyzing && (
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("analyzing")}
            </div>
          )}

          {analysis && (
            <div className="mt-3">
              <Badge variant="secondary" className="mb-2">
                {t("imageAnalysis")}
              </Badge>
              <p className="text-sm text-muted-foreground">{analysis}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">{t("uploadImageDesc")}</p>
    </label>
  );
}
