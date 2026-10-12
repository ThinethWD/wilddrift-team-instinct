export const VERSION='2.0';
export const DISCLAIMER='Based on four mission decisions and fictional colleague selections. This is an informal reflection, not a validated personality assessment or a prediction of team performance.';
export const TEAM_DISCLAIMER='This combined reflection describes participating members only. It draws on a short informal experience, not a validated assessment or observed team performance.';
export const LEGACY_DISCLAIMER='This earlier DISC-inspired snapshot reflects choices in a short experience. It is a conversation starter, not a formal psychometric assessment.';
export const TYPES={D:'Dominance',I:'Influence',S:'Steadiness',C:'Conscientiousness'};
export const APPROACHES={D:'Action',I:'Ideas',S:'Connection',C:'Clarity'};
const q=(id,activity,title,story,prompt,options)=>({id,activity,title,story,prompt,options:options.map(([type,label,text,icon])=>({type,label,text,icon}))});
export const QUESTIONS=[
q('start',0,'You’re on.','Your crew must launch a surprise experience tomorrow. The brief is missing a few details.','Make your first move.',[
['D','Get moving','Set a target and assign tasks.','📋'],['I','Gather ideas','Bring the crew together to explore.','📣'],['S','Check on people','See who needs help or support.','🤝'],['C','Open the brief','Clarify what’s missing.','📄']]),
q('role',1,'Three seats. Your call.','Invite three colleagues. Each has a strength—and a trade-off.','And where do YOU fit?',[
['D','Steer the mission','Set direction and make decisions.','🧭'],['I','Spark ideas','Connect ideas and build energy.','💡'],['S','Connect the crew','Support people and coordinate.','🤝'],['C','Check the plan','Spot risks and protect quality.','🔎']]),
q('resource',2,'Plot twist!','Your main attraction just cancelled. The doors open in ten minutes.','What’s your move?',[
['D','Pick a Plan B','Choose an alternative and assign actions.','↗'],['I','Find a fresh idea','Bring the crew together for a workaround.','💡'],['S','Share the load','Check capacity and redistribute work.','🤝'],['C','Check what must work','Find an option that meets the essentials.','🔎']]),
q('reply',3,'You pulled it off.','“We pulled it off—but that was hectic!”','Tap a reply to send.',[
['D','“One change for next time?”','Agree one change to put into action.',''],['I','“Let’s hear everyone’s ideas.”','Invite ideas for making the next one better.',''],['S','“What was hardest for you?”','Ask about a teammate’s experience.',''],['C','“Where did the rush start?”','Understand where the problem began.','']])];
export const CREW=[
{id:'arun',name:'Arun',role:'The driver',strength:'Gets things moving.',tradeoff:'Sometimes rushes.'},
{id:'maya',name:'Maya',role:'The connector',strength:'Brings people together.',tradeoff:'May miss follow-through.'},
{id:'nila',name:'Nila',role:'The supporter',strength:'Supports the crew.',tradeoff:'May avoid hard conversations.'},
{id:'dev',name:'Dev',role:'The detail spotter',strength:'Spots the details.',tradeoff:'May over-check.'},
{id:'tara',name:'Tara',role:'The explorer',strength:'Finds fresh ideas.',tradeoff:'May switch direction too soon.'},
{id:'sam',name:'Sam',role:'The steady hand',strength:'Keeps things steady.',tradeoff:'May resist sudden changes.'}];
export const CONSEQUENCES={D:'Plan B is moving. A teammate asks: “Did we hear everyone’s concerns?”',I:'Ideas are coming in. A teammate asks: “Which one are we using?”',S:'The load is shared. A teammate asks: “Can we still launch on time?”',C:'An essential check is complete. A teammate asks: “Are we ready to decide?”'};
export const REACTIONS={D:'“Agreed. Let’s choose one action.”',I:'“I have an idea. Let’s hear the others too.”',S:'“Thanks for asking. The last-minute changes were hardest.”',C:'“The rush started when we changed the plan late.”'};
export const START_REACTIONS={D:'Your action board opens. Target → owners → next steps.',I:'The crew joins your call. “Ideas welcome—let’s go!”',S:'A check-in opens. “Who needs a hand?”',C:'The brief opens. Missing details are highlighted.'};
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
 return {kind:types.length===1?'consistent':'situational',types,label:types.length===1?APPROACHES[types[0]]+' across four moves':'Different priorities across the mission',version:VERSION};
}
export function validateResponses(data,complete=true){
 if(!data||typeof data!=='object'||data.version!==VERSION||!data.answers||typeof data.answers!=='object'||Array.isArray(data.answers))throw new Error('Please restart the four-move experience.');
 const keys=Object.keys(data.answers);if(keys.some(k=>!QUESTIONS.some(q=>q.id===k))||keys.some(k=>!Object.hasOwn(TYPES,data.answers[k])))throw new Error('Invalid activity response.');
 if(complete&&keys.length!==4)throw new Error('Please complete all four moves.');
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
 const first={D:'set a target and assign tasks',I:'gather the crew’s ideas',S:'check who needed support',C:'clarify the incomplete brief'}[a.start];
 const role={D:'steer the mission',I:'spark ideas',S:'connect the crew',C:'check the plan'}[a.role];
 const pressure={D:'choose an alternative and assign actions',I:'bring people together for a fresh workaround',S:'check capacity and share the work',C:'protect the essential requirements'}[a.resource];
 const reply={D:'agree one improvement',I:'invite everyone’s ideas',S:'ask what was hardest',C:'trace where the rush began'}[a.reply];
 const strengthA={D:'Making a start: choosing a target and owners can help a team turn an unclear assignment into action.',I:'Opening possibilities: inviting ideas first can give others a voice before the plan is fixed.',S:'Making support visible: an early check-in can uncover capacity problems before commitments are made.',C:'Creating clarity: checking missing requirements can help a team avoid starting with different assumptions.'}[a.start];
 const strengthB={D:'Owning direction: you chose responsibility for decisions, rather than waiting for the crew to find its own course.',I:'Building energy: you chose to connect ideas and enthusiasm. Pairing that energy with clear commitments could help the team deliver.',S:'Supporting coordination: you chose to help people work together, rather than leave cooperation to chance.',C:'Protecting the plan: you chose to notice risks and details, rather than assume someone else would check.'}[a.role];
 const risk={D:'Speed may leave concerns unheard. A useful check is: “What risk or concern have we missed?” before committing.',I:'Generating alternatives may delay selecting one. Agree when exploration ends and who makes the call.',S:'Sharing the load may take time when a decision is urgent. Pair the capacity check with a decision deadline.',C:'Checking can delay action if every uncertainty feels essential. Decide which checks are necessary for this launch.'}[a.resource];
 const working={D:'Give you a clear outcome and decision ownership. Raise concerns early and make them specific.',I:'Give you room to propose ideas, then agree an owner and next step so enthusiasm becomes delivery.',S:'Make responsibilities clear and give people permission to ask for support or disagree.',C:'Share the requirements and the decision deadline together, so quality and pace both stay visible.'}[a.role];
 const selected=crewEvidence(draft),names=selected.map(c=>c.name).join(', '),qualities=selected.map(c=>c.strength.replace(/\.$/,'').toLowerCase()).join('; ');
 return {version:VERSION,headline:pattern.label,summary:'You chose to '+first+', '+role+', '+pressure+', and '+reply+'. This is the pattern shown in this short mission.',
 teamwork:'At the beginning, you chose to '+first+'. For your own contribution, you chose to '+role+'. Under pressure, you chose to '+pressure+'. These choices show what you prioritised at different moments; they may reflect the situation as much as a lasting preference.',
 strengths:[strengthA,strengthB],pressure:risk+' Your final reply focused on another part of the experience: you chose to '+reply+'. That gives a colleague something concrete to discuss with you after a difficult project.',
 crew:'You invited '+names+'. Their cards emphasised: '+qualities+'. This may suggest what you value around you, or simply which mix suited this mission. It does not prove that you lack these strengths or that these people would work well together.',
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
