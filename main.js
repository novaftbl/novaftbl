const hero=document.querySelector(".hero");
document.addEventListener("mousemove",e=>{
  const x=(e.clientX/innerWidth-.5)*8;
  const y=(e.clientY/innerHeight-.5)*8;
  hero.style.transform=`translate(${x}px,${y}px)`;
});
const btn=document.querySelector(".follow-btn");
btn.addEventListener("mouseenter",()=>document.title="FOLLOW @novaftbl__");
btn.addEventListener("mouseleave",()=>document.title="NOVAFTBL__ — Follow on TikTok");
