/* Hester logo loader. Original transparent PNG assets; one continuous RAF timeline.
   Integration: await HesterLoader.play(); the promise resolves at the completed logo.
   Listen for `hester:ready` to reveal the website. No artificial loading percentage. */
(()=>{'use strict';
const canvas=document.getElementById('logo'),ctx=canvas.getContext('2d'),status=document.getElementById('status'),bar=document.getElementById('bar');
const W=1254,DURATION=14.2, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const entries=Object.entries(HESTER_ASSETS), layers={}, neutral={},particles=[];
let start=0,elapsed=0,paused=false,raf=0,resolvePlay=null,last=-1;
const clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,t)=>a+(b-a)*t;
const ease=t=>{t=clamp(t);return t*t*(3-2*t)};
const out=t=>1-Math.pow(1-clamp(t),3),part=(t,a,b)=>clamp((t-a)/(b-a));
const bounce=t=>{t=clamp(t);return 1-Math.exp(-7*t)*Math.cos(9*t)};
function path(t,keys){if(t<=keys[0][0])return keys[0].slice(1);for(let i=1;i<keys.length;i++){if(t<=keys[i][0]){const u=ease((t-keys[i-1][0])/(keys[i][0]-keys[i-1][0]));return keys[i].slice(1).map((v,k)=>mix(keys[i-1][k+1],v,u))}}return keys.at(-1).slice(1)}
function draw(name,{x=0,y=0,rotation=0,scale=1,flip=1,opacity=1,grey=false,pivot=null}={}){const b=HESTER_ASSETS[name],img=grey?neutral[name]:layers[name];if(!img||opacity<=0)return;const p=pivot||[b.w/2,b.h/2];ctx.save();ctx.globalAlpha=opacity;ctx.translate(b.x+p[0]+x,b.y+p[1]+y);ctx.rotate(rotation);ctx.scale(scale*flip,scale);ctx.drawImage(img,-p[0],-p[1],b.w,b.h);ctx.restore()}
function ink(name,t,band){draw(name,{grey:true});const p=part(t,band[0],band[1]);if(p){ctx.save();ctx.beginPath();ctx.rect(110,0,1040*p,1254);ctx.clip();draw(name);ctx.restore()}}
const paintCanvas=document.createElement('canvas');paintCanvas.width=paintCanvas.height=1254;const pc=paintCanvas.getContext('2d');
function painted(name,t,keys,width){if(t<keys[0][0])return;const b=HESTER_ASSETS[name];pc.clearRect(0,0,1254,1254);pc.globalCompositeOperation='source-over';pc.drawImage(layers[name],b.x,b.y,b.w,b.h);pc.globalCompositeOperation='destination-in';pc.lineWidth=width;pc.lineJoin=pc.lineCap='round';pc.strokeStyle='#000';pc.beginPath();pc.moveTo(keys[0][1],keys[0][2]);for(let i=1;i<keys.length;i++){if(t>=keys[i][0])pc.lineTo(keys[i][1],keys[i][2]);else{const u=ease(part(t,keys[i-1][0],keys[i][0]));pc.lineTo(mix(keys[i-1][1],keys[i][1],u),mix(keys[i-1][2],keys[i][2],u));break}}pc.stroke();ctx.drawImage(paintCanvas,0,0);if(t>keys.at(-1)[0])draw(name,{opacity:ease(part(t,keys.at(-1)[0],keys.at(-1)[0]+.24))})}
const redPaint=[[6.6,280,675],[6.75,280,535],[6.9,205,540],[7.2,546,190],[7.5,811,432]];
const darkPaint=[[7.85,760,320],[8.15,1075,560],[8.25,990,555],[8.4,990,675]];
function spark(x,y,t,at){const q=part(t,at,at+.42);if(t<at||q>=1)return;ctx.save();ctx.globalAlpha=1-q;ctx.strokeStyle='#ad7e45';ctx.lineWidth=3;for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*(8+q*18),y+Math.sin(a)*(8+q*18));ctx.lineTo(x+Math.cos(a)*(15+q*29),y+Math.sin(a)*(15+q*29));ctx.stroke()}ctx.restore()}
function render(t){ctx.setTransform(canvas.width/(W+180),0,0,canvas.height/(W+180),canvas.width*90/(W+180),canvas.height*90/(W+180));ctx.clearRect(-90,-90,W+180,W+180);
// Border is built as a single continuous stroke; paint follows later.
ctx.save();ctx.beginPath();ctx.moveTo(627,627);ctx.arc(627,627,900,-Math.PI/2,-Math.PI/2+Math.PI*2*part(t,.2,3.7));ctx.closePath();ctx.clip();draw('border',{grey:true});ctx.restore();
if(t>4.15){ctx.save();ctx.beginPath();ctx.moveTo(627,627);ctx.arc(627,627,900,-Math.PI/2,-Math.PI/2+Math.PI*2*part(t,4.15,6.35));ctx.closePath();ctx.clip();draw('border');ctx.restore()}
const build=[['foundation',.2,1.1,0,55],['roof-red',.45,1.7,-90,-95],['roof-dark',1.1,2.3,100,-100],['chimney',1.9,2.7,0,-75],['windows',2.3,3.05,0,55]];
for(const [n,a,b,x,y]of build){const p=out(part(t,a,b));if(!p)continue;draw(n,{x:x*(1-p),y:y*(1-p),opacity:p,grey:true});if(n==='roof-red')painted(n,t,redPaint,112);if(n==='roof-dark')painted(n,t,darkPaint,122);if(n==='chimney')painted(n,t,[[7.6,870,300],[7.78,870,350]],92);if(n==='windows')painted(n,t,[[8.48,515,335],[8.58,570,390]],100);if(n==='foundation'&&t>=9.4)draw(n)}
const letters=['H','E1','S','T','E2','R'];
letters.forEach((n,i)=>{const p=part(t,1.5+i*.15,2.55+i*.15);if(!p)return;let y=(1-bounce(p))*45,rotation=0;
if(n==='R'){rotation=.17*ease(part(t,10.5,11.0))*(1-ease(part(t,12.05,12.38)));y+=14*ease(part(t,10.5,11.0))*(1-ease(part(t,12.05,12.38)))}
draw(n,{y,rotation,opacity:ease(p),grey:true,pivot:[30,130]});if(t>=9.55){ctx.save();ctx.beginPath();ctx.rect(110,0,1040*ease(part(t,9.55,10.6)),1254);ctx.clip();draw(n,{y,rotation,pivot:[30,130]});ctx.restore()}});
for(const [n,a]of [['services',3.15],['tagline',3.35]]){const p=ease(part(t,a,a+.7));draw(n,{y:20*(1-p),opacity:p,grey:true});if(t>10.8){ctx.save();ctx.beginPath();ctx.rect(1150-1040*ease(part(t,10.8,11.25)),0,1040,1254);ctx.clip();draw(n);ctx.restore()}}
// Tools occupy their original silhouettes between actions, so the completed mark
// is reconstructed from the supplied image rather than an approximation.
if(t>=3.35){const p=ease(part(t,3.35,4.05));draw('spanner',{y:70*(1-p),opacity:p,grey:t<9.4});}
if(t>=3.65&&t<11.2){const p=ease(part(t,3.65,4.2));draw('drill',{y:75*(1-p),opacity:p,grey:t<9.4});}
// Hammer: anticipation, three distinct strikes, follow-through and curved return.
let hp=path(t,[[0,-490,170,-.8,0],[.55,-80,-175,-.6,1],[1.15,-55,-165,-.15,1],[2.0,280,-120,-.45,1],[2.6,265,-95,.1,1],[3.5,45,-55,.12,1],[4.25,0,0,0,1]]);
let swing=0;for(const hit of [1.05,1.4,2.35]){if(t>hit-.15&&t<hit+.22){const q=part(t,hit-.15,hit+.22);swing+=q<.4?mix(-.45,.28,ease(q/.4)):mix(.28,0,ease((q-.4)/.6))}}
draw('hammer',{x:hp[0],y:hp[1],rotation:hp[2]+swing,opacity:hp[3],grey:t<9.4,pivot:[65,210]});spark(355,420,t,1.03);spark(355,420,t,1.38);spark(675,468,t,2.32);
// Screwdriver twists at the window fixing, then eases back into the logo.
let sp=path(t,[[0,-100,330,.5,0],[1.75,-100,330,.5,0],[2.45,47,-140,.1,1],[3.05,47,-140,.1,1],[3.6,10,-40,-.08,1],[4.2,0,0,0,1]]);
draw('screwdriver',{x:sp[0],y:sp[1],rotation:sp[2]+(t>2.45&&t<3.15?Math.sin((t-2.45)*32)*.065:0),opacity:sp[3],grey:t<9.4});
// Brush travels around the border, then makes continuous overlapping broad passes.
let bx=604,by=476,br=0,bo=1;
if(t<3.55){bo=ease(part(t,3.1,3.8));by+=85*(1-bo)}
else if(t<4.15){const u=ease(part(t,3.55,4.15));bx=mix(604,627,u);by=mix(476,48,u);br=mix(0,Math.PI/2,u)}
else if(t<6.35){const a=-Math.PI/2+Math.PI*2*part(t,4.15,6.35);bx=627+582*Math.cos(a);by=627+582*Math.sin(a);br=a+Math.PI/2}
else{[bx,by,br]=path(t,[[6.35,627,48,0],[6.6,280,675,0],[6.75,280,535,0],[6.9,205,540,-.75],[7.2,546,190,.75],[7.5,811,432,.75],[7.6,870,300,0],[7.78,870,350,0],[7.85,760,320,.75],[8.15,1075,560,.75],[8.25,990,555,0],[8.4,990,675,0],[8.48,515,335,0],[8.58,570,390,Math.PI/2],[8.65,1120,610,-Math.PI/2],[9.4,130,610,-Math.PI/2],[9.55,135,840,Math.PI/2],[10.6,1120,840,Math.PI/2],[10.8,1120,1010,-Math.PI/2],[11.25,190,1010,-Math.PI/2],[11.6,460,660,-.5],[12,604,476,0]])}
// Actual tip rather than centre follows the path.
ctx.save();ctx.translate(bx,by);ctx.rotate(br);ctx.translate(-604,-476);draw('brush',{opacity:bo});ctx.restore();
// Colour the tools and the black foundation under the brush's second sweep.
if(t>=8.65&&t<9.4){ctx.save();ctx.beginPath();ctx.rect(1150-1040*ease(part(t,8.65,9.4)),445,1040,310);ctx.clip();for(const n of ['foundation','spanner','hammer','screwdriver','drill'])draw(n);ctx.restore()}
// Final loose R, drill approaches with its bit aligned to the upper right fastening.
if(t>=11.2){let dp=path(t,[[11.2,0,0,0],[11.8,175,248,-.22],[12.0,145,248,-.12],[12.45,145,248,-.12],[13.0,35,40,.06],[13.5,0,0,0]]);const running=t>11.9&&t<12.4;draw('drill',{x:dp[0]+(running?Math.sin(t*150)*1.4:0),y:dp[1],rotation:dp[2],scale:1-.28*ease(part(t,11.2,11.75))*(1-ease(part(t,12.55,13.35))),flip:1-2*ease(part(t,11.2,11.75))*(1-ease(part(t,12.55,13.35))),pivot:[238,40]});if(running){spark(1140,780,t,11.95);spark(1140,780,t,12.15);ctx.save();ctx.strokeStyle='#b5aaa3';ctx.lineWidth=2;ctx.globalAlpha=.35;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(1133,780,10+i*8,t*19+i,t*19+i+1.9);ctx.stroke()}ctx.restore()}}
if(t>=13.5){ctx.save();ctx.globalAlpha=.12*Math.sin(Math.PI*part(t,13.5,14.0));ctx.strokeStyle='#751321';ctx.lineWidth=2;ctx.beginPath();ctx.arc(627,627,641+16*part(t,13.5,14.0),0,Math.PI*2);ctx.stroke();ctx.restore()}
if(t>=14.0){ctx.clearRect(-90,-90,W+180,W+180);for(const [n]of entries)draw(n)}
bar.style.transform=`scaleX(${clamp(t/DURATION)})`;
const label=t<4.15?'Building something good':t<11.25?'Adding the finishing touches':t<13.5?'Every detail, taken care of':'Ready when you are';if(status.textContent!==label)status.textContent=label;
}
function tick(now){if(paused)return;elapsed=(now-start)/1000;render(Math.min(elapsed,DURATION));if(elapsed<DURATION)raf=requestAnimationFrame(tick);else{document.getElementById('pause').textContent='Finished';canvas.dispatchEvent(new CustomEvent('hester:ready',{bubbles:true}));if(resolvePlay){resolvePlay();resolvePlay=null}}}
async function play(){cancelAnimationFrame(raf);paused=false;elapsed=0;document.getElementById('pause').textContent='Pause';if(reduced){render(DURATION);canvas.dispatchEvent(new CustomEvent('hester:ready',{bubbles:true}));return}start=performance.now();raf=requestAnimationFrame(tick);return new Promise(r=>resolvePlay=r)}
document.getElementById('replay').onclick=play;document.getElementById('pause').onclick=()=>{if(elapsed>=DURATION)return;paused=!paused;document.getElementById('pause').textContent=paused?'Resume':'Pause';if(paused)cancelAnimationFrame(raf);else{start=performance.now()-elapsed*1000;raf=requestAnimationFrame(tick)}};
window.HesterLoader={play,seek:t=>{cancelAnimationFrame(raf);elapsed=t;paused=true;render(t)},duration:DURATION};
window.HesterLoader.ready=Promise.all(entries.map(async([name,b])=>{const img=new Image();img.src=b.src;await img.decode();layers[name]=img;const c=document.createElement('canvas');c.width=b.w;c.height=b.h;const q=c.getContext('2d');q.drawImage(img,0,0,b.w,b.h);q.globalCompositeOperation='source-in';q.fillStyle='#c6bfb6';q.fillRect(0,0,b.w,b.h);neutral[name]=c})).then(()=>{const frame=new URLSearchParams(location.search).get('frame');if(frame!==null)window.HesterLoader.seek(Math.max(0,Math.min(DURATION,Number(frame)||0)));else play()}).catch(()=>{status.textContent='Unable to load logo artwork'});
})();