export class Price {
  constructor(
    public readonly amount: number,
    public readonly currency: string = "BRL",
    public readonly period: "monthly" | "once" = "monthly"
  ) {}

  get formatted(): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: this.currency,
    }).format(this.amount);
  }

  get label(): string {
    if (this.period === "once") return `${this.formatted} único`;
    return `${this.formatted}/mês`;
  }

  static monthly(amount: number): Price {
    return new Price(amount, "BRL", "monthly");
  }

  static once(amount: number): Price {
    return new Price(amount, "BRL", "once");
  }
}
