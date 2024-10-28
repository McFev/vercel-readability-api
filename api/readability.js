import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Загружаем HTML-страницу по указанному URL
    const response = await fetch(url);
    const html = await response.text();

    // Создаем виртуальный DOM с помощью JSDOM
    const dom = new JSDOM(html, { url });

    // Запускаем Readability для обработки контента
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return res.status(500).json({ error: "Failed to parse the content" });
    }

    // Отправляем полученные данные в JSON-формате
    res.status(200).json({
      title: article.title,
      content: article.textContent,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error fetching the page" });
  }
}
