import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { getDb } from './firebase';
import type {
  Inscricao,
  GaleriaFoto,
  SiteConteudo,
  EventConfig,
  DashboardStats,
} from '@/types';

const COLLECTIONS = {
  INSCRICOES: 'inscricoes',
  GALERIA: 'galeria',
  CONTEUDO: 'conteudo_site',
  CONFIG: 'config',
} as const;

const CONFIG_DOC_ID = 'vagas';
const CONTEUDO_DOC_ID = 'principal';

export const DEFAULT_CONFIG: EventConfig = {
  vagas_totais: 40,
  vagas_ocupadas: 0,
};

export const DEFAULT_CONTEUDO: SiteConteudo = {
  hero_titulo: 'FRUTIFICANDO',
  hero_subtitulo: 'Um final de semana de comunhão, descanso e crescimento espiritual em meio à natureza.',
  sobre_titulo: 'UM MOMENTO DE RENOVAÇÃO',
  sobre_texto: 'O Frutificando é um encontro especial para comunhão, crescimento espiritual e descanso em meio à natureza. Um final de semana preparado para fortalecer a fé, criar novas amizades e viver momentos inesquecíveis.',
  programacao_itens: [
    { id: '1', dia: 'Sexta-feira (22/05)', hora: '16:00 - 17:00', titulo: 'Entrada', descricao: 'Check-in e acomodação nos quartos.', icone: 'LogIn' },
    { id: '2', dia: 'Sexta-feira (22/05)', hora: '20:00', titulo: 'Jantar', descricao: 'Momento de comunhão e refeição.', icone: 'Utensils' },
    { id: '3', dia: 'Sábado (23/05)', hora: '07:00 - 08:30', titulo: 'Café da Manhã', descricao: 'Início do dia com energia.', icone: 'Coffee' },
    { id: '4', dia: 'Sábado (23/05)', hora: '12:00', titulo: 'Almoço', descricao: 'Refeição principal do dia.', icone: 'Utensils' },
  ],
  valor_parcelado: 26.70,
  valor_parcelas: 7,
  valor_avista: 186.90,
  valor_descricao: 'Inclui hospedagem, 3 refeições e todas as atividades.',
  whatsapp_numero: '5511999999999',
  link_inscricao_evento: '',
  data_evento_inicio: '22/05/2026',
  data_evento_fim: '24/05/2026',
  local_evento: 'Sítio em Mairiporã - SP',
};

export const configService = {
  async get(): Promise<EventConfig> {
    const db = getDb();
    const ref = doc(db, COLLECTIONS.CONFIG, CONFIG_DOC_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) { await setDoc(ref, DEFAULT_CONFIG); return DEFAULT_CONFIG; }
    return snap.data() as EventConfig;
  },
  async update(config: Partial<EventConfig>): Promise<void> {
    const db = getDb();
    await setDoc(doc(db, COLLECTIONS.CONFIG, CONFIG_DOC_ID), config, { merge: true });
  },
  subscribe(callback: (config: EventConfig) => void): () => void {
    const db = getDb();
    return onSnapshot(doc(db, COLLECTIONS.CONFIG, CONFIG_DOC_ID), (snap) => {
      callback(snap.exists() ? (snap.data() as EventConfig) : DEFAULT_CONFIG);
    });
  },
};

export const inscricoesService = {
  async getAll(): Promise<Inscricao[]> {
    const db = getDb();
    const snap = await getDocs(query(collection(db, COLLECTIONS.INSCRICOES), orderBy('data_inscricao', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Inscricao));
  },
  async add(data: Omit<Inscricao, 'id'>): Promise<Inscricao> {
    if (data.hospedagem) {
      const config = await configService.get();
      if (config.vagas_ocupadas >= config.vagas_totais) throw new Error('Infelizmente as vagas de hospedagem acabaram.');
    }
    const db = getDb();
    const docRef = await addDoc(collection(db, COLLECTIONS.INSCRICOES), data);
    if (data.hospedagem) {
      const config = await configService.get();
      await configService.update({ vagas_ocupadas: config.vagas_ocupadas + 1 });
    }
    return { id: docRef.id, ...data };
  },
  async delete(id: string): Promise<void> {
    const db = getDb();
    const ref = doc(db, COLLECTIONS.INSCRICOES, id);
    const snap = await getDoc(ref);
    const data = snap.data() as Inscricao | undefined;
    await deleteDoc(ref);
    if (data?.hospedagem) {
      const config = await configService.get();
      await configService.update({ vagas_ocupadas: Math.max(0, config.vagas_ocupadas - 1) });
    }
  },
  subscribe(callback: (data: Inscricao[]) => void): () => void {
    const db = getDb();
    const q = query(collection(db, COLLECTIONS.INSCRICOES), orderBy('data_inscricao', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Inscricao)));
    });
  },
  exportToCSV(inscricoes: Inscricao[]): void {
    const headers = ['Nome', 'CPF', 'Telefone', 'Hospedagem', 'Observações', 'Data Inscrição'];
    const rows = inscricoes.map((i) => [i.nome, i.cpf, i.telefone, i.hospedagem ? 'Sim' : 'Não', i.observacoes || '', new Date(i.data_inscricao).toLocaleString('pt-BR')]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscricoes-frutificando-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

export const conteudoService = {
  async get(): Promise<SiteConteudo> {
    const db = getDb();
    const ref = doc(db, COLLECTIONS.CONTEUDO, CONTEUDO_DOC_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) { await setDoc(ref, DEFAULT_CONTEUDO); return DEFAULT_CONTEUDO; }
    return snap.data() as SiteConteudo;
  },
  async update(data: Partial<SiteConteudo>): Promise<void> {
    const db = getDb();
    await setDoc(doc(db, COLLECTIONS.CONTEUDO, CONTEUDO_DOC_ID), data, { merge: true });
  },
  subscribe(callback: (data: SiteConteudo) => void): () => void {
    const db = getDb();
    return onSnapshot(doc(db, COLLECTIONS.CONTEUDO, CONTEUDO_DOC_ID), (snap) => {
      callback(snap.exists() ? (snap.data() as SiteConteudo) : DEFAULT_CONTEUDO);
    });
  },
};

export const galeriaService = {
  async getAll(): Promise<GaleriaFoto[]> {
    const db = getDb();
    const snap = await getDocs(query(collection(db, COLLECTIONS.GALERIA), orderBy('ordem', 'asc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GaleriaFoto));
  },
  async add(foto: Omit<GaleriaFoto, 'id'>): Promise<GaleriaFoto> {
    const db = getDb();
    const docRef = await addDoc(collection(db, COLLECTIONS.GALERIA), foto);
    return { id: docRef.id, ...foto };
  },
  async delete(id: string): Promise<void> {
    const db = getDb();
    await deleteDoc(doc(db, COLLECTIONS.GALERIA, id));
  },
  async updateOrdem(fotos: GaleriaFoto[]): Promise<void> {
    const db = getDb();
    const batch = writeBatch(db);
    fotos.forEach((foto, index) => {
      if (foto.id) batch.update(doc(db, COLLECTIONS.GALERIA, foto.id), { ordem: index });
    });
    await batch.commit();
  },
  subscribe(callback: (data: GaleriaFoto[]) => void): () => void {
    const db = getDb();
    const q = query(collection(db, COLLECTIONS.GALERIA), orderBy('ordem', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as GaleriaFoto)));
    });
  },
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [inscricoes, config] = await Promise.all([inscricoesService.getAll(), configService.get()]);
  const com_hospedagem = inscricoes.filter((i) => i.hospedagem).length;
  return {
    total_inscritos: inscricoes.length,
    inscritos_com_hospedagem: com_hospedagem,
    inscritos_sem_hospedagem: inscricoes.length - com_hospedagem,
    vagas_restantes: config.vagas_totais - config.vagas_ocupadas,
    vagas_totais: config.vagas_totais,
  };
}
