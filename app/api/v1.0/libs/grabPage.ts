import puppeteer from "puppeteer";
import { Browser } from "puppeteer";

export const grabPage = async (url: string) => {
  const browser: Browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1640, height: 1920 });
  await page.goto(url, { waitUntil: "networkidle0" });

  // console.log("scrolling page");
  // scroll through the page
  let prevHeight = -1;
  let maxScrolls = 100;
  let scrollCount = 0;

  while (scrollCount < maxScrolls) {
    // Scroll to the bottom of the page
    await page.evaluate("window.scrollTo(0, document.body.clientHeight*0.5)");
    // Wait for page load
    await page.waitForTimeout(300);
    // Calculate new scroll height and compare
    // console.log("re-evaluate height and scroll again");
    let newHeight: any = await page.evaluate("document.body.scrollHeight");
    if (newHeight == prevHeight) {
      await page.waitForTimeout(300);
      break;
    }
    prevHeight = newHeight;
    scrollCount += 1;
  }

  await page.waitForTimeout(300);
  // console.log("return page html");
  const html = await page.content();

  await browser.close();

  return html;
};
