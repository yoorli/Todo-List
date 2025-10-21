'use client';
/**
 * 콘텐츠에 맞춰 자동으로 높이를 조정하는 textarea
 * - 부모 높이(maxH) 이내에서만 확장
 */
import { useRef, useEffect } from 'react';

export default function AutoTextarea({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // scrollHeight 기반 자동 리사이즈
  const resize = () => {
    const el = ref.current;
    if (!el) return;
    const maxH = el.parentElement?.clientHeight ?? Infinity;
    el.style.height = 'auto';
    const desired = el.scrollHeight;
    el.style.height = `${Math.min(desired, maxH)}px`;
  };

  useEffect(() => {
    resize();
    const id = setTimeout(resize, 0);
    return () => clearTimeout(id);
  }, []);

  const handleInput: React.FormEventHandler<HTMLTextAreaElement> = (e) => {
    resize();
    props.onInput?.(e);
  };

  return (
    <textarea
      ref={ref}
      onInput={handleInput}
      className={`w-full bg-transparent outline-none resize-none text-center leading-6 scrollbar ${className}`}
      {...props}
    />
  );
}
