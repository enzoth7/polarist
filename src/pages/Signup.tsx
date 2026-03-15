import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Signup = () => {
    const navigate = useNavigate();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        // MVP: Bypass auth and go to Onboarding
        navigate("/onboarding");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm flex flex-col gap-6">
                <div className="text-center mb-4">
                    <h1 className="text-4xl font-black tracking-tight mb-2">
                        <span className="text-primary">Pola</span>rist
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">Crea tu agente táctico de inteligencia.</p>
                </div>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                     <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider ml-1">Nombre</label>
                        <Input 
                           type="text" 
                           placeholder="Cris" 
                           className="h-14 rounded-2xl bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:ring-offset-2 px-4"
                           required
                        />
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider ml-1">Email</label>
                        <Input 
                           type="email" 
                           placeholder="tu@negocio.com" 
                           className="h-14 rounded-2xl bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:ring-offset-2 px-4"
                           required
                        />
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider ml-1">Contraseña</label>
                        <Input 
                           type="password" 
                           placeholder="••••••••" 
                           className="h-14 rounded-2xl bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:ring-offset-2 px-4"
                           required
                        />
                     </div>
                    
                     <Button type="submit" className="h-14 rounded-full font-bold text-lg mt-4 tracking-wide text-primary-foreground">
                         Continuar
                     </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <span className="text-muted-foreground font-medium">¿Ya tienes cuenta?</span>{' '}
                    <Link to="/login" className="text-foreground font-bold hover:underline">Iniciar Sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
