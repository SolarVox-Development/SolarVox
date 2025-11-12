import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("guessnumber")
  .setDescription("Guess a number between 1 and 10");

export async function execute(interaction: any) {
  const number = Math.floor(Math.random() * 10) + 1;
  await interaction.reply(`I picked a number between 1 and 10! Reply with your guess.`);

  const filter = (m: any) => !isNaN(m.content) && m.author.id === interaction.user.id;
  const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

  collector.on("collect", (m: any) => {
    if (parseInt(m.content) === number) m.reply("🎉 Correct! You guessed it!");
    else m.reply(`❌ Wrong! I chose ${number}.`);
  });
}
