import cheerio from "cheerio";
import { isAfter, sub, type Duration } from "date-fns";

export const getDisruptAfrica = async (duration: Duration) => {
  const url = "https://disrupt-africa.com/category/news/";
  const response = await fetch(`${url}`, {
    headers: { "Accept-Encoding": "gzip,deflate,compress" },
  });
  const data = await response.text();
  const $ = cheerio.load(data);

  const posts = $(
    "body > div.main-wrap > div.main.wrap.cf > div > div > div.posts-list.listing-alt > article.post",
  );

  const postResults = [];
  for (const post of posts) {
    const postContent = $(post).find("div.post-wrap>div.content");
    const postDate = $(postContent).find("div.listing-meta>time").text();

    if (isAfter(new Date(postDate), sub(new Date(), duration))) {
      const postTitle = $(postContent).find("a.post-title");
      const postLink = postTitle.attr("href");
      const postTitleText = postTitle.text();

      postResults.push({
        postLink,
        postTitle: postTitleText,
        postDate,
      });
    }
  }

  return { data: postResults, title: "Disrupt Africa" };
};
