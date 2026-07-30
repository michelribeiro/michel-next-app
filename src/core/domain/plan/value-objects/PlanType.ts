export enum PlanType {
  FREE = "free",
  BASIC = "basic",
  EVOLUTION = "evolution",
  PRO = "pro",
}

export const PlanTypeLabel: Record<PlanType, string> = {
  [PlanType.FREE]: "Free",
  [PlanType.BASIC]: "Básico",
  [PlanType.EVOLUTION]: "Evolution",
  [PlanType.PRO]: "Pro",
};

export const PlanTypeColor: Record<PlanType, string> = {
  [PlanType.FREE]: "rgb(34, 197, 94)",     // green
  [PlanType.BASIC]: "rgb(34, 197, 94)",    // green
  [PlanType.EVOLUTION]: "rgb(234, 179, 8)", // yellow
  [PlanType.PRO]: "rgb(124, 58, 237)",      // violet
};
