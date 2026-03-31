export const dynamic = 'force-dynamic';

'use client';

import * as React from 'react';
import { configService } from '@/lib/firestore';
import type { EventConfig } from '@/types';
import { Button } from '@/components/ui/Button';
import { Save, Bed, Users, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VagasPage() {
  const [config, setConfig] = React.useState<EventConfig | null>(null);
  const [totalVagas, setTotalVagas] = React.useState(40);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const unsub = configService.subscribe((data) => {
      setConfig(data);
      setTotalVagas(data.vagas_totais);
    });
    return unsub;
  }, []);

  const handleSave = async () => {
    if (!config) return;
    if (totalVagas < config.vagas_ocupadas) {
      toast.error(`Não é possível definir menos vagas do que as já ocupadas (${config.vagas_ocupadas}).`);
      return;
    }
    setIsSaving(true);
    try {
      await configService.update({ vagas_totais: totalVagas });
      toast.success('Configuração de vagas atualizada!');
    } catch {
      toast.error('Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  const vagasRestantes = config ? config.vagas_totais - config.vagas_ocupadas : 0;
  const ocupacaoPercent = config ? Math.round((config.vagas_ocupadas / config.vagas_totais) * 100) : 0;

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-3xl font-black text-brand-700 tracking-tighter">Gestão de Vagas</h1>
        <p className="text-brand-700/50 text-sm mt-1">Configure o total de vagas de hospedagem disponíveis.</p>
      </div>

      {config ? (
        <>
          {/* Status cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-admin text-center">
              <p className="text-xs font-bold text-brand-700/40 uppercase tracking-widest mb-1">Total</p>
              <p className="text-4xl font-black text-brand-700">{config.vagas_totais}</p>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-admin text-center">
              <p className="text-xs font-bold text-brand-700/40 uppercase tracking-widest mb-1">Ocupadas</p>
              <p className="text-4xl font-black text-brand-700">{config.vagas_ocupadas}</p>
            </div>
            <div className={`rounded-3xl p-5 border shadow-admin text-center ${vagasRestantes <= 5 ? 'bg-red-50 border-red-100' : 'bg-white border-black/5'}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${vagasRestantes <= 5 ? 'text-red-400' : 'text-brand-700/40'}`}>Restantes</p>
              <p className={`text-4xl font-black ${vagasRestantes <= 5 ? 'text-red-500' : 'text-brand-700'}`}>{vagasRestantes}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-admin">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-brand-700">Ocupação atual</p>
              <p className="text-sm font-black text-brand-700">{ocupacaoPercent}%</p>
            </div>
            <div className="w-full bg-cream rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${ocupacaoPercent >= 90 ? 'bg-red-500' : ocupacaoPercent >= 70 ? 'bg-orange-400' : 'bg-brand-700'}`}
                style={{ width: `${ocupacaoPercent}%` }}
              />
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-admin space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-black/5">
              <Bed className="w-4 h-4 text-brand-700" />
              <h3 className="font-bold text-brand-700">Alterar total de vagas</h3>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-700/50 uppercase tracking-widest block mb-2">
                Total de vagas de hospedagem
              </label>
              <input
                type="number"
                min={config.vagas_ocupadas}
                max={999}
                value={totalVagas}
                onChange={(e) => setTotalVagas(Number(e.target.value))}
                className="w-full px-5 py-3.5 rounded-2xl bg-cream border-none focus:ring-2 focus:ring-brand-700 outline-none text-brand-700 text-2xl font-black"
              />
              {totalVagas < config.vagas_ocupadas && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Não pode ser menor que as vagas já ocupadas ({config.vagas_ocupadas}).
                </div>
              )}
            </div>

            <Button onClick={handleSave} isLoading={isSaving} className="w-full" size="lg">
              <Save className="w-4 h-4" />
              Salvar configuração
            </Button>
          </div>

          <p className="text-xs text-brand-700/30 text-center">
            As vagas ocupadas são atualizadas automaticamente conforme as inscrições com hospedagem são adicionadas ou removidas.
          </p>
        </>
      ) : (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-700" />
        </div>
      )}
    </div>
  );
}
