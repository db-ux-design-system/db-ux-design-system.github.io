/**
 * The front matter of a page.
 */
declare interface FrontMatter {
  /**
   * The title of the page.
   */
  title: string;
  /**
   * The author of the page.
   */
  author: string;
  /**
   * The description of the page.
   */
  description?: string;
  /**
   * Main headline for hero section.
   */
  headline?: string;
  /**
   * Optional hero image URL.
   */
  heroImage?: string;
  /**
   * Alt text for the hero image.
   */
  heroImageAlt?: string;
  /**
   * The creation date of the page.
   */
  date?: Date;
  /**
   * The path to the layout the page should use.
   */
  layout?: string;
  /**
   * Whether the page should render a table of contents.
   * @default true
   */
  toc?: boolean;
  /**
   * Whether the page should render a navigation sidebar. Not visible on mobile devices and not visible
   * if the page does not have any sibling pages.
   * @default true
   */
  nav?: boolean;
  /**
   * If true, children will be rendered as sub-navigation on child pages.
   */
  isSubNavigation?: boolean;
  /**
   * If true, the page itself will not be shown; instead, a redirect to the first child will occur.
   */
  hidePage?: boolean;
  /**
   * An optional icon that can be used to represent the page.
   */
  iconTrailing?: string;
}

/**
 * A navigation item that can be used to build the navigation of the application.
 */
declare interface NavigationItem {
  /**
   * The title of the navigation item.
   */
  title: string;
  /**
   * An optional icon that can be used to represent the navigation item.
   */
  icon?: string;
  /**
   * An optional icon that can be used to represent the navigation item.
   */
  iconTrailing?: string;
  /**
   * An optional path that the navigation item should link to. If none is provided,
   * the navigation item will be rendered as a group of sub-items.
   */
  path?: string;
  /**
   * An optional list of sub-items that will be rendered as a group of navigation
   * items if a path is not provided.
   */
  children?: NavigationItem[];
  /**
   * If true, the children will be rendered as sub-navigation items.
   */
  isSubNavigation?: boolean;

  /**
   * The order of the navigation item. Lower numbers will appear first.
   */
  order?: number;
}

/**
 * The page structure of the application. The navigation will be built automatically based on this.
 */
declare type AppNavigation = NavigationItem[];

declare interface AppConfig {
  /**
   * The title of the application.
   */
  title: string;
  /**
   * The hostname of the application.
   */
  hostname: string;
  /**
   * The base path of the application.
   */
  basePath: string;
  /**
   * A list of routes that will be excluded from the sitemap. Excluding routes will result in them not being
   * indexed by DB Search.
   * @default ["example"]
   */
  sitemapBlacklist: string[];
  /**
   * The language of the application.
   */
  language: string;
}

// Allow importing .astro files in TypeScript contexts (e.g., barrel index.ts)
declare module '*.astro' {
  const Component: any;
  export default Component;
}
