'use client';

import { useState, useEffect } from 'react';
import { conteudoService, DEFAULT_CONTEUDO } from '@/lib/firestore';
import type { SiteConteudo } from '@/types';

export function useSiteContent() {
  const [conteudo, setConteudo] = useState<SiteConteudo>(DEFAULT_CONTEUDO);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = conteudoService.subscribe((data) => {
      setConteudo(data);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  return { conteudo, isLoading };
}
