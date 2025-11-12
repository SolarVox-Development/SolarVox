export const name = "clientReady";
export const once = true;

export async function execute(client: any) {
  console.log(`Logged in as ${client.user.tag}`);
}
