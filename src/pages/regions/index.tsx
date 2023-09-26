import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import getRegions from "src/regions/queries/getRegions";

const ITEMS_PER_PAGE = 100;

export const RegionsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ regions, hasMore }] = usePaginatedQuery(getRegions, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {regions.map((region) => (
          <li key={region.id}>
            <Link href={Routes.ShowRegionPage({ regionId: region.id })}>
              {region.name}
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const RegionsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Regions</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewRegionPage()}>Create Region</Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <RegionsList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default RegionsPage;
