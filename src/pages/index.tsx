import { formatUrlFromQueryParam } from "@dealbase/core";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { Head } from "src/components/Head";
import { Filter } from "@dealbase/core";
import { AppLayout } from "src/layouts/AppLayout";

const PageContents = dynamic(() => import("src/components/PageContents"), {
  ssr: false,
});

export interface ServerSideProps {
  url: string;
  filter: Filter;
  hasFilter: boolean;
}

export default function Home({ filter, url, hasFilter }: ServerSideProps) {
  return (
    <AppLayout>
      <Head filter={filter} url={url} hasFilter={hasFilter} />
      <PageContents />
    </AppLayout>
  );
}

export async function getServerSideProps({
  req,
  query,
}: GetServerSidePropsContext) {
  let url =
    "https://res.cloudinary.com/dealbase-africa/image/upload/v1649724922/banner_pprevt.jpg";

  let filter: Filter | null = null;
  let hasFilter = false;

  if (query.filter) {
    hasFilter = true;
    const newFilter = JSON.parse(decodeURIComponent(query.filter as string));
    filter = newFilter;
  }

  if (query.url) {
    url = formatUrlFromQueryParam(query.url as string);
  }

  return {
    props: {
      // first time users will not have any cookies and you may not return
      // undefined here, hence ?? is necessary
      cookies: req.headers.cookie ?? "",
      filter,
      url,
      hasFilter,
    },
  };
}
