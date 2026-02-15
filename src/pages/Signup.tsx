import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase'; // Import supabase client
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Sign up user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        business_name: name, // Save as business_name in metadata
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                // Manually update profile to ensure business_name is set in the table
                // (In case trigger doesn't map it correctly)
                await supabase
                    .from('profiles')
                    .update({ business_name: name })
                    .eq('id', data.user.id);

                toast({
                    title: "¡Cuenta creada!",
                    description: "Bienvenido a Visual Growth System.",
                });
                // Redirect to onboarding to complete profile
                navigate('/onboarding');
            }

        } catch (error: any) {
            console.error('Signup error:', error);
            toast({
                title: "Error al registrarse",
                description: error.message || "Inténtalo de nuevo.",
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
                    <h1 className="text-4xl font-bold">Comienza</h1>
                    <p className="text-muted-foreground">
                        Crea tu cuenta de Visual Growth System
                    </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Marca</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Juan Pérez"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-12"
                                disabled={loading}
                            />
                        </div>

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
                                minLength={6}
                                className="h-12"
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Debe tener al menos 6 caracteres
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" size="lg" className="w-full h-12" disabled={loading}>
                        {loading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <UserPlus className="w-5 h-5 mr-2" />
                        )}
                        {loading ? "Creando cuenta..." : "Crear Cuenta"}
                    </Button>
                </form>

                {/* Footer */}
                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        ¿Ya tienes una cuenta?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-primary hover:underline font-medium"
                        >
                            Iniciar sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
