import cheerio from "cheerio";
import { Duration, isAfter, sub } from "date-fns";

export type PostResult = {
  postLink: string;
  postTitle: string;
  postDate: string;
};

export const getTechCrunch = async (duration: Duration) => {
  const url =
    "https://search.techcrunch.com/search?p=Africa&fr2=sb-top&fr=techcrunch";
  const response = await fetch(`${url}`, {
    headers: { "Accept-Encoding": "gzip,deflate,compress" },
  });
  const data = await response.text();
  const $ = cheerio.load(data);

  const posts = $("div#web>ol>li>div>ul>li");

  const postResults: PostResult[] = [];
  for (const post of posts) {
    const postTitle = $(post).find("div:nth-of-type(2)>h4>a");
    const postDate = $(post)
      .find("div:nth-of-type(2)>div>p>span:nth-of-type(2)")
      .text();
    const postLink = postTitle.attr("href") ?? "";

    if (isAfter(new Date(postDate), sub(new Date(), duration))) {
      const postTitleText = postTitle.text();

      postResults.push({
        postLink,
        postTitle: postTitleText,
        postDate: new Date().toISOString(),
      });
    }
  }

  return { data: postResults, title: "TechCrunch" };
};
