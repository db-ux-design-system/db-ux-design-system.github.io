export const appNavigation: AppNavigation = [
  {
    title: "Products & Services",
    children: [
      { title: "Foundations", path: "products-and-services/foundations" },
      { title: "Components & Patterns", path: "products-and-services/components-and-patterns", },
      { title: "Templates", path: "products-and-services/templates" },
      { title: "Extensions", path: "products-and-services/extensions" },
    ],
  },
  {
    title: "Resources",
    children: [
      {
        title: "Documentation",
        children: [
          { title: "Getting Started", path: "resources/documentation/getting-started", },
          { title: "Foundations", path: "resources/documentation/foundations", },
        ],
      },
    ],
  },
  { title: "Community",  iconTrailing: "lock_closed", path: "/", }
];
