'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSiteContent } from '@/hooks/useSiteContent';
import { formatCurrency } from '@/lib/utils';

const inclusions = [
  'Hospedagem completa',
  '3 refeições diárias',
  'Participação em todas as atividades',
  'Kit de boas-vindas',
  'Acesso a todas as áreas do sítio',
];

export default function Pricing() {
  const { conteudo } = useSiteContent();

  return (
    <section id="valor" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cream rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-700/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 text-brand-700 font-bold tracking-widest uppercase text-xs mb-4"
            >
              <CreditCard className="w-4 h-4" />
              <span>Investimento</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-brand-700 leading-[0.9] tracking-tighter">
              UM INVESTIMENTO<br />EM VOCÊ
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-brand-700 rounded-[48px] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 text-accent font-bold tracking-widest uppercase text-xs mb-5">
                  <Sparkles className="w-4 h-4" />
                  <span>Pacote Completo</span>
                </div>
                <h3 className="text-2xl font-bold mb-7">Tudo o que você precisa para uma experiência inesquecível.</h3>
                <div className="space-y-3.5">
                  {inclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <span className="text-sm font-medium opacity-80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-[36px] p-10 border border-white/20 text-center flex flex-col items-center">
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-3">A partir de</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-black">{conteudo.valor_parcelas}x</span>
                  <span className="text-sm opacity-60">de</span>
                  <span className="text-5xl font-black tracking-tighter">
                    {formatCurrency(conteudo.valor_parcelado)}
                  </span>
                </div>
                <p className="text-sm opacity-50 mb-2">
                  Ou {formatCurrency(conteudo.valor_avista)} à vista
                </p>
                {conteudo.valor_descricao && (
                  <p className="text-xs opacity-40 mb-6">{conteudo.valor_descricao}</p>
                )}

                {conteudo.link_inscricao_evento ? (
                  <a
                    href={conteudo.link_inscricao_evento}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-full font-semibold text-base hover:bg-cream transition-colors"
                  >
                    Inscrição no Evento
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => document.getElementById('inscricao')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Garantir hospedagem
                  </Button>
                )}
                <p className="text-[10px] uppercase tracking-widest mt-4 opacity-30 font-bold">Vagas Limitadas</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
