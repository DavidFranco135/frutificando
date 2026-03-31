# 🌿 Frutificando — Sistema CMS + Site do Evento

Site administrável completo para o retiro cristão **Frutificando 2026**, construído com Next.js, Firebase Firestore e Cloudflare Pages.

---

## 🗂️ Estrutura do Projeto

```
frutificando/
├── src/
│   ├── app/
│   │   ├── page.tsx                  ← Página pública principal
│   │   ├── layout.tsx                ← Layout raiz (fontes, toasts)
│   │   ├── globals.css
│   │   └── admin/
│   │       ├── layout.tsx            ← Guard de autenticação
│   │       ├── page.tsx              ← Dashboard (stats + link evento)
│   │       ├── login/page.tsx        ← Tela de login
│   │       ├── inscricoes/page.tsx   ← Gestão de hospedagens
│   │       ├── conteudo/page.tsx     ← Editor de conteúdo do site
│   │       ├── galeria/page.tsx      ← Upload/gestão de fotos
│   │       └── vagas/page.tsx        ← Configurar total de vagas
│   ├── components/
│   │   ├── ui/                       ← Button, Card, Input, Badge
│   │   ├── site/                     ← Navbar, Hero, About, Schedule...
│   │   └── admin/                    ← AdminSidebar, StatsCard
│   ├── hooks/
│   │   ├── useAuth.ts                ← Autenticação Firebase
│   │   └── useSiteContent.ts         ← Conteúdo do site em tempo real
│   ├── lib/
│   │   ├── firebase.ts               ← Inicialização Firebase
│   │   ├── firestore.ts              ← Todos os serviços do Firestore
│   │   ├── imgbb.ts                  ← Upload de imagens ImgBB
│   │   └── utils.ts                  ← cn(), formatCurrency(), formatDate()
│   └── types/index.ts                ← Todas as interfaces TypeScript
├── firestore.rules                   ← Regras de segurança Firestore
├── firebase.json
├── wrangler.toml                     ← Config Cloudflare Pages
├── tailwind.config.ts
└── next.config.js
```

---

## 🚀 Setup Local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

Edite `.env.local` com seus valores (já estão preenchidos com as chaves do projeto).

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`
Admin: `http://localhost:3000/admin`

---

## 🔐 Configurar Autenticação Firebase

### Passo 1 — Ativar Email/Password no Firebase Console

1. Acesse: [console.firebase.google.com](https://console.firebase.google.com)
2. Projeto **niklaus-9c2b6** → **Authentication** → **Sign-in method**
3. Habilite **Email/Senha**

### Passo 2 — Criar usuário administrador

1. No Firebase Console → **Authentication** → **Users**
2. Clique em **Add user**
3. Email: `admin@frutificando.com` (ou o que preferir)
4. Senha: escolha uma senha segura
5. Copie o **UID** gerado

### Passo 3 — (Opcional) Restringir por UID

Para segurança máxima, edite `firestore.rules` e substitua:
```
function isAdmin() {
  return isAuthenticated();
}
```
por:
```
function isAdmin() {
  return request.auth.uid == "SEU_UID_AQUI";
}
```

---

## 🔒 Deploy das Regras Firestore

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

---

## ☁️ Deploy no Cloudflare Pages

### Método 1 — Via Cloudflare Dashboard (recomendado)

1. Suba o código para um repositório GitHub/GitLab
2. Acesse [pages.cloudflare.com](https://pages.cloudflare.com)
3. Clique em **Create a project** → **Connect to Git**
4. Selecione seu repositório
5. Configure:
   - **Framework preset:** Next.js
   - **Build command:** `npx @cloudflare/next-on-pages`
   - **Build output directory:** `.vercel/output/static`
6. Em **Environment variables**, adicione todas as variáveis do `.env.example`
7. Clique em **Save and Deploy**

### Método 2 — Via CLI

```bash
npm run deploy
```

> **Nota:** A primeira vez, o Wrangler pedirá autenticação na Cloudflare.

---

## 📱 Funcionalidades do Admin (`/admin`)

| Página | URL | O que faz |
|---|---|---|
| Dashboard | `/admin` | Cards de stats, barra de ocupação, link do evento |
| Hospedagens | `/admin/inscricoes` | Tabela de reservas, busca, exportar CSV |
| Conteúdo | `/admin/conteudo` | Editar todos os textos e valores do site |
| Galeria | `/admin/galeria` | Upload (ImgBB), excluir, reordenar fotos |
| Vagas | `/admin/vagas` | Definir total de vagas de hospedagem |

---

## 🗃️ Estrutura Firestore

| Coleção | Documento | Uso |
|---|---|---|
| `inscricoes` | `{id}` | Reservas de hospedagem |
| `conteudo_site` | `principal` | Textos, valores, links do site |
| `galeria` | `{id}` | URLs das fotos (via ImgBB) |
| `config` | `vagas` | Total e ocupação de vagas |

---

## 🖼️ Fluxo de Upload de Fotos

```
Admin seleciona imagem
        ↓
Validação (tipo + tamanho)
        ↓
Upload para ImgBB API
        ↓
ImgBB retorna URL permanente
        ↓
URL salva no Firestore (coleção: galeria)
        ↓
Galeria pública atualiza automaticamente (onSnapshot)
```

---

## 🌐 Seções do Site Público

- **Hero** — Título, subtítulo, datas, local e botão de inscrição
- **Sobre** — Texto descritivo do evento com imagem
- **Programação** — Itens editáveis pelo admin (dia/hora/título/descrição)
- **Hospedagem** — Opções e incluso na estadia
- **Valor** — Preços parcelado/à vista + botão de inscrição no evento
- **Galeria** — Fotos do evento com lightbox
- **Inscrição de Hospedagem** — Formulário com CPF, telefone, vagas em tempo real
- **WhatsApp** — Botão flutuante com número configurável

---

## 📦 Tecnologias

- **Next.js 15** (App Router)
- **Firebase 11** (Firestore + Authentication)
- **TailwindCSS 3**
- **Framer Motion** (animações)
- **React Hook Form + Zod** (formulários com validação)
- **React IMask** (máscara CPF/telefone)
- **ImgBB API** (hospedagem de imagens)
- **Cloudflare Pages** (deploy edge)
- **react-hot-toast** (notificações)
