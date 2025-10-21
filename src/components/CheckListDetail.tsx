'use client';
/**
 * 상세 상단 카드
 * - 완료 체크박스 + 제목 인라인 편집
 * - 입력 너비를 텍스트 길이에 맞게 자동 조정
 * - 완료 여부에 따라 배경/테두리 색상 분기
 */

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Props = {
  itemTitle: string;
  isCompleted: boolean;
  onToggle?: (next: boolean) => void; // 완료 토글 콜백
  onTitleChange?: (title: string) => void; // 제목 변경 콜백
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

  // 외부 완료여부 변경 반영
  useEffect(() => {
    setIsDone(isCompleted);
  }, [isCompleted]);

  // 완료 토글
  const handleCompleted = () => {
    const next = !isDone;
    setIsDone(next);
    onToggle?.(next);
  };

  // 입력 길이에 맞춰 input 너비 조정
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
  const rowBg = isDone
    ? 'bg-violet-200 border-violet-600'
    : 'bg-white border-slate-900';

  return (
    <div
      className={`w-full h-14 border-2 rounded-2xl flex items-center justify-center gap-4 px-2 ${rowBg}`}
    >
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
        className="invisible absolute whitespace-pre font-bold text-lg underline"
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
        className="w-auto text-center font-bold text-lg text-slate-900 underline bg-transparent outline-none"
        placeholder="제목을 입력하세요"
        maxLength={100}
        aria-label="할 일 제목"
        style={{ minWidth: '2ch' }}
      />
    </div>
  );
}
