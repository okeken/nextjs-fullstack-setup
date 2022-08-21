import { getSession } from "next-auth/react";
import useAuth from "@views/auth/hooks/useAuth";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { status, data } = useSession();
  const { signOut } = useAuth();
  const signOutUser = () => signOut();
  return (
    <>
      {JSON.stringify(status, null, 2)}
      {JSON.stringify(data, null, 2)}
      Dashboard
      <br />
      <button className="border p-2" onClick={signOutUser}>
        Sign out
      </button>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Dashboard;
