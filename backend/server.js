const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Histórico em memória (sem banco de dados para simplicidade)
let historico = [];

// Rota principal - serve o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// API: calcular expressão
app.post('/api/calcular', (req, res) => {
  const { expressao } = req.body;

  if (!expressao) {
    return res.status(400).json({ erro: 'Expressão não fornecida' });
  }

  try {
    // Valida que só tem números e operadores seguros
    if (!/^[\d\s\+\-\*\/\.\(\)]+$/.test(expressao)) {
      return res.status(400).json({ erro: 'Expressão inválida' });
    }

    const resultado = Function('"use strict"; return (' + expressao + ')')();

    if (!isFinite(resultado)) {
      return res.status(400).json({ erro: 'Divisão por zero' });
    }

    const entrada = {
      id: Date.now(),
      expressao,
      resultado: parseFloat(resultado.toFixed(10)),
      data: new Date().toISOString()
    };

    historico.unshift(entrada);
    if (historico.length > 20) historico.pop();

    return res.json({ resultado: entrada.resultado, id: entrada.id });
  } catch (err) {
    return res.status(400).json({ erro: 'Erro ao calcular expressão' });
  }
});

// API: buscar histórico
app.get('/api/historico', (req, res) => {
  res.json(historico);
});

// API: limpar histórico
app.delete('/api/historico', (req, res) => {
  historico = [];
  res.json({ mensagem: 'Histórico limpo' });
});

// Health check para plataformas de deploy
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
