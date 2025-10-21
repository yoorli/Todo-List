/**
 * 목록 컬럼 컴포넌트
 * - field(todo/done)에 따라 체크박스 이미지와 줄긋기 스타일 분기
 * - 아이템 클릭 시 상세 페이지로 이동
 * - 체크박스 클릭 시 완료 상태 토글 후 상위 onMutate로 재조회 요청
 */
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { ItemEntity, Status } from '@/types/todo';
import { updateItem } from '@/app/api/api';

type Props = {
  field: Status;
  list: ItemEntity[];
  onMutate?: () => void; // 완료 토글 후 목록 재조회 콜백
};

export default function CheckList({ field, list, onMutate }: Props) {
  const checkboxSrc =
    field === 'todo' ? '/checkboxDefault.svg' : '/checkboxChecked.svg';

  const checkBoxStyle =
    field === 'todo' ? 'bg-white' : 'line-through bg-violet-100';

  // 중복 클릭 방지용 pending 집합
  const [pending, setPending] = useState<Set<string>>(new Set());

  // 완료 토글
  const handleCompleted = async (id: string, isCompleted: boolean) => {
    if (pending.has(id)) return;
    setPending((prev) => new Set(prev).add(id));
    try {
      await updateItem(id, { isCompleted: !isCompleted });
      onMutate?.();
    } catch (e) {
      console.error('update failed', e);
    } finally {
      setPending((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <section className="w-full">
      <div className="relative h-[36px] w-[101px]">
        <Image
          src={`/${field}.svg`}
          alt={`${field}`}
          fill
          priority
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div className="mt-4 w-full">
        {list.length !== 0 ? (
          <ul className="space-y-2">
            {list.map((i) => (
              <li
                key={i.id}
                className={`flex h-11 w-full max-w-full items-center gap-4 rounded-full border-2 border-slate-900 px-3 ${checkBoxStyle}`}
              >
                <Image
                  src={checkboxSrc}
                  alt="checkBox"
                  width={28}
                  height={28}
                  priority
                  className={`cursor-pointer ${
                    pending.has(String(i.id))
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }`}
                  onClick={() => handleCompleted(String(i.id), i.isCompleted)}
                />
                <Link
                  href={`/items/${i.id}`}
                  className="min-w-0 flex-1 truncate"
                >
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center gap-4">
            <div className="relative h-[120px] w-[120px] md:h-[240px] md:w-[240px]">
              <Image
                src={field === 'todo' ? '/emptyTodoL.svg' : '/emptyDoneL.svg'}
                alt="empty"
                fill
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="whitespace-pre-wrap text-center font-bold text-slate-400">
              {field === 'todo'
                ? '할 일이 없어요.\nTODO를 새롭게 추가해주세요!'
                : '아직 다 한 일이 없어요.\n해야 할 일을 체크해보세요!'}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
