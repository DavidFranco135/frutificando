'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, Images, Settings,
  LogOut, Leaf, Menu, X, Bed,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/inscricoes', label: 'Hospedagens', icon: Bed },
  { href: '/admin/conteudo', label: 'Conteúdo', icon: FileText },
  { href: '/admin/galeria', label: 'Galeria', icon: Images },
  { href: '/admin/vagas', label: 'Vagas', icon: Settings },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f8f7f5] flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-brand-700 text-white flex flex-col transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 font-black tracking-tighter text-lg">
            <Leaf className="w-5 h-5 text-accent" />
            FRUTIFICANDO
          </Link>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-bold">Administração</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Top bar mobile */}
        <header className="md:hidden sticky top-0 z-20 bg-brand-700 text-white px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black tracking-tighter">
            <Leaf className="w-4 h-4 text-accent" />
            FRUTIFICANDO
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
