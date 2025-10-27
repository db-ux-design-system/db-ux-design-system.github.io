import type { ReactElement } from "react";
import { DBDivider, DBLink } from "@db-ux/react-core-components";

export function Footer(): ReactElement {
  const now = new Date();

  return (
    <footer className="dba-footer">
      <p>&#169; {now.getFullYear()} DB Systel</p>
      <DBDivider variant="vertical" />
      <p>
        based on DB on Astro
      </p>
      <DBDivider variant="vertical" />
      <p>
        developed with{" "}
        <DBLink
          href="https://astro.build/"
          content="external"
          referrerpolicy="no-referrer"
          target="_blank"
          showIcon={false}
        >
          🚀 Astro
        </DBLink>{" "}
        and{" "}
        <DBLink
          href="https://github.com/db-ux-design-system/core-web"
          content="external"
          referrerpolicy="no-referrer"
          target="_blank"
          showIcon={false}
        >
          DB UX
        </DBLink>
      </p>
    </footer>
  );
}
