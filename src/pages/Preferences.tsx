import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, RefreshCw, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Preferences = () => {
  const { profile, updateProfile, resetProfile } = useBusinessProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [businessName, setBusinessName] = useState(profile.businessName || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({
            business_name: businessName,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (error) throw error;
      }

      updateProfile({ businessName });
      toast({ title: t("preferences.toasts.saved") });
    } catch (error) {
      console.error(error);
      toast({
        title: t("preferences.toasts.saveError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    resetProfile();
    navigate("/");
  };

  const handleRetakeOnboarding = () => {
    if (window.confirm(t("preferences.confirmRetake"))) {
      navigate("/onboarding");
    }
  };

  const strategyItems = [
    { labelKey: "preferences.strategy.category", value: profile.businessCategory },
    { labelKey: "preferences.strategy.history", value: profile.brandHistory },
    { labelKey: "preferences.strategy.differential", value: profile.brandDifferential },
    { labelKey: "preferences.strategy.targetAudience", value: profile.targetAudience },
    { labelKey: "preferences.strategy.promotions", value: profile.promotions },
    { labelKey: "preferences.strategy.operationType", value: profile.operationType },
    { labelKey: "preferences.strategy.resources", value: profile.contentResources },
    { labelKey: "preferences.strategy.camera", value: profile.cameraQuality },
    { labelKey: "preferences.strategy.salesChannels", value: profile.salesChannels },
    { labelKey: "preferences.strategy.socialGoal", value: profile.socialPriorityGoal },
    { labelKey: "preferences.strategy.visualStyle", value: profile.productVisualStyle },
    { labelKey: "preferences.strategy.frequency", value: profile.postingFrequency },
    { labelKey: "preferences.strategy.perception", value: profile.brandPerception },
  ];

  return (
    <div className="animate-fade-in min-h-screen bg-background p-6 pb-8">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} aria-label={t("common.back")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">{t("preferences.title")}</h1>
        <div className="w-10" />
      </div>

      <div className="mx-auto max-w-xl space-y-8">
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("preferences.generalInfo")}</h2>
          <div className="rounded-xl border border-border bg-card p-6">
            <label className="mb-2 block text-sm font-medium">{t("preferences.brandName")}</label>
            <Input value={businessName} onChange={(event) => setBusinessName(event.target.value)} className="bg-background" />
            <Button className="mt-4 w-full" onClick={handleSave} disabled={isSaving}>
              {isSaving ? t("preferences.saving") : t("preferences.saveName")}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("preferences.currentStrategy")}</h2>
            <Button variant="outline" size="sm" onClick={handleRetakeOnboarding}>
              <RefreshCw className="mr-2 h-3 w-3" />
              {t("preferences.retakeQuestionnaire")}
            </Button>
          </div>

          <div className="divide-y divide-border rounded-xl border border-border bg-card text-sm">
            {strategyItems.map((item) => (
              <StrategyItem key={item.labelKey} label={t(item.labelKey)} value={item.value} emptyValue={t("common.notAvailable")} />
            ))}
          </div>
        </section>

        <section className="pt-8">
          <Button variant="destructive" className="w-full" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {t("preferences.logout")}
          </Button>
        </section>
      </div>
    </div>
  );
};

const StrategyItem = ({ label, value, emptyValue }: { label: string; value: string; emptyValue: string }) => (
  <div className="flex flex-col gap-1 p-4">
    <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
    <span className="font-medium capitalize text-foreground">{value ? value.replace(/_/g, " ") : emptyValue}</span>
  </div>
);

export default Preferences;
