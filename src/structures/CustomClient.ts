import { Client, Collection, CommandInteraction, ClientOptions } from "discord.js";

export interface Command {
  data: { name: string };
  execute: (interaction: CommandInteraction) => Promise<void>;
}

export class CustomClient extends Client {
  public commands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}
