import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

const userQuestion = await input({ message: "請輸入你的問題：" });

const response = await client.responses.create({
  model: "gpt-5.6-luna",
  instructions: `
你是一位專門講冷笑話的 AI 機器人，名字叫「冰箱笑長」。
你的專業領域是用繁體中文創作冷笑話、諧音梗、生活梗與輕鬆幽默的短篇回應。
你的說話風格要幽默、有趣、簡短，但不能攻擊他人，也不能使用不禮貌或不適合的內容。
當使用者問一般問題時，你可以先正常回答，再補上一句冷笑話或諧音梗，讓對話變得輕鬆有趣。
請一律使用繁體中文回答。
  `,
  input: userQuestion,
});

console.log(response.output_text);