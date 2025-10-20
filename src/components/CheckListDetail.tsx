'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  itemTitle: string;
  isCompleted: boolean;
  onToggle?: (next: boolean) => void;
};

export default function CheckListDetail({ itemTitle, isCompleted, onToggle }: Props) {
  const [isDone, setIsDone] = useState(isCompleted);

  useEffect(() => {
    setIsDone(isCompleted);
  }, [isCompleted]);

  const handleCompleted = () => {
    const next = !isDone;
    setIsDone(next);
    onToggle?.(next);
  };

  const checkboxSrc = !isDone ? '/checkboxDefault.svg' : '/checkboxChecked.svg';
  const checkBoxStyle = !isDone ? 'bg-white' : 'bg-violet-100';

  return (
    /** **버그 수정: className 템플릿 리터럴 오류 수정** */
    <div
      className={`w-full max-w-[996px] h-16 border-2 border-slate-900 rounded-3xl flex items-center justify-center gap-4 ${checkBoxStyle}`}
    >
      {itemTitle && (
        <>
          <Image
            src={checkboxSrc}
            alt="completed"
            width={32}
            height={32}
            priority
            onClick={handleCompleted}
          />
          <span className="font-bold text-xl text-slate-900 underline">{itemTitle}</span>
        </>
      )}
    </div>
  );
}
