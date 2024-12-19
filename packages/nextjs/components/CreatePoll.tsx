import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreatePoll() {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  const addOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const createPoll = async () => {
    if (question && options.length > 1 && duration > 0) {
      await writeContractAsync({
        functionName: "createPoll",
        args: [question, options, BigInt(duration)],
      });
    } else {
      alert("Пожалуйста, заполните все поля корректно.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl p-6">
      <h2 className="text-3xl font-semibold text-teal-600 mb-6">Создание голосования</h2>

      <div className="mb-4">
        <label htmlFor="question" className="block text-lg text-teal-500 mb-2">
          Вопрос голосования
        </label>
        <input
          id="question"
          type="text"
          placeholder="Введите ваш вопрос"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="w-full p-3 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="optionInput" className="block text-lg text-teal-500 mb-2">
          Добавить варианты ответов
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="optionInput"
            type="text"
            placeholder="Добавить вариант"
            value={optionInput}
            onChange={e => setOptionInput(e.target.value)}
            className="flex-1 p-3 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            onClick={addOption}
            className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition"
          >
            Добавить
          </button>
        </div>
        <ul className="mt-2 list-disc pl-5">
          {options.map((opt, idx) => (
            <li key={idx} className="text-lg text-teal-700">
              {opt}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <label htmlFor="duration" className="block text-lg text-teal-500 mb-2">
          Длительность (в секундах)
        </label>
        <input
          id="duration"
          type="number"
          placeholder="Введите длительность"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          className="w-full p-3 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <button
        onClick={createPoll}
        disabled={isMining}
        className={`w-full py-3 rounded-lg text-white ${isMining ? "bg-gray-500" : "bg-teal-600 hover:bg-teal-700"} transition`}
      >
        {isMining ? "Создание..." : "Создать голосование"}
      </button>
    </div>
  );
}
