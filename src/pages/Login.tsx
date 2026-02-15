import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, LogIn } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement Supabase authentication
        console.log('Login attempt:', { email, password });

        // For MVP, redirect to onboarding
        navigate('/onboarding');
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
                    Back
                </Button>

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground">
                        Sign in to your Visual Growth System account
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" size="lg" className="w-full h-12">
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign In
                    </Button>
                </form>

                {/* Footer */}
                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-primary hover:underline font-medium"
                        >
                            Create one
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
