'use client';
import { useRef, useEffect } from 'react';

export default function AutoTextarea({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

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
