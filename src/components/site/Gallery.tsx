'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Images, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galeriaService } from '@/lib/firestore';
import type { GaleriaFoto } from '@/types';

export default function Gallery() {
  const [fotos, setFotos] = React.useState<GaleriaFoto[]>([]);
  const [selected, setSelected] = React.useState<number | null>(null);

  React.useEffect(() => {
    const unsub = galeriaService.subscribe(setFotos);
    return unsub;
  }, []);

  if (fotos.length === 0) return null;

  const prev = () => setSelected((s) => (s !== null ? Math.max(0, s - 1) : null));
  const next = () => setSelected((s) => (s !== null ? Math.min(fotos.length - 1, s + 1) : null));

  return (
    <section id="galeria" className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-brand-700 font-bold tracking-widest uppercase text-xs mb-4"
          >
            <Images className="w-4 h-4" />
            <span>Galeria</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-brand-700 leading-[0.9] tracking-tighter">
            MOMENTOS<br />ESPECIAIS
          </h2>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {fotos.map((foto, i) => (
            <motion.div
              key={foto.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid cursor-pointer overflow-hidden rounded-2xl group"
              onClick={() => setSelected(i)}
            >
              <img
                src={foto.thumb_url || foto.url}
                alt={foto.titulo || `Foto ${i + 1}`}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button className="absolute top-5 right-5 text-white/60 hover:text-white" onClick={() => setSelected(null)}>
              <X className="w-8 h-8" />
            </button>
            {selected > 0 && (
              <button className="absolute left-4 text-white/60 hover:text-white" onClick={(e) => { e.stopPropagation(); prev(); }}>
                <ChevronLeft className="w-10 h-10" />
              </button>
            )}
            {selected < fotos.length - 1 && (
              <button className="absolute right-4 text-white/60 hover:text-white" onClick={(e) => { e.stopPropagation(); next(); }}>
                <ChevronRight className="w-10 h-10" />
              </button>
            )}
            <motion.img
              key={selected}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={fotos[selected].url}
              alt={fotos[selected].titulo || ''}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
