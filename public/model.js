export const VERSION='3.0';
export const DISCLAIMER='Based on four mini-game choices and fictional colleague selections. This is an informal reflection, not a validated personality assessment or a prediction of team performance.';
export const TEAM_DISCLAIMER='This combined reflection describes participating members only. It draws on a short informal experience, not a validated assessment or observed team performance.';
export const LEGACY_DISCLAIMER='This earlier DISC-inspired snapshot reflects choices in a short experience. It is a conversation starter, not a formal psychometric assessment.';
export const TYPES={D:'Dominance',I:'Influence',S:'Steadiness',C:'Conscientiousness'};
export const APPROACHES={D:'Action',I:'Ideas',S:'Connection',C:'Clarity'};
const q=(id,activity,title,story,prompt,options)=>({id,activity,title,story,prompt,options:options.map(([type,label,text,icon])=>({type,label,text,icon}))});
export const QUESTIONS=[
q('start',0,'The Mystery Box','A mystery challenge is inside. Pick the tool you would use first.','Pick your first tool.',[
['D','Compass','Set direction.','compass'],['I','Megaphone','Gather ideas.','megaphone'],['S','Helping hand','Find support.','hand'],['C','Magnifying glass','Investigate.','search']]),
q('role',1,'Build Your Crew','Three seats. Six characters. Invite your mix.','Where do YOU fit?',[
['D','Guide','Make decisions.','compass'],['I','Invent','Bring fresh ideas.','idea'],['S','Support','Keep people connected.','hand'],['C','Check','Protect the plan.','search']]),
q('resource',2,'The Broken Bridge','Your cartoon crew reaches a broken bridge. Pick a move to get things going.','What’s your move?',[
['D','Another route','Choose a way forward.','route'],['I','Invent a crossing','Find a fresh solution.','idea'],['S','Organise everyone','Coordinate the crew.','people'],['C','Inspect the damage','Understand what’s wrong.','search']]),
q('reply',3,'The Victory Wall','A fictional team has finished a challenge. Pick one badge for its celebration wall.','What will you celebrate?',[
['D','We made it happen','Celebrate turning effort into a result.','flag'],['I','We brought fresh ideas','Celebrate opening fresh possibilities.','idea'],['S','We helped each other','Celebrate support and cooperation.','hand'],['C','We got the details right','Celebrate care and accuracy.','check']])];
export const CREW=[
{id:'arun',name:'Arun',role:'The driver',strength:'Gets things moving.',tradeoff:'Sometimes rushes.'},
{id:'maya',name:'Maya',role:'The connector',strength:'Brings people together.',tradeoff:'May miss follow-through.'},
{id:'nila',name:'Nila',role:'The supporter',strength:'Supports the crew.',tradeoff:'May avoid hard conversations.'},
{id:'dev',name:'Dev',role:'The detail spotter',strength:'Spots the details.',tradeoff:'May over-check.'},
{id:'tara',name:'Tara',role:'The explorer',strength:'Finds fresh ideas.',tradeoff:'May switch direction too soon.'},
{id:'sam',name:'Sam',role:'The steady hand',strength:'Keeps things steady.',tradeoff:'May resist sudden changes.'}];
export const CONSEQUENCES={D:'The crew takes a detour. It adds distance, but you have a route.',I:'A new crossing idea takes shape. It still needs a safety check.',S:'Everyone has a role. You still need to choose how to cross.',C:'The weak section is identified. You still need a way forward.'};
export const REACTIONS={D:'Your badge celebrates turning effort into a result.',I:'Your badge celebrates opening fresh possibilities.',S:'Your badge celebrates support and cooperation.',C:'Your badge celebrates care and accuracy.'};
export const START_REACTIONS={D:'You open a direction board: goal → owners → first move.',I:'You open an idea exchange. Everyone brings a possibility.',S:'You open a support check-in. Who can help?',C:'You open a clue sheet. What do we know—and what’s missing?'};
export const blankDraft=()=>({answers:{},crew:[],step:0,version:VERSION});
export function resumeDraft(draft){try{return validateResponses(draft,false)}catch{return blankDraft()}}
export const PROFILES={
D:{headline:'You turn intention into action.',summary:'Your choices suggest a preference for taking initiative, making decisions and keeping outcomes visible.',strengths:['Creating momentum','Taking ownership','Keeping the team focused on results'],watch:'Moving quickly can leave some concerns unheard.',tip:'Before a key decision, invite one perspective you have not yet heard.'},
I:{headline:'You bring ideas and people together.',summary:'Your choices suggest a preference for connecting people, exploring ideas and building enthusiasm around shared possibilities.',strengths:['Building connection','Generating enthusiasm','Opening up possibilities'],watch:'Enthusiasm can outpace clear commitments and follow-through.',tip:'Close your next discussion with an action, an owner and a deadline.'},
S:{headline:'You help people move forward together.',summary:'Your choices suggest a preference for supporting colleagues, maintaining cooperation and bringing continuity to a team.',strengths:['Supporting colleagues','Building cooperation','Following through steadily'],watch:'Maintaining harmony can make difficult concerns harder to raise.',tip:'Share one concern early and pair it with a practical suggestion.'},
C:{headline:'You bring clarity to the challenge.',summary:'Your choices suggest a preference for checking requirements, noticing risks and protecting quality.',strengths:['Clarifying expectations','Spotting risks','Protecting quality'],watch:'Continued checking can delay a decision when enough information is available.',tip:'Agree the essential checks and a decision deadline with your team.'}};
function classifyLegacy(scores){
 const ranked=Object.keys(TYPES).sort((a,b)=>scores[b]-scores[a]);
 if(ranked.some(k=>!Number.isInteger(scores[k])||scores[k]<0)||ranked.reduce((n,k)=>n+scores[k],0)!==12)throw new Error('Invalid scores');
 if(scores[ranked[0]]-scores[ranked[3]]<=2)return {kind:'balanced',types:ranked,label:'An evenly balanced pattern'};
 if(scores[ranked[0]]-scores[ranked[1]]>=3)return {kind:'primary',types:[ranked[0]],label:TYPES[ranked[0]]+' tendency'};
 const leaders=ranked.filter(k=>scores[k]===scores[ranked[0]]);
 const types=leaders.length>=3?leaders:ranked.slice(0,2);
 return {kind:'blend',types,label:types.join(' + ')+' blend'};
}

export function classify(scores){
 const keys=Object.keys(TYPES);if(keys.some(k=>!Number.isInteger(scores[k])||scores[k]<0))throw new Error('Invalid scores');
 const total=keys.reduce((n,k)=>n+scores[k],0);if(total===12)return classifyLegacy(scores);if(total!==4)throw new Error('Invalid scores');
 const types=keys.filter(k=>scores[k]>0).sort((a,b)=>scores[b]-scores[a]);
 return {kind:types.length===1?'consistent':'situational',types,label:types.length===1?APPROACHES[types[0]]+' across four games':'Different priorities across the games',version:VERSION};
}
export function validateResponses(data,complete=true){
 if(!data||typeof data!=='object'||data.version!==VERSION||!data.answers||typeof data.answers!=='object'||Array.isArray(data.answers))throw new Error('Please restart the four-game experience.');
 const keys=Object.keys(data.answers);if(keys.some(k=>!QUESTIONS.some(q=>q.id===k))||keys.some(k=>!Object.hasOwn(TYPES,data.answers[k])))throw new Error('Invalid activity response.');
 if(complete&&keys.length!==4)throw new Error('Please complete all four games.');
 if(!Array.isArray(data.crew)||new Set(data.crew).size!==data.crew.length||data.crew.length>3||data.crew.some(id=>!CREW.some(c=>c.id===id))||(complete&&data.crew.length!==3))throw new Error('Choose three teammates.');
 if(!Number.isInteger(data.step)||data.step<0||data.step>3)throw new Error('Invalid progress.');
 return {answers:Object.fromEntries(keys.map(k=>[k,data.answers[k]])),crew:[...data.crew],step:data.step,version:VERSION};
}
export function score(data){const draft=validateResponses(data);const scores={D:0,I:0,S:0,C:0};for(const type of Object.values(draft.answers))scores[type]++;const pattern=classify(scores);pattern.label=({D:'Direction',I:'Ideas',S:'Connection',C:'Clarity'}[draft.answers.role])+' with your own twist';return {scores,pattern};}
export function decisionEvidence(draft){return QUESTIONS.map(q=>{const o=q.options.find(o=>o.type===draft.answers[q.id]);return {move:q.title,situation:q.story,choice:o.label,meaning:o.text,approach:APPROACHES[o.type]}});}
export function crewEvidence(draft){return draft.crew.map(id=>{const c=CREW.find(c=>c.id===id);return {name:c.name,strength:c.strength,tradeoff:c.tradeoff}});}
export function fallbackReport(pattern,draft){
 if(!draft||draft.version!==VERSION){
  if(pattern.kind==='balanced')return {headline:'You chose a range of team approaches.',summary:'Your responses were spread fairly evenly across action, enthusiasm, support and clarity. This earlier experience did not identify a clear leading tendency.',strengths:['Considering outcomes','Including people','Checking requirements'],watch:'Your preferred approach may be less obvious to teammates.',tip:'Explain what matters most in the current situation and why.'};
  if(pattern.kind==='primary')return {...PROFILES[pattern.types[0]]};
  const chosen=pattern.types.map(k=>PROFILES[k]);return {headline:'You bring a blend of approaches.',summary:'Your earlier choices suggest a blend of '+pattern.types.map(k=>TYPES[k].toLowerCase()).join(', ')+'.',strengths:[...new Set(chosen.flatMap(p=>p.strengths.slice(0,2)))].slice(0,3),watch:chosen.map(p=>p.watch).join(' '),tip:'Discuss which approach the situation needs, then agree a next action.'};
 }
 const a=draft.answers;
 const first={D:'set direction with a compass',I:'gather ideas with a megaphone',S:'find support with a helping hand',C:'investigate with a magnifying glass'}[a.start];
 const role={D:'guide your crew',I:'bring fresh ideas',S:'support your crew',C:'protect the plan'}[a.role];
 const pressure={D:'choose another route',I:'invent a new crossing',S:'organise the crew',C:'inspect the damage'}[a.resource];
 const reply={D:'celebrate making things happen',I:'celebrate fresh ideas',S:'celebrate helping each other',C:'celebrate getting the details right'}[a.reply];
 const strengthA={D:'Setting direction: you chose a compass to make the next direction clear. In a real task, naming an outcome can help others find a useful starting point.',I:'Opening possibilities: you chose a megaphone to gather ideas. In a real task, inviting different suggestions early can keep the first idea from becoming the only option.',S:'Making support visible: you chose a helping hand to find support. In a real task, identifying who can help may uncover useful resources before commitments are made.',C:'Creating clarity: you chose a magnifying glass to investigate. In a real task, finding out what is known and missing can reduce different assumptions at the start.'}[a.start];
 const strengthB={D:'Owning direction: you chose responsibility for decisions, rather than waiting for the crew to find its own course.',I:'Building energy: you chose to connect ideas and enthusiasm. Pairing that energy with clear commitments could help the team deliver.',S:'Supporting coordination: you chose to help people work together, rather than leave cooperation to chance.',C:'Protecting the plan: you chose to notice risks and details, rather than assume someone else would check.'}[a.role];
 const risk={D:'Choosing another route creates a way forward, but may add effort or distance. Before committing, ask: “What trade-off does this alternative introduce?”',I:'Inventing a crossing creates a fresh possibility, but an untested idea still needs checking. Agree a small test and when you will select a workable option.',S:'Organising the crew makes coordination visible, but roles alone do not solve the obstacle. Pair the organisation with a clear decision about the next move.',C:'Inspecting the damage clarifies the problem, but may delay action if checking continues without a decision. Decide which information is enough to choose a next step.'}[a.resource];
 const working={D:'Give you a clear outcome and decision ownership. Raise concerns early and make them specific.',I:'Give you room to propose ideas, then agree an owner and next step so enthusiasm becomes delivery.',S:'Make responsibilities clear and give people permission to ask for support or disagree.',C:'Share the requirements and the decision deadline together, so quality and pace both stay visible.'}[a.role];
 const selected=crewEvidence(draft),names=selected.map(c=>c.name).join(', '),qualities=selected.map(c=>c.strength.replace(/\.$/,'').toLowerCase()).join('; ');
 return {version:VERSION,headline:pattern.label,summary:'You chose to '+first+', '+role+', '+pressure+', and '+reply+'. This is the combination shown across four separate games.',
 teamwork:'In the mystery game, you chose to '+first+'. For your own contribution, you chose to '+role+'. At the bridge obstacle, you chose to '+pressure+'. These independent choices show what you prioritised in different situations; they may reflect the game as much as a lasting preference.',
 strengths:[strengthA,strengthB],pressure:risk+' In the separate celebration game, you chose to '+reply+'. That gives a colleague something concrete to discuss: how does what you value connect with the way you approach obstacles?',
 crew:'You invited '+names+'. Their cards emphasised: '+qualities+'. This may suggest what you value around you, or simply which mix appealed in this game. It does not prove that you lack these strengths or that these people would work well together.',
 workingWith:working+' Tell colleagues what you need at the start, then check whether the current task needs a different approach.',
 experiment:'In one real team task, name your first instinct out loud. Before acting, invite one alternative view. Afterwards, ask a teammate: “Did my approach help us? What would have made it more useful?” Use their example to choose one adjustment.',
 reflectionQuestion:'When does my first instinct help the team—and when should I make room for a different approach?',scope:DISCLAIMER};
}
export function reportText(p){const r=p.report;const intro='WildDrift Team Instinct\n'+p.name+' · '+p.company+'\n'+p.pattern.label+'\n\n'+r.headline+'\n'+r.summary;
 if(r.teamwork)return intro+'\n\nYour teamwork pattern\n'+r.teamwork+'\n\nTwo contributions you may bring\n'+r.strengths.map(s=>'• '+s).join('\n')+'\n\nWhen pressure rises\n'+r.pressure+'\n\nThe crew you chose\n'+r.crew+'\n\nWorking with you\n'+r.workingWith+'\n\nYour next-week experiment\n'+r.experiment+'\n\nA question to take away\n'+r.reflectionQuestion+'\n\n'+(r.scope||DISCLAIMER);
 return intro+'\n\nThree strengths\n'+r.strengths.map(s=>'• '+s).join('\n')+'\n\nWatch-out: '+r.watch+'\nTry this: '+r.tip+'\n\n'+LEGACY_DISCLAIMER;
}
export function normalisePhone(raw){let s=String(raw??'').replace(/[\s()-]/g,'');if(/^0\d{9}$/.test(s))s='+94'+s.slice(1);if(!/^\+[1-9]\d{7,14}$/.test(s))throw new Error('Enter a valid WhatsApp number with country code, such as +94 77 123 4567.');return s;}
export function normaliseCode(code){const c=String(code??'').trim().toUpperCase();if(!/^[A-Z]{2}\d{3}$/.test(c))throw new Error('Team codes have two letters and three numbers, for example AB482.');return c;}
