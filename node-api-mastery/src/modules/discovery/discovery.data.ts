const renderUrl = process.env.RENDER_URL || "http://localhost:5000";

export const modules = [
  {
    id: "business",
    title: "Business & Appointment",
    description:
      "Advanced service management with smart slot calculation and 2-hour cancellation logic.",
    docsUrl: `${renderUrl}/api-docs/business`,
    status: "Stable",
  },
  {
    id: "finance",
    title: "Finance & Automation",
    description:
      "Financial tracking with automated recurring transactions and balance projections.",
    docsUrl: `${renderUrl}/api-docs/finances`,
    status: "Active",
  },
  {
    id: "users",
    title: "User Management",
    description:
      "Identity system and user profile management with modular security.",
    docsUrl: `${renderUrl}/api-docs/users`,
    status: "Active",
  },
];
