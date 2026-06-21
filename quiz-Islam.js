import { Question } from "./questionQuiz.js";

const startButton = document.querySelector("#start");   // Bouton "Start" / "Recommencer"
const spaceQuestion = document.querySelector("#spaceQuestion"); // Zone d'affichage de la question courante
const spaceAnwser = document.querySelector("#spaceAnwser");     // Zone d'affichage des réponses proposées
const titreApp = document.querySelector("#titreApp");           // Titre "Islam Quiz" (supprimé au démarrage)

startButton.addEventListener("click", startQuiz);

let currentIndex = 0;   // Index de la question courante dans le tableau Question[]
let score = 0;           // Nombre de réponses correctes accumulées
let answered = false;    // Verrou : empêche le joueur de cliquer plusieurs fois sur une réponse

function startQuiz() {
  if (titreApp) titreApp.remove();   // Retirer le titre "Islam Quiz" de la page
  startButton.style.display = "none"; // Masquer le bouton pendant le quiz
  showQuestion();                     // Afficher la première question
}

function showQuestion() {
  // Réinitialiser le verrou de réponse pour la nouvelle question
  answered = false;

  // --- Afficher le texte de la question courante ---
  spaceQuestion.style.display = "block";
  spaceQuestion.textContent = Question[currentIndex].question;

  // --- Vider la zone de réponses (supprimer les réponses de la question précédente) ---
  spaceAnwser.innerHTML = "";
  spaceAnwser.style.display = "flex";

  for (const answerText of Question[currentIndex].answer) {
    const theAnswers = document.createElement("div");  // Ligne de réponse complète
    const answers = document.createElement("div");     // Texte de la réponse
    const cercle = document.createElement("div");      // Cercle radio externe
    const boule = document.createElement("div");       // Point central du cercle

    // Appliquer les classes CSS correspondantes
    theAnswers.classList.add("theAnwsers");
    answers.classList.add("answers");
    cercle.classList.add("cercle");
    boule.classList.add("boule");

    // Assembler la structure : theAnswers > [answers, cercle > boule]
    cercle.appendChild(boule);
    answers.textContent = answerText;
    theAnswers.appendChild(answers);
    theAnswers.appendChild(cercle);
    spaceAnwser.appendChild(theAnswers);

    // Le cercle radio est caché par défaut (visible au hover ou après sélection)
    cercle.style.display = "none";

    // --- Événement : hover (survol de la souris) ---
    // Affiche le cercle radio au survol, sauf si la réponse a déjà été validée
    theAnswers.addEventListener("mouseover", () => {
      if (!answered) cercle.style.display = "flex";
    });
    // Cache le cercle radio quand la souris quitte la zone
    theAnswers.addEventListener("mouseout", () => {
      cercle.style.display = "none";
    });

    // --- Événement : click (sélection d'une réponse) ---
    // C'est ici que se joue la logique de vérification.
    theAnswers.addEventListener("click", () => {
      // Verrou : ignorer les clics si une réponse a déjà été choisie
      if (answered) return;
      answered = true;

      // "isCorrect" : booléen, true si le texte cliqué correspond à la bonne réponse
      const isCorrect = answerText === Question[currentIndex].correct;

      if (isCorrect) {
        // ---- BONNE RÉPONSE ----
        score++;  // Incrémenter le score
        theAnswers.style.background = "#c8f7c5";        
        theAnswers.style.borderColor = "#27ae60";        
        cercle.style.display = "flex";                    
        cercle.style.borderColor = "#27ae60";           
        boule.style.background = "#27ae60";               
      } else {
        // ---- MAUVAISE RÉPONSE ----
        theAnswers.style.background = "#f7c5c5";         
        theAnswers.style.borderColor = "#e74c3c";        
        cercle.style.display = "flex";                    
        cercle.style.borderColor = "#e74c3c";           
        boule.style.background = "#e74c3c";              

        // Mettre en évidence la BONNE réponse en vert (pour que le joueur apprenne)
        document.querySelectorAll(".theAnwsers").forEach((el) => {
          if (el.querySelector(".answers").textContent === Question[currentIndex].correct) {
            el.style.background = "#c8f7c5";
            el.style.borderColor = "#27ae60";
            const c = el.querySelector(".cercle");
            const b = el.querySelector(".boule");
            if (c) { c.style.display = "flex"; c.style.borderColor = "#27ae60"; }
            if (b) b.style.background = "#27ae60";
          }
        });
      }

      // --- Transition automatique vers la question suivante ---
      // Après 1.2 secondes, passer à la question suivante ou afficher le résultat final.
      // "currentIndex" : index de la question courante, incrémenté ici.
      setTimeout(() => {
        currentIndex++;
        if (currentIndex >= Question.length) {
          showResult();      // Toutes les questions ont été posées → afficher le score
        } else {
          showQuestion();    // Sinon → afficher la question suivante
        }
      }, 1200);
    });
  }
}

function showResult() {
  // Vider les zones de question et de réponse
  spaceQuestion.textContent = "";
  spaceAnwser.innerHTML = "";

  // --- Créer le conteneur de résultat ---
  const resultDiv = document.createElement("div");
  resultDiv.classList.add("result-container");

  // --- Titre "Quiz terminé !" ---
  const titleResult = document.createElement("h2");
  titleResult.textContent = "Quiz terminé !";
  titleResult.style.textAlign = "center";
  titleResult.style.marginBottom = "15px";
  titleResult.style.color = "#007F50";

  // --- Affichage du score (ex: "Score : 8 / 10") ---
  const scoreResult = document.createElement("p");
  scoreResult.textContent = `Score : ${score} / ${Question.length}`;
  scoreResult.style.fontSize = "1.8em";
  scoreResult.style.fontWeight = "700";
  scoreResult.style.textAlign = "center";

  // --- Calcul du pourcentage de réussite ---
  // "pourcentage" : score exprimé en % (ex: 8/10 = 80)
  const pourcentage = Math.round((score / Question.length) * 100);

  // --- Message de feedback selon le pourcentage ---
  const messageResult = document.createElement("p");
  messageResult.style.textAlign = "center";
  messageResult.style.fontSize = "1.1em";
  messageResult.style.marginTop = "10px";

  if (pourcentage === 100) {
    messageResult.textContent = "Parfait ! MashaAllah !";
  } else if (pourcentage >= 50) {
    messageResult.textContent = "Bien joué, continuez à apprendre !";
  } else {
    messageResult.textContent = "Continuez à étudier, vous pouvez faire mieux !";
  }

  // --- Assembler et injecter le résultat dans le DOM ---
  resultDiv.appendChild(titleResult);
  resultDiv.appendChild(scoreResult);
  resultDiv.appendChild(messageResult);
  spaceAnwser.appendChild(resultDiv);
  spaceAnwser.style.display = "flex";

  // --- Afficher le bouton "Recommencer" ---
  startButton.textContent = "Recommencer";
  startButton.style.display = "block";
  startButton.onclick = restartQuiz;  // Attacher la fonction de redémarrage
}


function restartQuiz() {
  currentIndex = 0;    // Revenir à la première question
  score = 0;           // Remettre le score à zéro
  answered = false;    // Déverrouiller les réponses

  startButton.textContent = "Start";          // Restaurer le texte du bouton
  startButton.onclick = null;                 // Supprimer l'ancien handler
  startButton.addEventListener("click", startQuiz); // Réattacher le handler Start
  showQuestion();                             // Afficher la première question
}
