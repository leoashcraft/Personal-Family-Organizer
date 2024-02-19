import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status !== "loading" && !session) {
        router.push("/login");
      }
    }, [router, session, status]);

    if (session) {
      return <Component {...props} />;
    }

    return null; // or a loading indicator
  };
}
