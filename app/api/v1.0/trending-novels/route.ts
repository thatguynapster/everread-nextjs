import { NextResponse } from "next/server";
import { load } from "cheerio";

import { Article } from "../../../../types";
import { grabPage } from "../libs/grabPage";

export const GET = async (req: Request, res: Response) => {
  const url = "https://novelebook.com/";

  try {
    const novels: Article[] = [];
    await grabPage(url).then((html) => {
      const $ = load(html);

      $(".book-3d", html).each((i, item) => {
        const title = $(item).find(".item-title").text();
        const url = $(item).find("a").attr("href") as string;
        const image = $(item).find("img").attr("src") as string;

        novels.push({ title, url, image });
      });
    });

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
