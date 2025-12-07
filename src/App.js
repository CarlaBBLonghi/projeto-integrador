import React, { useState } from 'react';


// --- BASE DE CONHECIMENTO (Lógica Bayesiana) ---
const LIKELIHOODS = {
  // Cenários Franquia e Quiosque
  'Franquia de rua': {
    'custo_baixo': 0.1, 'custo_medio': 0.6, 'custo_alto': 0.9,
    'prazo_rapido': 0.8, 'prazo_longo': 0.2,
    'ideia_comprovada': 0.9, 'ideia_nova': 0.1,
    'risco_baixo': 0.7, 'risco_moderado': 0.5, 'risco_alto': 0.2,
    'habilidade_gestao': 0.9, 'habilidade_tecnica': 0.1,
    'sim_proprio': 0.3, 'nao_aluguel': 0.7,
  },
  'Franquia de shopping': {
    'custo_baixo': 0.05, 'custo_medio': 0.4, 'custo_alto': 0.95,
    'prazo_rapido': 0.7, 'prazo_longo': 0.3,
    'ideia_comprovada': 0.95, 'ideia_nova': 0.05,
    'risco_baixo': 0.6, 'risco_moderado': 0.6, 'risco_alto': 0.3,
    'habilidade_gestao': 0.9, 'habilidade_tecnica': 0.1,
    'sim_proprio': 0.01, 'nao_aluguel': 0.99,
  },
  'Quiosque no metrô/cptm/sptrans': {
    'custo_baixo': 0.3, 'custo_medio': 0.7, 'custo_alto': 0.5,
    'prazo_rapido': 0.7, 'prazo_longo': 0.3,
    'ideia_comprovada': 0.8, 'ideia_nova': 0.2,
    'risco_baixo': 0.5, 'risco_moderado': 0.8, 'risco_alto': 0.4,
    'habilidade_gestao': 0.7, 'habilidade_tecnica': 0.4,
    'sim_proprio': 0.01, 'nao_aluguel': 0.99,
  },
  'Quiosque shopping': {
    'custo_baixo': 0.2, 'custo_medio': 0.7, 'custo_alto': 0.8,
    'prazo_rapido': 0.7, 'prazo_longo': 0.3,
    'ideia_comprovada': 0.8, 'ideia_nova': 0.2,
    'risco_baixo': 0.6, 'risco_moderado': 0.7, 'risco_alto': 0.3,
    'habilidade_gestao': 0.8, 'habilidade_tecnica': 0.3,
    'sim_proprio': 0.01, 'nao_aluguel': 0.99,
  },

  // Cenários Marca Própria (Físico)
  'Marca própria Porta de garagem': {
    'custo_baixo': 0.7, 'custo_medio': 0.4, 'custo_alto': 0.1,
    'prazo_rapido': 0.4, 'prazo_longo': 0.6,
    'ideia_comprovada': 0.5, 'ideia_nova': 0.5,
    'risco_baixo': 0.6, 'risco_moderado': 0.5, 'risco_alto': 0.2,
    'habilidade_gestao': 0.5, 'habilidade_tecnica': 0.4,
    'sim_proprio': 0.95, 'nao_aluguel': 0.05,
  },
  'Marca própria Loja de rua': {
    'custo_baixo': 0.1, 'custo_medio': 0.5, 'custo_alto': 0.8,
    'prazo_rapido': 0.2, 'prazo_longo': 0.8,
    'ideia_comprovada': 0.6, 'ideia_nova': 0.4,
    'risco_baixo': 0.3, 'risco_moderado': 0.7, 'risco_alto': 0.4,
    'habilidade_gestao': 0.8, 'habilidade_tecnica': 0.3,
    'sim_proprio': 0.7, 'nao_aluguel': 0.3,
  },
  'Marca própria loja de shopping': {
    'custo_baixo': 0.01, 'custo_medio': 0.2, 'custo_alto': 0.99,
    'prazo_rapido': 0.1, 'prazo_longo': 0.9,
    'ideia_comprovada': 0.6, 'ideia_nova': 0.4,
    'risco_baixo': 0.2, 'risco_moderado': 0.4, 'risco_alto': 0.8,
    'habilidade_gestao': 0.9, 'habilidade_tecnica': 0.2,
    'sim_proprio': 0.01, 'nao_aluguel': 0.99,
  },

  // Cenários Marca Própria (Digital/Mobile)
  'Marca própria e-commerce': {
    'custo_baixo': 0.4, 'custo_medio': 0.8, 'custo_alto': 0.5,
    'prazo_rapido': 0.5, 'prazo_longo': 0.5,
    'ideia_comprovada': 0.7, 'ideia_nova': 0.4,
    'risco_baixo': 0.4, 'risco_moderado': 0.8, 'risco_alto': 0.3,
    'habilidade_gestao': 0.6, 'habilidade_tecnica': 0.7,
    'sim_proprio': 0.3, 'nao_aluguel': 0.7,
  },
  'Marca própria Carrinho de rua': {
    'custo_baixo': 0.8, 'custo_medio': 0.3, 'custo_alto': 0.1,
    'prazo_rapido': 0.9, 'prazo_longo': 0.1,
    'ideia_comprovada': 0.7, 'ideia_nova': 0.3,
    'risco_baixo': 0.8, 'risco_moderado': 0.3, 'risco_alto': 0.1,
    'habilidade_gestao': 0.6, 'habilidade_tecnica': 0.4,
    'sim_proprio': 0.1, 'nao_aluguel': 0.9,
  },
  'Marca própria com vendas em terceiros': {
    'custo_baixo': 0.5, 'custo_medio': 0.5, 'custo_alto': 0.2,
    'prazo_rapido': 0.6, 'prazo_longo': 0.4,
    'ideia_comprovada': 0.7, 'ideia_nova': 0.3,
    'risco_baixo': 0.6, 'risco_moderado': 0.5, 'risco_alto': 0.2,
    'habilidade_gestao': 0.7, 'habilidade_tecnica': 0.6,
    'sim_proprio': 0.1, 'nao_aluguel': 0.9,
  },

  // Cenários Serviços e Inovação
  'Serviços para eventos': {
    'custo_baixo': 0.6, 'custo_medio': 0.4, 'custo_alto': 0.2,
    'prazo_rapido': 0.6, 'prazo_longo': 0.4,
    'ideia_comprovada': 0.8, 'ideia_nova': 0.2,
    'risco_baixo': 0.5, 'risco_moderado': 0.6, 'risco_alto': 0.3,
    'habilidade_gestao': 0.7, 'habilidade_tecnica': 0.5,
    'sim_proprio': 0.2, 'nao_aluguel': 0.8,
  },
  'Startup': {
    'custo_baixo': 0.1, 'custo_medio': 0.3, 'custo_alto': 0.9,
    'prazo_rapido': 0.1, 'prazo_longo': 0.9,
    'ideia_comprovada': 0.05, 'ideia_nova': 0.95,
    'risco_baixo': 0.05, 'risco_moderado': 0.1, 'risco_alto': 0.95,
    'habilidade_gestao': 0.3, 'habilidade_tecnica': 0.95,
    'sim_proprio': 0.1, 'nao_aluguel': 0.9,
  },
};

// Probabilidade a priori (1/12 para cada cenário)
const PRIORS = Object.keys(LIKELIHOODS).reduce((acc, scenario) => {
  acc[scenario] = 1 / 12;
  return acc;
}, {});

// --- Estrutura de Perguntas ---
const questions = [
  {
    id: 'q1',
    text: "Qual é o seu limite de capital total para investir neste negócio nos primeiros 12 meses?",
    options: [
      { text: "Baixo (ex: até R$10k)💰", value: 'custo_baixo' },
      { text: "Médio (ex: R$11k - R$199k)💰💰", value: 'custo_medio' },
      { text: "Alto (ex: acima de R$200k)💰💰💰", value: 'custo_alto' }
    ]
  },
  {
    id: 'q2',
    text: "Você depende do lucro deste negócio para pagar suas contas pessoais no curto prazo (6-12 meses)?",
    options: [
      { text: "Sim, preciso de renda rápida (6-12 meses)", value: 'prazo_rapido' },
      { text: "Não, posso esperar 2 anos ou mais", value: 'prazo_longo' }
    ]
  },
  {
    id: 'q3',
    text: "Sua motivação principal é executar um plano comprovado ou criar algo radicalmente novo?",
    options: [
      { text: "Executar um plano comprovado", value: 'ideia_comprovada' },
      { text: "Criar um produto/serviço novo", value: 'ideia_nova' }
    ]
  },
  {
    id: 'q4',
    text: "Quão confortável você está com a incerteza financeira? (0 = Segurança total, 10 = Risco total)",
    options: [
      { text: "0-4: Prefiro segurança, mesmo com retorno menor", value: 'risco_baixo' },
      { text: "5-7: Aceito risco moderado por retorno moderado", value: 'risco_moderado' },
      { text: "8-10: Arrisco tudo pela chance de um retorno muito maior", value: 'risco_alto' }
    ]
  },
  {
    id: 'q5',
    text: "Qual é sua maior força profissional?",
    options: [
      { text: "Gestão (Organizar processos, finanças, equipes)", value: 'habilidade_gestao' },
      { text: "Técnica (Programar, criar conteúdo, marketing digital)", value: 'habilidade_tecnica' }
    ]
  },
  {
    id: 'q6',
    text: "Voce possui local próprio ou depende 100% de aluguel?",
    options: [
      { text: "Sim, possuo local próprio (reduzindo custo fixo)", value: 'sim_proprio' },
      { text: "Não, dependeria 100% de aluguel/contrato", value: 'nao_aluguel' }
    ]
  }
];

// ** SIMULAÇÃO DE IMPORTAÇÃO DE LOGO: **
// const SemexeLogo = '/logo.png';


// --- Componente de Estilização (Com ajustes para evitar sobreposição no Header) ---
function AppStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
      /* Adiciona Font Awesome para ícones (necessário para o ícone do Instagram) */
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

      body {
        margin: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      /* --- AJUSTE: CSS para o Header Superior Fixo --- */
      .app-header {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #1f2937;
        border-bottom: 2px solid #3b82f6;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        z-index: 20;
        padding: 0.75rem 1.5rem;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 42rem;
        margin: 0 auto;
      }

      .header-logo {
        font-size: 1.5rem;
        font-weight: 800;
        color: #ffffff;
        white-space: nowrap;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .header-logo img {
          height: 1.8rem;
          max-width: none;
          border-bottom: 10px solid #3b82f6;
          border-radius: 5px

      }

      .header-nav {
        display: flex;
        /* REDUÇÃO DE ESPAÇAMENTO: de 1.5rem para 1rem */
        gap: 1rem;
      }

      .header-link {
        color: #d1d5db;
        text-decoration: none;
        font-weight: 600;
        /* REDUÇÃO DA FONTE: de 0.95rem para 0.85rem */
        font-size: 0.85rem;
        transition: color 0.3s;
        white-space: nowrap; /* Garante que não quebre a linha */
      }

      .header-link:hover, .header-link.active {
        color: #3b82f6;
      }
      /* ----------------------------------------------------- */

      .app-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: #111827;
        color: #f3f4f6;
        padding-top: 5rem;
        padding-bottom: 3rem;
        box-sizing: border-box;
        padding-left: 1rem;
        padding-right: 1rem;
      }

      .quiz-card {
        width: 100%;
        max-width: 42rem;
        background-color: #1f2937;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        padding: 2rem;
        transition: all 0.5s;
        box-sizing: border-box;
        position: relative;
      }

      /* TÍTULO COM GRADIENTE CLEAN */
      .quiz-title {
        font-size: 2rem;
        font-weight: 800;
        text-align: center;
        margin-bottom: 0rem;
        background-image: linear-gradient(to right, #60a5fa, #3b82f6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .quiz-description { font-size: 1.4rem; font-weight: 350; text-align: center; color:rgb(255, 255, 255); margin-bottom: 4rem; margin-top: 0rem; }
      .progress-container { width: 100%; background-color: #374151; border-radius: 9999px; height: 0.625rem; }
      .progress-bar { background-color: #3b82f6; height: 0.625rem; border-radius: 9999px; transition: width 0.5s ease-in-out; }
      .progress-text { text-align: center; font-size: 0.875rem; color: #9ca3af; margin-top: 0.5rem; }
      .question-area { text-align: center; }
      .question-text { font-size: 1.5rem; font-weight: 600; margin-bottom: 2rem; min-height: 60px; color: #e5e7eb; }
      .options-container { display: flex; flex-direction: column; gap: 1rem; }

      /* EFEITO DE HOVER/SELEÇÃO SUAVE */
      .option-button {
        width: 100%;
        background-color: #374151;
        font-size: 1.125rem;
        color: #e5e7eb;
        padding: 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: none;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'Inter', sans-serif;
        font-weight: 600;
      }
      .option-button:hover {
        background-color: #2563eb;
        color: #ffffff;
        transform: translateY(-2px) scale(1.01);
        box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
      }
      .option-button.selected {
        background-color: #3b82f6 !important;
        color: #ffffff !important;
        border: 2px solid #60a5fa;
      }

      .results-container { text-align: center; animation: fade-in 0.5s ease-out; }
      .best-result-card { background-color: #3b82f6; color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); margin-bottom: 2rem; transition: all 0.3s; }
      .best-result-card:hover { transform: scale(1.03); }
      .best-result-label { font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .best-result-model { font-size: 2.25rem; font-weight: 800; margin-top: 0.5rem; }
      .best-result-prob { font-size: 1.875rem; font-weight: 700; opacity: 0.9; }
      .all-results-container { display: flex; flex-direction: column; gap: 1rem; text-align: left; }
      .all-results-title { font-size: 1.25rem; font-weight: 600; color: #d1d5db; margin-bottom: 1rem; }
      .result-item { background-color: #374151; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1mp rgba(0, 0, 0, 0.06); }
      .result-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
      .result-item-model { font-weight: 600; color: #e5e7eb; }
      .result-item-model-best { color: #60a5fa; }
      .result-item-prob { font-weight: 700; color: #e5e7eb; }
      .result-item-prob-best { color: #60a5fa; }
      .result-progress-bar-container { width: 100%; background-color: #4b5563; border-radius: 9999px; height: 0.625rem; }
      .result-progress-bar { background-color: #6b7280; height: 0.625rem; border-radius: 9999px; }
      .result-progress-bar-best { background-color: #3b82f6; }
      .reset-button { margin-top: 2.5rem; background-color: #4b5563; font-size: 1.125rem; color: #e5e7eb; padding: 0.75rem 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: none; cursor: pointer; transition: all 0.3s; font-weight: 600; }
      .reset-button:hover { background-color: #6b7280; color: white; transform: scale(1.02); }

      /* CSS PARA RODAPÉ FIXO NA PÁGINA */
      .footer-bar {
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #1f2937;
        color: #9ca3af;
        border-top: 1px solid #374151;
        padding: 0.75rem 1rem;
        font-size: 0.75rem;
        box-sizing: border-box;
        z-index: 10;
      }
      .footer-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        max-width: 42rem;
        margin: 0 auto;
        gap: 0.5rem 1rem;
      }
      .footer-item {
        display: flex;
        align-items: center;
        white-space: nowrap;
      }
      .instagram-icon i {
        margin-right: 0.3rem;
        color: #c13584;
      }
      .adress-icon i {
        margin-right: 0.3rem;
        color: #c13584;
      }
      .phone-icon i {
        margin-right: 0.3rem;
        color: #c13584;
      }
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );
}

// --- Componente Principal ---
function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const calculateResults = (finalAnswers) => {
    const evidence = Object.values(finalAnswers);
    let posteriors = {};
    let totalProbability = 0;

    for (const [model, prior] of Object.entries(PRIORS)) {
      let likelihood = prior;
      for (const e of evidence) {
        // Multiplica a probabilidade, usando 0.001 para evidências sem peso em um modelo
        likelihood *= LIKELIHOODS[model][e] || 0.001;
      }
      posteriors[model] = likelihood;
      totalProbability += likelihood;
    }

    const normalizedPosteriors = Object.entries(posteriors)
      .map(([model, prob]) => ({
        model,
        probability: (prob / totalProbability) || 0,
      }))
      .sort((a, b) => b.probability - a.probability);

    setResults(normalizedPosteriors);
    setShowResults(true);
  };

  const handleAnswer = (questionId, answerValue) => {
    const newAnswers = { ...answers, [questionId]: answerValue };
    setAnswers(newAnswers);

    const answeredCount = Object.values(newAnswers).filter(v => v !== null).length;

    if (answeredCount < questions.length) {
      // Pequeno timeout para mostrar a seleção antes de ir para a próxima pergunta
      setTimeout(() => {
        setCurrentQuestionIndex(answeredCount);
      }, 300);
    } else {
      setTimeout(() => {
        calculateResults(newAnswers);
      }, 300);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults([]);
    setShowResults(false);
  };

  const displayIndex = showResults ? questions.length - 1 : currentQuestionIndex;
  const currentQuestion = questions[displayIndex];

  return (
    <>
      <AppStyles />

      {/* --- HEADER SUPERIOR FIXO --- */}
      <div className="app-header">
        <div className="header-content">
          <div className="header-logo">
            {/* <img src={SemexeLogo} alt="" style={{ height: '100px' }} /> */}
            <img src={process.env.PUBLIC_URL + '/logo.png'} alt="-" style={{height: '100px'}} />
            SemexeAI
          </div>
          <nav className="header-nav">
            <a href="#!" className="header-link_active">App (Início)</a>
            <a href="#!" className="header-link">Sobre Nós</a>
            <a href="#!" className="header-link">Contatos</a>
            <a href="#!" className="header-link">Sugestão de Melhoria</a>
          </nav>
        </div>
      </div>
      {/* ---------------------------- */}

      <div className="app-container">
        <div className="quiz-card">
          {!showResults ? (
            // --- Tela do Quiz ---
            <>
              <div className="quiz-header">
                <h1 className="quiz-title">
                  Calculadora do empreendedorismo
                </h1>
                <h1 className="quiz-description">
                  Saiba aqui seu perfil empreendedor 😎
                </h1>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${((Object.keys(answers).length) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  Pergunta {Object.keys(answers).length + 1} de {questions.length}
                </p>
              </div>

              <div className="question-area">
                <h2 className="question-text">
                  {currentQuestion.text}
                </h2>
                <div className="options-container">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(currentQuestion.id, option.value)}
                      className={`option-button ${answers[currentQuestion.id] === option.value ? 'selected' : ''}`}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // --- Tela de Resultados ---
            <div className="results-container">
              <h1 className="quiz-title">
                Resultado da Análise
              </h1>

              <div className="best-result-card">
                <span className="best-result-label">Seu perfil mais provável é:</span>
                <h2 className="best-result-model">
                  {results[0].model.toUpperCase()}
                </h2>
                <p className="best-result-prob">
                  {(results[0].probability * 100).toFixed(1)}%
                </p>
              </div>

              <div className="all-results-container">
                <h3 className="all-results-title">Probabilidade de cada modelo:</h3>
                {results.map((result, index) => (
                  <div key={result.model} className="result-item">
                    <div className="result-item-header">
                      <span className={`result-item-model ${index === 0 ? 'result-item-model-best' : ''}`}>
                        {index + 1}. {result.model}
                      </span>
                      <span className={`result-item-prob ${index === 0 ? 'result-item-prob-best' : ''}`}>
                        {(result.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="result-progress-bar-container">
                      <div
                        className={`result-progress-bar ${index === 0 ? 'result-progress-bar-best' : ''}`}
                        style={{ width: `${result.probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="reset-button"
              >
                Fazer novamente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- RODAPÉ GLOBAL FIXO NA PÁGINA --- */}
      <div className="footer-bar">
        <div className="footer-content">
          <span className="footer-item instagram-icon"><i className="fab fa-instagram"></i>@semexeai</span>
          <span className="footer-item adress-icon"><i className="fab fa-MapMarkerAlt"></i>R. Jaguaré Mirim, 71 - Vila Leopoldina</span>
          <span className="footer-item phone-icon"><i className="fab fa-Phone"></i>(11) 3738-1260</span>
          <span className="footer-item">Senai Vila Leopoldina - Mariano Ferraz</span>
        </div>
      </div>
      {/* ------------------------------------ */}
    </>
  );
}

export default App;