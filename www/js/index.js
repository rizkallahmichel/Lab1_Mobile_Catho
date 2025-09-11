// document.addEventListener('deviceready', init, false);
// // Pour tests dans navigateur
// if (!window.cordova) window.addEventListener('load', init);

// function $(id){ return document.getElementById(id); }

// function init(){
//   $('countryBtn').onclick = () => showView('country');
//   $('searchCountryBtn').onclick = searchCountry;
// }

// function showView(name){
//   document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
//   $(name).style.display = 'block';
// }

// async function searchCountry(){
//   const name = $('countryInput').value.trim();
//   if (!name){ alert("Entrez un nom de pays"); return; }

//   const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`;
//   try {
//     const resp = await fetch(url);
//     if (!resp.ok) throw new Error("Pays non trouvé");
//     const data = await resp.json();
//     const c = data[0];

//     $('countryResult').innerHTML = `
//       <h3>${c.name.common}</h3>
//       <p><b>Capitale :</b> ${c.capital ? c.capital[0] : "N/A"}</p>
//       <p><b>Population :</b> ${c.population.toLocaleString()}</p>
//       <img src="${c.flags.png}" alt="Drapeau"/>
//     `;
//   } catch(err){
//     $('countryResult').innerHTML = `<p style="color:red">Erreur: ${err.message}</p>`;
//   }
// }


// document.addEventListener('deviceready', init, false);
// if (!window.cordova) window.addEventListener('load', init);

// const TYRA_BASE = "https://tyradex.vercel.app/api/v1/pokemon/";
// const MAX_ID = 1025;
// const FILE_NAME = "scores.json";

// let state = {
//   index: 0,
//   score: 0,
//   startTime: null,
//   current: null,
//   timerInterval: null
// };

// function $(id){ return document.getElementById(id); }

// function init(){
//   $('startQuizBtn').onclick = startQuiz;
//   $('leaderboardBtn').onclick = showLeaderboard;
//   $('submitAnswerBtn').onclick = submitAnswer;
//   $('saveScoreBtn').onclick = saveScore;
// }

// function showView(name){
//   document.querySelectorAll('.view').forEach(v => v.style.display="none");
//   $(name).style.display = "block";
// }

// /* ---------- Quiz ---------- */
// function startQuiz(){
//   state.index = 0;
//   state.score = 0;
//   state.startTime = Date.now();
//   startTimer();
//   showView('quiz');
//   nextQuestion();
// }

// function startTimer(){
//   clearInterval(state.timerInterval);
//   state.timerInterval = setInterval(()=>{
//     const s = Math.floor((Date.now()-state.startTime)/1000);
//     $('timer').innerText = formatTime(s);
//   },1000);
// }

// function formatTime(sec){
//   const m = String(Math.floor(sec/60)).padStart(2,'0');
//   const s = String(sec%60).padStart(2,'0');
//   return `${m}:${s}`;
// }

// async function nextQuestion(){
//   state.index++;
//   if(state.index>10){
//     clearInterval(state.timerInterval);
//     $('scoreOut').innerText = state.score;
//     showView('result');
//     return;
//   }
//   $('qIndex').innerText = `${state.index}/10`;
//   $('answerInput').value="";
//   $('feedback').innerText="";
//   const id = Math.floor(Math.random()*MAX_ID)+1;

//   try{
//     const resp = await fetch(TYRA_BASE+id);
//     const json = await resp.json();
//     const name = json.name.fr.toLowerCase(); 
//     const img = json.sprites.regular;
//     state.current = name;
//     drawGray(img);
//   }catch(e){
//     console.error(e);
//     nextQuestion();
//   }
// }

// function drawGray(url){
//   const canvas = $('pokeCanvas');
//   const ctx = canvas.getContext('2d');
//   const img = new Image();
//   img.crossOrigin="anonymous";
//   img.onload = ()=>{
//     ctx.clearRect(0,0,canvas.width,canvas.height);
//     ctx.drawImage(img,0,0,canvas.width,canvas.height);
//     try{
//       let data = ctx.getImageData(0,0,canvas.width,canvas.height);
//       let d = data.data;
//       for(let i=0;i<d.length;i+=4){
//         let gray = 0.3*d[i]+0.59*d[i+1]+0.11*d[i+2];
//         d[i]=d[i+1]=d[i+2]=gray;
//       }
//       ctx.putImageData(data,0,0);
//     }catch(err){
//       console.log("CORS fallback");
//       ctx.filter="grayscale(100%)";
//       ctx.drawImage(img,0,0,canvas.width,canvas.height);
//       ctx.filter="none";
//     }
//   };
//   img.src=url;
// }

// function submitAnswer(){
//   const guess = $('answerInput').value.trim().toLowerCase();
//   if(!guess) return;
//   if(guess===state.current){
//     state.score++;
//     $('feedback').innerText=`Bravo ! C'était ${state.current}`;
//   }else{
//     $('feedback').innerText=`Mauvais ! C'était ${state.current}`;
//   }
//   setTimeout(nextQuestion,1000);
// }

// /* ---------- Sauvegarde scores ---------- */
// async function saveScore(){
//   const name = $('playerName').value.trim();
//   if(!name){ alert("Entrez un nom"); return; }
//   const time = Math.floor((Date.now()-state.startTime)/1000);
//   const entry = { name, score: state.score, time, date:new Date().toISOString() };

//   let scores = await readScores();
//   scores.push(entry);
//   scores.sort((a,b)=> (b.score-a.score)||(a.time-b.time));
//   await writeScores(scores);
//   showLeaderboard();
// }

// function getDataDir(){
//   if(window.cordova?.file?.dataDirectory){
//     return cordova.file.dataDirectory;
//   }
//   return null;
// }

// function readScores(){
//   return new Promise((resolve)=>{
//     const dir=getDataDir();
//     if(!dir){
//       const raw=localStorage.getItem(FILE_NAME);
//       resolve(raw?JSON.parse(raw):[]);
//       return;
//     }
//     window.resolveLocalFileSystemURL(dir, dirEntry=>{
//       dirEntry.getFile(FILE_NAME,{create:false},fe=>{
//         fe.file(f=>{
//           const r=new FileReader();
//           r.onloadend=()=>resolve(JSON.parse(r.result||"[]"));
//           r.readAsText(f);
//         });
//       },()=>resolve([]));
//     });
//   });
// }

// function writeScores(scores){
//   return new Promise((resolve,reject)=>{
//     const dir=getDataDir();
//     if(!dir){
//       localStorage.setItem(FILE_NAME,JSON.stringify(scores));
//       resolve(); return;
//     }
//     window.resolveLocalFileSystemURL(dir, dirEntry=>{
//       dirEntry.getFile(FILE_NAME,{create:true},fe=>{
//         fe.createWriter(w=>{
//           w.onwriteend=()=>resolve();
//           w.onerror=e=>reject(e);
//           const blob=new Blob([JSON.stringify(scores)],{type:"application/json"});
//           w.write(blob);
//         });
//       });
//     });
//   });
// }

// /* ---------- Leaderboard ---------- */
// async function showLeaderboard(){
//   const scores=await readScores();
//   const top=scores.slice(0,5);
//   const ol=$('topList');
//   ol.innerHTML="";
//   top.forEach(s=>{
//     const li=document.createElement('li');
//     li.textContent=`${s.name} - ${s.score}/10 - ${formatTime(s.time)}`;
//     ol.appendChild(li);
//   });
//   showView('leaderboard');
// }



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
