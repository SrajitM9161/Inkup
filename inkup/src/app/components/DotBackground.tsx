export default function DotBackground({ children }: { children: React.ReactNode }) {
  return <div className="bg-dot-pattern min-h-screen w-full">{children}</div>;
}
