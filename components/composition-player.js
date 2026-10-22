const params=new URLSearchParams(location.search),id=params.get('composition')||'scan-ai-product';
const allowed=new Set(['scan-ai-product','scan-ai-clarity']);
if(!allowed.has(id))throw new Error('Unknown composition');
if(params.has('render'))document.body.classList.add('render');
window.filmReady=(async()=>{
 const [config,module]=await Promise.all([fetch(`compositions/${id}.json`).then(r=>{if(!r.ok)throw new Error('Composition missing');return r.json();}),import(`../compositions/${id}.js`)]);
 await Promise.all([document.fonts.load('800 110px Montserrat'),document.fonts.load('600 40px Montserrat'),document.fonts.load('600 40px RobotoMono'),document.fonts.ready]);
 const film=await module.createComposition(document.getElementById('film'),config);
 window.render=film.render;window.film=film;window.filmConfig=config;document.querySelector('h1').textContent=config.title;document.title=config.title;window.DURATION=config.duration;film.render(0);
 document.getElementById('download').href=config.output;const audio=document.getElementById('voice'),play=document.getElementById('play'),seek=document.getElementById('seek');audio.src=config.audio;seek.max=config.duration;let playing=false,position=0,started=0;
 const now=()=>playing?Math.min(config.duration,position+(performance.now()-started)/1000):position;
 play.onclick=async()=>{if(playing){position=now();audio.pause();playing=false;play.textContent='Продолжить';return;}if(position>=config.duration-.01)position=0;audio.currentTime=Math.min(position,config.audioDuration-.001);try{if(position<config.audioDuration)await audio.play();started=performance.now();playing=true;play.textContent='Пауза';}catch{play.textContent='Нажмите для воспроизведения';}};
 seek.oninput=()=>{position=Number(seek.value);started=performance.now();audio.currentTime=Math.min(position,config.audioDuration-.001);if(position>=config.audioDuration)audio.pause();else if(playing)audio.play();film.render(position);};
 const format=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0');
 function tick(){if(playing){const t=now();film.render(t);seek.value=t;document.getElementById('time').textContent=`${format(t)} / ${format(config.duration)}`;if(t>=config.duration){position=config.duration;playing=false;audio.pause();play.textContent='Посмотреть ещё раз';}}requestAnimationFrame(tick);}if(!params.has('render'))tick();return true;
})();
