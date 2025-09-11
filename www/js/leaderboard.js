async function saveScore(){
  const name = $('playerName').value.trim();
  if(!name){ alert("Entrez un nom"); return; }
  const time = Math.floor((Date.now()-state.startTime)/1000);
  const entry = { name, score: state.score, time, date:new Date().toISOString() };

  let scores = await readScores();
  scores.push(entry);
  scores.sort((a,b)=> (b.score-a.score)||(a.time-b.time));
  await writeScores(scores);
  showLeaderboard();
}

async function showLeaderboard(){
  const scores=await readScores();
  const top=scores.slice(0,5);
  const ol=$('topList');
  ol.innerHTML="";
  top.forEach(s=>{
    const li=document.createElement('li');
    li.textContent=`${s.name} - ${s.score}/10 - ${formatTime(s.time)}`;
    ol.appendChild(li);
  });
  showView('leaderboard');
}
