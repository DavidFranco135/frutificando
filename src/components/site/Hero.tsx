'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Leaf, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function Hero() {
  const { conteudo } = useSiteContent();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={conteudo.hero_imagem_url || 'https://images.unsplash.com/photo-1501854140801-50d01674aa3e?q=80&w=2000&auto=format&fit=crop'}
          alt="Natureza Retiro"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold tracking-widest uppercase"
          >
            <Leaf className="w-4 h-4 text-accent" />
            <span>Retiro Espiritual 2026</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
            {conteudo.hero_titulo}
          </h1>

          <p className="text-lg md:text-xl font-light max-w-2xl opacity-90 leading-relaxed">
            {conteudo.hero_subtitulo}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm opacity-70 mt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{conteudo.data_evento_inicio} – {conteudo.data_evento_fim}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{conteudo.local_evento}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <Button size="lg" onClick={() => scrollTo('inscricao')}>
              Reservar minha vaga
            </Button>
            <Button size="lg" variant="secondary" onClick={() => scrollTo('sobre')}>
              Saiba mais
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ArrowDown className="w-5 h-5 opacity-60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
