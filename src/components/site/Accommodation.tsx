'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Bed, Check, Home, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const options = [
  { icon: Home, title: '2 Quartos Privados', description: 'Ideal para famílias ou casais.' },
  { icon: Bed, title: '5 Alojamentos', description: 'Espaços amplos e confortáveis.' },
];

const inclusions = [
  'Roupa de cama completa',
  'Toalha de banho macia',
  'Kit de higiene pessoal',
  'Ambiente climatizado',
];

export default function Accommodation() {
  return (
    <section id="hospedagem" className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 text-brand-700 font-bold tracking-widest uppercase text-xs mb-4">
              <Home className="w-4 h-4" />
              <span>Hospedagem</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-brand-700 leading-[0.9] tracking-tighter mb-8">
              CONFORTO EM<br />MEIO À NATUREZA
            </h2>
            <p className="text-lg text-brand-700/80 leading-relaxed mb-10">
              Oferecemos opções de hospedagem pensadas para o seu descanso e bem-estar durante todo o evento.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mb-10">
              {options.map((opt, i) => (
                <Card key={i} className="p-7 border-none shadow-card hover:scale-[1.03] transition-transform duration-500">
                  <div className="w-11 h-11 rounded-2xl bg-brand-700 flex items-center justify-center text-white mb-5">
                    <opt.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-700 mb-1">{opt.title}</h3>
                  <p className="text-sm text-brand-700/60">{opt.description}</p>
                </Card>
              ))}
            </div>

            <div className="bg-brand-700 rounded-[36px] p-10 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold">Incluso na Estadia</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {inclusions.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="text-sm font-medium opacity-90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop"
                alt="Hospedagem Sítio"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl">
              <p className="text-brand-700 font-bold text-sm tracking-widest uppercase">Tudo Pronto</p>
              <p className="text-brand-700/50 text-xs">Para sua chegada</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
