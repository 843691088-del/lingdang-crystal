const crystals = [
  ["rose","粉晶","温柔人缘","柔和表达、亲密关系与自我关怀","想让关系更柔软、提醒自己好好爱自己的人","#efa6bd","#bd617f"],
  ["amethyst","紫水晶","清醒安定","冷静、思路清晰与安稳休息","脑子停不下来、需要专注与沉静的人","#9a75c9","#5c3b8b"],
  ["obsidian","黑曜石","边界守护","坚定边界、远离杂念与稳定内心","工作压力大、希望更果断坚定的人","#25252d","#050507"],
  ["tiger","虎眼石","勇气行动","勇气、判断力与把计划变成行动","需要做决定、谈合作或推进目标的人","#b87a26","#5d3514"],
  ["clear","白水晶","澄澈专注","清理思绪、聚焦，也是百搭连接珠","想要简洁、百搭和明确目标的人","#e9f3f2","#9cafb4"],
  ["fluorite","萤石","学习秩序","整理复杂信息、学习与建立秩序","学生、研究者和同时处理很多任务的人","#72b9a4","#7964a5"],
  ["lapis","青金石","表达智慧","思考深度、诚实表达与沟通信心","答辩、汇报、写作或需要清楚表达的人","#315fa9","#14316c"],
  ["citrine","黄水晶","明亮丰盛","积极、自信、机会与丰盛感","职业上升期、需要展示自己的人","#e8bd4d","#bc7427"],
  ["moonstone","月光石","柔韧平衡","直觉、情绪平衡与柔韧面对变化","生活变化较多、想保持柔和稳定的人","#e7e8df","#97a8bd"],
  ["garnet","石榴石","热情续航","活力、坚持与对生活的热情","需要持续投入和恢复元气的人","#9f3044","#551520"],
  ["aquamarine","海蓝宝","从容沟通","平静沟通、坦率表达与舒展心情","经常开会、协调团队或面对客户的人","#78c8d5","#3c8ba1"],
  ["smoky","茶晶","落地稳重","脚踏实地、耐心与现实执行力","容易焦虑或处理长期现实任务的人","#816c65","#443a36"]
].map(x=>({id:x[0],name:x[1],short:x[2],meaning:x[3],suited:x[4],color:x[5],shadow:x[6]}));
const map=Object.fromEntries(crystals.map(x=>[x.id,x]));
let selected=["rose","amethyst","moonstone","clear"];
let active="rose",size=8,wrist=16;
const target=()=>Math.max(14,Math.min(28,Math.round(wrist*10/size)));
const beadBg=c=>`radial-gradient(circle at 30% 25%,#fff,${c.color} 38%,${c.shadow} 88%)`;

function fill(ids,n){return Array.from({length:n},(_,i)=>ids[i%ids.length])}
function render(){
  const ring=document.querySelector("#bracelet");
  ring.querySelectorAll(".bead").forEach(x=>x.remove());
  const max=target(); selected=selected.slice(0,max);
  selected.forEach((id,i)=>{
    const c=map[id],a=Math.PI*2*i/max-Math.PI/2,b=document.createElement("button");
    b.className="bead"; b.title=`移除：${c.name}`;
    Object.assign(b.style,{left:`${50+Math.cos(a)*38}%`,top:`${50+Math.sin(a)*38}%`,width:`${size===6?22:size===8?27:32}px`,height:`${size===6?22:size===8?27:32}px`,background:beadBg(c)});
    b.onclick=()=>{selected.splice(i,1);render()}; ring.appendChild(b);
  });
  document.querySelector("#count").textContent=`${selected.length}/${max}`;
  document.querySelector("#status").textContent=selected.length===max?"圆满成串":"继续添珠";
  document.querySelector("#target").textContent=max;
  const unique=[...new Set(selected)].slice(0,4);
  document.querySelector("#blessing").textContent=unique.length?unique.map(id=>map[id].short).join(" · "):"等待你放入第一颗心意珠";
}
function choose(id){
  active=id; const c=map[id];
  document.querySelectorAll("#crystal-buttons button").forEach(x=>x.classList.toggle("active",x.dataset.id===id));
  document.querySelector("#active-name").textContent=`${c.name} · ${c.short}`;
  document.querySelector("#active-meaning").textContent=`传统寓意：${c.meaning}`;
  document.querySelector("#active-suited").textContent=`适合：${c.suited}`;
  document.querySelector("#add").textContent=`＋ 加入一颗 ${c.name}`;
}
document.querySelectorAll(".mini-bracelet").forEach(el=>{
  fill(el.dataset.palette.split(","),14).forEach(id=>{const i=document.createElement("i"),c=map[id];i.style.background=beadBg(c);el.appendChild(i)});
});
document.querySelectorAll(".load-preset").forEach(btn=>btn.onclick=()=>{
  selected=fill(btn.dataset.palette.split(","),target());render();document.querySelector("#diy").scrollIntoView({behavior:"smooth"});
});
const buttons=document.querySelector("#crystal-buttons");
crystals.forEach(c=>{
  const b=document.createElement("button");b.dataset.id=c.id;
  b.innerHTML=`<i style="background:${beadBg(c)}"></i><span>${c.name}<small>${c.short}</small></span>`;
  b.onclick=()=>choose(c.id);buttons.appendChild(b);
  const d=document.createElement("details");
  d.innerHTML=`<summary><i style="background:${beadBg(c)}"></i><span><b>${c.name}</b><small>${c.short}</small></span><em>＋</em></summary><div><p>传统寓意：${c.meaning}</p><p><b>更适合：</b>${c.suited}</p></div>`;
  document.querySelector("#guide-list").appendChild(d);
});
document.querySelector("#add").onclick=()=>{if(selected.length<target()){selected.push(active);render()}};
document.querySelector("#undo").onclick=()=>{selected.pop();render()};
document.querySelector("#clear").onclick=()=>{selected=[];render()};
document.querySelector("#random").onclick=()=>{const ids=[...crystals].sort(()=>Math.random()-.5).slice(0,3).map(x=>x.id);selected=fill(ids,target());choose(ids[0]);render()};
document.querySelector("#wrist").oninput=e=>{wrist=+e.target.value;document.querySelector("#wrist-value").textContent=wrist;render()};
document.querySelectorAll("[data-size]").forEach(b=>b.onclick=()=>{size=+b.dataset.size;document.querySelectorAll("[data-size]").forEach(x=>x.classList.toggle("active",x===b));render()});
choose(active);selected=fill(selected,target());render();
