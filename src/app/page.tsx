'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import AddItem from '@/components/AddItem';
import CheckList from '@/components/CheckList';
import { listItems } from '@/libs/api';
import { ItemEntity } from '@/types/todo';

export default function Page() {
  const [items, setItems] = useState<ItemEntity[]>([]);

  const reload = useCallback(async () => {
    const next = await listItems();
    setItems(next);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const todoList = useMemo(() => items.filter(i => !i.isCompleted), [items]);
  const completedList = useMemo(() => items.filter(i => i.isCompleted), [items]);

  return (
    <main className="max-w-[1920px] flex flex-col items-center">
      <AddItem
        onCreated={(created) => {
          setItems(prev => [created, ...prev]);
        }}
      />
      <div className="flex gap-6 w-full justify-center">
        <CheckList field="todo" list={todoList} onMutate={reload}/>
        <CheckList field="done" list={completedList} onMutate={reload}/>
      </div>
    </main>
  );
}

