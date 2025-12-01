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
  
  let prompt = '';
  if (type === 'product') {
    prompt = `
      بصفتك باحث منتجات محترف، قم بإجراء بحث شامل وتحليل دقيق للمنتج أو العلامة التجارية: "${query}".
      
      يجب أن يكون ردك باللغة العربية، غنياً بالتفاصيل، ومنظماً بتنسيق Markdown (عناوين، قوائم نقطية).
      
      يرجى اتباع الهيكل التالي في تقريرك:
      1. **نظرة عامة على المنتج**: وصف موجز للمنتج ومكانته في السوق.
      2. **المواصفات والميزات الرئيسية**: تفاصيل تقنية ووظيفية.
      3. **تحليل الأسعار**: النطاق السعري ومقارنة القيمة.
      4. **تحليل المنافسين**: أبرز المنافسين المباشرين وكيف يتفوق أو يضعف هذا المنتج أمامهم.
      5. **آراء العملاء والمشاعر العامة**: ملخص للمراجعات الإيجابية والسلبية.
      6. **الخلاصة**: هل يستحق الشراء/الاستثمار؟
    `;
  } else {
    prompt = `
      بصفتك كبير محللي السوق، قم بإعداد تقرير احترافي حول اتجاهات السوق لـ: "${query}".
      
      يجب أن يكون الرد باللغة العربية، تحليلياً، ومنظماً بتنسيق Markdown.
      
      الهيكل المطلوب للتقرير:
      1. **ملخص تنفيذي**: نظرة سريعة على حالة السوق الحالية.
      2. **أهم الاتجاهات الناشئة**: قائمة مفصلة بالأنماط الجديدة التي تكتسب شعبية.
      3. **سلوك المستهلك**: ماذا يفضل العملاء حالياً ولماذا؟ (دوافع الشراء).
      4. **الفرص التجارية**: فجوات في السوق يمكن استغلالها.
      5. **توصيات استراتيجية**: خطوات عملية للعلامات التجارية للنجاح في هذا السوق.
    `;
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
  
  const prompt = `
    تصرف بصفتك مدير استراتيجيات (CSO) ومستشار أعمال خبير. قم بتطوير استراتيجية عمل شاملة ومفصلة جداً بناءً على الطلب التالي: "${query}".

    يجب أن يكون الرد باللغة العربية، احترافياً للغاية، ومنسقاً بوضوح باستخدام Markdown (عناوين رئيسية، عناوين فرعية، قوائم، وخط عريض).

    يرجى تغطية الجوانب التالية في خطتك:
    1. **الملخص التنفيذي (Executive Summary)**: الرؤية والرسالة والأهداف العليا.
    2. **تحليل السوق والفرص**: حجم السوق، الجمهور المستهدف، ونقاط الألم لدى العملاء.
    3. **الركائز الاستراتيجية**: 3-5 أهداف استراتيجية رئيسية للتركيز عليها.
    4. **خطة العمل التشغيلية**: خطوات تنفيذية ملموسة (ماذا سنفعل وكيف؟).
    5. **الميزة التنافسية**: ما الذي سيجعل هذا العمل فريداً؟
    6. **التوقعات والمخاطر**: التحديات المحتملة وكيفية التخفيف منها.
    
    استخدم "وضع التفكير" للتعمق في التحليل وتقديم حلول إبداعية وعملية.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
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
      systemInstruction: "أنت مساعد ذكي لمنصة GlamStride، وهي منصة لإنشاء متاجر إلكترونية للأزياء. أجب دائمًا باللغة العربية بأسلوب احترافي وودود. استخدم تنسيق Markdown عند الحاجة (عناوين، قوائم) لتوضيح الإجابات."
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