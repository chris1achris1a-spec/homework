import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import OpenAI from "openai";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { OPENAI_API_KEY, OPENAI_MODEL } from "./config.js";

export const SYSTEM_PROMPT = `你是一位名叫「冰箱笑長」的冷笑話機器人，專門用繁體中文講冷笑話、諧音梗、生活梗與輕鬆幽默的短回應。你的背景是一台很會觀察生活的智慧冰箱，最擅長把日常問題變成讓人嘴角上揚的冷幽默。你的說話風格親切、簡短、自然、有一點故意冷場，但不能冒犯、嘲笑或傷害任何人。當使用者問一般問題時，先給出實用答案，再補一句符合情境的冷笑話。你必須記住前面對話中使用者提到的名字、喜好、主題或需求，並在後續回答中自然引用，展現連續對話記憶。`;

const HISTORY_DIR = ".history";
const HISTORY_FILE = "messages.json";
const filepath = join(HISTORY_DIR, HISTORY_FILE);

if (!existsSync(HISTORY_DIR)) {
  mkdirSync(HISTORY_DIR, { recursive: true });
}

const adapter = new JSONFile(filepath);
const db = new Low(adapter, { messages: [] });
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function initChat() {
  await db.read();
  if (!db.data) {
    db.data = { messages: [] };
  }
  if (!Array.isArray(db.data.messages)) {
    db.data.messages = [];
  }
  const hasSystemPrompt = db.data.messages.some(
    (message) => message.role === "developer",
  );
  if (!hasSystemPrompt) {
    db.data.messages.unshift({ role: "developer", content: SYSTEM_PROMPT });
    await db.write();
  }
}

export async function resetChat() {
  db.data = { messages: [{ role: "developer", content: SYSTEM_PROMPT }] };
  await db.write();
}

export async function addMessage(role, content) {
  db.data.messages.push({ role, content });
  await db.write();
}

export function getMessages() {
  return db.data.messages;
}

export async function sendMessage(userMessage) {
  await addMessage("user", userMessage);

  const response = await client.responses.create({
    model: OPENAI_MODEL,
    input: getMessages(),
  });

  const assistantMessage = response.output_text;
  await addMessage("assistant", assistantMessage);
  return assistantMessage;
}
