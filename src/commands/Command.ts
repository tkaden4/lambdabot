import { Message, Channel, PartialMessage, TextBasedChannelFields } from "discord.js";

export interface Command {
  name: string;
  usage: string;
  description: string;
  run(content: string, message: Message | PartialMessage, channel: TextBasedChannelFields): Promise<void>;
}
