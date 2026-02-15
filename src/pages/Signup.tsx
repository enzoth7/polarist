import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserPlus } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement Supabase authentication
        console.log('Signup attempt:', { name, email, password });

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
                    <h1 className="text-4xl font-bold">Get Started</h1>
                    <p className="text-muted-foreground">
                        Create your Visual Growth System account
                    </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-12"
                            />
                        </div>

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
                                minLength={8}
                                className="h-12"
                            />
                            <p className="text-xs text-muted-foreground">
                                Must be at least 8 characters
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" size="lg" className="w-full h-12">
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Account
                    </Button>
                </form>

                {/* Footer */}
                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-primary hover:underline font-medium"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
