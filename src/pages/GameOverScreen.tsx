import { useEffect, useState } from "react";
import { Check, Ellipsis, Pencil } from "lucide-react";
import {
  getLeaderboard,
  submitScoreToFirestore,
} from "../utils/leaderboardService";

export const GameOverScreen = ({
  score,
  streak,
  isNameEdit,
  playerName,
  setPlayerName,
  setIsNameEdit,
  restartGame,
}: any) => {
  const [records, setRecords] = useState([
    { name: "example data", score: 0, streak: 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const fetchLeaderboard = async () => {
    try {
      const data: any = await getLeaderboard();
      setRecords(data);
      setFetching(false)
    } catch (e) {
      console.error(e)
    }
  };
  const submitScore = async () => {
    setLoading(true);
    await submitScoreToFirestore(playerName, score, streak);

    restartGame();
  };
  useEffect(() => {
    fetchLeaderboard();
  }, []);
  const Rank = () => {
    const sortedPlayers = [...records].sort((a, b) => b.score - a.score);
    const rank = sortedPlayers.findIndex((player) => player.score <= score) + 1;

    // Fungsi untuk menambahkan suffix
    const getRankSuffix = (rank: number) => {
      if (rank % 100 >= 11 && rank % 100 <= 13) return "th"; // Handle 11th, 12th, 13th
      switch (rank % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    // Tentukan warna berdasarkan peringkat
    const getRankColor = (rank: number) => {
      switch (rank) {
        case 1:
          return "bg-yellow-300 text-yellow-700"; // Emas
        case 2:
          return "bg-gray-300 text-gray-700"; // Perak
        case 3:
          return "bg-amber-300 text-amber-700"; // Perunggu
        default:
          return "bg-stone-300 text-stone-700"; // Default
      }
    };

    return (
      <>
        <span
          className={`p-2 rounded-sm mx-2 ${getRankColor(
            rank > 0 ? rank : sortedPlayers.length + 1
          )}`}
        >
          {rank > 0
            ? `${rank}${getRankSuffix(rank)}`
            : `${sortedPlayers.length + 1}${getRankSuffix(
                sortedPlayers.length + 1
              )}`}
        </span>
        {rank === 1 && (
          <span className={`p-2 rounded-sm  text-nowrap ${getRankColor(1)}`}>
            best record
          </span>
        )}
      </>
    );
  };

  return fetching ? (<div className="grid place-content-center grow">loading</div>) :  (
    <div
      className="grid gap-4 text-center grow place-content-center
     p-4"
    >
      <b className="text-2xl md:text-4xl">Game Over</b>
      <p>
        final score : <span className="text-yellow-500">{score}</span> <Rank />
      </p>

      {score > 0 ? (
        <>
          <div className="grid grid-cols-4 gap-2">
            <input
              disabled={!isNameEdit}
              className={`bg-slate-200/10 p-2 col-span-3 rounded-md ring-0 outline-none disabled:text-slate-700 placeholder:text-slate-700 ${
                isNameEdit && "border"
              }}`}
              placeholder="enter your name"
              value={playerName}
              autoFocus
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button
              className=" bg-slate-600/50 hover:bg-slate-600/30 duration-300 transition-all grid place-content-center rounded-md"
              onClick={() => setIsNameEdit(!isNameEdit)}
            >
              {isNameEdit ? <Check size={16} /> : <Pencil size={16} />}
            </button>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <button
              className="p-2 bg-blue-200/20 hover:bg-blue-200/40 transition-all duration-300 rounded-md"
              onClick={restartGame}
            >
              restart without submitting
            </button>
            <button
              className="p-2 bg-orange-500/80 flex justify-center hover:bg-orange-500 disabled:bg-gray-500 disabled:text-gray-800 text-white transition-all duration-300 rounded-md"
              onClick={submitScore}
              disabled={playerName === "" || loading}
            >
              {loading ? <Ellipsis /> : "submit score and restart"}
            </button>
          </div>
        </>
      ) : (
        <button
          className="p-2 bg-blue-200/20 hover:bg-blue-200/40 transition-all duration-300 rounded-md"
          onClick={restartGame}
        >
          restart
        </button>
      )}
      <div className="flex gap-2 justify-between bg-white/10 p-4 rounded-sm my-2">
        <div>pos</div>
        <div className="grow">name</div>
        <div className="text-yellow-400">
          score
          <span className="bg-orange-300 text-orange-700 ms-2 p-2 rounded-sm">
            streak
          </span>
        </div>
      </div>
      <div className="h-60 overflow-scroll hiddenscroll">
        {records
          .sort(
            (a: { score: number }, b: { score: number }) => b.score - a.score
          )
          .map(
            (
              r: {
                name: string;
                score: number;
                streak: number;
              },
              i: number
            ) => (
              <div className="flex gap-2 p-2">
                <div>{i + 1}</div>
                <div className="grow overflow-hidden">{r.name}</div>
                <div className="text-yellow-400">
                  {r.score}
                  <span className="bg-orange-300 text-orange-700 ms-2 p-2 rounded-sm">
                    {r.streak}
                  </span>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};
