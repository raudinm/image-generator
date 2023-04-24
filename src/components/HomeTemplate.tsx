import { useEffect, useState } from "react";
import SendIcon, { ApiLogo } from "./SendIcon";

export default function HomeTemplate() {
  const [text, setText] = useState("");
  const [imgGen, setImgGen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(
    () =>
      setImgGen(
        JSON.parse((localStorage.getItem("imgGen") as string) || "true")
      ),
    []
  );

  const getImage = async () => {
    if (text) {
      setLoading(true);
      const response = await fetch("/api/gpt", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type: "image" }),
      })
        .then((r) => r.json())
        .catch((error) => {
          console.error(error);
          return null;
        });

      if (response?.error) console.error(response?.error);

      if (Array.isArray(response?.data?.data)) setImages(response?.data?.data);
      setLoading(false);
    }
  };

  const getMessageResponse = async () => {
    if (text) {
      const copy = [...messages, { role: "user", message: text }];
      setMessages(copy);
      setLoading(true);
      const response = await fetch("/api/gpt", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type: "chat" }),
      })
        .then((r) => r.json())
        .catch((error) => {
          console.error(error);
          return null;
        });

      if (response?.error) console.error(response?.error);

      if (Array.isArray(response?.data?.choices)) {
        let mmss = (response?.data?.choices as any[]).map((m) => ({
          role: m.message?.role,
          message: m.message?.content,
        }));
        setMessages([...copy, ...mmss]);
      }
      setText("");
      setLoading(false);
    }
  };

  const switchMode = (imgGen: boolean) => {
    setText("");
    setImgGen(imgGen);
    localStorage.setItem("imgGen", String(imgGen));
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

  const buildPrompt = () => {
    return (
      <label className="input-group input-group-lg">
        <span>Prompt</span>
        <input
          onKeyDown={(e) => {
            if (e.code === "Enter") imgGen ? getImage() : getMessageResponse();
          }}
          type="text"
          value={text}
          disabled={loading}
          placeholder="Type here"
          onChange={(e) => setText(e.target.value)}
          className="input input-bordered input-lg w-full"
        />
        <button
          onClick={imgGen ? getImage : getMessageResponse}
          disabled={!text || loading}
          className="btn btn-lg btn-square"
        >
          {loading ? <Loading /> : <SendIcon />}
        </button>
      </label>
    );
  };

  return (
    <main>
      <div className="navbar bg-base-300">
        <div className="flex-1 px-2 lg:flex-none">
          <a className="text-lg font-bold">
            {imgGen ? "Image generator" : "Chat GPT"}
          </a>
        </div>
        <div className="flex justify-end flex-1 px-2"></div>
      </div>
      <div className="container mx-auto flex flex-col items-center mt-10">
        <label className="swap swap-flip text-9xl mb-10">
          <input
            type="checkbox"
            checked={imgGen}
            value={imgGen ? "on" : "off"}
            onChange={(e) => switchMode(!imgGen)}
          />
          <div className="swap-on">📷</div>
          <div className="swap-off">📮</div>
        </label>

        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-1 text-black dark:text-white">
          {imgGen ? "Image generator with open AI" : "Chat GPT"}
        </h1>
        <div className="form-control mt-5 w-full">
          {imgGen ? (
            <>
              {buildPrompt()}
              <div className="mt-5 mb-20 grid md:grid-cols-2 sm:grid-cols-1 gap-2">
                {images.map((i, idx) => (
                  <img key={idx} className="w-full" src={i.url} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div
                className="mt-2 mb-8 rounded-md p-5 overflow-auto"
                style={{ height: 450 }}
              >
                {messages.map((m, i) => {
                  let prev = messages[i - 1];
                  if (m.role === "user") {
                    return (
                      <div key={i} className="chat chat-end">
                        {prev?.role !== "user" ? (
                          <div className="chat-header">User</div>
                        ) : null}

                        <div className="chat-bubble chat-bubble-info">
                          {m.message}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="chat chat-start">
                      <div className="chat-image avatar">
                        <div className="rounded-full">
                          <ApiLogo />
                        </div>
                      </div>
                      {prev?.role !== "assistant" ? (
                        <div className="chat-header">GPT</div>
                      ) : null}
                      <div className="chat-bubble">{m.message}</div>
                    </div>
                  );
                })}
              </div>
              {buildPrompt()}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
