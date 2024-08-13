import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFilterStore } from "src/stores/filter";

const formatUrlFromQueryParam = (url: string) => {
  if (!url) return "";

  return encodeURI(decodeURIComponent(url));
};

interface ReturnValue {
  url: string;
  hasFilter: boolean;
}

export function useDealflowAndUrlFromQueryParams(): ReturnValue {
  const setFilter = useFilterStore((state) => state.setFilter);

  const { query } = useRouter();

  const [url, setUrl] = useState(() =>
    query.url
      ? formatUrlFromQueryParam(query.url as string)
      : "https://res.cloudinary.com/dealbase-africa/image/upload/v1649538134/open-graph_flrncu.png",
  );

  useEffect(() => {
    if (!query) return;

    if (query.filter) {
      const filter = JSON.parse(decodeURIComponent(query.filter as string));
      setFilter(filter);
    }

    if (query.url) {
      const newUrl = formatUrlFromQueryParam(query.url as string);
      setUrl(newUrl);
    }
  }, [query, setFilter]);

  return { url, hasFilter: !!query.dealflow };
}
