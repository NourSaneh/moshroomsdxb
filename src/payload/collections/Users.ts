import type { CollectionConfig } from "payload";

/** People who can log in to /admin (the venue's team + you). Email + password; first user is created on first visit to /admin. */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Team member", plural: "Team" },
  admin: {
    useAsTitle: "email",
    group: "Settings",
    description: "Who can log in to this dashboard.",
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 14, // stay logged in for 2 weeks
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
  },
  fields: [{ name: "name", type: "text" }],
};
