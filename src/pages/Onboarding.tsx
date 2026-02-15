import { useState } from "react";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { useNavigate } from "react-router-dom";
import { Sparkles, Store, Share2, ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";

const INDUSTRIES = [
  "Restaurante / Cafetería",
  "Tienda de Ropa",
  "Peluquería / Barbería",
  "Panadería / Pastelería",
  "Gimnasio / Fitness",
  "Tienda Online",
  "Servicios Profesionales",
  "Otro",
];

const SOCIAL_NETWORKS = [
  { id: "instagram", label: "Instagram", emoji: "📸" },
  { id: "facebook", label: "Facebook", emoji: "👥" },
  { id: "tiktok", label: "TikTok", emoji: "🎵" },
  { id: "whatsapp", label: "WhatsApp Business", emoji: "💬" },
];

const Onboarding = () => {
  const { updateProfile } = useBusinessProfile();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [socialNetworks, setSocialNetworks] = useState<string[]>([]);

  // New Psychological State
  const [archetype, setArchetype] = useState("");
  const [emotionalGoal, setEmotionalGoal] = useState("");
  const [story, setStory] = useState("");

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const toggleNetwork = (id: string) => {
    setSocialNetworks((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const canContinue = () => {
    if (step === 0) return brandName.trim().length > 0;
    if (step === 1) return industry.length > 0;
    if (step === 2) return socialNetworks.length > 0;
    if (step === 3) return archetype.length > 0; // Archetype
    if (step === 4) return emotionalGoal.length > 0; // Emotion
    if (step === 5) return story.length > 0; // Story
    return false;
  };

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setDone(true);
      updateProfile({
        brandName: brandName.trim(),
        industry,
        socialNetworks,
        archetype,
        emotionalGoal,
        story,
        onboardingComplete: true,
      });
      setTimeout(() => navigate("/dashboard"), 1200);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          {!done ? (
            <>
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin-slow" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">Creando tu identidad única...</h2>
                <p className="mt-2 text-muted-foreground">Analizando tu arquetipo <span className="font-semibold text-primary">{archetype}</span></p>
              </div>
              <div className="flex gap-1.5 mt-4">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "0s" }} />
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "0.3s" }} />
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "0.6s" }} />
              </div>
            </>
          ) : (
            <>
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center animate-check-bounce">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">¡Agente Listo! 🚀</h2>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Progress */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-border"
                }`}
            />
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Paso {step + 1} de 6</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {step === 0 && (
          <div className="animate-fade-in">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-purple">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">¿Cómo se llama tu negocio?</h1>
            <p className="mt-2 text-lg text-muted-foreground">Este nombre aparecerá en tu contenido</p>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Ej: Café Luna, Tienda María..."
              className="mt-8 w-full rounded-2xl border-2 border-border bg-card px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-primary focus:shadow-card"
              autoFocus
            />
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-yellow">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">¿A qué se dedica?</h1>
            <p className="mt-2 text-lg text-muted-foreground">Así personalizamos tus misiones de marketing</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  className={`rounded-2xl border-2 px-4 py-4 text-left text-sm font-medium transition-all ${industry === ind
                      ? "border-primary bg-primary/5 text-primary shadow-card"
                      : "border-border bg-card text-foreground hover:border-primary/30"
                    }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-pink">
              <Share2 className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">¿Dónde publicas?</h1>
            <p className="mt-2 text-lg text-muted-foreground">Selecciona las redes que usas</p>
            <div className="mt-8 flex flex-col gap-3">
              {SOCIAL_NETWORKS.map((net) => (
                <button
                  key={net.id}
                  onClick={() => toggleNetwork(net.id)}
                  className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all ${socialNetworks.includes(net.id)
                      ? "border-primary bg-primary/5 shadow-card"
                      : "border-border bg-card hover:border-primary/30"
                    }`}
                >
                  <span className="text-2xl">{net.emoji}</span>
                  <span className="text-base font-medium text-foreground">{net.label}</span>
                  {socialNetworks.includes(net.id) && (
                    <Check className="ml-auto h-5 w-5 text-primary animate-check-bounce" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: ARCHETYPE */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-blue">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Tu Personalidad</h1>
            <p className="mt-2 text-lg text-muted-foreground">¿Cuál te representa mejor?</p>
            <div className="mt-8 flex flex-col gap-3">
              {[
                { id: "Sabio", label: "El Sabio", desc: "Experto, educativo, confiable." },
                { id: "Rebelde", label: "El Rebelde", desc: "Disruptivo, audaz, diferente." },
                { id: "Cuidador", label: "El Cuidador", desc: "Servicial, empático, cálido." },
                { id: "Amigo", label: "El Amigo", desc: "Cercano, realista, honesto." },
              ].map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => setArchetype(arch.id)}
                  className={`rounded-2xl border-2 px-5 py-4 text-left transition-all ${archetype === arch.id
                      ? "border-primary bg-primary/5 shadow-card"
                      : "border-border bg-card hover:border-primary/30"
                    }`}
                >
                  <div className="font-semibold text-foreground">{arch.label}</div>
                  <div className="text-sm text-muted-foreground">{arch.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: EMOTION */}
        {step === 4 && (
          <div className="animate-fade-in">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-green">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">¿Qué deben sentir?</h1>
            <p className="mt-2 text-lg text-muted-foreground">Cuando ven tu marca, sienten:</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {["Confianza", "Alegría", "Calma", "Inspiración", "Pertenencia", "Adrenalina"].map((em) => (
                <button
                  key={em}
                  onClick={() => setEmotionalGoal(em)}
                  className={`rounded-2xl border-2 px-4 py-4 text-center font-medium transition-all ${emotionalGoal === em
                      ? "border-primary bg-primary/5 text-primary shadow-card"
                      : "border-border bg-card hover:border-primary/30"
                    }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: STORY */}
        {step === 5 && (
          <div className="animate-fade-in">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-purple">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Tu Historia</h1>
            <p className="mt-2 text-lg text-muted-foreground">¿Por qué empezaste este negocio?</p>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Ej: Empecé cocinando para mis amigos y me di cuenta que..."
              className="mt-8 h-40 w-full rounded-2xl border-2 border-border bg-card px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-primary focus:shadow-card resize-none"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 pb-8 pt-4">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-border bg-card text-muted-foreground transition-all hover:border-primary/30"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => (step < 5 ? setStep((s) => s + 1) : handleFinish())}
            disabled={!canContinue()}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step < 5 ? (
              <>
                Continuar
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              <>
                ¡Finalizar!
                <Sparkles className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
