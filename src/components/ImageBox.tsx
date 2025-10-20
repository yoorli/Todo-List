import Image from 'next/image';

export default function ImageBox() {

  return (
    <div className='relative w-full h-[311px] max-w-[384px] border-2 border-slate-300 border-dashed rounded-2xl bg-slate-50 bg-[url("/img.svg")] bg-center bg-no-repeat'>
      <button className="absolute bottom-4 right-4 cursor-pointer">
        <Image
          src="/btnImgAdd.svg"
          alt="camera"
          width={64}
          height={64}
          priority
        />
      </button>
    </div>
  );
}
  