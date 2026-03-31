export const dynamic = 'force-dynamic';

'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2, User, Phone, FileText, Home, Search,
  Download, Bed, MessageSquare, Calendar,
} from 'lucide-react';
import { inscricoesService } from '@/lib/firestore';
import type { Inscricao } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function InscricoesPage() {
  const [inscricoes, setInscricoes] = React.useState<Inscricao[]>([]);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsub = inscricoesService.subscribe((data) => {
      setInscricoes(data);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const filtered = inscricoes.filter((i) =>
    i.nome.toLowerCase().includes(search.toLowerCase()) ||
    i.cpf.includes(search) ||
    i.telefone.includes(search)
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta inscrição de hospedagem?')) return;
    setDeleting(id);
    try {
      await inscricoesService.delete(id);
      toast.success('Inscrição excluída.');
    } catch {
      toast.error('Erro ao excluir inscrição.');
    } finally {
      setDeleting(null);
    }
  };

  const handleExport = () => {
    inscricoesService.exportToCSV(filtered);
    toast.success('CSV exportado!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-700 tracking-tighter">Hospedagens</h1>
          <p className="text-brand-700/50 text-sm mt-1">
            {inscricoes.length} inscrição{inscricoes.length !== 1 ? 'ões' : ''} cadastrada{inscricoes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-700/30" />
            <input
              type="text"
              placeholder="Buscar nome, CPF, telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-full bg-white border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700 w-64"
            />
          </div>
          <Button variant="outline" size="md" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl h-24 animate-pulse border border-black/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-black/5">
          <Bed className="w-12 h-12 text-brand-700/20 mx-auto mb-3" />
          <p className="text-brand-700/40 font-medium">
            {search ? 'Nenhuma inscrição encontrada.' : 'Nenhuma inscrição cadastrada ainda.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((inscricao) => (
              <motion.div
                key={inscricao.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl p-5 border border-black/5 shadow-admin hover:shadow-card transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Info grid */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-brand-700 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-brand-700/40 uppercase tracking-widest">Nome</p>
                        <p className="font-bold text-brand-700 truncate text-sm">{inscricao.nome}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-brand-700 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-brand-700/40 uppercase tracking-widest">CPF</p>
                        <p className="font-medium text-brand-700 text-sm">{inscricao.cpf}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-brand-700 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-brand-700/40 uppercase tracking-widest">WhatsApp</p>
                        <a
                          href={`https://wa.me/55${inscricao.telefone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-brand-700 text-sm hover:text-accent transition-colors"
                        >
                          {inscricao.telefone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-brand-700 shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-brand-700/40 uppercase tracking-widest">Hospedagem</p>
                        <Badge variant={inscricao.hospedagem ? 'green' : 'gray'}>
                          {inscricao.hospedagem ? 'Sim' : 'Não'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right section */}
                  <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-black/5 pt-3 md:pt-0 md:pl-4">
                    <div className="text-right hidden lg:block">
                      <p className="text-[10px] font-bold text-brand-700/30 uppercase tracking-widest">Data</p>
                      <p className="text-xs text-brand-700/50">{formatDateTime(inscricao.data_inscricao)}</p>
                    </div>
                    {inscricao.observacoes && (
                      <div title={inscricao.observacoes}>
                        <MessageSquare className="w-4 h-4 text-brand-700/30" />
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(inscricao.id!)}
                      disabled={deleting === inscricao.id}
                      className="w-10 h-10 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Observações */}
                {inscricao.observacoes && (
                  <div className="mt-3 pt-3 border-t border-black/5">
                    <p className="text-xs text-brand-700/50">
                      <span className="font-bold">Obs:</span> {inscricao.observacoes}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
