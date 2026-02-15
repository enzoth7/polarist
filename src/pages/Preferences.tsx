import { useState } from "react";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Preferences = () => {
    const { profile, updateProfile } = useBusinessProfile();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(profile);
    const [saved, setSaved] = useState(false);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        updateProfile(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background pb-8 animate-fade-in">
            {/* Header */}
            <div className="px-5 pt-6 pb-2 flex items-center justify-between">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-muted-foreground transition-all hover:bg-border border border-white/5"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-bold text-foreground">Ajustes</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="px-5 mt-6 space-y-6">
                {/* Section: Identity */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">Identidad</h2>

                    <div className="rounded-3xl bg-card p-5 border border-white/5 space-y-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-2">Nombre del Negocio</label>
                            <input
                                type="text"
                                value={formData.brandName}
                                onChange={(e) => handleChange("brandName", e.target.value)}
                                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-2">Industria</label>
                            <input
                                type="text"
                                value={formData.industry}
                                onChange={(e) => handleChange("industry", e.target.value)}
                                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors"
                            />
                        </div>
                    </div>
                </section>

                {/* Section: Psychology */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Psicología de Marca</h2>
                    </div>

                    <div className="rounded-3xl bg-card p-5 border border-white/5 space-y-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-2">Arquetipo</label>
                            <select
                                value={formData.archetype}
                                onChange={(e) => handleChange("archetype", e.target.value)}
                                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors appearance-none"
                            >
                                <option value="Sabio">El Sabio</option>
                                <option value="Rebelde">El Rebelde</option>
                                <option value="Cuidador">El Cuidador</option>
                                <option value="Amigo">El Amigo</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-2">Objetivo Emocional</label>
                            <input
                                type="text"
                                value={formData.emotionalGoal}
                                onChange={(e) => handleChange("emotionalGoal", e.target.value)}
                                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-2">Tu Historia</label>
                            <textarea
                                value={formData.story}
                                onChange={(e) => handleChange("story", e.target.value)}
                                className="w-full h-32 bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors resize-none"
                            />
                        </div>
                    </div>
                </section>

                <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-semibold text-primary-foreground transform transition-all active:scale-95"
                >
                    {saved ? "¡Guardado!" : "Guardar Cambios"}
                    <Save className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Preferences;
