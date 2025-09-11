const TYRA_BASE = "https://tyradex.vercel.app/api/v1/pokemon/";
const MAX_ID = 1025;

let state = {
  index: 0,
  score: 0,
  startTime: null,
  current: null,
  timerInterval: null
};

function startQuiz(){
  state.index = 0;
  state.score = 0;
  state.startTime = Date.now();
  startTimer();
  showView('quiz');
  nextQuestion();
}

function startTimer(){
  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(()=>{
    const s = Math.floor((Date.now()-state.startTime)/1000);
    $('timer').innerText = formatTime(s);
  },1000);
}

function formatTime(sec){
  const m = String(Math.floor(sec/60)).padStart(2,'0');
  const s = String(sec%60).padStart(2,'0');
  return `${m}:${s}`;
}

async function nextQuestion(){
  state.index++;
  if(state.index>10){
    clearInterval(state.timerInterval);
    $('scoreOut').innerText = state.score;
    showView('result');
    return;
  }
  $('qIndex').innerText = `${state.index}/10`;
  $('answerInput').value="";
  $('feedback').innerText="";
  const id = Math.floor(Math.random()*MAX_ID)+1;

  try{
    const resp = await fetch(TYRA_BASE+id);
    const json = await resp.json();
    const name = json.name.fr.toLowerCase(); 
    const img = json.sprites.regular;
    state.current = name;
    drawGray(img);
  }catch(e){
    console.error(e);
    nextQuestion();
  }
}

function submitAnswer(){
  const guess = $('answerInput').value.trim().toLowerCase();
  if(!guess) return;
  if(guess===state.current){
    state.score++;
    $('feedback').innerText=`Bravo ! C'était ${state.current}`;
  }else{
    $('feedback').innerText=`Mauvais ! C'était ${state.current}`;
  }
  setTimeout(nextQuestion,1000);
}
