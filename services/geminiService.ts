
import { GoogleGenAI, Type } from "@google/genai";
import { EditorialProfile, EditorialCorrection, NewsItem, NewsTrends, HeadlineAnalysis } from "../types";

export const generateHeadlinesFromPitch = async (pitch: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Como um editor experiente, crie 3 variações de manchetes (Informativa, Impactante e Provocativa) baseadas nesta pauta: "${pitch}".
    REGRAS CRÍTICAS: 
    1. Cada manchete deve ter no MÁXIMO 50 caracteres (contando espaços).
    2. ESCREVA TUDO EM LETRAS MAIÚSCULAS (CAIXA ALTA).
    3. Seja conciso e use verbos de ação.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Lista de 3 manchetes em letras maiúsculas com no máximo 50 caracteres cada."
      }
    }
  });

  try {
    const rawHeadlines = JSON.parse(response.text || "[]");
    return rawHeadlines.map((h: string) => h.toUpperCase().substring(0, 50));
  } catch (e) {
    console.error("Erro ao gerar manchetes:", e);
    return [];
  }
};

export const analyzeHeadlines = async (headlines: string[]): Promise<HeadlineAnalysis[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analise as seguintes manchetes jornalísticas sob a ótica de engajamento, ética e clareza. 
    Dê notas de 0 a 100. Manchetes: \n${headlines.join('\n')}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            engagementScore: { type: Type.NUMBER },
            ethicsScore: { type: Type.NUMBER },
            clarityScore: { type: Type.NUMBER },
            critique: { type: Type.STRING },
            improvement: { type: Type.STRING }
          },
          required: ["text", "engagementScore", "ethicsScore", "clarityScore", "critique", "improvement"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Erro no parsing de headlines:", e);
    return [];
  }
};

export const generateJournalisticPitch = async (topic: string, profile: EditorialProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gere uma pauta jornalística completa sobre o tema: "${topic}". 
    Considere o seguinte perfil: Região ${profile.region}, Veículo ${profile.vehicleType}, Linha ${profile.editorialLine}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          context: { type: Type.STRING },
          keyQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedSources: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedFormats: { type: Type.ARRAY, items: { type: Type.STRING } },
          impactLevel: { type: Type.STRING },
          urgency: { type: Type.STRING }
        },
        required: ["title", "context", "keyQuestions", "recommendedSources"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const correctEditorialText = async (text: string): Promise<EditorialCorrection> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Atue como um editor-chefe. Revise o seguinte texto jornalístico para ortografia, gramática e clareza: \n\n "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING },
          correctedText: { type: Type.STRING },
          errorsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
          styleSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          journalisticToneScore: { type: Type.NUMBER }
        },
        required: ["correctedText", "errorsFound", "styleSuggestions", "journalisticToneScore"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const compareNewsSources = async (region: string = "Vale do Paraíba e Região, SP", sources?: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const coreSources = [
    "sampi.net.br/ovale",
    "portalvalenoticias.com.br",
    "vale360news.com.br",
    "lifeinforma.com.br",
    "meon.com.br",
    "bandvale.com.br",
    "ovale.com.br"
  ];

  const sourcesList = sources && sources.length > 0 ? sources : coreSources;

  // Busca ultra-rápida focada em deep links das últimas 3 horas
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Aja como um radar de notícias em tempo real para a região: ${region}.
    Busque nos portais: ${sourcesList.join(", ")}.
    
    FILTRO DE URL (OBRIGATÓRIO):
    1. Retorne APENAS links individuais de matérias (Deep Links). 
    2. PROIBIDO retornar links de 'home' (ex: domain.com.br/) ou categorias (ex: domain.com.br/politica/).
    3. Uma URL válida de notícia geralmente contém hifens ou IDs e termina com o slug do título.
    4. FOCO: Últimas 3 horas.
    5. Distribua os 6 resultados entre portais diferentes.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          news: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                url: { type: Type.STRING },
                category: { type: Type.STRING },
                impactScore: { type: Type.NUMBER },
                timeAgo: { type: Type.STRING }
              },
              required: ["title", "summary", "url", "category", "impactScore", "timeAgo"]
            }
          }
        },
        required: ["news"]
      }
    },
  });

  try {
    const data = JSON.parse(response.text || '{"news": []}');
    const newsItems: NewsItem[] = data.news.map((item: any, index: number) => {
      let domain = "Fonte Regional";
      try {
        if (item.url && item.url.startsWith('http')) {
          const urlObj = new URL(item.url);
          domain = urlObj.hostname.replace('www.', '').split('/')[0];
        }
      } catch (e) {}

      return {
        ...item,
        id: `news-${index}-${Date.now()}`,
        domain
      };
    }).filter((n: any) => {
        try {
          const url = new URL(n.url);
          const path = url.pathname.toLowerCase();
          
          // Bloqueios de segurança
          if (url.hostname.includes('globo.com') || url.hostname.includes('g1.')) return false;
          
          // Lista de caminhos proibidos (páginas de índice conhecidas)
          const forbiddenPaths = ['/', '/ovale', '/noticias', '/politica', '/policia', '/cidades', '/geral', '/social'];
          if (forbiddenPaths.includes(path)) return false;

          // Se for Sampi/OVale, precisa ter /noticia/ ou o slug longo
          if (url.hostname.includes('sampi.net.br') && !path.includes('/noticia/')) return false;

          // Notícias reais costumam ter caminhos longos com hifens
          return path.length > 8 && path.includes('-');
        } catch (e) {
          return false;
        }
    });

    const trends: NewsTrends = {
      politics: newsItems.filter(n => n.category.toLowerCase().includes('polí')).length,
      economy: newsItems.filter(n => n.category.toLowerCase().includes('econ')).length,
      security: newsItems.filter(n => n.category.toLowerCase().includes('segu')).length,
      health: newsItems.filter(n => n.category.toLowerCase().includes('saúd')).length,
      education: newsItems.filter(n => n.category.toLowerCase().includes('educ')).length,
      totalVolume: newsItems.length
    };

    return {
      rawBriefing: "Scanner regional de alta precisão concluído.",
      news: newsItems,
      trends
    };
  } catch (e) {
    console.error("Erro no Scanner:", e);
    throw e;
  }
};
