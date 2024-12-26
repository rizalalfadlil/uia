import { Progress } from "antd";
import { useState } from "react";
import { img } from "../utils/cat-api";
import { Keyboard } from "lucide-react";

export const GameScreen = ({
  score,
  streak,
  isPlaying,
  percent,
  isFailed,
  word,
  currentLength,
  getTime,
  unique,
  KeyPressed,
}: any) => {
  const [keyboarActive, setKeyboarActive] = useState(true);
  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex justify-end text-lg font-medium">
        <p>
          {score}{" "}
          {streak != 0 && (
            <span className="bg-green-600 text-white p-1 text-sm rounded-md px-4">
              {(1 + streak / 10).toFixed(1)}x
            </span>
          )}
        </p>
      </div>
      <div className="grow grid place-content-center gap-4">
        <Progress
          type="circle"
          percent={isPlaying ? (percent === 0 ? 100 : percent) : percent}
          status={isFailed ? "exception" : undefined}
          format={() => <img src={img(currentLength)} />}
        />
        <p className="text-center p-2 bg-black/50 rounded-md">
          {word[currentLength]}
        </p>
        <p className="text-center">{getTime()}</p>
      </div>
      <div className="flex gap-2">
        <button
          className={`rounded p-2 duration-300 transition-all z-20 ${
            keyboarActive && "bg-white/20"
          }`}
          onClick={() => setKeyboarActive(!keyboarActive)}
        >
          <Keyboard />
        </button>
        {keyboarActive &&
          unique.map((un: string) => (
            <button
              onClick={() => KeyPressed({ key: un })}
              className="p-2 bg-white/20 grow rounded-md hover:bg-white/30 duration-300 transition-all z-20"
            >
              {un}
            </button>
          ))}
      </div>

      <input
        type="text"
        autoFocus
        onKeyDown={KeyPressed}
        className="absolute inset-0 bottom-4 w-full h-full opacity-0 z-10 cursor-default"
      />
    </div>
  );
};
