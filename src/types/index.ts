// ─── Domain Types ───────────────────────────────────────────────────────────

export interface Inscricao {
  id?: string;
  nome: string;
  cpf: string;
  telefone: string;
  hospedagem: boolean;
  observacoes?: string;
  data_inscricao: string; // ISO string
}

export interface GaleriaFoto {
  id?: string;
  url: string;
  thumb_url?: string;
  titulo?: string;
  ordem: number;
  data_upload: string; // ISO string
}

export interface SiteConteudo {
  // Hero
  hero_titulo: string;
  hero_subtitulo: string;
  hero_imagem_url?: string;
  // Sobre
  sobre_titulo: string;
  sobre_texto: string;
  sobre_imagem_url?: string;
  // Programação
  programacao_itens: ProgramacaoItem[];
  // Valor
  valor_parcelado: number;
  valor_parcelas: number;
  valor_avista: number;
  valor_descricao?: string;
  // Contato
  whatsapp_numero: string;
  link_inscricao_evento?: string;
  // Datas
  data_evento_inicio: string;
  data_evento_fim: string;
  local_evento: string;
}

export interface ProgramacaoItem {
  id: string;
  dia: string;
  hora: string;
  titulo: string;
  descricao: string;
  icone?: string;
}

export interface EventConfig {
  vagas_totais: number;
  vagas_ocupadas: number;
}

// ─── Admin Types ─────────────────────────────────────────────────────────────

export interface DashboardStats {
  total_inscritos: number;
  inscritos_com_hospedagem: number;
  inscritos_sem_hospedagem: number;
  vagas_restantes: number;
  vagas_totais: number;
}

// ─── Form Types ──────────────────────────────────────────────────────────────

export type InscricaoFormData = Omit<Inscricao, 'id' | 'data_inscricao'>;
