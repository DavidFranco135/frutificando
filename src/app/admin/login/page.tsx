'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { useAuthState } from '@/hooks/useAuth';
import { Leaf, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { signIn } = useAuthState();
  const router = useRouter();

  // Redirect if already logged in
  React.useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (user) router.replace('/admin');
    });
    return unsub;
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signIn(email, password);
      router.replace('/admin');
    } catch (err: any) {
      setError('Email ou senha incorretos. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-3xl mb-5">
            <Leaf className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">FRUTIFICANDO</h1>
          <p className="text-white/40 text-sm mt-1 uppercase tracking-widest font-bold">Área Administrativa</p>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-brand-700 mb-6">Entrar</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-700/50 uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-700/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-cream border-none focus:ring-2 focus:ring-brand-700 outline-none transition-all text-brand-700"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-700/50 uppercase tracking-widest">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-700/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-cream border-none focus:ring-2 focus:ring-brand-700 outline-none transition-all text-brand-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-700/30 hover:text-brand-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
              {!isLoading && 'Entrar'}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          <a href="/" className="hover:text-white/60 transition-colors">← Voltar ao site</a>
        </p>
      </div>
    </div>
  );
}
