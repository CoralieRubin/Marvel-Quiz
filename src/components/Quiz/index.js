import React, { Component, Fragment } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";
import { QuizMarvel } from "../QuizMarvel ";
import QuizOver from "../QuizOver";
import { FaChevronRight } from "react-icons/fa";

toast.configure();

const initialState = {
  levelNames: ["debutant", "confirme", "expert"],
  quizLevel: 0,
  maxQuestions: 10,
  storedQuestion: [],
  question: null,
  options: [],
  idQuestion: 0,
  btnDisabled: true,
  userAnswer: null,
  score: 0,
  showWelcomeMsg: false,
  quizEnd: false,
  percent: null,
};

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
    this.storedDataRef = React.createRef();
  }

  loadQuestion = (quizz) => {
    const fetchedArrayQuiz = QuizMarvel[0].quizz[quizz];
    if (fetchedArrayQuiz.length >= this.state.maxQuestions) {
      this.storedDataRef.current = fetchedArrayQuiz;

      const newArray = fetchedArrayQuiz.map(
        ({ answer, ...keepRest }) => keepRest
      );
      this.setState({
        storedQuestion: newArray,
      });
    }
  };

  showToastMsg = (pseudo) => {
    if (!this.state.showWelcomeMsg) {
      this.setState({
        showWelcomeMsg: true,
      });
      toast.warn(`Bienvenue ${pseudo}, et bonne chance!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        bodyClassName: "toastify-color-welcome",
      });
    }
  };
  componentDidMount() {
    this.loadQuestion(this.state.levelNames[this.state.quizLevel]);
  }

  nextQuestion = () => {
    if (this.state.idQuestion === this.state.maxQuestions - 1) {
      this.setState({
        quizEnd: true,
      });
    } else {
      this.setState((prevState) => ({ idQuestion: prevState.idQuestion + 1 }));
    }

    const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
    if (this.state.userAnswer === goodAnswer) {
      this.setState((prevState) => ({ score: prevState.score + 1 }));

      toast.success("Bravo +1", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        bodyClassName: "toastify-color",
      });
    } else {
      toast.error("Raté 0", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        bodyClassName: "toastify-color",
      });
    }
  };
  componentDidUpdate(PrevProps, prevState) {
    const {
      maxQuestions,
      storedQuestion,
      idQuestion,
      score,
      quizEnd,
    } = this.state;

    if (storedQuestion !== prevState.storedQuestion && storedQuestion.length) {
      this.setState({
        question: storedQuestion[idQuestion].question,
        options: storedQuestion[idQuestion].options,
      });
    }

    if (idQuestion !== prevState.idQuestion && storedQuestion.length) {
      this.setState({
        question: storedQuestion[idQuestion].question,
        options: storedQuestion[idQuestion].options,
        userAnswer: null,
        btnDisabled: true,
      });
    }

    if (quizEnd !== prevState.quizEnd) {
      const gradePercent = this.getPercentage(maxQuestions, score);
      this.gameOver(gradePercent);
    }

    if (this.props.userData.pseudo !== PrevProps.userData.pseudo) {
      this.showToastMsg(this.props.userData.pseudo);
    }
  }

  submitAnswer = (selectedAnswer) => {
    this.setState({
      userAnswer: selectedAnswer,
      btnDisabled: false,
    });
  };

  getPercentage = (maxquest, ourScore) => (ourScore / maxquest) * 100;

  gameOver = (percent) => {
    if (percent >= 50) {
      this.setState({
        quizLevel: this.state.quizLevel + 1,
        percent: percent,
      });
    } else {
      this.setState({
        percent: percent,
      });
    }
  };

  loadLevelQuestion = (param) => {
    this.setState({
      ...initialState,
      quizLevel: param,
    });
    this.loadQuestion(this.state.levelNames[param]);
  };

  render() {
    const {
      levelNames,
      quizLevel,
      maxQuestions,
      question,
      options,
      idQuestion,
      btnDisabled,
      userAnswer,
      score,
      quizEnd,
      percent,
    } = this.state;

    const displayOptions = options.map((option, index) => {
      return (
        <p
          key={index}
          className={`answerOptions ${
            userAnswer === option ? "selected" : null
          }`}
          onClick={() => this.submitAnswer(option)}
        >
          <FaChevronRight /> {option}
        </p>
      );
    });

    return quizEnd ? (
      <QuizOver
        ref={this.storedDataRef}
        levelNames={levelNames}
        score={score}
        maxQuestion={maxQuestions}
        quizLevel={quizLevel}
        percent={percent}
        loadLevelQuestion={this.loadLevelQuestion}
      />
    ) : (
      <Fragment>
        <Levels levelNames={levelNames} quizLevel={quizLevel} />
        <ProgressBar idQuestion={idQuestion} maxQuestions={maxQuestions} />
        <h2>{question}</h2>
        {displayOptions}
        <button
          onClick={this.nextQuestion}
          disabled={btnDisabled}
          className="btnSubmit"
        >
          {idQuestion < maxQuestions - 1 ? "Suivant" : "Terminer"}
        </button>
      </Fragment>
    );
  }
}

export default Quiz;
