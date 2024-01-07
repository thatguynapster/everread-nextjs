import { NextRequest, NextResponse } from "next/server";
import queryString from "query-string";
import { load } from "cheerio";

import { grabPage } from "../libs/grabPage";
import { Novel } from "../../../../types";
import { chunkArray } from "../libs";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const url = "https://novelebook.com/completed-novel7";

  const page = req.nextUrl.searchParams.get("page");
  const limit = req.nextUrl.searchParams.get("limit");

  try {
    let novels: Novel[] = [];
    await grabPage(`${url}?${queryString.stringify({ page })}`).then((html) => {
      const $ = load(html);

      $(".bookhori", html).each((_, item) => {
        const title = $(item).find(".item-title").text();
        const url = $(item).find("a").attr("href") as string;
        const image = $(item).find("img").attr("src") as string;

        novels.push({ title, url, image });
      });
    });
    const novelsChunk = chunkArray(novels, 10);
    console.log(novelsChunk);
    if (limit) novels = novels.slice(0, parseInt(limit as string));

    return NextResponse.json(
      {
        success: true,
        message: "Completed Novels",
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
