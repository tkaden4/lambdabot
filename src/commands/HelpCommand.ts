import { Command } from "./Command";
import { Message, PartialMessage, TextBasedChannelFields } from "discord.js";
import { sendMessage } from "..";

export class HelpCommand implements Command {
  name = "help";
  usage = "help";
  description = "get information on other commands.";
  helpString: string;
  constructor(prefix: string, commands: Array<Command>) {
    this.helpString = commands.map((command) => `\`${prefix}${command.usage}\`\n\t${command.description}`).join("\n");
  }
  async run(_content: string, _message: Message | PartialMessage, channel: TextBasedChannelFields): Promise<void> {
    sendMessage(channel, async () => {
      return "Commands\n" + "===============\n" + this.helpString;
    });
  }
}
