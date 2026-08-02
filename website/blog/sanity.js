import { createClient } from "https://esm.sh/@sanity/client";

export const client = createClient({
    projectId: "w4tsuhea",
    dataset: "production",
    apiVersion: "2026-01-01",
    useCdn: true
});