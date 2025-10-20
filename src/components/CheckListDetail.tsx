'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Props = {
  itemTitle: string;
  isCompleted: boolean;
  onToggle?: (next: boolean) => void;
  onTitleChange?: (title: string) => void;
};

export default function CheckListDetail({
  itemTitle,
  isCompleted,
  onToggle,
  onTitleChange,
}: Props) {
  const [isDone, setIsDone] = useState(isCompleted);
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => { setIsDone(isCompleted); }, [isCompleted]);

  const handleCompleted = () => {
    const next = !isDone;
    setIsDone(next);
    onToggle?.(next);
  };

  const resizeToContent = (text: string) => {
    const span = mirrorRef.current;
    const input = inputRef.current;
    if (!span || !input) return;
    span.textContent = text || input.placeholder || '';
    const pad = 6; 
    input.style.width = `${Math.ceil(span.offsetWidth) + pad}px`;
  };

  useEffect(() => {
    resizeToContent(itemTitle);
  }, [itemTitle]);

  const checkboxSrc = isDone ? '/checkboxChecked.svg' : '/checkboxDefault.svg';
  const rowBg = isDone ? 'bg-violet-100' : 'bg-white';

  return (
    <div className={`w-full max-w-[996px] h-16 border-2 border-slate-900 rounded-3xl flex items-center justify-center gap-4 ${rowBg}`}>
      <Image
        src={checkboxSrc}
        alt="completed"
        width={32}
        height={32}
        priority
        className="cursor-pointer"
        onClick={handleCompleted}
      />

      <span
        ref={mirrorRef}
        aria-hidden
        className="invisible absolute whitespace-pre font-bold text-xl underline"
        style={{ fontFamily: 'NanumSquare, sans-serif' }}
      />

      <input
        ref={inputRef}
        value={itemTitle}
        onChange={(e) => {
          onTitleChange?.(e.target.value);
          resizeToContent(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        className="w-auto text-center font-bold text-xl text-slate-900 underline bg-transparent outline-none"
        placeholder="제목을 입력하세요"
        maxLength={100}
        aria-label="할 일 제목"
        style={{ minWidth: '2ch' }}
      />
    </div>
  );
}
