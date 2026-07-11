import Image from "next/image";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="The Living Margin Logo" 
              width={36} 
              height={36} 
              className="rounded-md object-cover bg-slate-900 border border-slate-800"
            />
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">The Living Margin</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link>
            <Link href="/community" className="hover:text-white transition-colors">Community</Link>
            <div className="w-[1px] h-4 bg-slate-800"></div>
            <Link href="/login" className="hover:text-white transition-colors">Log in</Link>
            <Link href="/register" className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)]">
              Sign up
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
