'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function WhatsAppButton() {
  const { conteudo } = useSiteContent();
  const msg = encodeURIComponent('Olá, quero mais informações sobre o evento Frutificando.');
  const url = `https://wa.me/${conteudo.whatsapp_numero}?text=${msg}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow group"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-white text-brand-700 text-xs font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-black/5">
        Fale conosco
      </span>
    </motion.a>
  );
}
