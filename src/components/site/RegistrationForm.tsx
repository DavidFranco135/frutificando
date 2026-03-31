'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, User, Phone, FileText, MessageSquare, Home, Leaf } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { inscricoesService, configService } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const schema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
  hospedagem: z.boolean(),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [vagasRestantes, setVagasRestantes] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { hospedagem: false, nome: '', cpf: '', telefone: '', observacoes: '' },
  });

  React.useEffect(() => {
    const unsub = configService.subscribe((config) => {
      setVagasRestantes(config.vagas_totais - config.vagas_ocupadas);
    });
    return unsub;
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await inscricoesService.add({ ...data, data_inscricao: new Date().toISOString() });
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao enviar sua inscrição. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inscricao" className="py-24 md:py-32 bg-cream relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 text-brand-700 font-bold tracking-widest uppercase text-xs mb-4">
              <Leaf className="w-4 h-4" />
              <span>Hospedagem</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-brand-700 leading-[0.9] tracking-tighter mb-6">
              RESERVE SUA<br />HOSPEDAGEM
            </h2>
            <p className="text-lg text-brand-700/70 leading-relaxed mb-10">
              Preencha o formulário para reservar sua vaga de hospedagem no Frutificando 2026. Entraremos em contato via WhatsApp para confirmar os detalhes.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-brand-700 shadow-card">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-700/50 uppercase tracking-widest">Vagas de Hospedagem</p>
                <p className="text-3xl font-black text-brand-700">
                  {vagasRestantes !== null ? `${vagasRestantes} restantes` : '—'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-700 mb-3">Reserva enviada!</h3>
                    <p className="text-brand-700/60">Entraremos em contato pelo WhatsApp em breve.</p>
                    <Button variant="outline" className="mt-8" onClick={() => setIsSuccess(false)}>
                      Fazer outra reserva
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    {/* Nome */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3 h-3" /> Nome Completo
                      </label>
                      <input
                        {...register('nome')}
                        placeholder="Ex: João Silva"
                        className={cn(
                          'w-full px-5 py-3.5 rounded-2xl bg-cream border-none focus:ring-2 focus:ring-brand-700 outline-none transition-all text-brand-700',
                          errors.nome && 'ring-2 ring-red-400'
                        )}
                      />
                      {errors.nome && <p className="text-xs text-red-500">{errors.nome.message}</p>}
                    </div>

                    {/* CPF + Telefone */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-2">
                          <FileText className="w-3 h-3" /> CPF
                        </label>
                        <IMaskInput
                          mask="000.000.000-00"
                          onAccept={(v) => setValue('cpf', v)}
                          placeholder="000.000.000-00"
                          className={cn(
                            'w-full px-5 py-3.5 rounded-2xl bg-cream border-none focus:ring-2 focus:ring-brand-700 outline-none transition-all text-brand-700',
                            errors.cpf && 'ring-2 ring-red-400'
                          )}
                        />
                        {errors.cpf && <p className="text-xs text-red-500">{errors.cpf.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-2">
                          <Phone className="w-3 h-3" /> WhatsApp
                        </label>
                        <IMaskInput
                          mask="(00) 00000-0000"
                          onAccept={(v) => setValue('telefone', v)}
                          placeholder="(00) 00000-0000"
                          className={cn(
                            'w-full px-5 py-3.5 rounded-2xl bg-cream border-none focus:ring-2 focus:ring-brand-700 outline-none transition-all text-brand-700',
                            errors.telefone && 'ring-2 ring-red-400'
                          )}
                        />
                        {errors.telefone && <p className="text-xs text-red-500">{errors.telefone.message}</p>}
                      </div>
                    </div>

                    {/* Hospedagem */}
                    <label className="flex items-center gap-4 p-5 rounded-2xl bg-brand-700/5 border border-brand-700/10 cursor-pointer">
                      <input type="checkbox" {...register('hospedagem')} className="w-5 h-5 accent-brand-700" />
                      <span className="text-sm font-bold text-brand-700">Desejo hospedagem no sítio</span>
                    </label>

                    {/* Observações */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Observações (Opcional)
                      </label>
                      <textarea
                        {...register('observacoes')}
                        rows={3}
                        placeholder="Restrição alimentar, necessidades especiais..."
                        className="w-full px-5 py-3.5 rounded-2xl bg-cream border-none focus:ring-2 focus:ring-brand-700 outline-none transition-all resize-none text-brand-700"
                      />
                    </div>

                    {error && (
                      <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                        {error}
                      </div>
                    )}

                    <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                      {!isSubmitting && <><Send className="w-4 h-4" /> Enviar reserva</>}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
