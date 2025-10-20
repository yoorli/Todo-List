import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { ItemEntity, Status } from '@/types/todo';
import { updateItem } from '@/libs/api';

type Props = {
  field: Status;
  list: ItemEntity[];
  onMutate?: () => void;
};

export default function CheckList({ field, list, onMutate }: Props) {
  const checkboxSrc =
    field === 'todo' ? '/checkboxDefault.svg' : '/checkboxChecked.svg';

  const checkBoxStyle =
    field === 'todo' ? 'bg-white' : 'line-through bg-violet-100';

  const [pending, setPending] = useState<Set<string>>(new Set());

  const handleCompleted = async (id: string, isCompleted: boolean) => {
    if (pending.has(id)) return;
    setPending(prev => new Set(prev).add(id));
    try {
      await updateItem(id, { isCompleted: !isCompleted });
      onMutate?.();
    } catch (e) {
      console.error('update failed', e);
    } finally {
      setPending(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="mt-10 max-w-[588px] flex flex-col gap-4 w-full">
      <Image src={`/${field}.svg`} alt={`${field}`} width={101} height={36} priority />
      <div className="flex flex-col gap-4 w-full">
        <ul className="space-y-3">
          {list.map((i) => (
            <li
              key={i.id}
              className={`px-3 max-w-[588px] h-[50px] rounded-full border-2 border-slate-900 flex items-center gap-4 ${checkBoxStyle}`}
            >
              <Image
                src={checkboxSrc}
                alt="checkBox"
                width={32}
                height={32}
                priority
                className={`cursor-pointer ${pending.has(String(i.id)) ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => handleCompleted(String(i.id), i.isCompleted)}
              />
              <Link href={`/items/${i.id}`} className="truncate">
                {i.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
