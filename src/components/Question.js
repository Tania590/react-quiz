import Options from "./Options";

function Question({ question, answerIndex, dispatch }) {
  return (
    <div>
      <h4>{question.question}</h4>

      <Options
        question={question}
        answerIndex={answerIndex}
        dispatch={dispatch}
      />
    </div>
  );
}

export default Question;
