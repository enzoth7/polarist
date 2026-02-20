import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from("profiles").update({ business_name: name }).eq("id", data.user.id);

        toast({
          title: t("auth.signup.toastSuccessTitle"),
          description: t("auth.signup.toastSuccessDescription"),
        });
        navigate("/onboarding");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: t("auth.signup.toastErrorTitle"),
        description: error.message || t("auth.signup.genericError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      toast({
        title: t("auth.common.googleErrorTitle"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>

        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">{t("auth.signup.title")}</h1>
          <p className="text-muted-foreground">{t("auth.signup.subtitle")}</p>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex h-12 w-full items-center justify-center gap-2"
            onClick={handleGoogleSignup}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t("auth.common.continueWithGoogle")}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t("auth.signup.orWithEmail")}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("auth.signup.brandName")}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t("auth.signup.brandNamePlaceholder")}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="h-12"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.common.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.common.emailPlaceholder")}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-12"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.common.password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                className="h-12"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">{t("auth.signup.passwordHint")}</p>
            </div>
          </div>

          <Button type="submit" size="lg" className="h-12 w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
            {loading ? t("auth.signup.loading") : t("auth.signup.submit")}
          </Button>
        </form>

        <div className="space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            {t("auth.signup.alreadyAccount")}{" "}
            <button onClick={() => navigate("/login")} className="font-medium text-primary hover:underline">
              {t("auth.signup.loginAction")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
