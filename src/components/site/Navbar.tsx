'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.92]);
  const blurAmount = useTransform(scrollY, [0, 80], [0, 12]);
  const shadowOpacity = useTransform(scrollY, [0, 80], [0, 0.06]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const navLinks = [
    { label: 'Sobre', id: 'sobre' },
    { label: 'Programação', id: 'programacao' },
    { label: 'Hospedagem', id: 'hospedagem' },
    { label: 'Valor', id: 'valor' },
  ];

  return (
    <>
      <motion.nav
        style={{
          backgroundColor: useTransform(bgOpacity, (v) => `rgba(255,255,255,${v})`),
          backdropFilter: useTransform(blurAmount, (v) => `blur(${v}px)`),
          boxShadow: useTransform(shadowOpacity, (v) => `0 4px 20px rgba(0,0,0,${v})`),
        }}
        className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ color: useTransform(scrollY, [0, 80], ['#ffffff', '#1a3c34']) }}
            className="flex items-center gap-2 text-lg font-black tracking-tighter"
          >
            <Leaf className="w-5 h-5" />
            FRUTIFICANDO
          </motion.button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.id}
                style={{ color: useTransform(scrollY, [0, 80], ['#ffffff', '#1a3c34']) }}
                onClick={() => scrollTo(link.id)}
                className="text-sm font-medium hover:opacity-60 transition-opacity"
              >
                {link.label}
              </motion.button>
            ))}
            <button
              onClick={() => scrollTo('inscricao')}
              className="bg-brand-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-800 transition-colors"
            >
              Inscrever-se
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: scrollY.get() > 80 ? '#1a3c34' : 'white' }}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-black/5 p-6 flex flex-col gap-4 shadow-lg md:hidden"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-brand-700 font-semibold text-left py-2 border-b border-black/5"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('inscricao')}
            className="bg-brand-700 text-white px-6 py-3 rounded-full font-semibold mt-2"
          >
            Inscrever-se
          </button>
        </motion.div>
      )}
    </>
  );
}
