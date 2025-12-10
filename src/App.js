import React, { useState } from "react";
import SemexeLogo from "./logos/Logo_sem_texto.png";
import senai from "./logos/Senai.png";

// --- Base de Conhecimento (Lógica Bayesiana) ---
// (Mantido inalterado)
const LIKELIHOODS = {
  // Cenários Franquia e Quiosque
  "Franquia de rua": {
    custo_baixo: 0.1,
    custo_medio: 0.6,
    custo_alto: 0.9,
    prazo_rapido: 0.8,
    prazo_longo: 0.2,
    ideia_comprovada: 0.9,
    ideia_nova: 0.1,
    risco_baixo: 0.7,
    risco_moderado: 0.5,
    risco_alto: 0.2,
    habilidade_gestao: 0.9,
    habilidade_tecnica: 0.1,
    sim_proprio: 0.3,
    nao_aluguel: 0.7,
  },
  "Franquia de shopping": {
    custo_baixo: 0.05,
    custo_medio: 0.4,
    custo_alto: 0.95,
    prazo_rapido: 0.7,
    prazo_longo: 0.3,
    ideia_comprovada: 0.95,
    ideia_nova: 0.05,
    risco_baixo: 0.6,
    risco_moderado: 0.6,
    risco_alto: 0.3,
    habilidade_gestao: 0.9,
    habilidade_tecnica: 0.1,
    sim_proprio: 0.01,
    nao_aluguel: 0.99,
  },
  "Quiosque no metrô/cptm/sptrans": {
    custo_baixo: 0.3,
    custo_medio: 0.7,
    custo_alto: 0.5,
    prazo_rapido: 0.7,
    prazo_longo: 0.3,
    ideia_comprovada: 0.8,
    ideia_nova: 0.2,
    risco_baixo: 0.5,
    risco_moderado: 0.8,
    risco_alto: 0.4,
    habilidade_gestao: 0.7,
    habilidade_tecnica: 0.4,
    sim_proprio: 0.01,
    nao_aluguel: 0.99,
  },
  "Quiosque shopping": {
    custo_baixo: 0.2,
    custo_medio: 0.7,
    custo_alto: 0.8,
    prazo_rapido: 0.7,
    prazo_longo: 0.3,
    ideia_comprovada: 0.8,
    ideia_nova: 0.2,
    risco_baixo: 0.6,
    risco_moderado: 0.7,
    risco_alto: 0.3,
    habilidade_gestao: 0.8,
    habilidade_tecnica: 0.3,
    sim_proprio: 0.01,
    nao_aluguel: 0.99,
  },

  // Cenários Marca Própria (Físico)
  "Marca própria Porta de garagem": {
    custo_baixo: 0.7,
    custo_medio: 0.4,
    custo_alto: 0.1,
    prazo_rapido: 0.4,
    prazo_longo: 0.6,
    ideia_comprovada: 0.5,
    ideia_nova: 0.5,
    risco_baixo: 0.6,
    risco_moderado: 0.5,
    risco_alto: 0.2,
    habilidade_gestao: 0.5,
    habilidade_tecnica: 0.4,
    sim_proprio: 0.95,
    nao_aluguel: 0.05,
  },
  "Marca própria Loja de rua": {
    custo_baixo: 0.1,
    custo_medio: 0.5,
    custo_alto: 0.8,
    prazo_rapido: 0.2,
    prazo_longo: 0.8,
    ideia_comprovada: 0.6,
    ideia_nova: 0.4,
    risco_baixo: 0.3,
    risco_moderado: 0.7,
    risco_alto: 0.4,
    habilidade_gestao: 0.8,
    habilidade_tecnica: 0.3,
    sim_proprio: 0.7,
    nao_aluguel: 0.3,
  },
  "Marca própria loja de shopping": {
    custo_baixo: 0.01,
    custo_medio: 0.2,
    custo_alto: 0.99,
    prazo_rapido: 0.1,
    prazo_longo: 0.9,
    ideia_comprovada: 0.6,
    ideia_nova: 0.4,
    risco_baixo: 0.2,
    risco_moderado: 0.4,
    risco_alto: 0.8,
    habilidade_gestao: 0.9,
    habilidade_tecnica: 0.2,
    sim_proprio: 0.01,
    nao_aluguel: 0.99,
  },

  // Cenários Marca Própria (Digital/Mobile)
  "Marca própria e-commerce": {
    custo_baixo: 0.4,
    custo_medio: 0.8,
    custo_alto: 0.5,
    prazo_rapido: 0.5,
    prazo_longo: 0.5,
    ideia_comprovada: 0.7,
    ideia_nova: 0.4,
    risco_baixo: 0.4,
    risco_moderado: 0.8,
    risco_alto: 0.3,
    habilidade_gestao: 0.6,
    habilidade_tecnica: 0.7,
    sim_proprio: 0.3,
    nao_aluguel: 0.7,
  },
  "Marca própria Carrinho de rua": {
    custo_baixo: 0.8,
    custo_medio: 0.3,
    custo_alto: 0.1,
    prazo_rapido: 0.9,
    prazo_longo: 0.1,
    ideia_comprovada: 0.7,
    ideia_nova: 0.3,
    risco_baixo: 0.8,
    risco_moderado: 0.3,
    risco_alto: 0.1,
    habilidade_gestao: 0.6,
    habilidade_tecnica: 0.4,
    sim_proprio: 0.1,
    nao_aluguel: 0.9,
  },
  "Marca própria com vendas em terceiros": {
    custo_baixo: 0.5,
    custo_medio: 0.5,
    custo_alto: 0.2,
    prazo_rapido: 0.6,
    prazo_longo: 0.4,
    ideia_comprovada: 0.7,
    ideia_nova: 0.3,
    risco_baixo: 0.6,
    risco_moderado: 0.5,
    risco_alto: 0.2,
    habilidade_gestao: 0.7,
    habilidade_tecnica: 0.6,
    sim_proprio: 0.1,
    nao_aluguel: 0.9,
  },

  // Cenários Serviços e Inovação
  "Serviços para eventos": {
    custo_baixo: 0.6,
    custo_medio: 0.4,
    custo_alto: 0.2,
    prazo_rapido: 0.6,
    prazo_longo: 0.4,
    ideia_comprovada: 0.8,
    ideia_nova: 0.2,
    risco_baixo: 0.5,
    risco_moderado: 0.6,
    risco_alto: 0.3,
    habilidade_gestao: 0.7,
    habilidade_tecnica: 0.5,
    sim_proprio: 0.2,
    nao_aluguel: 0.8,
  },
  Startup: {
    custo_baixo: 0.1,
    custo_medio: 0.3,
    custo_alto: 0.9,
    prazo_rapido: 0.1,
    prazo_longo: 0.9,
    ideia_comprovada: 0.05,
    ideia_nova: 0.95,
    risco_baixo: 0.05,
    risco_moderado: 0.1,
    risco_alto: 0.95,
    habilidade_gestao: 0.3,
    habilidade_tecnica: 0.95,
    sim_proprio: 0.1,
    nao_aluguel: 0.9,
  },
};

// Probabilidade a priori (1/12 para cada cenário)
const PRIORS = Object.keys(LIKELIHOODS).reduce((acc, scenario) => {
  acc[scenario] = 1 / 12;
  return acc;
}, {});

// --- Estrutura de Perguntas ---
// (Mantido inalterado)
const questions = [
  {
    id: "q1",
    text: "Qual é o seu limite de capital total para investir neste negócio nos primeiros 12 meses?",
    options: [
      { text: "Baixo (ex: até R$10.000)💰", value: "custo_baixo" },
      { text: "Médio (ex: R$11.000 - R$199.000)💰💰", value: "custo_medio" },
      { text: "Alto (ex: acima de R$200.000)💰💰💰", value: "custo_alto" },
    ],
  },
  {
    id: "q2",
    text: "Você depende do lucro deste negócio para pagar suas contas pessoais no curto prazo (6-12 meses)?",
    options: [
      {
        text: "Sim, preciso de renda rápida (6-12 meses)",
        value: "prazo_rapido",
      },
      { text: "Não, posso esperar 2 anos ou mais", value: "prazo_longo" },
    ],
  },
  {
    id: "q3",
    text: "Sua motivação principal é executar um plano comprovado ou criar algo radicalmente novo?",
    options: [
      { text: "Executar um plano comprovado", value: "ideia_comprovada" },
      { text: "Criar um produto/serviço novo", value: "ideia_nova" },
    ],
  },
  {
    id: "q4",
    text: "Quão confortável você está com a incerteza financeira? (0 = Segurança total, 10 = Risco total)",
    options: [
      {
        text: "0-4: Prefiro segurança, mesmo com retorno menor",
        value: "risco_baixo",
      },
      {
        text: "5-7: Aceito risco moderado por retorno moderado",
        value: "risco_moderado",
      },
      {
        text: "8-10: Arrisco tudo pela chance de um retorno muito maior",
        value: "risco_alto",
      },
    ],
  },
  {
    id: "q5",
    text: "Qual é sua maior força profissional?",
    options: [
      {
        text: "Gestão (Organizar processos, finanças, equipes)",
        value: "habilidade_gestao",
      },
      {
        text: "Técnica (Programar, criar conteúdo, marketing digital)",
        value: "habilidade_tecnica",
      },
    ],
  },
  {
    id: "q6",
    text: "Voce possui local próprio ou depende 100% de aluguel?",
    options: [
      {
        text: "Sim, possuo local próprio (reduzindo custo fixo)",
        value: "sim_proprio",
      },
      {
        text: "Não, dependeria 100% de aluguel/contrato",
        value: "nao_aluguel",
      },
    ],
  },
];

// --- Componentes de Página ---

// Componente para a Página "Sobre Nós"
function AboutPage() {
  return (
    <div className="content-page-container">
      <h1 className="page-title">Sobre Nós</h1>
      <p className="page-content">
        <b>
          Somos uma equipe de quatro estudantes do segundo período de Análise e
          Desenvolvimento de Sistemas do SENAI - Mariano Ferraz.
        </b>
        <br />
        <b>O SeMexeAI</b> nasceu como nosso Projeto Integrador com o objetivo de
        aplicar conhecimentos técnicos em uma solução prática para novos
        empreendedores.
        <br />
        Nosso diferencial é a utilização do{" "}
        <b>Teorema de Bayes (classificador Naive Bayes)</b>, uma poderosa
        ferramenta estatística, para analisar as respostas do usuário e calcular
        as probabilidades do seu perfil de investimento (score bayesiano). Isso
        nos permite sugerir o tipo de empreendimento com maior chance de sucesso
        para o seu capital, prazo e apetite ao risco.
        <br />
        <br />
        Agradecemos o interesse em nosso projeto e esperamos que o SeMexeAI seja
        o primeiro passo de sucesso na sua jornada empreendedora!
      </p>
      <p>Anderson - Carla - Eduardo - Julyana</p>
    </div>
  );
}

// Componente para a Página "Contato"
function ContactPage() {
  return (
    <div className="content-page-container">
      <h1 className="page-title">Contatos rede Senai</h1>
      <p className="page-content">Email: sac@senaicni.com.br</p>
      <p>
        ou ligue para (61) 3317-9989 ou (61) 3317-9992 para atendimento geral
      </p>
    </div>
  );
}

// Componente do Quiz (Lógica original, encapsulada para maior clareza)
function QuizContent({
  currentQuestionIndex,
  answers,
  showResults,
  questions,
  results,
  handleAnswer,
  handleReset,
}) {
  const displayIndex = showResults
    ? questions.length - 1
    : currentQuestionIndex;
  const currentQuestion = questions[displayIndex];

  return (
    <div className="quiz-card">
      {!showResults ? (
        // --- Tela do Quiz ---
        <>
          <div className="quiz-header">
            <h1 className="quiz-title">Calculadora do empreendedorismo</h1>
            <h1 className="quiz-description">
              Saiba aqui seu perfil empreendedor 😎
            </h1>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${
                    (Object.keys(answers).length / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p className="progress-text">
              Pergunta {Object.keys(answers).length + 1} de {questions.length}
            </p>
          </div>

          <div className="question-area">
            <h2 className="question-text">{currentQuestion.text}</h2>
            <div className="options-container">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`option-button ${
                    answers[currentQuestion.id] === option.value
                      ? "option-button-selected"
                      : ""
                  }`}
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
          <h1 className="quiz-title">Resultado da Análise</h1>

          <div className="best-result-card">
            <span className="best-result-label">
              Seu perfil mais provável é:
            </span>
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
                  <span
                    className={`result-item-model ${
                      index === 0 ? "result-item-model-best" : ""
                    }`}
                  >
                    {index + 1}. {result.model}
                  </span>
                  <span
                    className={`result-item-prob ${
                      index === 0 ? "result-item-prob-best" : ""
                    }`}
                  >
                    {(result.probability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="result-progress-bar-container">
                  <div
                    className={`result-progress-bar ${
                      index === 0 ? "result-progress-bar-best" : ""
                    }`}
                    style={{ width: `${result.probability * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleReset} className="reset-button">
            Fazer novamente
          </button>
        </div>
      )}
    </div>
  );
}

// --- Componente de Estilização (Com ajustes no Header, App Container e novos estilos para as páginas) ---
function AppStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

      body {
        margin: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      /* --- CSS para o Header Superior Fixo (Light Mode) --- */
      .app-header {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #ffffff;
        border-bottom: 2px solid #3b82f6;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 20;
        padding: 0.75rem 0rem;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 40rem; /* Aumentado para melhor alinhamento com o card */
        margin: 0 auto;
      }

      .header-logo-container {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: 800;
        color: #1f2937;
        white-space: nowrap;
        cursor: pointer;
      }

      .header-logo-img {
          height: 6rem;
          width: 6rem;
          margin-right: 0.5rem;
          border-radius: 0px;
          object-fit: contain;

      }

      .header-nav {
        display: flex;
        gap: 1rem;
      }

      .header-link {
        color: #6b7280;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
        transition: color 0.3s;
        cursor: pointer; /* Adicionado cursor pointer */
      }

      .header-link:hover, .header-link.active {
        color:rgb(246, 159, 59);
      }
      /* ----------------------------------------------------- */

      .app-container {
        display: flex;
        align-items: center; /* Alterado para alinhar no topo em páginas de conteúdo */
        justify-content: center;
        min-height: 100vh;
        background-color:rgb(56, 126, 196);
        color: #1f2937;

        padding-top: 8rem; /* Aumentado para acomodar o header fixo */
        padding-bottom: 3rem;

        box-sizing: border-box;
        padding-left: 1rem;
        padding-right: 1rem;
      }

      /* Estilo para as novas páginas de conteúdo */
      .content-page-container {
        width: 100%;
        max-width: 42rem;
        background-color:rgb(255, 255, 255);
        border-radius: 1rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        padding: 2rem;
        box-sizing: border-box;
        border: 1px solid #e5e7eb;
        text-align: center;
        min-height: 200px; /* Para dar um volume */
      }

      .page-title {
        font-size: 2.25rem;
        font-weight: 700;
        color: #3b82f6;
        margin-bottom: 1.5rem;
      }

      .page-content {
        font-size: 1.125rem;
        color: #4b5563;
        line-height: 1.6;
      }
      /* Fim dos novos estilos */

      .quiz-card {
        width: 100%;
        max-width: 42rem;
        background-color:rgb(255, 255, 255);
        border-radius: 1rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\
        padding: 2rem;\
        transition: all 0.5s;\
        box-sizing: border-box;
        position: relative;
        border: 1px solid #e5e7eb;
      }

      /* Estilos do Quiz e Resultados - Light Mode */

      .quiz-header { margin-bottom: 2rem; }
      .quiz-title { font-size: 1.875rem; font-weight: 700; text-align: center; color: #1f2937; margin-bottom: 0rem; }
      .quiz-description { font-size: 1.4rem; font-weight: 350; text-align: center; color: #4b5563; margin-bottom: 4rem; margin-top: 0rem; }
      .progress-container { width: 100%; background-color: #e5e7eb; border-radius: 9999px; height: 0.625rem; }
      .progress-bar { background-color: #3b82f6; height: 0.625rem; border-radius: 9999px; transition: width 0.5s ease-in-out; }
      .progress-text { text-align: center; font-size: 0.875rem; color: #9ca3af; margin-top: 0.5rem; }
      .question-area { text-align: center; }
      .question-text { font-size: 1.5rem; font-weight: 600; margin-bottom: 2rem; min-height: 60px; color: #1f2937; }
      .options-container { display: flex; flex-direction: column; gap: 1rem; }

      /* Botões de Opção */
      .option-button {
        width: 100%;
        background-color:rgb(223, 223, 223);
        font-size: 1.125rem;
        color: #1f2937;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        border: 1px solid #d1d5db;
        cursor: pointer;
        transition: all 0.3s;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
      }
      .option-button:hover {
        background-color: #2563eb;
        color: #ffffff;
        transform: scale(1.02);
        border-color: #2563eb;
      }
      /* Estilo para a opção selecionada */
      .option-button-selected {
          background-color: #3b82f6 !important;
          color: #ffffff !important;
          border-color: #3b82f6 !important;
      }

      .results-container { text-align: center; animation: fade-in 0.5s ease-out; }

      /* Cartão de Melhor Resultado */
      .best-result-card {
        background-color: #3b82f6;
        color: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
        transition: all 0.3s;
      }

      .all-results-title { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin-bottom: 1rem; }

      /* Item de Resultado Individual */
      .result-item {
        background-color: #f9fafb;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        border: 1px solid #e5e7eb;
      }
      .result-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
      .result-item-model { font-weight: 600; color:rgb(55, 43, 31); }
      .result-item-model-best { color: #3b82f6; }
      .result-item-prob { font-weight: 700; color: #4b5563; }
      .result-item-prob-best { color: #3b82f6; }
      .result-progress-bar-container { width: 100%; background-color: #e5e7eb; border-radius: 9999px; height: 0.625rem; }
      .result-progress-bar { background-color: #9ca3af; height: 0.625rem; border-radius: 9999px; transition: width 0.3s; }
      .result-progress-bar-best { background-color: #3b82f6; }

      /* Botão de Reset */
      .reset-button {
        margin-top: 2.5rem;
        background-color:rgb(236, 36, 36);
        font-size: 1.125rem;
        color: #ffffff;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: none;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 600;
      }
      .reset-button:hover {
        background-color: #4b5563;
        color: white;
        transform: scale(1.02);
      }

      /* --- CSS PARA RODAPÉ FIXO NA PÁGINA (Light Mode) --- */
      .footer-bar {
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #ffffff;
        color: #6b7280;
        border-top: 1px solid #e5e7eb;
        padding: 0.75rem 1rem;
        font-size: 0.75rem;
        box-sizing: border-box;
        z-index: 10;
      }
      .footer-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        max-width: 42rem;
        margin: 0 auto;
        gap: 0.5rem 2rem;
      }
      .footer-item {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        white-space: nowrap;
      }

      .footer-logo-img {
          height: 2rem;
          width: 6rem;
          margin-right: 4rem;
          border-radius: 0px;
          object-fit: contain;
          flex-shrink: 0;
      }

      .instagram-icon::before {
          content: "📸 ";
      }
      /* ------------------------------------ */
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );
}

// --- Componente Principal Atualizado ---
function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); // Novo estado para controle da página

  // Funções de Navegação
  const goToHome = () => setCurrentPage("home");
  const goToAbout = () => setCurrentPage("about");
  const goToContact = () => setCurrentPage("contact");

  // Lógica de Cálculo (Mantida inalterada)
  const calculateResults = (finalAnswers) => {
    const evidence = Object.values(finalAnswers);
    let posteriors = {};
    let totalProbability = 0;

    for (const [model, prior] of Object.entries(PRIORS)) {
      let likelihood = prior;
      for (const e of evidence) {
        likelihood *= LIKELIHOODS[model][e] || 0.001;
      }
      posteriors[model] = likelihood;
      totalProbability += likelihood;
    }

    const normalizedPosteriors = Object.entries(posteriors)
      .map(([model, prob]) => ({
        model,
        probability: prob / totalProbability || 0,
      }))
      .sort((a, b) => b.probability - a.probability);

    setResults(normalizedPosteriors);
    setShowResults(true);
  };

  const handleAnswer = (questionId, answerValue) => {
    const newAnswers = { ...answers, [questionId]: answerValue };
    setAnswers(newAnswers);

    const answeredCount = Object.values(newAnswers).filter(
      (v) => v !== null
    ).length;

    if (answeredCount < questions.length) {
      setCurrentQuestionIndex(answeredCount);
    } else {
      calculateResults(newAnswers);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults([]);
    setShowResults(false);
    goToHome(); // Volta para a home ao resetar, caso estivesse em resultados
  };

  // Renderiza a página principal (Home) ou o conteúdo do About/Contact
  const renderPageContent = () => {
    switch (currentPage) {
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "home":
      default:
        // Passa todas as props necessárias para o componente Quiz
        return (
          <QuizContent
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            showResults={showResults}
            questions={questions}
            results={results}
            handleAnswer={handleAnswer}
            handleReset={handleReset}
          />
        );
    }
  };

  return (
    <>
      <AppStyles />

      {/* --- HEADER SUPERIOR FIXO (Links atualizados) --- */}
      <div className="app-header">
        <div className="header-content">
          {/* LOGO NO CABEÇALHO */}
          <div className="header-logo-container" onClick={goToHome}>
            <img
              src={SemexeLogo}
              alt="Logo SeMexeAI"
              className="header-logo-img"
            />
            SeMexeAI
          </div>

          <nav className="header-nav">
            <button // CORRIGIDO
              onClick={goToHome}
              className={`header-link ${
                currentPage === "home" ? "active" : ""
              }`}
            >
              Home
            </button>

            <button // CORRIGIDO
              onClick={goToAbout}
              className={`header-link ${
                currentPage === "about" ? "active" : ""
              }`}
            >
              Sobre Nós
            </button>

            <button // CORRIGIDO
              onClick={goToContact}
              className={`header-link ${
                currentPage === "contact" ? "active" : ""
              }`}
            >
              Contatos
            </button>
          </nav>
        </div>
      </div>
      {/* ---------------------------- */}

      <div className="app-container">
        {renderPageContent()} {/* Renderização condicional do conteúdo */}
      </div>

      {/* --- RODAPÉ GLOBAL FIXO NA PÁGINA (Mantido inalterado) --- */}
      <div className="footer-bar">
        <div className="footer-content">
          <span className="footer-item">
            <img src={senai} alt="Logo senai" className="footer-logo-img" />
          </span>
          <span className="footer-item instagram-icon">@semexeai</span>
          <span className="footer-item">
            📍R. Jaguaré Mirim, 71 - Vila Leopoldina
          </span>
          <span className="footer-item">📞(11) 3738-1260</span>
        </div>
      </div>
      {/* ------------------------------------ */}
    </>
  );
}

export default App;
