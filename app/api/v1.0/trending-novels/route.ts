import { NextResponse } from "next/server";
import { load } from "cheerio";

import { Novel } from "../../../../types";
import { grabPage } from "../libs/grabPage";

export const GET = async (req: Request, res: Response) => {
  const url = "https://novelebook.com";

  try {
    let novels: Novel[] = [];
    await grabPage(url).then((html) => {
      const $ = load(html);

      $(".book-3d", html).each((i, item) => {
        const title = $(item).find(".item-title").text();
        const url = $(item).find("a").attr("href") as string;
        const image = $(item).find("img").attr("src") as string;

        novels.push({ title, url, image });
      });
    });
    novels = novels.slice(0, 10);

    // get extra novel details
    await Promise.all(
      novels.map(async (novel: any, i, novels) => {
        console.log(`${url}${novel.url}`);
        await grabPage(`${url}${novel.url}`).then((html) => {
          const $ = load(html);

          $(".bookinfo-wg", html).each((_, item): any => {
            const author = $(item).find(".authors > .value").text();
            console.log(author);
            const genre = $(item).find(".categories > .value").text();
            console.log(genre);

            novels[i] = { ...novels[i], author, genre };
          });
        });
      })
    );
    console.log(novels);

    return NextResponse.json(
      {
        success: true,
        message: "Trending Novels",
        code: 200,
        response: novels,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error",
        err,
      },
      { status: 500 }
    );
  }
};
