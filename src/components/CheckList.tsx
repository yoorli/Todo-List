import Image from 'next/image';

import { ItemEntity, Status } from '@/types/todo';
import { updateItem } from '@/libs/api';

type Props = {
  field: Status;
  list: ItemEntity[];
};

const handleCompleted = async (id: string, isCompleted: boolean) => {
  try {
    await updateItem(id, { isCompleted: !isCompleted });
  } catch (e) {
    console.error('update failed', e);
  }
};

export default function CheckList({ field, list }: Props) {
  const checkboxSrc =
    field === 'todo' ? '/checkboxDefault.svg' : '/checkboxChecked.svg';

  const checkBoxStyle =
    field === 'todo' ? 'bg-white' : 'line-through bg-violet-100';

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
          {list.map((i) => (
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
                className="cursor-pointer"
                onClick={() => handleCompleted(String(i.id), i.isCompleted)}
              />
              <span
                onClick={() => {
                  window.location.href = `/items/${i.id}`;
                }}
              >
                {i.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
