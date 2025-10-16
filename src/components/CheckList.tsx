'use client';
import Image from 'next/image';

import { Status } from '@/types/todo';
import { MOCK_UI } from '@/libs/mock';

type Props = {
  field: Status;
};

export default function CheckList({ field }: Props) {
  const checkboxSrc =
    field === 'todo' ? '/checkboxDefault.svg' : '/checkboxChecked.svg';

  const checkBoxStyle = field === 'todo' ? 'bg-white' : 'line-through bg-violet-100';

  return (
    <div className="mt-10 max-w-[588px] flex flex-col gap-4 w-full">
      <Image  
        src={`/${field}.svg`}
        alt={`${field}`}
        width={101}
        height={36}
        priority
      />
      <div className="flex flex-col gap-4 w-full">
        <ul className="space-y-3">
          {(field === 'todo' ? MOCK_UI.todo : MOCK_UI.done).map((i) => (
            <li
              key={i.id}
              className={`px-3 max-w-[588px] h-[50px] rounded-full border-2 border-slate-900 flex items-center gap-4 ${checkBoxStyle}`}
            >
              <Image
                src={`${checkboxSrc}`}
                alt="checkBox"
                width={32}
                height={32}
                priority
              />
              <span>{i.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
