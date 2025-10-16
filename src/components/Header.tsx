'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 border-b h-15 border-slate-200 bg-white px-90 py-[10px]">
      <button aria-label="logo" onClick={() => router.push('/')}>
        <Image src="/logoL.svg" alt="logo" width={151} height={40} priority />
      </button>
    </header>
  );
}
