'use client';

/**
 * 앱 메인 페이지
 * - 전체 아이템 목록을 조회해 TODO / DONE 두 컬럼으로 표시
 * - 신규 아이템 추가(AddItem), 상태 토글(CheckList) 제공
 */

import { useEffect, useMemo, useState, useCallback } from 'react';
import AddItem from '@/components/AddItem';
import CheckList from '@/components/CheckList';
import { listItems } from '@/app/api/api';
import { ItemEntity } from '@/types/todo';

export default function Page() {
  const [items, setItems] = useState<ItemEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 빈 목록 여부에 따라 Add 버튼 스타일 변경
  const isNone = items.length === 0;

  // 목록 재조회 핸들러
  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);
      const next = await listItems();
      setItems(next);
    } catch (e) {
      setErr('목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 최초 진입 시 목록 로드
  useEffect(() => {
    void reload();
  }, [reload]);

  // 파생 목록: 미완료/완료 분리
  const todoList = useMemo(() => items.filter((i) => !i.isCompleted), [items]);
  const completedList = useMemo(
    () => items.filter((i) => i.isCompleted),
    [items]
  );

  return (
    <main
      className="
      mx-auto w-full min-w-[344px]
      px-4 pt-4
      sm:px-6
      lg:px-0 lg:max-w-[1200px]
    "
    >
      <AddItem
        onCreated={(created) => setItems((prev) => [created, ...prev])}
        isNone={isNone}
      />

      {err && <p className="mt-4 text-rose-500">{err}</p>}
      {loading && <p className="mt-4 text-slate-500">불러오는 중...</p>}

      {!loading && (
        <div
          className="
          mt-6 w-full
          flex flex-col gap-12
          lg:flex-row lg:items-start
        "
        >
          <CheckList field="todo" list={todoList} onMutate={reload} />
          <CheckList field="done" list={completedList} onMutate={reload} />
        </div>
      )}
    </main>
  );
}
