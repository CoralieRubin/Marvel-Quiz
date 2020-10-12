import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { GiTrophyCup } from "react-icons/gi";
import Loader from "../Loader";
import Modal from "../Modal";

const QuizOver = React.forwardRef((props, ref) => {
  const {
    levelNames,
    score,
    maxQuestion,
    quizLevel,
    percent,
    loadLevelQuestion,
  } = props;

  const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;

  const hash = "0b377a7a2e4d514d3d3b9cd624d50c4e";

  const [asked, setAsked] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [charactersInfo, setCharactersInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAsked(ref.current);

    if (localStorage.getItem("marvelStorageDate")) {
      const date = localStorage.getItem("marvelStorageDate");
      checkDataAge(date);
    }
  }, [ref]);

  const checkDataAge = (date) => {
    const today = Date.now();
    const timeDifference = today - date;

    const daysDifference = timeDifference / (1000 * 3600 * 24);

    if (daysDifference >= 15) {
      localStorage.clear();
      localStorage.setItem("marvelStorageDate", Date.now());
    }
  };

  const showModal = (id) => {
    setOpenModal(true);

    if (localStorage.getItem(id)) {
      setCharactersInfo(JSON.parse(localStorage.getItem(id)));
      setLoading(false);
    } else {
      axios
        .get(
          `https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`
        )
        .then((response) => {
          setCharactersInfo(response.data);
          setLoading(false);

          localStorage.setItem(id, JSON.stringify(response.data));
          if (!localStorage.getItem("marvelStorageDate")) {
            localStorage.setItem("marvelStorageDate", Date.now());
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const hideModal = () => {
    setOpenModal(false);
    setLoading(true);
  };
  const capitalizedFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const averageGrade = maxQuestion / 2;

  if (score < averageGrade) {
    setTimeout(() => {
      loadLevelQuestion(quizLevel);
    }, 3000);
  }

  const decision =
    score >= averageGrade ? (
      <Fragment>
        <div className="stepsBtnContainer">
          {quizLevel < levelNames.length ? (
            <Fragment>
              <p className="successMsg">Bravo, passez au niveau suivant</p>
              <button
                className="btnResult success"
                onClick={() => loadLevelQuestion(quizLevel)}
              >
                Niveau suivant
              </button>
            </Fragment>
          ) : (
            <Fragment>
              <p className="successMsg">
                {" "}
                <GiTrophyCup size="50px" /> Bravo vous êtes un expert
              </p>
              <button
                className="btnResult gameOver"
                onClick={() => loadLevelQuestion(0)}
              >
                Accueil
              </button>
            </Fragment>
          )}
        </div>
        <div className="percentage">
          <div className="progressPercent">Réussite : {percent} %</div>
          <div className="progressPercent">
            note : {score}/{maxQuestion}
          </div>
        </div>
      </Fragment>
    ) : (
      <Fragment>
        <div className="stepsBtnContainer">
          <p className="failureMsg">Vous avez échoué !</p>
        </div>
        <div className="percentage">
          <div className="progressPercent">Réussite : {percent} %</div>
          <div className="progressPercent">
            note : {score}/{maxQuestion}
          </div>
        </div>
      </Fragment>
    );

  const questionAnswer =
    score >= averageGrade ? (
      asked.map((question) => {
        return (
          <tr key={question.id}>
            <td>{question.question}</td>
            <td>{question.answer}</td>
            <button
              className="btnInfo"
              onClick={() => showModal(question.heroId)}
            >
              Info
            </button>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="3">
          <Loader
            loadingMsg={"Pas de réponse"}
            styling={{ textAlign: "center", color: "red" }}
          />
        </td>
      </tr>
    );

  const resultInModal = !loading ? (
    <Fragment>
      <div className="modalHeader">
        <h2>{charactersInfo.data.results[0].name}</h2>
      </div>
      <div className="modalBody">
        <div className="comicImage">
          <img
            src={
              charactersInfo.data.results[0].thumbnail.path +
              "." +
              charactersInfo.data.results[0].thumbnail.extension
            }
            alt={charactersInfo.data.results[0].name}
          />
          {charactersInfo.attributionText}
        </div>
        <div className="comicDetails">
          <h3>Description</h3>
          {charactersInfo.data.results[0].description ? (
            <p>{charactersInfo.data.results[0].description}</p>
          ) : (
            <p>Description indisponible ...</p>
          )}
          <h3>+ d'infos</h3>
          {charactersInfo.data.results[0].urls &&
            charactersInfo.data.results[0].urls.map((url, index) => {
              return (
                <a
                  key={index}
                  href={url.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {capitalizedFirstLetter(url.type)}
                </a>
              );
            })}
          <button></button>
        </div>
      </div>
      <div className="modalFooter" onClick={hideModal}>
        <button className="modalBtn">Fermer</button>
      </div>
    </Fragment>
  ) : (
    <Fragment>
      <div className="modalHeader">
        <h2>En attente des données Marvel</h2>
      </div>
      <div className="modalBody">
        <Loader
          loadingMsg={"Pas de réponse"}
          styling={{ textAlign: "center", color: "red" }}
        />
      </div>
    </Fragment>
  );
  return (
    <Fragment>
      {decision}
      <hr />
      <p>Les réponses aux questions posées</p>

      <div className="answerContainer">
        <table className="answers">
          <thead>
            <tr>
              <th>Question</th>
              <th>réponse</th>
              <th>infos</th>
            </tr>
          </thead>
          <tbody>{questionAnswer}</tbody>
        </table>
      </div>

      <Modal showModal={openModal} hideModal={hideModal}>
        {resultInModal}
      </Modal>
    </Fragment>
  );
});

export default React.memo(QuizOver);
