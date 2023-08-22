import { useState } from "react";
import { useGetQuestions, useGetQuestionsId } from "src/api/question/question";
import { IoArrowBack } from "react-icons/io5";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

const Questions = () => {
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [previousIds, setPreviousIds] = useState<number[]>([]);
  const {
    data: firstQuestionData,
    error,
    isLoading,
  } = useGetQuestions(
    {
      filters: {
        "isFirst[$eq]": "true",
      },
      fields: "id",
    },
    {
      query: {
        enabled: questionId === null,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
          const result = data?.data?.data?.[0];
          if (result) {
            setQuestionId(result.id ?? null);
          }
        },
      },
    }
  );
  const {
    data: questionData,
    error: questionError,
    isLoading: questionIsLoading,
    // @ts-ignore
  } = useGetQuestionsId(questionId, {
    query: {
      enabled: questionId !== null,
    },
  });
  const question = questionData?.data.data?.attributes;

  if (isLoading || questionIsLoading) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {previousIds.length ? (
        <button
          onClick={() => {
            const lastId = previousIds[previousIds.length - 1];
            setPreviousIds(previousIds.slice(0, previousIds.length - 1));
            setQuestionId(lastId);
          }}
          className="btn btn-ghost fixed left-4 top-4 text-2xl"
        >
          <IoArrowBack />
        </button>
      ) : null}
      <div className="flex w-4/5 flex-col space-y-6 lg:w-2/3">
        <h1 className="text-xl font-bold">{question?.Title}</h1>
        <div className="max-h-96 overflow-auto">
          <ReactMarkdown>{question?.Question ?? ""}</ReactMarkdown>
        </div>
        {question?.answerOptions ? (
          <div className="btn-group flex w-full text-xl">
            {(question?.answerOptions as any).map((answer: any) => (
              <button
                className="btn flex-grow"
                key={answer.id}
                onClick={() => {
                  if(answer.next === 'conversation') {
                    window.location.href = `/conversation/new`;
                    return;
                  }
                  setPreviousIds([...previousIds, questionId as number]);
                  setQuestionId(answer.next);
                }}
              >
                {answer.answer}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Questions;
