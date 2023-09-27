import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getBikelaneVerification from "src/bikelane-verifications/queries/getBikelaneVerification";
import deleteBikelaneVerification from "src/bikelane-verifications/mutations/deleteBikelaneVerification";

export const BikelaneVerification = () => {
  const router = useRouter();
  const bikelaneVerificationId = useParam("bikelaneVerificationId", "number");
  const [deleteBikelaneVerificationMutation] = useMutation(
    deleteBikelaneVerification
  );
  const [bikelaneVerification] = useQuery(getBikelaneVerification, {
    id: bikelaneVerificationId,
  });

  return (
    <>
      <Head>
        <title>BikelaneVerification {bikelaneVerification.id}</title>
      </Head>

      <div>
        <h1>BikelaneVerification {bikelaneVerification.id}</h1>
        <pre>{JSON.stringify(bikelaneVerification, null, 2)}</pre>

        <Link
          href={Routes.EditBikelaneVerificationPage({
            bikelaneVerificationId: bikelaneVerification.id,
          })}
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteBikelaneVerificationMutation({
                id: bikelaneVerification.id,
              });
              await router.push(Routes.BikelaneVerificationsPage());
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowBikelaneVerificationPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.BikelaneVerificationsPage()}>
          BikelaneVerifications
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <BikelaneVerification />
      </Suspense>
    </div>
  );
};

ShowBikelaneVerificationPage.authenticate = true;
ShowBikelaneVerificationPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowBikelaneVerificationPage;
