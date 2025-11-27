export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  STUDIO_GEN = 'STUDIO_GEN',
  STUDIO_EDIT = 'STUDIO_EDIT',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  STRATEGY = 'STRATEGY',
  QUICK_COPY = 'QUICK_COPY',
  ASSISTANT = 'ASSISTANT'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  groundingMetadata?: GroundingMetadata;
  isThinking?: boolean;
}

export interface GroundingMetadata {
  groundingChunks?: {
    web?: {
      uri?: string;
      title?: string;
    };
  }[];
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
