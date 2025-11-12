import { SlashCommandBuilder } from "discord.js";

const questions = [
  { q: "What is the capital of France?", a: "Paris" },
  { q: "2 + 2 = ?", a: "4" },
  { q: "What color is the sky?", a: "Blue" },
];

export const data = new SlashCommandBuilder()
  .setName("trivia")
  .setDescription("Answer a trivia question!");

export async function execute(interaction: any) {
  const q = questions[Math.floor(Math.random() * questions.length)];
  await interaction.reply(q.q);

  const filter = (m: any) => m.author.id === interaction.user.id;
  const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

  collector.on("collect", (m: any) => {
    if (m.content.toLowerCase() === q.a.toLowerCase()) m.reply("✅ Correct!");
    else m.reply(`❌ Wrong! The answer was ${q.a}`);
  });
}
