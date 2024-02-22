import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answerIndex: null,
  points: 0,
  highScore: 0,

  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived": {
      return { ...state, questions: action.info, status: "ready" };
    }
    case "dataFailed": {
      return { ...state, status: "error" };
    }
    case "start": {
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    }
    case "answered": {
      const question = state.questions.at(state.index);
      return {
        ...state,
        answerIndex: action.answerIndex,
        points:
          action.answerIndex === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case "nextQuestion": {
      return { ...state, index: state.index + 1, answerIndex: null };
    }

    case "finish": {
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    }
    case "restart": {
      return { ...initialState, questions: state.questions, status: "ready" };
    }

    case "tick": {
      return {
        ...state,

        status: state.secondsRemaining === 0 ? "finished" : state.status,
        secondsRemaining: state.secondsRemaining - 1,
      };
    }

    default: {
      throw Error("Unknown action");
    }
  }
}

export default function App() {
  const [
    {
      questions,
      status,
      index,
      answerIndex,
      points,
      highScore,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;

  const maxPossiblePoints = questions.reduce(
    (accu, curr) => accu + curr.points,
    0
  );

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())

      .then((data) => dispatch({ type: "dataReceived", info: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div>
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}

        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answerIndex={answerIndex}
            />
            <Question
              question={questions.at(index)}
              answerIndex={answerIndex}
              dispatch={dispatch}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              {answerIndex !== null && (
                <NextButton
                  dispatch={dispatch}
                  numQuestions={numQuestions}
                  index={index}
                />
              )}
            </Footer>
          </>
        )}

        {status === "error" && <Error />}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

// import { useEffect, useReducer } from "react";
// import Header from "./Header";
// import Main from "./Main";
// import Loader from "./Loader";
// import Error from "./Error";
// import StartScreen from "./StartScreen";
// import Question from "./Question";
// import NextButton from "./NextButton";
// import Progress from "./Progress";
// import FinishScreen from "./FinishScreen";
// import Footer from "./Footer";
// import Timer from "./Timer";

// const initialState = {
//   // questions: {},
//   questions: [],

//   status: "loading",
//   index: 0,
//   answerIndex: null,
//   points: 0,
//   highScore: 0,
// };
// function reducer(state, action) {
//   switch (action.type) {
//     case "dataReceived": {
//       return { ...state, questions: action.info, status: "ready" };
//     }
//     case "dataFailed": {
//       return { ...state, status: "error" };
//     }
//     case "start": {
//       return { ...state, status: "active" };
//     }
//     case "answered": {
//       const question = state.questions.at(state.index);
//       return {
//         ...state,
//         answerIndex: action.answerIndex,
//         points:
//           action.answerIndex === question.correctOption
//             ? state.points + question.points
//             : state.points,
//       };
//     }
//     case "nextQuestion": {
//       return { ...state, index: state.index + 1, answerIndex: null };
//     }

//     case "finish": {
//       return {
//         ...state,
//         status: "finished",
//         highScore:
//           state.points > state.highScore ? state.points : state.highScore,
//       };
//     }
//     case "restart": {
//       return { ...initialState, questions: state.questions, status: "ready" };
//     }

//     default: {
//       throw Error("Unknown action");
//     }
//   }
// }

// export default function App() {
//   const [
//     { questions, status, index, answerIndex, points, highScore },
//     dispatch,
//   ] = useReducer(reducer, initialState);
//   const numQuestions = questions.length;

//   const maxPossiblePoints = questions.reduce(
//     (accu, curr) => accu + curr.points,
//     0
//   );

//   useEffect(() => {
//     fetch("http://localhost:8000/questions")
//       .then((res) => res.json())

//       .then((data) => dispatch({ type: "dataReceived", info: data }))
//       .catch(() => dispatch({ type: "dataFailed" }));
//   }, []);

//   return (
//     <div>
//       <Header />
//       <Main>
//         {status === "loading" && <Loader />}
//         {status === "ready" && (
//           <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
//         )}

//         {status === "active" && (
//           <>
//             <Progress
//               index={index}
//               numQuestions={numQuestions}
//               points={points}
//               maxPossiblePoints={maxPossiblePoints}
//               answerIndex={answerIndex}
//             />
//             <Question
//               question={questions.at(index)}
//               answerIndex={answerIndex}
//               dispatch={dispatch}
//             />
//             <Footer>
//               <Timer />
//               {answerIndex !== null && (
//                 <NextButton
//                   dispatch={dispatch}
//                   numQuestions={numQuestions}
//                   index={index}
//                 />
//               )}
//             </Footer>
//           </>
//         )}

//         {status === "error" && <Error />}
//         {status === "finished" && (
//           <FinishScreen
//             points={points}
//             maxPossiblePoints={maxPossiblePoints}
//             highScore={highScore}
//             dispatch={dispatch}
//           />
//         )}
//       </Main>
//     </div>
//   );
// }
