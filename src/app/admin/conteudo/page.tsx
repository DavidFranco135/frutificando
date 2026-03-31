export const dynamic = 'force-dynamic';

'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { conteudoService, DEFAULT_CONTEUDO } from '@/lib/firestore';
import type { SiteConteudo } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import {
  Save, Plus, Trash2, FileText, Image, Calendar,
  DollarSign, Phone, MapPin, AlignLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

type FormValues = SiteConteudo;

export default function ConteudoPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: DEFAULT_CONTEUDO,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'programacao_itens' });

  React.useEffect(() => {
    conteudoService.get().then((data) => {
      reset(data);
      setIsLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      await conteudoService.update(data);
      toast.success('Conteúdo atualizado com sucesso!');
    } catch {
      toast.error('Erro ao salvar conteúdo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-700" />
      </div>
    );
  }

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-admin space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-black/5">
        <div className="w-8 h-8 rounded-xl bg-brand-700/5 flex items-center justify-center">
          <Icon className="w-4 h-4 text-brand-700" />
        </div>
        <h3 className="font-bold text-brand-700">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-brand-700 tracking-tighter">Conteúdo do Site</h1>
          <p className="text-brand-700/50 text-sm mt-1">Edite todas as informações exibidas no site.</p>
        </div>
        <Button type="submit" isLoading={isSaving}>
          <Save className="w-4 h-4" />
          Salvar tudo
        </Button>
      </div>

      {/* Hero */}
      <Section title="Seção Hero (Capa)" icon={Image}>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Título Principal" {...register('hero_titulo')} />
          <Input label="URL da Imagem de Fundo (opcional)" {...register('hero_imagem_url')} placeholder="https://..." />
        </div>
        <Textarea label="Subtítulo" rows={2} {...register('hero_subtitulo')} />
      </Section>

      {/* Sobre */}
      <Section title="Seção Sobre" icon={AlignLeft}>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Título" {...register('sobre_titulo')} />
          <Input label="URL da Imagem (opcional)" {...register('sobre_imagem_url')} placeholder="https://..." />
        </div>
        <Textarea label="Texto" rows={5} {...register('sobre_texto')} />
      </Section>

      {/* Evento */}
      <Section title="Informações do Evento" icon={Calendar}>
        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Data de Início" {...register('data_evento_inicio')} placeholder="22/05/2026" />
          <Input label="Data de Término" {...register('data_evento_fim')} placeholder="24/05/2026" />
          <Input label="Local" {...register('local_evento')} placeholder="Sítio, Cidade - UF" icon={<MapPin className="w-3 h-3" />} />
        </div>
      </Section>

      {/* Programação */}
      <Section title="Programação" icon={Calendar}>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-cream rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input label="Dia" {...register(`programacao_itens.${index}.dia`)} placeholder="Sexta-feira (22/05)" />
                <Input label="Horário" {...register(`programacao_itens.${index}.hora`)} placeholder="09:00 - 10:00" />
                <Input label="Título" {...register(`programacao_itens.${index}.titulo`)} />
                <Input label="Ícone" {...register(`programacao_itens.${index}.icone`)} placeholder="Coffee, LogIn, Utensils..." />
              </div>
              <div className="flex gap-3">
                <Input label="Descrição" {...register(`programacao_itens.${index}.descricao`)} className="flex-1" />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-7 w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ id: Date.now().toString(), dia: '', hora: '', titulo: '', descricao: '', icone: 'Clock' })}
        >
          <Plus className="w-4 h-4" />
          Adicionar item
        </Button>
      </Section>

      {/* Valor */}
      <Section title="Preços" icon={DollarSign}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Input label="Nº de Parcelas" type="number" {...register('valor_parcelas', { valueAsNumber: true })} />
          <Input label="Valor da Parcela (R$)" type="number" step="0.01" {...register('valor_parcelado', { valueAsNumber: true })} />
          <Input label="Valor à Vista (R$)" type="number" step="0.01" {...register('valor_avista', { valueAsNumber: true })} />
        </div>
        <Input label="Descrição do valor (opcional)" {...register('valor_descricao')} placeholder="Inclui hospedagem, refeições..." />
      </Section>

      {/* Contato */}
      <Section title="Contato" icon={Phone}>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Número WhatsApp (com DDI)"
            {...register('whatsapp_numero')}
            placeholder="5511999999999"
          />
          <Input
            label="Link de Inscrição no Evento (externo)"
            {...register('link_inscricao_evento')}
            placeholder="https://forms.google.com/..."
          />
        </div>
      </Section>

      <div className="flex justify-end pb-8">
        <Button type="submit" size="lg" isLoading={isSaving}>
          <Save className="w-4 h-4" />
          Salvar todas as alterações
        </Button>
      </div>
    </form>
  );
}
