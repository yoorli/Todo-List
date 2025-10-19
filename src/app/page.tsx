'use client';

import { useEffect, useState } from 'react';
import AddItem from '@/components/AddItem';
import CheckList from '@/components/CheckList';

import { listItems } from '@/libs/api';
import { ItemEntity } from '@/types/todo';

export default function Page() {
  const [todoList, setTodoList] = useState<ItemEntity[]>([]);
  const [completedList, setCompletedList] = useState<ItemEntity[]>([]);

  useEffect(() => {
    (async () => {
      const items = await listItems();
      setTodoList(items.filter((i) => !i.isCompleted));
      setCompletedList(items.filter((i) => i.isCompleted));
    })();
  }, [todoList, completedList]);

  return (
    <main className="max-w-[1920px] flex flex-col items-center">
      <AddItem />

      <div className="flex gap-6 w-full justify-center">
        <CheckList field="todo" list={todoList} />
        <CheckList field="done" list={completedList} />
      </div>
    </main>
  );
}
