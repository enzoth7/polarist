import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, LogIn, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.session) {
                toast({
                    title: "Sesión iniciada",
                    description: "¡Hola de nuevo!",
                });

                // Check if onboarding is complete (optional optimization: fetch profile here)
                // For now, let the dashboard handle redirection or just go to dashboard
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast({
                title: "Error al iniciar sesión",
                description: error.message === "Invalid login credentials"
                    ? "Credenciales incorrectas."
                    : "Ocurrió un error. Inténtalo de nuevo.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold">Bienvenido</h1>
                    <p className="text-muted-foreground">
                        Inicia sesión en tu cuenta de Visual Growth System
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12"
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" size="lg" className="w-full h-12" disabled={loading}>
                        {loading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <LogIn className="w-5 h-5 mr-2" />
                        )}
                        {loading ? "Iniciando..." : "Iniciar Sesión"}
                    </Button>
                </form>

                {/* Footer */}
                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        ¿No tienes una cuenta?{' '}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-primary hover:underline font-medium"
                        >
                            Crear una
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
