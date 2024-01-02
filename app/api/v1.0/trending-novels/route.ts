import { NextResponse } from "next/server";
import { load } from "cheerio";
import axios from "axios";

import { Article } from "../../../../types";

export const GET = async (req: Request, res: Response) => {
  const url = "https://novelebook.com/";

  try {
    const { data: html } = await axios(url);

    const $ = load(html);

    const novels: Article[] = [];

    $(".book-3d", html).each((i, item) => {
      const title = $(item).find(".item-title").text();
      const url = $(item).find("a").attr("href") as string;
      const image = $(item).find("img").attr("src") as string;

      novels.push({ title, url, image });
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
    console.log(err);

    return NextResponse.json(
      {
        message: "Error",
        err,
      },
      { status: 500 }
    );
  }
};
