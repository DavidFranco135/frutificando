'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Users, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useSiteContent } from '@/hooks/useSiteContent';

const features = [
  { icon: Heart, title: 'Crescimento', description: 'Fortaleça sua fé com ensinamentos profundos.' },
  { icon: Users, title: 'Comunhão', description: 'Crie novas amizades e compartilhe momentos.' },
  { icon: Sparkles, title: 'Descanso', description: 'Recarregue as energias em meio à natureza.' },
];

export default function About() {
  const { conteudo } = useSiteContent();

  return (
    <section id="sobre" className="py-24 md:py-32 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 text-brand-700 font-bold tracking-widest uppercase text-xs mb-4">
              <Leaf className="w-4 h-4" />
              <span>Sobre o Evento</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-brand-700 leading-[0.9] tracking-tighter mb-8">
              {conteudo.sobre_titulo}
            </h2>
            <p className="text-lg text-brand-700/80 leading-relaxed mb-12 whitespace-pre-line">
              {conteudo.sobre_texto}
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-start gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center text-white">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-brand-700">{feature.title}</h3>
                  <p className="text-sm text-brand-700/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
              <img
                src={conteudo.sobre_imagem_url || 'https://images.unsplash.com/photo-1493916665398-143bdeabe500?q=80&w=1000&auto=format&fit=crop'}
                alt="Retiro Espiritual"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-brand-700 rounded-[32px] hidden md:flex items-center justify-center p-6 text-white shadow-2xl">
              <p className="text-center font-bold leading-tight">
                Vagas<br />Limitadas<br /><span className="text-4xl font-black">40</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
