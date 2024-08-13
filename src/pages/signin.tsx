import dynamic from "next/dynamic";
import { Head } from "src/components/Head";
import { AppLayout } from "src/layouts/AppLayout";
import { ServerSideProps } from "./index";

const PageContents = dynamic(() => import("src/components/PageContents"), {
  ssr: false,
});

export default function HomeWithSignIn({
  filter,
  url,
  hasFilter,
}: ServerSideProps) {
  return (
    <AppLayout withSignIn>
      <Head filter={filter} url={url} hasFilter={hasFilter} />
      <PageContents />
    </AppLayout>
  );
}

export { getServerSideProps } from "./index";
