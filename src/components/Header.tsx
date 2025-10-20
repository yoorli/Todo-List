'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 h-[60px] border-b border-slate-200 bg-white">
      <button
        aria-label="logo"
        onClick={() => router.push('/')}
        className={`
          flex items-center
          relative top-3 left-4
          min-[1270px]:fixed
          min-[1270px]:top-3
          min-[1270px]:left-[calc((100vw-1920px)/2+360px)]
        `}
      >
        <span className="relative h-10 w-[71px] min-[744px]:hidden">
          <Image
            src="/logoS.svg"
            alt="logo"
            fill
            priority
            style={{ objectFit: 'contain' }}
          />
        </span>
        <span className="relative hidden min-[744px]:block h-10 w-[151px]">
          <Image
            src="/logoL.svg"
            alt="logo"
            fill
            priority
            style={{ objectFit: 'contain' }}
          />
        </span>
      </button>
    </header>
  );
}
