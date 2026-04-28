import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-55"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--gold-light) / 0.30), hsl(var(--gold) / 0.14), transparent 72%)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-50"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--gold) / 0.24), hsl(var(--gold-deep) / 0.12), transparent 72%)",
          }}
        />
        <div className="absolute top-0 inset-x-0 divider-gold" />
        <div className="absolute bottom-0 inset-x-0 divider-gold" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto text-center">
          <span className="block mx-auto mb-8 gold-rule" aria-hidden="true" />
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <AlertCircle className="h-7 w-7 text-primary" />
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-[1.02] tracking-tight">
              404 Page Not Found
            </h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Did you forget to add the page to the router?
          </p>
        </div>
      </div>
    </div>
  );
}
