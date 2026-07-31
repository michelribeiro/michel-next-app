"use client";

import { useState } from "react";
import { PLANS } from "@/core/domain/plan/entities/Plan";
import { PlanType, PlanTypeColor } from "@/core/domain/plan/value-objects/PlanType";
import { FeatureId } from "@/core/domain/plan/entities/PlanFeature";
import type { Plan } from "@/core/domain/plan/entities/Plan";
import { LeadModal } from "@/ui/components/lead/LeadModal";

function FeatureRow({
  label,
  included,
  limited,
  limitValue,
}: {
  label: string;
  included: boolean;
  limited?: boolean;
  limitValue?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 text-sm">
      {included ? (
        <svg className="h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4 flex-shrink-0 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className={included ? "text-zinc-300" : "text-zinc-600"}>
        {label}
        {limited && limitValue && (
          <span className="ml-1 text-xs text-zinc-500">({limitValue})</span>
        )}
      </span>
    </div>
  );
}

function PlanCard({ plan, onSelect }: { plan: Plan; onSelect: (plan: Plan) => void }) {
  // Build features list: enabled first, then disabled
  const allFeatures = [
    { id: FeatureId.AI_PAGE, label: "Página com IA", included: true },
    { id: FeatureId.LEADS_UNLIMITED, label: "Leads ilimitados", included: true },
    { id: FeatureId.CHECKOUT, label: "Checkout (ASAAS)", included: true },
    {
      id: FeatureId.CATALOG,
      label: "Catálogo de produtos",
      included: true,
      limited: plan.limits.maxProducts !== "unlimited",
      limitValue: plan.limits.maxProducts !== "unlimited" ? `até ${plan.limits.maxProducts}` : undefined,
    },
    {
      id: FeatureId.ANALYTICS,
      label: "Relatórios",
      included: plan.limits.hasAnalytics,
    },
    {
      id: FeatureId.WHATSAPP_1TO1,
      label: "WhatsApp 1:1",
      included: plan.limits.hasWhatsApp,
    },
    {
      id: FeatureId.WHATSAPP_GROUP,
      label: "Disparo em grupo",
      included: plan.limits.maxGroups > 0,
      limited: plan.limits.maxGroups > 0,
      limitValue: plan.limits.maxGroups > 0 ? `até ${plan.limits.maxGroups} grupos` : undefined,
    },
    {
      id: FeatureId.INSTAGRAM,
      label: "Instagram integrado",
      included: plan.limits.hasInstagram,
    },
    {
      id: FeatureId.CUSTOM_DOMAIN,
      label: "Domínio próprio",
      included: plan.limits.hasCustomDomain,
    },
  ];

  const features = [
    ...allFeatures.filter((f) => f.included),
    ...allFeatures.filter((f) => !f.included),
  ];

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
        plan.highlight
          ? "border-violet-500/40 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-xl shadow-violet-600/10 scale-105"
          : "border-white/5 bg-zinc-900/50 hover:border-white/10"
      }`}
      style={{ borderWidth: "1px", borderStyle: "solid" }}
    >
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="inline-block rounded-full px-4 py-1 text-xs font-medium text-white"
            style={{ background: `linear-gradient(135deg, ${PlanTypeColor[PlanType.EVOLUTION]}, rgb(59, 130, 246))` }}
          >
            Mais popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">{plan.price.formatted}</span>
          <span className="text-sm text-zinc-500">/mês</span>
        </div>
        <p className="mt-1 text-xs text-zinc-600">
          + {plan.setupFee.label} de implantação
        </p>
      </div>

      <button
        onClick={() => onSelect(plan)}
        className={`mb-8 w-full rounded-xl py-3 text-sm font-semibold transition-all active:scale-95 ${
          plan.highlight
            ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/35"
            : "border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600 hover:text-white"
        }`}
      >
        Quero esse plano
      </button>

      {/* Features list - takes remaining space */}
      <div className="flex-1 border-t border-white/5 pt-6">
        {features.map((feature) => (
          <FeatureRow key={feature.id} {...feature} />
        ))}
      </div>

      {plan.limits.hasWhatsApp && (
        <div className="mt-6 border-t border-white/5 pt-4">
          <p className="text-xs text-zinc-600">
            WhatsApp via{" "}
            {plan.limits.isCloudAPI
              ? "Cloud API oficial (Meta)"
              : "Evolution API (QR Code)"}
          </p>
        </div>
      )}
    </div>
  );
}

export function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <section id="planos" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Planos
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Escolha o plano ideal pro seu negócio
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.type} plan={plan} onSelect={setSelectedPlan} />
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-zinc-600">
          ✨ Sem contrato fidelidade. Cancele quando quiser.
        </p>
      </div>

      <LeadModal
        isOpen={selectedPlan !== null}
        onClose={() => setSelectedPlan(null)}
        planName={selectedPlan?.name || ""}
        planPrice={selectedPlan?.price.formatted || ""}
      />
    </section>
  );
}
