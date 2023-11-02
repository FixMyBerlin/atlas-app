import { Suspense } from "react"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
const styles = {} as Record<string, string>

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <button
          className={styles.button}
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          <code><pre>
            {JSON.stringify(currentUser, null, 2)}
          </pre></code>
        </div>
      </>
    )
  } else {
    return (
      <>
        <br/>
        <Link href="/api/auth/osm/login" passHref legacyBehavior>
          <a className="button small">
            <strong>Sign in with OpenStreetMap</strong>
          </a>
        </Link>
      </>
    )
  }
}

const Home: BlitzPage = () => {
  return (
    <Layout title="Home">
      <div className={styles.globe} />

      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <div className={styles.buttonContainer}>
                <Suspense fallback="Loading...">
                  <UserInfo />
                </Suspense>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Home
