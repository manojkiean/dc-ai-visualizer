import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import scandinavianImg from "@/assets/styles/scandinavian.jpg";
import modernImg from "@/assets/styles/modern.jpg";
import cozyImg from "@/assets/styles/cozy.jpg";
import industrialImg from "@/assets/styles/industrial.jpg";
import bohoImg from "@/assets/styles/boho.jpg";
import luxuryImg from "@/assets/styles/luxury.jpg";

const designStyles = [
  { 
    name: "Scandinavian", 
    image: scandinavianImg,
    description: "Light & minimalist"
  },
  { 
    name: "Modern", 
    image: modernImg,
    description: "Sleek & contemporary"
  },
  { 
    name: "Cozy", 
    image: cozyImg,
    description: "Warm & inviting"
  },
  { 
    name: "Industrial", 
    image: industrialImg,
    description: "Raw & urban"
  },
  { 
    name: "Boho", 
    image: bohoImg,
    description: "Eclectic & artistic"
  },
  { 
    name: "Luxury", 
    image: luxuryImg,
    description: "Elegant & refined"
  },
];

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // Check if API key is already stored
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) {
      navigate("/");
    }
  }, [navigate]);

  const validateApiKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }],
          }),
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your Gemini API key",
      });
      return;
    }

    try {
      setLoading(true);
      
      const isValid = await validateApiKey(apiKey);
      
      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Invalid API Key",
          description: "Please check your Gemini API key and try again",
        });
        return;
      }

      localStorage.setItem("gemini_api_key", apiKey);
      
      toast({
        title: "Success!",
        description: "API key validated successfully",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to validate API key. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid of design styles */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
        {designStyles.map((style) => (
          <div key={style.name} className="relative group overflow-hidden">
            <img 
              src={style.image} 
              alt={style.name}
              className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-foreground mb-1">{style.name}</h3>
              <p className="text-sm text-muted-foreground">{style.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Login card overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-glow border-2 backdrop-blur-xl bg-card/95">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Designer
            </CardTitle>
            <CardDescription className="text-base">
              Enter your Gemini API key to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Gemini API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Get your API key from{" "}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-base"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
