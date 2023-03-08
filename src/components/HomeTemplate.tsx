import { useState } from "react";

export default function HomeTemplate() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const getImage = async () => {
    if (text) {
      setLoading(true);
      const response = await fetch("/api/get-image", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).then((r) => r.json());
      if (Array.isArray(response?.data?.data)) setImages(response?.data?.data);
      setLoading(false);
    }
  };

  const Loading = () => (
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-gray-400 motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );

  return (
    <main>
      <div className="navbar bg-base-300">
        <div className="flex-1 px-2 lg:flex-none">
          <a className="text-lg font-bold">Image generator 1.0</a>
        </div>
        <div className="flex justify-end flex-1 px-2"></div>
      </div>
      <div className="container mx-auto flex flex-col items-center mt-10">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-1 text-black dark:text-white">
          Image generator with open AI
        </h1>
        <div className="form-control mt-5 w-full">
          <label className="input-group input-group-lg">
            <span>Prompt</span>
            <input
              onKeyDown={(e) => {
                if (e.code === "Enter") getImage();
              }}
              type="text"
              value={text}
              disabled={loading}
              placeholder="Type here"
              onChange={(e) => setText(e.target.value)}
              className="input input-bordered input-lg w-full"
            />
            <button
              onClick={getImage}
              disabled={!text || loading}
              className="btn btn-lg btn-square"
            >
              {loading ? (
                <Loading />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </button>
          </label>

          <div className="mt-5 mb-20 grid md:grid-cols-2 sm:grid-cols-1 gap-2">
            {images.map((i, idx) => (
              <img key={idx} className="w-full" src={i.url} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
