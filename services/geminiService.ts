import { GoogleGenAI, Type, FunctionDeclaration, Schema } from "@google/genai";
import { AspectRatio, GroundingMetadata } from '../types';

// Helper to get API Key safely
const getApiKey = () => process.env.API_KEY || '';

// Helper to check for custom key selection (mocking the window interface)
// In a real scenario, we would use window.aistudio.hasSelectedApiKey()
const ensureCustomKey = async (): Promise<void> => {
  if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
       await (window as any).aistudio.openSelectKey();
    }
  }
};

/**
 * 1. Image Generation (Standard/Fast)
 * Model: gemini-2.5-flash-image (Nano Banana)
 */
export const generateStandardImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
          // imageSize is not supported for gemini-2.5-flash-image
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    // Check if model returned text (e.g. refusal or clarification)
    const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
    if (textPart?.text) {
      throw new Error(textPart.text);
    }

    throw new Error("لم يتم إنشاء الصورة لسبب غير معروف.");
  } catch (e: any) {
    console.error("Standard Generation Error:", e);
    throw new Error(e.message || "فشل في إنشاء الصورة.");
  }
};

/**
 * Legacy: Image Generation (High Quality)
 * Model: gemini-3-pro-image-preview
 */
export const generateHighQualityImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  await ensureCustomKey(); // Requirement for gemini-3-pro-image-preview
  
  // Re-instantiate with potentially new key from selection
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K" // Defaulting to 1K
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    // Check if model returned text
    const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
    if (textPart?.text) {
      throw new Error(textPart.text);
    }

    throw new Error("لم يتم إنشاء الصورة لسبب غير معروف.");
  } catch (e: any) {
    console.error("HQ Generation Error:", e);
    throw new Error(e.message || "فشل في إنشاء الصورة.");
  }
};

/**
 * 2. Image Editing
 * Model: gemini-2.5-flash-image
 * "Nano banana powered app"
 */
export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  // Extract mime type and clean base64 data
  const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
  const cleanBase64 = base64Image.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    // Check if model returned text
    const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
    if (textPart?.text) {
      throw new Error(textPart.text);
    }

    throw new Error("لم يتم إرجاع صورة معدلة.");
  } catch (e: any) {
    console.error("Image Edit Error:", e);
    throw new Error(e.message || "فشل في تعديل الصورة.");
  }
};

/**
 * 3. Search Grounding (Market Research)
 * Model: gemini-2.5-flash
 * Tool: googleSearch
 * Updated to handle both Trend and Product queries with Arabic prompts
 */
export const searchMarketTrends = async (query: string, type: 'trend' | 'product' = 'trend'): Promise<{ text: string, groundingMetadata?: GroundingMetadata }> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  let prompt = query;
  if (type === 'product') {
    prompt = `ابحث عن معلومات مفصلة حول المنتج أو العلامة التجارية: "${query}". قم بتضمين الأسعار الحالية والميزات الرئيسية ومراجعات العملاء والمنافسين الرئيسيين. أجب باللغة العربية.`;
  } else {
    prompt = `حلل اتجاهات السوق الحالية المتعلقة بـ: "${query}". ركز على تفضيلات المستهلكين والأنماط الناشئة وفرص السوق. أجب باللغة العربية.`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text || "لم يتم العثور على نتائج.",
    groundingMetadata: response.candidates?.[0]?.groundingMetadata
  };
};

/**
 * 4. Business Strategy (Thinking Mode)
 * Model: gemini-3-pro-preview
 * Config: thinkingBudget: 32768
 */
export const generateBusinessPlan = async (query: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `تصرف كخبير استراتيجي للأعمال. ${query}. أجب باللغة العربية وتوسع في التفاصيل.`,
    config: {
      thinkingConfig: {
        thinkingBudget: 32768
      }
    }
  });

  return response.text || "لم يتم إنشاء الخطة.";
};

/**
 * 5. Quick Copy (Fast Responses)
 * Model: gemini-2.5-flash-lite-latest
 */
export const generateQuickCopy = async (topic: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: `اكتب 3 عبارات تسويقية قصيرة وجذابة لـ: ${topic}. اجعلها قوية ومؤثرة. أجب باللغة العربية.`,
  });

  return response.text || "لم يتم إنشاء النص.";
};

/**
 * 6. AI Assistant (Chatbot)
 * Model: gemini-3-pro-preview
 */
export const chatWithAssistant = async (history: {role: 'user'|'model', text: string}[], newMessage: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  // Construct chat history for the API
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "أنت مساعد ذكي لمنصة GlamStride، وهي منصة لإنشاء متاجر إلكترونية للأزياء. أجب دائمًا باللغة العربية بأسلوب احترافي وودود."
    },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  const result = await chat.sendMessage({
    message: newMessage
  });

  return result.text || "عذراً، لا يمكنني الرد في الوقت الحالي.";
};