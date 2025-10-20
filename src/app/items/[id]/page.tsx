import AutoTextarea from '@/components/AutoTextarea';
import CheckListDetail from '@/components/CheckListDetail';
import ImageBox from '@/components/ImageBox';

export default function Page() {
  return (
    <main className="w-full flex justify-center overflow-hidden">
      <div className="max-w-[1200px] w-full h-[calc(100dvh-60px)] bg-white flex flex-col items-center gap-6 pt-6">
        <CheckListDetail />
        <div className="flex items-center justify-between gap-6 w-full max-w-[996px]">
          <ImageBox />
          <div className='relative w-full max-w-[588px] h-[311px] py-3 rounded-2xl bg-[url("/memo.svg")] flex flex-col items-center justify-center'>
            <p className="absolute top-[18px] text-amber-800 font-extrabold">
              Memo
            </p>
            <div className="w-full h-full mt-[58px] px-6 grid place-items-center overflow-hidden">
              <AutoTextarea
                placeholder={'메모를 작성해 보세요!\n사진도 첨부할 수 있어요!'}
                rows={3}
                className="max-h-full"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-end w-full max-w-[996px]">
          <button className='w-[168px] h-[56px] bg-[url("/btnEditWhite.svg")] cursor-pointer'></button>
          <button className='w-[168px] h-[56px] bg-[url("/btnDelete.svg")] cursor-pointer'></button>
        </div>
      </div>
    </main>
  );
}
