import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    try {
      setLoading(true);
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
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
              {isSignUp ? "Create an account to get started" : "Sign in to explore design possibilities"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                />
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
                  isSignUp ? "Sign Up" : "Sign In"
                )}
              </Button>
            </form>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
