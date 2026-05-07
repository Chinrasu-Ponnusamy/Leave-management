 // ─── Helpers ─────────────────────────────────────────────────────────────────
export const daysBetween = (from, to) => Math.ceil((new Date(to) - new Date(from)) / 86400000) + 1;

export const fmt = d => new Date(d).toLocaleDateString("en-GB", {
     day: "2-digit",
     month: "short",
     year: "numeric"
 });

export const statusColor = s => ({
     pending: "#f59e0b",
     approved: "#10b981",
     rejected: "#ef4444"
 } [s] || "#6b7280");

export const statusBg = s => ({
     pending: "#fef3c7",
     approved: "#d1fae5",
     rejected: "#fee2e2"
 } [s] || "#f3f4f6");