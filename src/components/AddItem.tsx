'use client';
import Image from 'next/image';

export default function AddItem() {
  return (
    <div className="mt-6 flex justify-center items-center gap-4 w-full">
      <div className="relative">
        <Image src="/search.svg" alt="add" width={1016} height={56} priority />
        <input
          type="text"
          placeholder="할 일을 입력해주세요"
          className="absolute top-0 left-0 h-14 w-full bg-transparent px-6 text-[16px] placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <button className="relative h-14 max-w-[168px] flex items-center justify-center cursor-pointer">
        <Image
          src="/btnAddWhite.svg"
          alt="add"
          width={168}
          height={56}
          priority
        />
      </button>
    </div>
  );
}
