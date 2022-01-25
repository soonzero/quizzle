import React from "react";
import { decode } from "html-entities";

export default function Question(props) {
  const [chosenAnswer, setChosenAnswer] = React.useState("");

  const answerElements = props.question.answers.map((answer) => {
    const styles = {
      backgroundColor: "",
    };

    if (answer === chosenAnswer && !props.complete) {
      styles.backgroundColor = "#D6DBF5";
    } else if (answer === props.question.correct && props.complete) {
      styles.backgroundColor = "#94d7a2";
    } else if (
      answer === chosenAnswer &&
      chosenAnswer !== props.question.correct &&
      props.complete
    ) {
      styles.backgroundColor = "#F8BCBC";
    }

    function chooseAnswer(answer) {
      setChosenAnswer(answer);
      props.selectedAnswer(props.id, answer);
    }

    return (
      <button
        className="answer-btn"
        style={styles}
        onClick={() => chooseAnswer(answer)}
      >
        {decode(answer)}
      </button>
    );
  });
  return (
    <div className="question">
      <h2>{decode(props.question.question)}</h2>
      <p>{answerElements}</p>
    </div>
  );
}
