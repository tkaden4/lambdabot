import djs, { Channel, TextChannel, TextBasedChannelFields } from "discord.js";
import bunyan from "bunyan";
import config from "../config.json";

import _ from "lodash";
import { HackerEarthCodeRunner } from "./runner/HackerEarth";
import { EvalCommand } from "./commands/EvalCommand";
import { Command } from "./commands/Command";
import { LanguagesCommand } from "./commands/LanguagesCommand";
import { HelpCommand } from "./commands/HelpCommand";

const {
  discord: { token, prefix, outputLengthMax },
  hackerearth,
} = config;

const client = new djs.Client();

const logger = bunyan.createLogger({
  name: "langbot",
});

const codeRunner = new HackerEarthCodeRunner(hackerearth);

const commands = [new EvalCommand(codeRunner), new LanguagesCommand(codeRunner.languages)];
const help = new HelpCommand(prefix, commands);

const commandMap = _.fromPairs([help, ...commands].map((x) => [x.name, x]));

export async function sendMessage(channel: TextBasedChannelFields, content: () => Promise<string>) {
  try {
    channel.startTyping();
    const output = (await content()).substr(0, outputLengthMax ?? 1900);
    await channel.send(output);
  } finally {
    channel.stopTyping(true);
  }
}

client.on("ready", () => {
  logger.info("bot started");
});

client.on("message", async (message) => {
  if (message.author?.bot) return;
  if (message.content && message.content.trimLeft().startsWith(prefix)) {
    logger.info({
      event: "processing message",
      message: message.content,
      id: message.id,
    });
    const deprefixed = message.content.trimLeft().slice(prefix.length);
    const [command] = deprefixed.match(/\w+/g)!;
    const messageContent = deprefixed.slice(command.length);
    commandMap[command]?.run(messageContent, message, message.channel!!);
  }
});

client.login(token);
