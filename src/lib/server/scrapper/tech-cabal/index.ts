import cheerio from "cheerio";
import { Duration, isAfter, sub } from "date-fns";

export const extractDateFromURL = (input: string): string | null => {
  const regex = /\d{4}\/\d{2}\/\d{2}/;

  const date = input.match(regex);

  if (date) {
    return date[0];
  }
  return null;
};

export const getTechCabal = async (duration: Duration) => {
  const url = "https://techcabal.com/category/funding/";
  const response = await fetch(`${url}`, {
    headers: { "Accept-Encoding": "gzip,deflate,compress" },
  });
  const data = await response.text();
  const $ = cheerio.load(data);

  const posts = $(
    "section.article-list-section>div.content>div.list-archive-section>div.list-archive-main>article.article-list-item",
  );

  const postResults = [];
  for (const post of posts) {
    const postTitle = $(post).find(
      "div.article-list-desc>a.article-list-title",
    );
    const postLink = postTitle.attr("href");

    const date = extractDateFromURL(postLink ?? "");

    if (date) {
      if (isAfter(new Date(date), sub(new Date(), duration))) {
        const postTitleText = postTitle.text();

        postResults.push({
          postLink,
          postTitle: postTitleText,
          postDate: new Date().toISOString(),
        });
      }
    }
  }

  return { data: postResults, title: "TechCabal" };
};
