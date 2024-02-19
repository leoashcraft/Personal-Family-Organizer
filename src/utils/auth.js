import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getCommonServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // console.log("Session:", session);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  
  const safeSession = {
    ...session,
    expires: session.expires || null,
    user: session.user
      ? {
          ...session.user,
          id: session.user.id || null,
          name: session.user.name || null,
          firstName: session.user.firstName || null,
          lastName: session.user.lastName || null,
          email: session.user.email || null,
        }
      : null,
  };

  return {
    props: { session: safeSession },
  };
}
