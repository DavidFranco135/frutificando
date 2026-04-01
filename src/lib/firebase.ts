import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

// Config hardcoded — these are public client-side keys (safe to commit)
const firebaseConfig = {
  apiKey: "AIzaSyA0NNXzbi6NpctcPudTUswms6HkqBV_uQo",
  authDomain: "niklaus-9c2b6.firebaseapp.com",
  projectId: "niklaus-9c2b6",
  storageBucket: "niklaus-9c2b6.firebasestorage.app",
  messagingSenderId: "608119762863",
  appId: "1:608119762863:web:8d022ec10741e9d0b8895a",
  measurementId: "G-CH1ZFCXDDF",
};

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

function getApp_(): FirebaseApp {
  if (!_app) {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return _app;
}

export function getDb(): Firestore {
  if (typeof window === 'undefined') throw new Error('Firestore must be used client-side only');
  if (!_db) _db = getFirestore(getApp_());
  return _db;
}

export function getFirebaseAuth(): Auth {
  if (typeof window === 'undefined') throw new Error('Auth must be used client-side only');
  if (!_auth) _auth = getAuth(getApp_());
  return _auth;
}


// Default content fallback used when Firestore is unavailable
export const DEFAULT_CONTEUDO_FALLBACK = {
  hero_titulo: 'FRUTIFICANDO',
  hero_subtitulo: 'Um final de semana de comunhão, descanso e crescimento espiritual em meio à natureza.',
  sobre_titulo: 'UM MOMENTO DE RENOVAÇÃO',
  sobre_texto: 'O Frutificando é um encontro especial para comunhão, crescimento espiritual e descanso em meio à natureza.',
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
