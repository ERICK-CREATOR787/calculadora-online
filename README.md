# CalcPro — Calculadora Online

Sistema de calculadora online com **Node.js + Express** no backend e HTML/CSS/JS no frontend, com histórico de cálculos via API REST.

## 🗂 Estrutura do Projeto

```
calculadora-online/
├── backend/
│   └── server.js          ← Servidor Express + API REST
├── frontend/
│   ├── index.html          ← Interface da calculadora
│   ├── style.css           ← Estilos (design profissional dark)
│   └── app.js              ← Lógica JS + integração com API
├── package.json
├── .gitignore
└── README.md
```

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+ instalado → https://nodejs.org

### Passos

```bash
# 1. Entre na pasta do projeto
cd calculadora-online

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm start

# 4. Acesse no navegador
# http://localhost:3000
```

---

## ☁️ DEPLOY NO RENDER (Gratuito) — PASSO A PASSO

### Por que o Render?
- Gratuito, sem precisar de cartão de crédito
- Suporta Node.js nativamente
- URL pública automática (exemplo.onrender.com)
- Deploy automático a cada push no GitHub

---

### ETAPA 1 — Criar conta no GitHub

1. Acesse **https://github.com** e clique em **Sign up**
2. Crie sua conta com e-mail e senha
3. Confirme o e-mail

---

### ETAPA 2 — Instalar o Git no computador

**Windows:**
- Baixe em https://git-scm.com/download/win e instale

**Mac:**
```bash
brew install git
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install git
```

Confirme a instalação:
```bash
git --version
```

---

### ETAPA 3 — Configurar o Git (primeira vez)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

---

### ETAPA 4 — Criar repositório no GitHub

1. No GitHub, clique em **"New repository"** (botão verde)
2. Nome: `calculadora-online`
3. Deixe como **Public**
4. Clique em **Create repository**

---

### ETAPA 5 — Enviar o projeto para o GitHub

No terminal, dentro da pasta `calculadora-online`:

```bash
# Inicializa o repositório Git local
git init

# Adiciona todos os arquivos
git add .

# Cria o primeiro commit
git commit -m "feat: calculadora online com backend Express"

# Conecta ao repositório remoto (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/calculadora-online.git

# Envia para o GitHub
git push -u origin main
```

> ⚠️ Se pedir autenticação, use seu usuário e um **Personal Access Token**  
> (GitHub → Settings → Developer settings → Personal access tokens → Generate new token)

---

### ETAPA 6 — Criar conta no Render

1. Acesse **https://render.com**
2. Clique em **Get Started for Free**
3. Faça login com sua conta do **GitHub** (mais fácil!)

---

### ETAPA 7 — Criar o Web Service no Render

1. No dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Clique em **"Connect account"** e autorize o GitHub
3. Selecione o repositório `calculadora-online`
4. Clique em **"Connect"**

---

### ETAPA 8 — Configurar o serviço

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | calculadora-online |
| **Region** | Oregon (US West) |
| **Branch** | main |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

5. Clique em **"Create Web Service"**

---

### ETAPA 9 — Aguardar o deploy

- O Render vai instalar as dependências e iniciar o servidor automaticamente
- Aguarde ~2 minutos
- Quando aparecer **"Live"** (verde), seu site está no ar! 🎉

---

### ETAPA 10 — Acessar a URL pública

- Sua URL será algo como: `https://calculadora-online-xxxx.onrender.com`
- Essa URL é pública e pode ser acessada de qualquer lugar!

---

## 🔄 Como Atualizar o Site

Sempre que fizer alterações no código:

```bash
git add .
git commit -m "atualização: descrição da mudança"
git push
```

O Render faz o deploy automático a cada push! ✅

---

## 📡 API REST — Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Serve o frontend |
| `POST` | `/api/calcular` | Calcula uma expressão |
| `GET` | `/api/historico` | Retorna histórico |
| `DELETE` | `/api/historico` | Limpa o histórico |
| `GET` | `/api/health` | Status do servidor |

### Exemplo de uso da API:

```bash
# Calcular
curl -X POST https://SUA-URL.onrender.com/api/calcular \
  -H "Content-Type: application/json" \
  -d '{"expressao": "10 + 5 * 2"}'

# Resposta:
# {"resultado": 20, "id": 1234567890}
```

---

## 🛠 Tecnologias Utilizadas

- **Backend:** Node.js + Express
- **Frontend:** HTML5 + CSS3 + JavaScript (Vanilla)
- **API:** REST com JSON
- **Deploy:** Render (gratuito)
- **Versionamento:** Git + GitHub

---

## ✅ Requisitos Atendidos

- [x] Backend funcional (Node.js + Express)
- [x] Rotas funcionando (API REST)
- [x] Interface navegável (HTML/CSS/JS)
- [x] Sistema publicado online (Render)
- [x] URL pública acessível
- [x] Estrutura organizada
- [x] Projeto funcional sem erros críticos
- [x] Tecnologias modernas
- [x] Histórico via API (sem banco de dados necessário)
