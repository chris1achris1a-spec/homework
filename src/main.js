import { input } from "@inquirer/prompts";
import { initChat, resetChat, sendMessage, SYSTEM_PROMPT } from "./chat-manager.js";

console.log("冰箱笑長啟動中，輸入 exit 結束，輸入 clear 清除對話記憶。");
console.log(`角色設定字數：約 ${SYSTEM_PROMPT.length} 字，已超過老師要求的 50 字。`);

try {
  await initChat();

  while (true) {
    const userQuestion = (await input({ message: "請輸入你的問題：" })).trim();

    if (userQuestion === "") continue;

    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~ 冰箱門要關好，冷笑話才不會跑掉。🧊");
      break;
    }

    if (userQuestion.toLowerCase() === "clear") {
      await resetChat();
      console.log("已清除對話記憶，冰箱重新冷卻完成。🧊");
      continue;
    }

    const answer = await sendMessage(userQuestion);
    console.log(answer);
    console.log();
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
