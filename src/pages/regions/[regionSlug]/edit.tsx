import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import { UpdateRegionSchema } from "src/regions/schemas";
import getRegion from "src/regions/queries/getRegion";
import updateRegion from "src/regions/mutations/updateRegion";
import { RegionForm, FORM_ERROR } from "src/regions/components/RegionForm";

export const EditRegion = () => {
  const router = useRouter();
  const regionId = useParam("regionId", "number");
  const [region, { setQueryData }] = useQuery(
    getRegion,
    { id: regionId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateRegionMutation] = useMutation(updateRegion);

  return (
    <>
      <Head>
        <title>Edit Region {region.id}</title>
      </Head>

      <div>
        <h1>Edit Region {region.id}</h1>
        <pre>{JSON.stringify(region, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <RegionForm
            submitText="Update Region"
            schema={UpdateRegionSchema}
            initialValues={region}
            onSubmit={async (values) => {
              try {
                const updated = await updateRegionMutation({
                  id: region.id,
                  ...values,
                });
                await setQueryData(updated);
                await router.push(
                  Routes.ShowRegionPage({ regionId: updated.id })
                );
              } catch (error: any) {
                console.error(error);
                return {
                  [FORM_ERROR]: error.toString(),
                };
              }
            }}
          />
        </Suspense>
      </div>
    </>
  );
};

const EditRegionPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditRegion />
      </Suspense>

      <p>
        <Link href={Routes.RegionsPage()}>Regions</Link>
      </p>
    </div>
  );
};

EditRegionPage.authenticate = true;
EditRegionPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditRegionPage;
