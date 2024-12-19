import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function PollResults() {
  const [pollId, setPollId] = useState<number>(-1);

  // Чтение результатов голосования
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "getResults", // Функция для получения результатов
    args: [BigInt(pollId)], // Идентификатор голосования
  });

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl p-6">
      <h3 className="text-2xl font-semibold text-teal-600 mb-6">Результаты голосования</h3>

      <input
        type="number"
        placeholder="Введите ID голосования"
        onChange={e => setPollId(e.target.value ? Number(e.target.value) : -1)}
        className="w-full p-3 mb-6 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
      />

      {data && (
        <div className="bg-teal-50 p-6 rounded-lg shadow-md">
          <ul>
            {data[0].map((option: string, idx: number) => (
              <li key={idx} className="text-teal-700 text-lg mb-4">
                <span className="font-semibold">{option}:</span> {Number(data[1][idx])} голосов
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
