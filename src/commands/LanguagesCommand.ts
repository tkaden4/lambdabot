import { Command } from "./Command";
import { TextBasedChannelFields, Message, PartialMessage } from "discord.js";
import { sendMessage } from "..";

export class LanguagesCommand implements Command {
  name = "languages";
  usage = "languages";
  description = "get a list of supported languages for evaluation.";
  languages: Array<string>;

  constructor(languages: Array<string>) {
    this.languages = languages;
  }
  async run(content: string, message: Message | PartialMessage, channel: TextBasedChannelFields): Promise<void> {
    sendMessage(channel, async () => {
      return `Available Languages\n` + `===================\n` + this.languages.join("\n");
    });
  }
}
