'use client';

import * as React from 'react';
import { Users, Bed, BedSingle, Home, TrendingUp, ExternalLink, Link2 } from 'lucide-react';
import { getDashboardStats } from '@/lib/firestore';
import { conteudoService } from '@/lib/firestore';
import StatsCard from '@/components/admin/StatsCard';
import { Button } from '@/components/ui/Button';
import type { DashboardStats, SiteConteudo } from '@/types';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [conteudo, setConteudo] = React.useState<SiteConteudo | null>(null);
  const [linkEvento, setLinkEvento] = React.useState('');
  const [savingLink, setSavingLink] = React.useState(false);

  React.useEffect(() => {
    getDashboardStats().then(setStats);
    const unsub = conteudoService.subscribe((data) => {
      setConteudo(data);
      setLinkEvento(data.link_inscricao_evento || '');
    });
    return unsub;
  }, []);

  const handleSaveLink = async () => {
    setSavingLink(true);
    try {
      await conteudoService.update({ link_inscricao_evento: linkEvento });
      toast.success('Link salvo!');
    } catch {
      toast.error('Erro ao salvar link.');
    } finally {
      setSavingLink(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-brand-700 tracking-tighter">Dashboard</h1>
        <p className="text-brand-700/50 text-sm mt-1">Visão geral do evento Frutificando 2026.</p>
      </div>

      {/* Stats */}
      {stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total de Inscritos" value={stats.total_inscritos} icon={Users} color="green" />
          <StatsCard title="Com Hospedagem" value={stats.inscritos_com_hospedagem} icon={Bed} color="blue" />
          <StatsCard title="Sem Hospedagem" value={stats.inscritos_sem_hospedagem} icon={BedSingle} color="orange" />
          <StatsCard
            title="Vagas Restantes"
            value={stats.vagas_restantes}
            subtitle={`de ${stats.vagas_totais} totais`}
            icon={Home}
            color={stats.vagas_restantes <= 5 ? 'red' : 'green'}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 h-28 animate-pulse border border-black/5" />
          ))}
        </div>
      )}

      {/* Occupancy Bar */}
      {stats && (
        <div className="bg-white rounded-3xl p-6 shadow-admin border border-black/5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-brand-700/40 uppercase tracking-widest">Ocupação de Vagas</p>
              <p className="text-lg font-bold text-brand-700 mt-0.5">
                {stats.inscritos_com_hospedagem} / {stats.vagas_totais} vagas preenchidas
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div className="w-full bg-cream rounded-full h-3">
            <div
              className="bg-brand-700 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (stats.inscritos_com_hospedagem / stats.vagas_totais) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-brand-700/40 mt-2">
            {Math.round((stats.inscritos_com_hospedagem / stats.vagas_totais) * 100)}% ocupado
          </p>
        </div>
      )}

      {/* Link de Inscrição do Evento */}
      <div className="bg-white rounded-3xl p-6 shadow-admin border border-black/5">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-brand-700" />
          <div>
            <h3 className="font-bold text-brand-700">Link de Inscrição do Evento</h3>
            <p className="text-xs text-brand-700/50">Este link aparecerá como botão na seção de valor.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="url"
            value={linkEvento}
            onChange={(e) => setLinkEvento(e.target.value)}
            placeholder="https://forms.google.com/..."
            className="flex-1 px-4 py-3 rounded-2xl bg-cream border-none focus:ring-2 focus:ring-brand-700 outline-none text-sm text-brand-700"
          />
          <Button onClick={handleSaveLink} isLoading={savingLink} size="md">
            Salvar
          </Button>
          {linkEvento && (
            <a href={linkEvento} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="md">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
