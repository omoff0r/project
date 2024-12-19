import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function EndPoll({ pollId }: { pollId: bigint }) {
  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract", // Имя контракта
  });

  // Функция для завершения голосования
  const handleEndPoll = async () => {
    try {
      // Выполняем транзакцию на завершение голосования
      await writeContractAsync({
        functionName: "endPoll", // Имя функции контракта для завершения голосования
        args: [pollId], // Аргумент: идентификатор голосования
      });
      alert("Голосование завершено!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при завершении голосования.");
    }
  };

  return (
    <div className="bg-red-100 p-6 rounded-lg shadow-xl mt-4">
      <h3 className="text-xl font-semibold text-red-800 mb-4">Завершить голосование</h3>
      <p className="text-lg text-red-600 mb-6">Вы уверены, что хотите завершить голосование?</p>
      <button
        onClick={handleEndPoll} // Завершаем голосование при клике
        disabled={isMining} // Отключаем кнопку, если процесс в ожидании
        className={`w-full py-3 rounded-lg text-white ${isMining ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"} transition duration-200`}
      >
        {isMining ? "Завершение..." : "Завершить голосование"}
      </button>
    </div>
  );
}
