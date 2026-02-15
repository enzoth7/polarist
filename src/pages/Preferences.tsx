import { useState } from "react";
import { useBusinessProfile, QuestionnaireItem } from "@/hooks/useBusinessProfile";
import { ArrowLeft, Save, RefreshCw, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Preferences = () => {
    const { profile, updateProfile, resetProfile } = useBusinessProfile();
    const navigate = useNavigate();
    const { toast } = useToast();

    // We only allow editing the brand name directly here. 
    // To change strategy, they should retake the questionnaire.
    const [brandName, setBrandName] = useState(profile.brandName);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        full_name: brandName,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', user.id);

                if (error) throw error;
            }

            updateProfile({ brandName });
            toast({ title: "Cambios guardados" });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error al guardar",
                variant: "destructive"
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
        if (confirm("¿Estás seguro? Esto sobrescribirá tu estrategia actual.")) {
            navigate("/onboarding");
        }
    };

    return (
        <div className="min-h-screen bg-background pb-8 animate-fade-in p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">Ajustes de Marca</h1>
                <div className="w-10" />
            </div>

            <div className="max-w-xl mx-auto space-y-8">
                {/* Brand Name Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        Información General
                    </h2>
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <label className="text-sm font-medium mb-2 block">Nombre de la Marca</label>
                        <Input
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="bg-background"
                        />
                        <Button
                            className="w-full mt-4"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? "Guardando..." : "Guardar Nombre"}
                            <Save className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </section>

                {/* Strategy Summary Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                            Estrategia Actual
                        </h2>
                        <Button variant="outline" size="sm" onClick={handleRetakeOnboarding}>
                            <RefreshCw className="w-3 h-3 mr-2" />
                            Refacer Cuestionario
                        </Button>
                    </div>

                    <div className="bg-card rounded-xl border border-border divide-y divide-border">
                        {profile.questionnaire && profile.questionnaire.length > 0 ? (
                            profile.questionnaire.map((item: QuestionnaireItem) => (
                                <div key={item.id} className="p-4 flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground uppercase">
                                        {item.category}
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {item.answer || "—"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-muted-foreground">
                                No hay estrategia definida aún.
                            </div>
                        )}
                    </div>
                </section>

                {/* Danger Zone / Logout */}
                <section className="pt-8">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                    </Button>
                </section>
            </div>
        </div>
    );
};

export default Preferences;
