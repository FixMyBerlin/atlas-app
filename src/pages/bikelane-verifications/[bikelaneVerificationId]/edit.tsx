import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import { UpdateBikelaneVerificationSchema } from "src/bikelane-verifications/schemas";
import getBikelaneVerification from "src/bikelane-verifications/queries/getBikelaneVerification";
import updateBikelaneVerification from "src/bikelane-verifications/mutations/updateBikelaneVerification";
import {
  BikelaneVerificationForm,
  FORM_ERROR,
} from "src/bikelane-verifications/components/BikelaneVerificationForm";

export const EditBikelaneVerification = () => {
  const router = useRouter();
  const bikelaneVerificationId = useParam("bikelaneVerificationId", "number");
  const [bikelaneVerification, { setQueryData }] = useQuery(
    getBikelaneVerification,
    { id: bikelaneVerificationId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateBikelaneVerificationMutation] = useMutation(
    updateBikelaneVerification
  );

  return (
    <>
      <Head>
        <title>Edit BikelaneVerification {bikelaneVerification.id}</title>
      </Head>

      <div>
        <h1>Edit BikelaneVerification {bikelaneVerification.id}</h1>
        <pre>{JSON.stringify(bikelaneVerification, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <BikelaneVerificationForm
            submitText="Update BikelaneVerification"
            schema={UpdateBikelaneVerificationSchema}
            initialValues={bikelaneVerification}
            onSubmit={async (values) => {
              try {
                const updated = await updateBikelaneVerificationMutation({
                  id: bikelaneVerification.id,
                  ...values,
                });
                await setQueryData(updated);
                await router.push(
                  Routes.ShowBikelaneVerificationPage({
                    bikelaneVerificationId: updated.id,
                  })
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

const EditBikelaneVerificationPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditBikelaneVerification />
      </Suspense>

      <p>
        <Link href={Routes.BikelaneVerificationsPage()}>
          BikelaneVerifications
        </Link>
      </p>
    </div>
  );
};

EditBikelaneVerificationPage.authenticate = true;
EditBikelaneVerificationPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditBikelaneVerificationPage;
