import { nanoid } from "nanoid";
import React from "react";
import Question from "./Question";
import Confetti from "react-confetti";

export default function App() {
  const [isQuiz, setIsQuiz] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [answerCount, setAnswerCount] = React.useState(0);

  function getQuestions() {
    setIsLoading(true);
    fetch(
      "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
    )
      .then((response) => response.json())
      .then((data) => {
        return setQuestions(
          data.results.map((q) => {
            const { question, incorrect_answers, correct_answer } = q;
            const answers = incorrect_answers.slice();
            function randomNum(array) {
              return Math.floor(Math.random() * array.length);
            }
            answers.splice(randomNum(incorrect_answers), 0, correct_answer);
            setIsLoading(false);
            return {
              id: nanoid(),
              question: question,
              answers: answers,
              correct: correct_answer,
              selected: "",
            };
          })
        );
      });
  }

  React.useEffect(() => {
    if (!isQuiz) {
      return;
    }
    getQuestions();
  }, [isQuiz]);

  function startQuiz() {
    setIsQuiz(true);
    getQuestions();
  }

  const selectedAnswerHandler = (id, answer) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question) => {
        return question.id === id
          ? { ...question, selected: answer }
          : question;
      });
    });
  };

  function checkAnswers() {
    if (!complete) {
      setComplete(true);
      for (const question of questions) {
        if (question.correct === question.selected) {
          setAnswerCount((prev) => prev + 1);
        }
      }
    } else {
      setIsQuiz(false);
      setQuestions([]);
      setComplete(false);
      setAnswerCount(0);
      startQuiz();
    }
  }

  const questionElements = questions.map((question) => {
    return (
      <Question
        key={question.id}
        id={question.id}
        question={question}
        selectedAnswer={selectedAnswerHandler}
        complete={complete}
      />
    );
  });

  const intro = (
    <div className="intro">
      <h1>Quizzle</h1>
      <p>Test your knowledge with 5 random quizzes</p>
      <button onClick={startQuiz}>Start Quiz!</button>
    </div>
  );

  return (
    <div className="App">
      {complete && answerCount >= 3 && <Confetti />}
      {!isQuiz && intro}
      <div className="questions">
        {isQuiz && !isLoading && questionElements}
        <div className="buttons">
          {isQuiz && !isLoading && (
            <button className="checkBtn" onClick={checkAnswers}>
              {complete ? "Try again" : "Check answers"}
            </button>
          )}
          {isQuiz && complete && !isLoading && (
            <p className="score">Your score: {answerCount}</p>
          )}
          {isQuiz && !isLoading && !complete && (
            <button className="newquizzes" onClick={getQuestions}>
              New quizzes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
