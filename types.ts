
export enum AppMode {
  TYPING = 'TYPING',
  MESSAGING = 'MESSAGING',
}

export enum Sentiment {
  HAPPY = 'HAPPY',
  ANGRY = 'ANGRY',
  NEUTRAL = 'NEUTRAL',
  UNKNOWN = 'UNKNOWN',
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  sentiment?: Sentiment;
  highlighted?: boolean;
}
