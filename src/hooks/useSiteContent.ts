'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { getDb, DEFAULT_CONTEUDO_FALLBACK } from '@/lib/firebase';
import type { SiteConteudo } from '@/types';

export function useSiteContent() {
  const [conteudo, setConteudo] = useState<SiteConteudo>(DEFAULT_CONTEUDO_FALLBACK);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    try {
      const db = getDb();
      const ref = doc(db, 'conteudo_site', 'principal');

      unsub = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            setConteudo(snap.data() as SiteConteudo);
          }
          // If doc doesn't exist yet, keep defaults
          setIsLoading(false);
        },
        (error) => {
          // Permission error or offline — silently use defaults
          console.warn('Firestore unavailable, using defaults:', error.code);
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.warn('Firebase init error, using defaults:', err);
      setIsLoading(false);
    }

    return () => unsub?.();
  }, []);

  return { conteudo, isLoading };
}
