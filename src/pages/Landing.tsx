import { useNavigate } from 'react-router-dom';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { Button } from '@/components/ui/button';
import { Download, UserPlus, LogIn, Sparkles } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const { isInstallable, installApp } = useInstallPrompt();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-12 text-center">
                {/* Hero Section */}
                <div className="space-y-6">
                    {/* Logo/Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                            <Sparkles className="w-20 h-20 text-primary relative" strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-3">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                            Visual Growth System
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-light">
                            Contenido visual profesional para tu negocio
                        </p>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4 max-w-md mx-auto">
                    {/* Install Button - Only show if installable */}
                    {isInstallable && (
                        <Button
                            onClick={installApp}
                            size="lg"
                            className="w-full text-lg h-14 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Instalar
                        </Button>
                    )}

                    {/* Create Account */}
                    <Button
                        onClick={() => navigate('/signup')}
                        size="lg"
                        variant="outline"
                        className="w-full text-lg h-14 border-2"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Crear Cuenta
                    </Button>

                    {/* Sign In */}
                    <Button
                        onClick={() => navigate('/login')}
                        size="lg"
                        variant="ghost"
                        className="w-full text-lg h-14"
                    >
                        <LogIn className="w-5 h-5 mr-2" />
                        Iniciar Sesión
                    </Button>
                </div>

                {/* Footer */}
                <p className="text-sm text-muted-foreground">
                    Crea contenido visual que destaque
                </p>
            </div>
        </div>
    );
};

export default Landing;
