'use client';

import { useState, useEffect } from 'react';
import { conteudoService, DEFAULT_CONTEUDO } from '@/lib/firestore';
import type { SiteConteudo } from '@/types';

export function useSiteContent() {
  const [conteudo, setConteudo] = useState<SiteConteudo>(DEFAULT_CONTEUDO);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Always start with defaults so page renders even if Firebase fails
    setConteudo(DEFAULT_CONTEUDO);

    let unsub: (() => void) | undefined;
    try {
      unsub = conteudoService.subscribe((data) => {
        setConteudo(data);
        setIsLoading(false);
      });
    } catch (err) {
      // Firebase not available (rules, offline, etc.) — use defaults
      console.warn('Could not load site content from Firestore, using defaults.', err);
      setIsLoading(false);
    }

    return () => unsub?.();
  }, []);

  return { conteudo, isLoading };
}
