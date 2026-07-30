export type ClientStatus = "active" | "suspended" | "canceled";

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Ativo",
  suspended: "Suspenso",
  canceled: "Cancelado",
};

export const CLIENT_STATUS_COLORS: Record<ClientStatus, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  suspended: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  canceled: "bg-red-500/10 text-red-400 border-red-500/20",
};
