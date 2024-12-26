import { useState, useEffect } from "react";
import "./App.css";
import { GameOverScreen } from "./pages/GameOverScreen";
import { GameScreen } from "./pages/GameScreen";
import { sfx } from "./utils/cat-api";
export default function App() {
  const word = "uiiaiuiiiai";
  const unique = [...new Set(word)];
  const [currentLength, setCurrentLength] = useState(0);
  const [isFailed, setIsFailed] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const percent = Number(((currentLength / word.length) * 100).toFixed(0));
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const defaultTimeLimit = 5;
  const [timeLimit, setTimeLimit] = useState(defaultTimeLimit);

  const [showFinalScore, setShowFinalScore] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [isNameEdit, setIsNameEdit] = useState(false);
  const KeyPressed = (e: { key: string }) => {
    sfx(e.key);
    if (e.key === word[currentLength]) {
      if (currentLength < word.length - 1) {
        setIsPlaying(true);
        setIsFailed(false);

        if (!isStarted) startTimer();
        setCurrentLength(currentLength + 1);
      } else success();
    } else if (currentLength > 0) failed();
  };

  const success = () => {
    const time =
      elapsedTime < timeLimit
        ? elapsedTime.toFixed(2)
        : timeLimit - 0.1 * timeLimit;
    const timeScore = (timeLimit - Number(time)) * (100 / timeLimit);
    const streakMultiplier = 1 + streak / 10;
    const finalScore = (timeScore * streakMultiplier).toFixed(0);
    console.log(`correct, score : ${finalScore}`);
    setStreak(streak + 1);
    setScore(score + Number(finalScore));
    // reset();
    setCurrentLength(0);
    setElapsedTime(0);
    if (timeLimit > 1) {
      setTimeLimit(timeLimit - 0.1 * timeLimit);
    }
  };

  const failed = () => {
    setElapsedTime(0);
    console.log("wrong");
    setIsFailed(true);
    console.log("final score : " + score);
    setShowFinalScore(true);
    reset();
  };

  const startTimer = () => {
    setElapsedTime(0);
    setIsStarted(true);
    const intervalId = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 0.01);
    }, 10);
    setTimerId(intervalId);
  };

  const stopTimer = () => {
    if (timerId) {
      clearInterval(timerId);
    }
    setTimerId(null);
  };

  const reset = () => {
    stopTimer();
    setIsStarted(false);
    setCurrentLength(0);
  };
  const restartGame = () => {
    setScore(0);
    setStreak(0);
    setIsNameEdit(false);
    setTimeLimit(defaultTimeLimit);
    setShowFinalScore(false);
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const getTime = () => {
    const time = (timeLimit - elapsedTime).toFixed(2);
    return Number(time) > 0 ? time : failed();
  };

  return (
    <main className="w-full min-h-screen flex flex-col font-coiny bg-gradient-to-t from-slate-900 to-slate-950 text-blue-200 lg:px-40 xl:px-60 2xl:px-80">
      {showFinalScore ? (
        <GameOverScreen
          score={score}
          streak={streak}
          isNameEdit={isNameEdit}
          playerName={playerName}
          setPlayerName={setPlayerName}
          setIsNameEdit={setIsNameEdit}
          restartGame={restartGame}
        />
      ) : (
        <GameScreen
          score={score}
          streak={streak}
          isPlaying={isPlaying}
          percent={percent}
          isFailed={isFailed}
          word={word}
          currentLength={currentLength}
          getTime={getTime}
          unique={unique}
          KeyPressed={KeyPressed}
        />
      )}
    </main>
  );
}
