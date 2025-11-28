import { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export const ImageUpload = ({ onImageSelect, selectedImage, onClear }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      onImageSelect(file, preview);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
    }
  }, [onImageSelect, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      onImageSelect(file, preview);
    }
  };

  return (
    <div className="w-full">
      {selectedImage ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-border bg-card shadow-elegant">
          <img src={selectedImage} alt="Uploaded" className="w-full h-auto" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
            ${isDragging 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-border hover:border-primary/50 hover:bg-accent/5"
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Upload Your Image</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop or click to browse
          </p>
          <Button variant="outline" className="pointer-events-none">
            Choose File
          </Button>
        </div>
      )}
    </div>
  );
};
