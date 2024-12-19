import EndPoll from "~~/components/EndPoll";
import HasUserVoted from "~~/components/HasUserVoted";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function PollList() {
  const { data: pollCount } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollCount",
  });

  const renderPolls = () => {
    if (!pollCount) return <p>Загрузка...</p>;
    const polls = [];
    for (let i: number = 0; i < pollCount; i++) {
      polls.push(<PollItem key={i} pollId={BigInt(i)} />);
    }
    return polls;
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl p-8">
      <h2 className="text-3xl font-semibold text-teal-600 text-center mb-8">Список голосований</h2>
      {pollCount && pollCount > 0 ? renderPolls() : <p className="text-xl text-center text-teal-500">Нет активных голосований</p>}
    </div>
  );
}

function PollItem({ pollId }: { pollId: bigint }) {
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollDetails",
    args: [BigInt(pollId)],
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  if (!data) return <p>Загрузка...</p>;

  const [question, options, , isActive] = data;
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border-2 border-teal-200">
      
      {/* Прямоугольник с вопросом */}
      <div className="bg-teal-100 p-4 rounded-lg mb-4 shadow-md">
        <h3 className="text-2xl font-semibold text-teal-700">{question}</h3>
      </div>
      
      {/* Прямоугольник с вариантами ответа */}
      <div className="bg-teal-50 p-4 rounded-lg mb-6 shadow-md">
        <ul className="space-y-4">
          {options.map((opt: string, idx: number) => (
            <li key={idx} className="bg-teal-100 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-teal-600">{opt}</span>
                {isActive && (
                  <button
                    onClick={() =>
                      writeContractAsync({
                        functionName: "vote",
                        args: [BigInt(pollId), BigInt(idx)],
                      })
                    }
                    className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-200"
                  >
                    Голосовать
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Сообщение о завершении голосования */}
      {!isActive && (
        <p className="bg-red-200 text-red-700 font-medium text-lg py-2 px-4 rounded-lg shadow-md">
          Голосование завершено
        </p>
      )}
      {isActive && <EndPoll pollId={pollId} />}
      <HasUserVoted pollId={pollId} />
    </div>
  );
}
