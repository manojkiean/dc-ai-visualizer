import { Download, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ComparisonSlider } from "./ComparisonSlider";

interface ResultDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
}

export const ResultDisplay = ({ originalImage, generatedImage, isGenerating }: ResultDisplayProps) => {
  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "redesigned-image.png";
      link.click();
    }
  };

  if (!originalImage && !generatedImage) return null;

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Result
      </h2>

      {/* Comparison Slider - shown when both images are available */}
      {originalImage && generatedImage && !isGenerating && (
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-center">Before & After Comparison</h3>
          <ComparisonSlider
            beforeImage={originalImage}
            afterImage={generatedImage}
            beforeLabel="Original"
            afterLabel="Redesigned"
          />
        </Card>
      )}

      {/* Loading state or waiting for generation */}
      {isGenerating && (
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-center">Redesigning...</h3>
          <div className="rounded-lg overflow-hidden border border-border bg-muted/50 min-h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Creating your design...</p>
            </div>
          </div>
        </Card>
      )}

      {/* Original only - before generation starts */}
      {originalImage && !generatedImage && !isGenerating && (
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-center">Original Image</h3>
          <div className="rounded-lg overflow-hidden border border-border">
            <img src={originalImage} alt="Original" className="w-full h-auto" />
          </div>
          <p className="text-center text-muted-foreground text-sm">
            Select options above and click "Redesign Room" to generate
          </p>
        </Card>
      )}

      {generatedImage && !isGenerating && (
        <div className="flex justify-center">
          <Button variant="gradient" size="lg" onClick={handleDownload} className="gap-2">
            <Download className="w-5 h-5" />
            Download Redesigned Image
          </Button>
        </div>
      )}
    </div>
  );
};
