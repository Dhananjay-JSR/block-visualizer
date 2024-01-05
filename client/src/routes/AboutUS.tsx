import { Header } from "./Main";

export default function AboutUSPage() {
  return (
    <>
      <Header />

      <div className=" border-t pt-3">
        <div className="max-w-xl mx-auto ">
          <div className="max-w-xl mx-auto  text-2xl font-semibold  tracking-tight leading-tight">
            About <span className="text-blue-600 ">Snowden</span>
          </div>
          <div className="prose text-lg mt-4 max-w-none tablet:prose-xl prose-p:my-2 prose-p:text-lg prose-li:text-lg prose-ul:list-disc prose-li:marker:text-black prose-a:text-primary prose-a:no-underline">
           We are Team Snow from Graphic Era , 3rd Yr Students of Graphic Era Dehradhun , 2023 SIH Finalist 
          </div>
          <div className="max-w-xl mt-7 mx-auto  text-2xl font-semibold  tracking-tight leading-tight">
            Meet Our  <span className="text-blue-600 ">Amazing Team</span>
          </div>
          <div className="mt-3 flex gap-3 flex-wrap">
            <div className="text-center w-fit">

            <img src="https://reunionhq.in//static/5584db9d7875728670f117ad5a5f22ca/80b13/blank-profile-picture.png" className="w-40 h-40 rounded-md" />
            <div className="font-medium">Ansh Dixit</div>
            </div>

            <div className="text-center w-fit">

<img src="https://reunionhq.in//static/5584db9d7875728670f117ad5a5f22ca/80b13/blank-profile-picture.png" className="w-40 h-40 rounded-md" />
<div className="font-medium">Shishir Tomar</div>
</div>

<div className="text-center w-fit">

<img src="https://reunionhq.in//static/5584db9d7875728670f117ad5a5f22ca/80b13/blank-profile-picture.png" className="w-40 h-40 rounded-md" />
<div className="font-medium">Riya Saxena</div>
</div>

<div className="text-center w-fit">

<img src="https://reunionhq.in//static/5584db9d7875728670f117ad5a5f22ca/80b13/blank-profile-picture.png" className="w-40 h-40 rounded-md" />
<div className="font-medium">Sagarika</div>
</div>
<div className="text-center w-fit">

<img src="https://reunionhq.in//static/5584db9d7875728670f117ad5a5f22ca/80b13/blank-profile-picture.png" className="w-40 h-40 rounded-md" />
<div className="font-medium">Tejeshwar </div>
</div>
<div className="text-center w-fit">

<img src="https://reunionhq.in//static/5584db9d7875728670f117ad5a5f22ca/80b13/blank-profile-picture.png" className="w-40 h-40 rounded-md" />
<div className="font-medium">Dhananjay Senday</div>
</div>


          </div>
          <div className="mt-6">

</div>
        </div>
      </div>
    </>
  );
}
