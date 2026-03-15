import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
    const navigate = useNavigate();
    const { loginAsGoogle, loginAsGuest } = useAuth();

    const handleGoogleLogin = () => {
        loginAsGoogle();
        navigate("/onboarding");
    };

    const handleGuestLogin = () => {
        loginAsGuest();
        navigate("/radar");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-between items-center px-6 pt-20 pb-10 relative overflow-hidden">
            
            {/* Decors abstractos en el fondo para mayor estetica visual */}
            <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[60%] bg-primary/20 blur-[120px] rounded-full point-events-none -z-10"></div>

            {/* Top Visual Section - Highly Visual with Images */}
            <div className="w-full flex-1 flex flex-col items-center justify-center -mt-8">
                {/* 3 Floating Image Cards exactly like the reference */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 w-full max-w-sm">
                    {/* Left Card */}
                    <div className="w-[28%] aspect-[2/3] rounded-2xl rotate-[-8deg] shadow-soft overflow-hidden border-2 border-background/50 translate-y-3 bg-muted">
                        <img 
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop" 
                            alt="Emprendedor 1" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    {/* Center Card - Largest */}
                    <div className="w-[36%] aspect-[2/3] rounded-3xl z-10 shadow-elevated overflow-hidden border-4 border-background bg-muted">
                        <img 
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop" 
                            alt="Emprendedor 2" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    {/* Right Card */}
                    <div className="w-[28%] aspect-[2/3] rounded-2xl rotate-[8deg] shadow-soft overflow-hidden border-2 border-background/50 translate-y-3 bg-muted">
                        <img 
                            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=450&fit=crop" 
                            alt="Emprendedor 3" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                </div>

                <div className="text-center w-full max-w-sm">
                    <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#201E1F] dark:text-[#F3F0EA] mb-4 block">
                        polarist
                    </span>
                    <h1 className="text-[2.2rem] font-black tracking-tight mb-4 leading-[1.1] text-foreground">
                        Descubre tu próximo<br />atajo de negocio
                    </h1>
                    <p className="text-muted-foreground text-[14px] font-medium leading-relaxed px-2">
                        Automatizaciones, manuales de neuroventas y herramientas para escalar hoy mismo.
                    </p>
                </div>
            </div>

            {/* Bottom Actions Section */}
            <div className="w-full max-w-sm flex flex-col gap-3 mt-8">
                <Button 
                    onClick={handleGoogleLogin} 
                    className="h-[56px] rounded-2xl font-bold text-[16px] tracking-wide bg-foreground text-background hover:bg-foreground/80 hover:scale-[1.02] shadow-card w-full border-none transition-all active:scale-[0.98] cursor-pointer"
                    variant="default"
                >
                    Continuar con Google
                </Button>

                <Button 
                    onClick={handleGuestLogin} 
                    variant="outline"
                    className="h-[56px] rounded-2xl font-bold text-[16px] tracking-wide bg-background text-foreground border-2 border-border hover:bg-muted hover:border-foreground/30 hover:scale-[1.02] shadow-sm w-full transition-all active:scale-[0.98] cursor-pointer"
                >
                    Entrar como visitante
                </Button>

                <p className="text-center text-[10px] text-muted-foreground mt-4 px-8 font-medium leading-relaxed opacity-70">
                    Tu privacidad es nuestra prioridad.<br/>Nunca compartiremos tus datos sin tu consentimiento.
                </p>
            </div>
        </div>
    );
};

export default Login;
