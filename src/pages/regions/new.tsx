import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "src/core/layouts/Layout";
import { CreateRegionSchema } from "src/regions/schemas";
import createRegion from "src/regions/mutations/createRegion";
import { RegionForm, FORM_ERROR } from "src/regions/components/RegionForm";
import { Suspense } from "react";

const NewRegionPage = () => {
  const router = useRouter();
  const [createRegionMutation] = useMutation(createRegion);

  return (
    <Layout title={"Create New Region"}>
      <h1>Create New Region</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RegionForm
          submitText="Create Region"
          schema={CreateRegionSchema}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              const region = await createRegionMutation(values);
              await router.push(Routes.ShowRegionPage({ regionId: region.id }));
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </Suspense>
      <p>
        <Link href={Routes.RegionsPage()}>Regions</Link>
      </p>
    </Layout>
  );
};

NewRegionPage.authenticate = true;

export default NewRegionPage;
