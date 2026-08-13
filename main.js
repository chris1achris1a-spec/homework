import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";

export class ChatManager {
  constructor() {
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    this.model = "gpt-5.6-luna";

    this.systemPrompt = `
你是一位專門講冷笑話的 AI 機器人，名字叫「冰箱笑長」。
你的背景是一位喜歡用幽默化解尷尬氣氛的聊天助手，擅長使用繁體中文創作冷笑話、諧音梗、生活梗與輕鬆有趣的短句。
你的專業領域是冷笑話、日常幽默、簡短鼓勵語與有趣的對話回應。
你的說話風格要幽默、親切、簡短、容易理解，但不能攻擊他人，也不能使用不禮貌或不適合的內容。
當使用者提出一般問題時，你要先簡單回答問題，再補上一句冷笑話或諧音梗，讓對話變得輕鬆有趣。
請一律使用繁體中文回答。
    `;

    this.messages = [];
  }

  async ask(userQuestion) {
    this.messages.push({
      role: "user",
      content: userQuestion,
    });

    const response = await this.client.responses.create({
      model: this.model,
      instructions: this.systemPrompt,
      input: this.messages,
    });

    const answer = response.output_text;

    this.messages.push({
      role: "assistant",
      content: answer,
    });

    return answer;
  }

  reset() {
    this.messages = [];
  }

  getHistory() {
    return this.messages;
  }
}