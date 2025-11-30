import React, { useState } from 'react';

// --- Base de Conhecimento (Lógica Bayesiana) ---
const LIKELIHOODS = {
  'Digital (Negócios Online)': {
    'custo_baixo': 0.8, 'custo_alto': 0.1,
    'prazo_rapido': 0.7, 'prazo_longo': 0.3,
    'ideia_comprovada': 0.5, 'ideia_nova': 0.8,
    'risco_baixo': 0.3, 'risco_moderado': 0.8, 'risco_alto': 0.3,
    'habilidade_gestao': 0.3, 'habilidade_tecnica': 0.9,
  },
  'Tradicional (Franquias)': {
    'custo_baixo': 0.1, 'custo_alto': 0.8,
    'prazo_rapido': 0.7, 'prazo_longo': 0.3,
    'ideia_comprovada': 0.9, 'ideia_nova': 0.1,
    'risco_baixo': 0.9, 'risco_moderado': 0.3, 'risco_alto': 0.1,
    'habilidade_gestao': 0.8, 'habilidade_tecnica': 0.2,
  },
  'Tradicional (Marca Própria)': {
    'custo_baixo': 0.1, 'custo_alto': 0.8,
    'prazo_rapido': 0.2, 'prazo_longo': 0.8,
    'ideia_comprovada': 0.6, 'ideia_nova': 0.4,
    'risco_baixo': 0.5, 'risco_moderado': 0.7, 'risco_alto': 0.3,
    'habilidade_gestao': 0.8, 'habilidade_tecnica': 0.4,
  },
  'Inovador (Startups)': {
    'custo_baixo': 0.1, 'custo_alto': 0.8,
    'prazo_rapido': 0.2, 'prazo_longo': 0.8,
    'ideia_comprovada': 0.1, 'ideia_nova': 0.9,
    'risco_baixo': 0.1, 'risco_moderado': 0.3, 'risco_alto': 0.9,
    'habilidade_gestao': 0.4, 'habilidade_tecnica': 0.9,
  }
};

const PRIORS = {
  'Digital (Negócios Online)': 0.25,
  'Tradicional (Franquias)': 0.25,
  'Tradicional (Marca Própria)': 0.25,
  'Inovador (Startups)': 0.25,
};

const questions = [
  {
    id: 'q1',
    text: "Qual é o seu limite de capital total para investir neste negócio nos primeiros 12 meses?",
    options: [
      { text: "Baixo (ex: até R$ 10k)", value: 'custo_baixo' },
      { text: "Alto (ex: acima de R$ 200k)", value: 'custo_alto' }
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
    text: "Quão confortável você está com a incerteza? (0 = Segurança total, 10 = Risco total)",
    options: [
      { text: "0-4: Prefiro segurança, mesmo com retorno menor", value: 'risco_baixo' },
      { text: "5-7: Aceito risco moderado por retorno moderado", value: 'risco_moderado' },
      { text: "8-10: Arrisco tudo pela chance de um retorno 10x", value: 'risco_alto' }
    ]
  },
  {
    id: 'q5',
    text: "Qual é sua maior força profissional?",
    options: [
      { text: "Gestão (Organizar processos, finanças, equipes)", value: 'habilidade_gestao' },
      { text: "Técnica (Programar, criar conteúdo, marketing digital)", value: 'habilidade_tecnica' }
    ]
  }
];

// --- Componente de Estilização ---
// Injeta o CSS na página sem precisar de arquivos .css ou Tailwind
function AppStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

      body {
        margin: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      .app-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: #111827; /* bg-gray-900 */
        color: #f3f4f6; /* text-gray-100 */
        padding: 1rem;
        box-sizing: border-box;
      }

      .quiz-card {
        width: 100%;
        max-width: 42rem; /* max-w-2xl */
        background-color: #1f2937; /* bg-gray-800 */
        border-radius: 1rem; /* rounded-2xl */
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */
        padding: 2rem;
        transition: all 0.5s;
        box-sizing: border-box;
      }

      .quiz-header {
        margin-bottom: 2rem;
      }

      .quiz-title {
        font-size: 1.875rem; /* text-3xl */
        font-weight: 700;
        text-align: center;
        color: #60a5fa; /* text-blue-400 */
        margin-bottom: 1.5rem;
      }

      .progress-container {
        width: 100%;
        background-color: #374151; /* bg-gray-700 */
        border-radius: 9999px;
        height: 0.625rem; /* h-2.5 */
      }

      .progress-bar {
        background-color: #3b82f6; /* bg-blue-500 */
        height: 0.625rem;
        border-radius: 9999px;
        transition: width 0.5s ease-in-out;
      }

      .progress-text {
        text-align: center;
        font-size: 0.875rem; /* text-sm */
        color: #9ca3af; /* text-gray-400 */
        margin-top: 0.5rem;
      }

      .question-area {
        text-align: center;
      }

      .question-text {
        font-size: 1.5rem; /* text-2xl */
        font-weight: 600;
        margin-bottom: 2rem;
        min-height: 60px;
        color: #e5e7eb;
      }

      .options-container {
        display: flex;
        flex-direction: column;
        gap: 1rem; /* space-y-4 */
      }

      .option-button {
        width: 100%;
        background-color: #374151; /* bg-gray-700 */
        font-size: 1.125rem; /* text-lg */
        color: #e5e7eb; /* text-gray-200 */
        padding: 1rem;
        border-radius: 0.5rem; /* rounded-lg */
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
        border: none;
        cursor: pointer;
        transition: all 0.3s;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
      }

      .option-button:hover {
        background-color: #2563eb; /* hover:bg-blue-600 */
        color: #ffffff; /* hover:text-white */
        transform: scale(1.02);
      }

      .results-container {
        text-align: center;
        animation: fade-in 0.5s ease-out;
      }

      .best-result-card {
        background-color: #3b82f6; /* bg-blue-500 */
        color: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
        margin-bottom: 2rem;
        transition: all 0.3s;
      }
      .best-result-card:hover {
        transform: scale(1.03);
      }

      .best-result-label {
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.1em; /* tracking-widest */
      }

      .best-result-model {
        font-size: 2.25rem; /* text-4xl */
        font-weight: 800;
        margin-top: 0.5rem;
      }

      .best-result-prob {
        font-size: 1.875rem; /* text-3xl */
        font-weight: 700;
        opacity: 0.9;
      }

      .all-results-container {
        display: flex;
        flex-direction: column;
        gap: 1rem; /* space-y-4 */
        text-align: left;
      }

      .all-results-title {
        font-size: 1.25rem; /* text-xl */
        font-weight: 600;
        color: #d1d5db; /* text-gray-300 */
        margin-bottom: 1rem;
      }

      .result-item {
        background-color: #374151; /* bg-gray-700 */
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .result-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .result-item-model {
        font-weight: 600;
        color: #e5e7eb;
      }
      
      .result-item-model-best {
        color: #60a5fa; /* text-blue-400 */
      }

      .result-item-prob {
        font-weight: 700;
        color: #e5e7eb;
      }

      .result-item-prob-best {
        color: #60a5fa; /* text-blue-400 */
      }

      .result-progress-bar-container {
        width: 100%;
        background-color: #4b5563; /* bg-gray-600 */
        border-radius: 9999px;
        height: 0.625rem;
      }

      .result-progress-bar {
        background-color: #6b7280; /* bg-gray-500 */
        height: 0.625rem;
        border-radius: 9999px;
      }
      
      .result-progress-bar-best {
        background-color: #3b82f6; /* bg-blue-500 */
      }

      .reset-button {
        margin-top: 2.5rem;
        background-color: #4b5563; /* bg-gray-600 */
        font-size: 1.125rem;
        color: #e5e7eb;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: none;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 600;
      }

      .reset-button:hover {
        background-color: #6b7280; /* hover:bg-gray-500 */
        color: white;
        transform: scale(1.02);
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
        likelihood *= LIKELIHOODS[model][e] || 0.01;
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

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      calculateResults(newAnswers);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults([]);
    setShowResults(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <>
      {/* A folha de estilo é injetada aqui */}
      <AppStyles />
      <div className="app-container">
        <div className="quiz-card">
          {!showResults ? (
            // --- Tela do Quiz ---
            <>
              <div className="quiz-header">
                <h1 className="quiz-title">
                  Calculadora de Modelo de Negócio
                </h1>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  Pergunta {currentQuestionIndex + 1} de {questions.length}
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
                      className="option-button"
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
    </>
  );
}

export default App;