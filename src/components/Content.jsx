import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

function Content() {
  const router = useRouter();
  const [PageComponent, setPageComponent] = useState(null);

  useEffect(() => {
    async function loadComponent() {
      const path = router.pathname === "/" ? "/home" : router.pathname;
      try {
        const component = await import(`./components${path}`);
        setPageComponent(component.default);
      } catch (err) {
        console.error("Error loading component:", err);
        setPageComponent(null);
      }
    }

    loadComponent();
  }, [router.pathname]);

  return <div className="content">{PageComponent && <PageComponent />}</div>;
}

export default Content;
