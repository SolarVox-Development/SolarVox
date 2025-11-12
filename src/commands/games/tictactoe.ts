import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("tictactoe")
  .setDescription("Play Tic-Tac-Toe with a friend!");

export async function execute(interaction: any) {
  const board: string[] = Array(9).fill("⬜");
  const buttons = () => {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const row = new ActionRowBuilder<ButtonBuilder>();
      for (let j = 0; j < 3; j++) {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`${i * 3 + j}`)
            .setLabel(board[i * 3 + j])
            .setStyle(ButtonStyle.Secondary)
        );
      }
      rows.push(row);
    }
    return rows;
  };

  await interaction.reply({ content: "Tic-Tac-Toe!", components: buttons() });
  // Full button interaction handling is more complex; we can expand later
}
