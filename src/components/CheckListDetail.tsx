import Image from 'next/image';

export default function CheckListDetail() {
  const field = 'todo';

  const checkboxSrc =
    field === 'todo' ? '/checkboxDefault.svg' : '/checkboxChecked.svg';

  return (
    <div className="w-full max-w-[996px] h-16 border-2 border-slate-900 rounded-3xl flex items-center justify-center gap-4">
      <Image
        src={`${checkboxSrc}`}
        alt={`${checkboxSrc}`}
        width={32}
        height={32}
        priority
      />
      <span className='font-bold text-xl text-slate-900'>비타민 챙겨 먹기</span>
    </div>
  );
}
