const FILE_NAME = "scores.json";

function getDataDir(){
  if(window.cordova?.file?.dataDirectory){
    return cordova.file.dataDirectory;
  }
  return null;
}

function readScores(){
  return new Promise((resolve)=>{
    const dir=getDataDir();
    if(!dir){
      const raw=localStorage.getItem(FILE_NAME);
      resolve(raw?JSON.parse(raw):[]);
      return;
    }
    window.resolveLocalFileSystemURL(dir, dirEntry=>{
      dirEntry.getFile(FILE_NAME,{create:false},fe=>{
        fe.file(f=>{
          const r=new FileReader();
          r.onloadend=()=>resolve(JSON.parse(r.result||"[]"));
          r.readAsText(f);
        });
      },()=>resolve([]));
    });
  });
}

function writeScores(scores){
  return new Promise((resolve,reject)=>{
    const dir=getDataDir();
    if(!dir){
      localStorage.setItem(FILE_NAME,JSON.stringify(scores));
      resolve(); return;
    }
    window.resolveLocalFileSystemURL(dir, dirEntry=>{
      dirEntry.getFile(FILE_NAME,{create:true},fe=>{
        fe.createWriter(w=>{
          w.onwriteend=()=>resolve();
          w.onerror=e=>reject(e);
          const blob=new Blob([JSON.stringify(scores)],{type:"application/json"});
          w.write(blob);
        });
      });
    });
  });
}
