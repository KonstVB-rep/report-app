import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const isLocal = process.env.NODE_ENV === "development";

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: isLocal
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : await chromium.executablePath(),
      headless: isLocal ? true : "shell",
    });

    const page = await browser.newPage();
    const host = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    await page.goto(`${host}/print`, { waitUntil: "networkidle0" });

    await page.evaluate((data) => {
      // @ts-ignore
      window.__PRINTER_DATA__ = data;
      window.dispatchEvent(new CustomEvent("DATA_READY"));
    }, payload);

    // Ждем отрисовки
    await page.waitForSelector(".a4-preview-render", { timeout: 20000 });

    // Даем 1 сек на финальный рендер картинок
    await new Promise((r) => setTimeout(r, 1000));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20", right: "20", bottom: "20", left: "20" },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (error: any) {
    console.error("PDF_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
