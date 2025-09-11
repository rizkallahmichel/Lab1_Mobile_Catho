function drawGray(url){
  const canvas = $('pokeCanvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin="anonymous";
  img.onload = ()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    try{
      let data = ctx.getImageData(0,0,canvas.width,canvas.height);
      let d = data.data;
      for(let i=0;i<d.length;i+=4){
        let gray = 0.3*d[i]+0.59*d[i+1]+0.11*d[i+2];
        d[i]=d[i+1]=d[i+2]=gray;
      }
      ctx.putImageData(data,0,0);
    }catch(err){
      console.log("CORS fallback");
      ctx.filter="grayscale(100%)";
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      ctx.filter="none";
    }
  };
  img.src=url;
}
