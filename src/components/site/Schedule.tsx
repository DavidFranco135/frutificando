'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Coffee, Utensils, LogIn, Music, Book, Sun } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useSiteContent } from '@/hooks/useSiteContent';
import type { ProgramacaoItem } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  LogIn, Coffee, Utensils, Music, Book, Sun, Calendar, Clock,
};

function groupByDay(items: ProgramacaoItem[]): Record<string, ProgramacaoItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.dia]) acc[item.dia] = [];
    acc[item.dia].push(item);
    return acc;
  }, {} as Record<string, ProgramacaoItem[]>);
}

export default function Schedule() {
  const { conteudo } = useSiteContent();
  const grouped = groupByDay(conteudo.programacao_itens);
  const days = Object.keys(grouped);

  return (
    <section id="programacao" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-brand-700 font-bold tracking-widest uppercase text-xs mb-4"
          >
            <Calendar className="w-4 h-4" />
            <span>Programação</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-brand-700 leading-[0.9] tracking-tighter">
            O QUE ESPERAR
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {days.map((day, dayIndex) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, x: dayIndex % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-xl font-bold text-brand-700 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-brand-700 rounded-full" />
                {day}
              </h3>
              <div className="space-y-4">
                {grouped[day].map((item) => {
                  const Icon = ICON_MAP[item.icone || ''] || Clock;
                  return (
                    <Card key={item.id} className="p-5 flex items-start gap-5 group">
                      <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-brand-700 group-hover:bg-brand-700 group-hover:text-white transition-colors duration-500 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-700/40 uppercase tracking-widest mb-1">
                          <Clock className="w-3 h-3" />
                          {item.hora}
                        </div>
                        <h4 className="text-base font-bold text-brand-700">{item.titulo}</h4>
                        <p className="text-sm text-brand-700/60 mt-0.5">{item.descricao}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
