export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-3 border-[var(--surface-border-strong)] border-t-[var(--primary)] rounded-full animate-spin"></div>
      <p className="font-serif text-sm text-[var(--foreground-muted)] tracking-wider">
        Crafting celebration moments...
      </p>
    </div>
  );
}
