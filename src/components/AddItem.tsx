import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createItemApi } from '@/app/api/api';
import type { ItemEntity } from '@/types/todo';

type Props = {
  onCreated?: (item: ItemEntity) => void;
  isNone: boolean;
};

export default function AddItem({ onCreated, isNone }: Props) {
  const [term, setTerm] = useState('');
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => setIsTablet(window.innerWidth >= 744);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const addBtnImg = isTablet
    ? isNone
      ? '/btnAdd.svg'
      : '/btnAddWhite.svg'
    : isNone
    ? '/btnAddS.svg'
    : '/btnAddSWhite.svg';
  const btnSize = isTablet ? 'max-w-[168px] w-full' : 'w-14';

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
    <div className="mt-6 w-full min-w-[344px] flex items-center gap-2">
      <div className="relative flex-1 h-[56px]">
        <input
          type="text"
          placeholder="할 일을 입력해주세요"
          className="w-full h-full rounded-full bg-slate-100 border-2 border-slate-900 border-b-6 px-4 text-[15px] placeholder:text-slate-500 focus:outline-none"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddItem();
          }}
        />
      </div>

      <button
        className={`relative flex-shrink-0 h-14 ${btnSize}`}
        onClick={handleAddItem}
        aria-label="추가"
      >
        <Image
          src={addBtnImg}
          alt="add"
          fill
          priority
          style={{ objectFit: 'contain' }}
        />
      </button>
    </div>
  );
}
