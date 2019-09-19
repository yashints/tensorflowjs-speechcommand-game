import * as tf from "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";

import { startGame, moveup, movedown, clearmove } from './main';

const recognizer = speechCommands.create("BROWSER_FFT", 'directional4w');

(async function() {
  await recognizer.ensureModelLoaded();

  console.log(recognizer.wordLabels());

  startGame();
})();

const suppressionTimeMillis = 1000;
const allowedCommands = ['up', 'down'];

recognizer
  .listen(
    result => {
      checkPredictions(recognizer.wordLabels(), result.scores,
      3, suppressionTimeMillis);
    },
    {
      includeSpectrogram: true,
      suppressionTimeMillis,
      probabilityThreshold: 0.8
    }
  )
  .then(() => {
    console.log("Streaming recognition started.");
  })
  .catch(err => {
    console.log("ERROR: Failed to start streaming display: " + err.message);
  });

const checkPredictions = (
  candidateWords,
  probabilities,
  topK,
  timeToLiveMillis
) => {
  if (topK != null) {
    let wordsAndProbs = [];
    for (let i = 0; i < candidateWords.length; ++i) {
      wordsAndProbs.push([candidateWords[i], probabilities[i]]);
    }
    wordsAndProbs.sort((a, b) => b[1] - a[1]);
    wordsAndProbs = wordsAndProbs.slice(0, topK);
    candidateWords = wordsAndProbs.map(item => item[0]);
    probabilities = wordsAndProbs.map(item => item[1]);
    console.log(wordsAndProbs);
    // Highlight the top word.
    const topWord = wordsAndProbs[0][0];
    if(allowedCommands.includes(topWord)) {
      if(topWord === 'up') {
        moveup();
        setTimeout(() => clearmove(), 850);
        console.log('up');
      } else {
        movedown();
        setTimeout(() => clearmove(), 850);
        console.log('down');
      }
    }
    
  }
}
