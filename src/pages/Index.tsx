import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "@/components/ImageUpload";
import { StyleSelector } from "@/components/StyleSelector";
import { ResultDisplay } from "@/components/ResultDisplay";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key exists
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      navigate("/auth");
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("gemini_api_key");
    navigate("/auth");
  };

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setSelectedImagePreview(preview);
    setGeneratedImage(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setSelectedImagePreview(null);
    setGeneratedImage(null);
  };

  const handleGenerate = async () => {
    if (!selectedFile || !selectedStyle) {
      toast({
        title: "Missing information",
        description: "Please upload an image and select a style",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Backend Required",
      description: "Image generation requires a backend service to be configured.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Design</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            AI Designer
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your interior spaces with AI. Upload an image and redesign it in any style instantly.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        <section className="max-w-4xl mx-auto">
          <ImageUpload
            onImageSelect={handleImageSelect}
            selectedImage={selectedImagePreview}
            onClear={handleClear}
          />
        </section>

        {selectedImagePreview && (
          <section className="max-w-6xl mx-auto">
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleSelect={setSelectedStyle}
            />
          </section>
        )}

        {selectedImagePreview && selectedStyle && (
          <section className="max-w-4xl mx-auto flex justify-center">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="gap-2 text-lg px-8 py-6"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? "Generating..." : "Generate Redesign"}
            </Button>
          </section>
        )}

        {(selectedImagePreview || generatedImage) && (
          <section className="max-w-6xl mx-auto">
            <ResultDisplay
              originalImage={selectedImagePreview}
              generatedImage={generatedImage}
              isGenerating={isGenerating}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground border-t border-border mt-20">
        <p>Powered by Lovable AI • Transform your spaces with artificial intelligence</p>
      </footer>
    </div>
  );
};

export default Index;
