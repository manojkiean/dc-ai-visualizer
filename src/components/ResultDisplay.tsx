import { Download, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

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
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original */}
        {originalImage && (
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold text-center">Original</h3>
            <div className="rounded-lg overflow-hidden border border-border">
              <img src={originalImage} alt="Original" className="w-full h-auto" />
            </div>
          </Card>
        )}

        {/* Generated */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-center">Redesigned</h3>
          <div className="rounded-lg overflow-hidden border border-border bg-muted/50 min-h-[300px] flex items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Creating your design...</p>
              </div>
            ) : generatedImage ? (
              <img src={generatedImage} alt="Redesigned" className="w-full h-auto" />
            ) : (
              <p className="text-muted-foreground">Your redesigned image will appear here</p>
            )}
          </div>
        </Card>
      </div>

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
