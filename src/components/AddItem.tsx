import Image from 'next/image';
import { useState } from 'react';
import { createItemApi } from '@/libs/api';
import type { ItemEntity } from '@/types/todo';

type Props = {
  onCreated?: (item: ItemEntity) => void;
};

export default function AddItem({ onCreated }: Props) {
  const [term, setTerm] = useState('');

  const handleAddItem = async () => {
    if (!term.trim()) return;
    try {
      const created = await createItemApi({ name: term.trim() });
      onCreated?.(created);
      setTerm('');
    } catch (e) {
      console.error('create failed', e);
    }
  };

  return (
    <div className="mt-6 flex justify-center items-center gap-4 w-full">
      <div className="relative">
        <Image src="/search.svg" alt="add" width={1016} height={56} priority />
        <input
          type="text"
          placeholder="할 일을 입력해주세요"
          className="absolute top-0 left-0 h-14 w-full bg-transparent px-6 text-[16px] placeholder:text-slate-400 focus:outline-none"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddItem();
          }}
        />
      </div>

      <button
        className="relative h-14 max-w-[168px] flex items-center justify-center cursor-pointer"
        onClick={handleAddItem}
      >
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
