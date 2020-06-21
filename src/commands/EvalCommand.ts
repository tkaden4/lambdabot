import { Message, Channel, TextChannel, PartialMessage, TextBasedChannelFields } from "discord.js";
import { isLeft } from "fp-ts/lib/Either";
import remark from "remark-parse";
import unified from "unified";
import { sendMessage } from "..";
import { CodeRunner } from "../runner/CodeRunner";
import { Command } from "./Command";

const markdown = unified().use(remark);

export class EvalCommand implements Command {
  name = "eval";
  usage = "eval <language> <code block>";
  description = "evaluate a code block with the provided language";
  codeRunner: CodeRunner;

  constructor(codeRunner: CodeRunner) {
    this.codeRunner = codeRunner;
  }

  async run(content: string, message: Message | PartialMessage, channel: TextBasedChannelFields): Promise<void> {
    const parsed = markdown.parse(content);
    if (parsed.children === undefined || !Array.isArray(parsed.children)) {
      await channel.send(`👎 invalid markdown`);
      return;
    }
    const children: Array<any> = parsed.children;

    const language = children[0].children[0].value.trim();

    const { type, value: messageCode } = children[children.length - 1];
    if (type !== "code") {
      await channel.send(`👎 was not supplied a code block, shame on you <@${message.author?.id}>`);
      return;
    }
    if (messageCode === undefined) {
      await channel.send(`🤔 invalid message, how did you do that?`);
      return;
    }

    await sendMessage(channel, async () => {
      const result = await this.codeRunner.run({
        language: language,
        code: messageCode,
      })();

      if (isLeft(result)) {
        return `😬 there was an error while running your code:\n${result.left.message.split("\n").join("\n")}\n`;
      }

      return `\`\`\`\n${result.right.message.replace("```", "\\`\\`\\`")}\n\`\`\``;
    });
  }
}
