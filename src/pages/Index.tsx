import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { StyleSelector } from "@/components/StyleSelector";
import { RoomTypeSelector } from "@/components/RoomTypeSelector";
import { ApplianceSelector } from "@/components/ApplianceSelector";
import { ResultDisplay } from "@/components/ResultDisplay";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [customRoomName, setCustomRoomName] = useState("");
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = async (file: File, preview: string) => {
    setSelectedFile(file);
    setSelectedImagePreview(preview);
    setGeneratedImage(null);
    setSelectedRoom(null);
    setCustomRoomName("");
    setSelectedAppliances([]);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setSelectedImagePreview(null);
    setSelectedRoom(null);
    setCustomRoomName("");
    setSelectedAppliances([]);
    setGeneratedImage(null);
  };

  const handleApplianceToggle = (applianceId: string) => {
    setSelectedAppliances(prev =>
      prev.includes(applianceId)
        ? prev.filter(id => id !== applianceId)
        : [...prev, applianceId]
    );
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

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const reader = new FileReader();
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const base64Data = imageData.split(",")[1];
      const mimeType = imageData.split(";")[0].split(":")[1];

      const roomTypeToSend = selectedRoom === "other" && customRoomName
        ? customRoomName
        : selectedRoom;

      const styleDescriptions: Record<string, string> = {
        modern: "clean lines, minimalist furniture, neutral colors with bold accents, contemporary design",
        scandinavian: "light wood, white walls, cozy textiles, hygge atmosphere, functional simplicity",
        industrial: "exposed brick, metal fixtures, raw materials, urban loft aesthetic",
        boho: "eclectic patterns, plants, natural textures, warm earth tones, artistic flair",
        luxury: "high-end materials, elegant furnishings, sophisticated color palette, premium finishes",
        cozy: "warm lighting, soft textures, comfortable furniture, inviting atmosphere"
      };

      const styleDescription = styleDescriptions[selectedStyle] || selectedStyle;

      const prompt = `Transform this interior space into a ${selectedStyle} style design. 
Apply these design characteristics: ${styleDescription}.
${roomTypeToSend ? `This is a ${roomTypeToSend}.` : ""}
${selectedAppliances.length > 0 ? `Include or enhance these elements: ${selectedAppliances.join(", ")}.` : ""}
Keep the same room layout and perspective. Generate a photorealistic redesigned version of this space.`;

      const { data, error } = await supabase.functions.invoke("redesign-room", {
        body: { prompt, imageBase64: base64Data, mimeType },
      });

      if (error) {
        throw new Error(error.message || "Failed to redesign image");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast({
          title: "Success!",
          description: "Your room has been redesigned",
        });
      } else {
        throw new Error("No image generated in response");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to redesign image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
            <RoomTypeSelector
              selectedRoom={selectedRoom}
              onRoomSelect={setSelectedRoom}
              detectedRoom={null}
              isDetecting={false}
              customRoomName={customRoomName}
              onCustomRoomChange={setCustomRoomName}
            />
          </section>
        )}

        {selectedImagePreview && selectedRoom && (
          <section className="max-w-6xl mx-auto">
            <ApplianceSelector
              roomType={selectedRoom === "other" ? "living-room" : selectedRoom}
              selectedAppliances={selectedAppliances}
              onApplianceToggle={handleApplianceToggle}
            />
          </section>
        )}

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
        <p>Powered by AI • Transform your spaces with artificial intelligence</p>
      </footer>
    </div>
  );
};

export default Index;
