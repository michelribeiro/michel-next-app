# Design System — Robô Vendedor

> **Status:** Planejamento  
> **Última atualização:** 26/07/2025  
> **Stack:** React + TypeScript + Tailwind CSS

---

## 1. Ferramenta de documentação

### Opções consideradas

| Ferramenta | Prós | Contras | Veredito |
|------------|------|---------|----------|
| **Storybook** | Mais maduro, ecosystem gigante, addons, Chromatic pra testes visuais | Pesado (80MB+ node_modules), config complexa | ✅ **Escolhido** |
| **Ladle** | Mais leve, rápido, zero config | Ecosystem menor, menos addons | ⏳ Alternativa |
| **Histoire** | Moderno, Vite-based | Foco Vue, suporte React ainda secundário | ❌ |
| **Styleguidist** | Simples | Abandonado (não atualiza desde 2022) | ❌ |

### Decisão: Storybook

**Motivos:**
- Já é padrão de mercado (qualquer dev React conhece)
- Testes visuais com Chromatic (screening de regressão)
- Addons de acessibilidade, docs automática, themes
- Funciona com Next.js 16 (`.storybook/main.ts`)
- Integração com Tailwind via addon

---

## 2. Estrutura do Design System

```
ui/
├── components/                   # Componentes
│   ├── atoms/                    # 🔷 Componentes-base
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── Button.test.tsx
│   │   ├── Input/
│   │   ├── Label/
│   │   ├── Text/
│   │   ├── Heading/
│   │   ├── Icon/
│   │   └── Avatar/
│   │
│   ├── molecules/               # 🔶 Combinações de átomos
│   │   ├── Card/
│   │   ├── FormField/
│   │   ├── ProductCard/         # Card de produto (crítico pro MVP)
│   │   ├── Badge/
│   │   ├── Alert/
│   │   └── Toast/
│   │
│   ├── organisms/               # 🟠 Blocos funcionais
│   │   ├── Header/
│   │   ├── ProductGrid/
│   │   ├── CheckoutForm/
│   │   ├── ChatWidget/          # Componente de chat com IA
│   │   └── Footer/
│   │
│   └── templates/               # 🟣 Layouts completos
│       ├── ProductPage/
│       └── DashboardLayout/
│
├── tokens/                       # Tokens de design
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   ├── shadows.ts
│   └── radii.ts
│
├── icons/                        # Ícones (Lucide ou Heroicons)
│   └── index.ts
│
└── styles/                       # Estilos globais
    ├── globals.css               # Tailwind base + tokens CSS
    └── animations.css
```

---

## 3. Tokens de design

Os tokens alimentam tanto o Tailwind quanto o Storybook.

```ts
// tokens/colors.ts
export const colors = {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a5f',
  },
  neutral: { /* ... */ },
  success: { /* ... */ },
  error:   { /* ... */ },
  warning: { /* ... */ },
} as const
```

Esses tokens são consumidos pelo `tailwind.config.ts` e também exportados como variáveis CSS para o Storybook.

---

## 4. Padrão de componente

Cada componente segue:

```tsx
// ui/components/atoms/Button/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size]
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner className="mr-2" />}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
}
```

---

## 5. Storybook — estrutura

```ts
// .storybook/main.ts
export default {
  stories: ['../src/ui/components/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',        // Alternar temas dark/light
  ],
  framework: '@storybook/nextjs',
}
```

---

## 6. Testes visuais

Quando o projeto estiver rodando:

- **Chromatic** (gratuito pra projetos open-source ou pequenos)
- Publica cada componente com diff visual a cada commit
- Integra com GitHub Actions

---

## 7. Roadmap do Design System

| Fase | O que | Quando |
|------|-------|--------|
| **Fase 1** | Tokens + atoms essenciais (Button, Input, Text, Heading) | Semana 1 |
| **Fase 2** | Molecules do MVP (ProductCard, FormField, ChatWidget) | Semana 1 |
| **Fase 3** | Storybook configurado + primeira página | Semana 2 |
| **Fase 4** | Testes visuais + acessibilidade | Semana 3 |
| **Fase 5** | Revisão e documentação completa | Contínuo |

---

## 8. Biblioteca de ícones

**Lucide React** — recomendado
- 1000+ ícones
- Tree-shakeable (importa só o que usa)
- Bem documentado
- Compatível com Tailwind

```ts
import { ShoppingCart, MessageCircle, Check } from 'lucide-react'
```
