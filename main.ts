import { Client } from "@mtkruto/mtkruto";
import { StorageDenoKV } from "@mtkruto/mtkruto/storage-deno-kv";
import env from "./env.ts";

const bot = new Client({
  apiId: env.API_ID,
  apiHash: env.API_HASH,
  storage: new StorageDenoKV("data/kv"),
});
await bot.start({ botToken: env.BOT_TOKEN });

bot.on("inlineQuery", async (ctx) => {
  const results =
    await (await fetch("https://libspeed.telegram.tools/results.json")).json();
  await ctx.answerInlineQuery([
    {
      id: crypto.randomUUID(),
      type: "article",
      title: "libspeed.telegram.tools",
      messageContent: {
        type: "richText",
        richText: {
          type: "html",
          html: html(results),
        },
      },
      replyMarkup: {
        type: "inlineKeyboard",
        inlineKeyboard: [[{
          type: "switchInlineQuery",
          text: "Share",
          inlineQuery: "",
        }]],
      },
    },
  ], { cacheTime: 0 });
});

const html = (
  results: {
    date: string;
    library: { slug: string; name: string; link: string };
    downloadMbps: number;
    uploadMbps: number;
  }[],
) => `
<table bordered>
    <thead>
    <tr>
        <th scope="col">#</th>
        <th scope="col">Library</th>
        <th scope="col">Download</th>
        <th scope="col">Upload</th>
        <th scope="col">Date</th>
        <th scope="col"></th>
    </tr>
          </thead>
          <tbody>
            ${
  results.map((v, i) => (
    `
              <tr>
                <td align="center">${
      i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1
    }</td>
                <td align="center">
                  <a href=${v.library.link}>${v.library.name}</a>
                </td>
                <td align="center">
                  ${v.downloadMbps.toFixed(1)} MB/s
                </td>
                <td align="center">
                  ${v.uploadMbps.toFixed(1)} MB/s
                </td>
                <td align="center">
                  ${new Intl.DateTimeFormat().format(new Date(v.date))}
                </td>
                <td align="center">
                  <a
                    href=${`https://github.com/rojvv/tglib-bench/tree/main/${v.library.slug}`}
                  >
                    View Source
                  </a>
                </td>
              </tr>`
  )).join("")
}
          </tbody>
        </table>
`;
