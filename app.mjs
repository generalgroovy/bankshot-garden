import {LEVELS,startGarden,editMirror,sendSeed,resetGarden,undoEdit} from './model.mjs';
const $ = id => document.getElementById(id);
let state=startGarden(0);
LEVELS.forEach((l,i)=>{ const o=document.createElement('option');o.value=i;o.textContent=`${i+1} / ${LEVELS.length}`;$('level').append(o); });
function draw() {
  const {level,board,history,result}=state;
  $('name').textContent=board.name;$('count').textContent=`${result?.lit.length || 0} / ${board.flowers.length} flowers`;
  $('board').style.setProperty('--size',board.size);
  const existing=$('board').children.length===board.size**2;
  if(!existing)$('board').replaceChildren();
  for(let y=0;y<board.size;y++)for(let x=0;x<board.size;x++){
    const mi=board.mirrors.findIndex(m=>m[0]===x&&m[1]===y),fi=board.flowers.findIndex(f=>f[0]===x&&f[1]===y);
    let cell=$('board').children[y*board.size+x];
    const type=mi>=0?'BUTTON':'DIV';
    if(!cell||cell.tagName!==type){const fresh=document.createElement(type.toLowerCase());if(cell)cell.replaceWith(fresh);else $('board').append(fresh);cell=fresh;}
    cell.className=`cell ${mi>=0?'mirror':fi>=0?'flower':'empty'}${result?.lit.includes(fi)?' bloom':''}${x===0&&y===board.row?' source':''}`;
    cell.textContent=mi>=0?board.mirrors[mi][2]:fi>=0?'✳':x===0&&y===board.row?'→':'·';
    if(mi>=0){cell.setAttribute('aria-label',`Mirror ${mi+1}, row ${y+1}, column ${x+1}, ${board.mirrors[mi][2]==='/'?'rises right':'falls right'}. Turn mirror`);cell.onclick=()=>{state=editMirror(state,mi);draw();$('status').textContent=`Mirror ${mi+1} turned. Send seed to try this route.`;};}
    else{cell.setAttribute('aria-label',fi>=0?`Flower ${fi+1}${result?.lit.includes(fi)?', bloomed':''}`:x===0&&y===board.row?'Seed enters here':'Empty tile');}
  }
  $('trail').setAttribute('viewBox',`0 0 ${board.size*60} ${board.size*60}`);
  $('trail').replaceChildren();
  if(result){const line=document.createElementNS('http://www.w3.org/2000/svg','polyline');line.setAttribute('points',result.path.map(([x,y])=>`${x*60+30},${y*60+30}`).join(' '));$('trail').append(line);}
  $('undo').disabled=!history.length;$('next').hidden=!result?.won||level===LEVELS.length-1;
}
function load(i){state=startGarden(i);$('level').value=i;draw();$('status').textContent='Turn a mirror, then Send seed to trace the path.';}
$('level').onchange=()=>load(Number($('level').value));
$('send').onclick=()=>{state=sendSeed(state);draw();const {result,level,board}=state;$('status').textContent=result.won?`All flowers bloomed. ${level===LEVELS.length-1?'All four gardens available to replay.':'Garden solved.'}`:`${result.lit.length} of ${board.flowers.length} flowers bloomed. ${result.end==='loop'?'The seed found a loop.':'The seed left the garden.'} Turn a mirror along its path and try again.`;if(result.won&&!$('next').hidden)$('next').focus();};
$('undo').onclick=()=>{if(state.history.length){state=undoEdit(state);draw();$('status').textContent=state.result?'Edit undone. Your earlier arrangement and shot are back.':'Edit undone. Your earlier arrangement is back.';if($('undo').disabled)$('send').focus();}};
$('reset').onclick=()=>{state=resetGarden(state);draw();$('status').textContent='Garden reset. Undo edit restores your earlier arrangement and shot.';};
$('next').onclick=()=>{load(state.level+1);$('board').querySelector('button')?.focus();};load(0);
