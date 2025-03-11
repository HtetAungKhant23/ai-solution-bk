import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatbotService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  async getChatbotResponse(userMessage: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(userMessage);

      return response.response.text();
    } catch (error) {
      console.error("Chatbot API Error:", error);
      return "Sorry, I encountered an error processing your request.";
    }
  }
}