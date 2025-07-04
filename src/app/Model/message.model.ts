// src/app/model/message.model.ts
export interface Message {
  sender: string;
  receiver: string;
  message: string;
  timestamp?: string;
}
