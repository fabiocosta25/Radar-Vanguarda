
import { AlertSeverity, JournalisticAlert, EditorialPitch } from './types';

// Logo profissional em SVG para garantir que apareça sempre
export const RADAR_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:%233b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:%231d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="45" fill="none" stroke="%231e293b" stroke-width="2" />
  <circle cx="50" cy="50" r="30" fill="none" stroke="%23334155" stroke-width="1" stroke-dasharray="4" />
  <path d="M50 5 L50 95 M5 50 L95 50" stroke="%23334155" stroke-width="0.5" />
  <path d="M50 50 L80 20" stroke="url(%23grad1)" stroke-width="4" stroke-linecap="round">
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite" />
  </path>
  <circle cx="50" cy="50" r="6" fill="%233b82f6" shadow="0 0 10px %233b82f6" />
  <circle cx="70" cy="35" r="3" fill="%233b82f6" opacity="0.6">
    <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
  </circle>
</svg>`;

export const MOCK_ALERTS: JournalisticAlert[] = [
  {
    id: '1',
    timestamp: '2024-05-21T08:00:00Z',
    title: 'Anomalia em Licitação da Linha Verde SJC',
    description: 'Identificado empenho de R$ 12M para manutenção de trecho recém-inaugurado da Linha Verde. Valor 60% acima da média de mercado para pavimentação de BRT.',
    severity: AlertSeverity.HIGH,
    source: 'Diário Oficial de São José dos Campos',
    sourceUrl: 'https://www.sjc.sp.gov.br/servicos/gestao-administrativa/diario-oficial/',
    involvedParties: ['Secretaria de Mobilidade Urbana', 'Consórcio ViaSJC'],
    relevanceReason: 'Possível superfaturamento em obra emblemática da gestão atual.',
    investigativeAngle: 'Comparar custos por km com projetos similares em Curitiba e Sorocaba.',
    confidenceScore: 0.95
  },
  {
    id: '2',
    timestamp: '2024-05-21T10:15:00Z',
    title: 'Contrato Emergencial: Hospital Municipal',
    description: 'Dispensa de licitação para fornecimento de insumos cirúrgicos por empresa com sede em residência no Litoral Norte.',
    severity: AlertSeverity.CRITICAL,
    source: 'Portal da Transparência SJC',
    sourceUrl: 'https://transparencia.sjc.sp.gov.br',
    involvedParties: ['Saúde SJC', 'MedCaiçara Distribuidora'],
    relevanceReason: 'Risco de desabastecimento e favorecimento de empresa sem infraestrutura.',
    investigativeAngle: 'Visita in loco ao endereço da empresa e checagem de sócios no Quadro de Sócios e Administradores (QSA).',
    confidenceScore: 0.89
  }
];

export const MOCK_PITCHES: EditorialPitch[] = [
  {
    id: 'p1',
    title: 'A Expansão Vertical no Jardim Aquarius',
    context: 'Mais 15 novos edifícios aprovados para os próximos 24 meses. Moradores temem colapso no trânsito e drenagem.',
    keyQuestions: [
      'O Plano Diretor está sendo seguido à risca?',
      'Quais as contrapartidas de mobilidade exigidas das construtoras?',
      'Há déficit de vagas em escolas públicas na região?'
    ],
    recommendedSources: [
      'SAVAP (Associação de Moradores)',
      'Secretaria de Urbanismo',
      'Especialistas em Trânsito da UNIVAP'
    ],
    suggestedFormats: ['Reportagem Especial', 'Mapa de Calor de Adensamento'],
    impactLevel: 'local',
    urgency: 'medium',
    tags: ['SJC', 'Urbanismo', 'Imobiliário']
  },
  {
    id: 'p2',
    title: 'Tecnologia Aeroespacial: O Novo Ciclo do DCTA',
    context: 'Novos investimentos internacionais em startups de defesa podem gerar 2.000 empregos de alta qualificação em SJC.',
    keyQuestions: [
      'Como a cidade está preparando a mão de obra?',
      'Qual o impacto no PIB municipal para 2025?',
      'O Parque Tecnológico tem espaço para essa expansão?'
    ],
    recommendedSources: [
      'Diretoria do DCTA',
      'Gestão do Parque Tecnológico',
      'Ciesp SJC'
    ],
    suggestedFormats: ['Série de Vídeos', 'Podcast'],
    impactLevel: 'regional',
    urgency: 'high',
    tags: ['Inovação', 'Economia', 'SJC']
  }
];
