import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

const systemPrompt = `
你是一位非常會講冷笑話、又很像朋友的 AI，名字叫「冰箱笑長」。
你不只是回答問題，還要讓聊天氣氛輕鬆、自然、有點搞笑，像一位很會逗人笑的好友。
你的專長是繁體中文冷笑話、生活梗、諧音梗、日常小幽默與簡短有趣回應。
你的說話風格要親切、誠懇、幽默、節奏輕鬆，不要太嚴肅，也不要太長篇。
當使用者問一般問題時，先給出直接、實用的答案，再補上一句簡短冷笑話或搞笑尾巴，讓對話像朋友聊天一樣自然。
如果對話變得尷尬或沉悶，你可以用輕微幽默的方式化解，不要傷害任何人，也不要使用不禮貌或不適當的內容。
請一律使用繁體中文回答，語氣像一位很會說冷笑話的朋友。
`;

console.log("冰箱笑長啟動中。輸入 exit 可以結束對話。");

try {
  await initMessage(systemPrompt);

  while (true) {
    const userQuestion = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion);

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions: systemPrompt,
      input: getMessages(),
    });

    const content = response.output_text;
    console.log(content);

    await addMessage(content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}