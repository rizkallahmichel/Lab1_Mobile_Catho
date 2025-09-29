
document.addEventListener('deviceready', init, false);
if (!window.cordova) window.addEventListener('load', init);

function $(id){ return document.getElementById(id); }

function init(){
  $('startQuizBtn').onclick = startQuiz;
  $('leaderboardBtn').onclick = showLeaderboard;
  $('submitAnswerBtn').onclick = submitAnswer;
  $('saveScoreBtn').onclick = saveScore;
}

function showView(name){
  document.querySelectorAll('.view').forEach(v => v.style.display="none");
  $(name).style.display = "block";
}
