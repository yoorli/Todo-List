import AddItem from '@/components/AddItem';
import CheckList from '@/components/CheckList';

export default async function Page() {
  return (
    <main className="max-w-[1920px] flex flex-col items-center">
      <AddItem />

      <div className="flex gap-6 w-full justify-center">
        <CheckList field="todo" />
        <CheckList field="done" />
      </div>
    </main>
  );
}
