import { PlanType } from "../value-objects/PlanType";
import { Price } from "../value-objects/Price";

export interface PlanLimit {
  maxProducts: number | "unlimited";
  maxGroups: number;
  hasWhatsApp: boolean;
  isCloudAPI: boolean;
  hasInstagram: boolean;
  hasAnalytics: boolean;
  hasCustomDomain: boolean;
}

export interface Plan {
  type: PlanType;
  name: string;
  description: string;
  price: Price;
  setupFee: Price;
  highlight: boolean;
  limits: PlanLimit;
}

export const PLANS: Plan[] = [
  {
    type: PlanType.BASIC,
    name: "Básico",
    description: "Para quem quer testar o robô vendedor sem WhatsApp",
    price: Price.monthly(49),
    setupFee: Price.once(197),
    highlight: false,
    limits: {
      maxProducts: 30,
      maxGroups: 0,
      hasWhatsApp: false,
      isCloudAPI: false,
      hasInstagram: false,
      hasAnalytics: true,
      hasCustomDomain: false,
    },
  },
  {
    type: PlanType.EVOLUTION,
    name: "Evolution",
    description: "Para a maioria dos negócios que vendem pelo WhatsApp",
    price: Price.monthly(97),
    setupFee: Price.once(197),
    highlight: true,
    limits: {
      maxProducts: 50,
      maxGroups: 3,
      hasWhatsApp: true,
      isCloudAPI: false,
      hasInstagram: false,
      hasAnalytics: true,
      hasCustomDomain: false,
    },
  },
  {
    type: PlanType.PRO,
    name: "Pro",
    description: "Para quem quer máxima segurança e volume alto",
    price: Price.monthly(197),
    setupFee: Price.once(197),
    highlight: false,
    limits: {
      maxProducts: "unlimited",
      maxGroups: 5,
      hasWhatsApp: true,
      isCloudAPI: true,
      hasInstagram: true,
      hasAnalytics: true,
      hasCustomDomain: true,
    },
  },
];
