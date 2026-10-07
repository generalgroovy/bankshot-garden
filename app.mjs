import { LEVELS, setup, turn, trace } from './model.mjs';
const $ = id => document.getElementById(id);
let level = 0, board = setup(0), history = [], result = null;
LEVELS.forEach((l,i)=>{ const o=document.createElement('option');o.value=i;o.textContent=`${i+1} / ${LEVELS.length}`;$('level').append(o); });
function draw() {
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
    if(mi>=0){cell.setAttribute('aria-label',`Mirror ${mi+1}, row ${y+1}, column ${x+1}, ${board.mirrors[mi][2]==='/'?'rises right':'falls right'}. Turn mirror`);cell.onclick=()=>{history.push(board);board=turn(board,mi);result=null;draw();$('status').textContent=`Mirror ${mi+1} turned. Send the seed to see its path.`;};}
    else{cell.setAttribute('aria-label',fi>=0?`Flower ${fi+1}${result?.lit.includes(fi)?', bloomed':''}`:x===0&&y===board.row?'Seed enters here':'Empty tile');}
  }
  $('trail').setAttribute('viewBox',`0 0 ${board.size*60} ${board.size*60}`);
  $('trail').replaceChildren();
  if(result){const line=document.createElementNS('http://www.w3.org/2000/svg','polyline');line.setAttribute('points',result.path.map(([x,y])=>`${x*60+30},${y*60+30}`).join(' '));$('trail').append(line);}
  $('undo').disabled=!history.length;$('next').hidden=!result?.won||level===LEVELS.length-1;
}
function load(i){level=i;board=setup(i);history=[];result=null;$('level').value=i;draw();$('status').textContent='A fresh garden. Where will the first mirror send your seed?';}
$('level').onchange=()=>load(Number($('level').value));
$('send').onclick=()=>{result=trace(board);draw();$('status').textContent=result.won?`Every flower bloomed! ${level===LEVELS.length-1?'You threaded all four gardens. Revisit one and explore another route.':'Your route works. Ready for another garden?'}`:`${result.lit.length} of ${board.flowers.length} flowers bloomed. ${result.end==='loop'?'The seed found a loop.':'The seed left the garden.'} Follow the path and turn a mirror.`;};
$('undo').onclick=()=>{if(history.length){board=history.pop();result=null;draw();$('status').textContent='Last turn undone. Your earlier arrangement is back.';if($('undo').disabled)$('send').focus();}};
$('reset').onclick=()=>load(level);
$('next').onclick=()=>{load(level+1);$('send').focus();};load(0);
