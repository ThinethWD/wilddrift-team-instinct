export const VERSION='1.0';
export const DISCLAIMER='This DISC-inspired snapshot reflects choices made in a short experience. It is a conversation starter, not a formal psychometric assessment. Behaviour may vary across situations.';
export const TYPES={D:'Dominance',I:'Influence',S:'Steadiness',C:'Conscientiousness'};
const q=(id,activity,title,story,prompt,options)=>({id,activity,title,story,prompt,options:options.map(([type,text])=>({type,text}))});
export const QUESTIONS=[
q('start',0,'The surprise assignment','Your team has been asked to launch a new employee-engagement initiative tomorrow. You have a limited budget, a small team and an incomplete brief.','What would you do first?',[
['D','Set a clear target, assign responsibilities and get started.'],['I','Bring everyone together to explore ideas and build enthusiasm.'],['S','Check everyone’s workload and what support they need.'],['C','Clarify the requirements and identify missing information.']]),
q('direction',0,'A different direction','Halfway through planning, a teammate proposes a completely different approach.','How would you respond?',[
['D','Decide whether it improves the outcome enough to change course.'],['I','Explore the idea together and see what possibilities it opens.'],['S','Hear the team’s views and consider how the change affects everyone.'],['C','Compare the new approach against the brief, budget and risks.']]),
q('update',0,'The client checks in','The client asks for a short progress update. You have time to make one main point.','What would you emphasise first?',[
['D','The outcome we are working towards and our next milestone.'],['I','The idea taking shape and why people will find it engaging.'],['S','How the team is coordinating and supporting delivery.'],['C','What is confirmed, what remains uncertain and what needs checking.']]),
q('role',1,'Your place in the team','You have chosen your three colleagues. Now it’s your turn to contribute.','What role would you naturally take?',[
['D','Set direction and help the team make decisions.'],['I','Connect ideas and build enthusiasm around the plan.'],['S','Coordinate support and keep everyone involved.'],['C','Clarify the plan and check the important details.']]),
q('meeting',1,'Your first team meeting','Your new team is ready to get started.','What would help you contribute most effectively?',[
['D','A clear outcome and freedom to move things forward.'],['I','An open conversation where we can develop ideas together.'],['S','Space for everyone to contribute and agree how we will work.'],['C','A clear brief and enough information to consider the options.']]),
q('request',1,'They’re counting on you','Your colleagues turn to you for help.','Which request feels most natural to handle?',[
['D','“Can you help us make a decision and take the next step?”'],['I','“Can you help us communicate the idea and get people interested?”'],['S','“Can you help us coordinate and support each other?”'],['C','“Can you check the plan and identify what we might have missed?”']]),
q('resource',2,'The last-minute curveball','Ten minutes before launch, a key resource becomes unavailable. Your team needs a way forward.','What would you do next?',[
['D','Choose a workable alternative and assign the next actions.'],['I','Bring people together to find a creative workaround.'],['S','Check the team’s capacity and redistribute the work.'],['C','Check which alternative meets the essential requirements.']]),
q('consequence',2,'Every approach has a trade-off','', 'How would you respond now?',[
['D','Confirm the immediate priority and make the next decision.'],['I','Reconnect everyone around a shared solution.'],['S','Hear the concern and agree a way forward with the team.'],['C','Examine the specific concern against the launch requirements.']]),
q('extra',2,'One more request','The client asks for an extra feature just before launch. It could be valuable, but it adds work.','How would you handle it?',[
['D','Decide what can fit now and what should wait.'],['I','Explore what would make the addition valuable and engaging.'],['S','Check with the team before committing to more work.'],['C','Clarify the scope, effort and risks before agreeing.']]),
q('reply',3,'Your team’s group chat','“We delivered, but everything felt rushed.”','What would you reply first?',[
['D','“Let’s agree one change we can put into action next time.”'],['I','“Let’s hear everyone’s ideas for making the next one better.”'],['S','“Thanks for saying that. What was hardest for you?”'],['C','“Which part caused the rush? Let’s understand where it started.”']]),
q('celebrate',3,'Recognise the contribution','“What should we celebrate?”','What would you highlight?',[
['D','The ownership people took to deliver the result.'],['I','The ideas and energy that brought the project to life.'],['S','The support people gave each other throughout.'],['C','The care people took to protect the quality of the work.']]),
q('habit',3,'The next chapter','“What is one team habit we should improve?”','Choose the improvement you would prioritise.',[
['D','Make responsibilities and decision ownership clearer.'],['I','Create more space for ideas and open conversation.'],['S','Check in regularly so people can raise concerns and ask for support.'],['C','Agree requirements and checkpoints at the start.']])];
export const CREW=[
{id:'arun',name:'Arun',role:'The driver',strength:'Takes ownership and makes quick decisions.',tradeoff:'Sometimes moves ahead before everyone is ready.'},
{id:'maya',name:'Maya',role:'The connector',strength:'Connects people and builds enthusiasm.',tradeoff:'Sometimes loses focus on follow-through.'},
{id:'nila',name:'Nila',role:'The supporter',strength:'Supports colleagues and keeps people included.',tradeoff:'Sometimes avoids difficult conversations.'},
{id:'dev',name:'Dev',role:'The detail spotter',strength:'Spots risks and checks details.',tradeoff:'Sometimes keeps reviewing when a decision is needed.'},
{id:'tara',name:'Tara',role:'The explorer',strength:'Finds fresh possibilities.',tradeoff:'Sometimes changes direction before an idea is tested.'},
{id:'sam',name:'Sam',role:'The steady hand',strength:'Keeps commitments and maintains continuity.',tradeoff:'Sometimes needs time to adjust to sudden changes.'}];
export const CONSEQUENCES={D:'Your quick alternative keeps things moving, but a teammate says their concern was overlooked.',I:'The discussion produces several ideas, but a teammate asks which one you will actually use.',S:'Redistributing the work reassures the team, but a teammate worries that time is running out.',C:'Your checks uncover a risk, but a teammate worries that further checking could delay the launch.'};
export const PROFILES={
D:{headline:'You turn intention into action.',summary:'Your choices suggest a preference for taking initiative, making decisions and keeping outcomes visible.',strengths:['Creating momentum','Taking ownership','Keeping the team focused on results'],watch:'Moving quickly can leave some concerns unheard.',tip:'Before a key decision, invite one perspective you have not yet heard.'},
I:{headline:'You bring ideas and people together.',summary:'Your choices suggest a preference for connecting people, exploring ideas and building enthusiasm around shared possibilities.',strengths:['Building connection','Generating enthusiasm','Opening up possibilities'],watch:'Enthusiasm can outpace clear commitments and follow-through.',tip:'Close your next discussion with an action, an owner and a deadline.'},
S:{headline:'You help people move forward together.',summary:'Your choices suggest a preference for supporting colleagues, maintaining cooperation and bringing continuity to a team.',strengths:['Supporting colleagues','Building cooperation','Following through steadily'],watch:'Maintaining harmony can make difficult concerns harder to raise.',tip:'Share one concern early and pair it with a practical suggestion.'},
C:{headline:'You bring clarity to the challenge.',summary:'Your choices suggest a preference for checking requirements, noticing risks and protecting quality.',strengths:['Clarifying expectations','Spotting risks','Protecting quality'],watch:'Continued checking can delay a decision when enough information is available.',tip:'Agree the essential checks and a decision deadline with your team.'}};
export function classify(scores){
 const ranked=Object.keys(TYPES).sort((a,b)=>scores[b]-scores[a]);
 if(ranked.some(k=>!Number.isInteger(scores[k])||scores[k]<0)||ranked.reduce((n,k)=>n+scores[k],0)!==12)throw new Error('Invalid scores');
 if(scores[ranked[0]]-scores[ranked[3]]<=2)return {kind:'balanced',types:ranked,label:'An evenly balanced pattern'};
 if(scores[ranked[0]]-scores[ranked[1]]>=3)return {kind:'primary',types:[ranked[0]],label:TYPES[ranked[0]]+' tendency'};
 const leaders=ranked.filter(k=>scores[k]===scores[ranked[0]]);
 const types=leaders.length>=3?leaders:ranked.slice(0,2);
 return {kind:'blend',types,label:types.join(' + ')+' blend'};
}
export function validateResponses(data,complete=true){
 if(!data||typeof data!=='object'||!data.answers||typeof data.answers!=='object'||Array.isArray(data.answers))throw new Error('Please complete the activity choices.');
 const keys=Object.keys(data.answers);
 if(keys.some(k=>!QUESTIONS.some(q=>q.id===k))||keys.some(k=>!Object.hasOwn(TYPES,data.answers[k])))throw new Error('Invalid activity response.');
 if(complete&&keys.length!==12)throw new Error('Please answer all 12 decisions.');
 if(!Array.isArray(data.crew)||new Set(data.crew).size!==data.crew.length||data.crew.length>3||data.crew.some(id=>!CREW.some(p=>p.id===id))||(complete&&data.crew.length!==3))throw new Error('Choose three teammates.');
 if(complete&&![0,1,2].includes(data.reflection))throw new Error('Please complete the final reflection.');
 if(!Number.isInteger(data.step)||data.step<0||data.step>13)throw new Error('Invalid progress.');
 return {answers: data.answers,crew:data.crew,reflection:[0,1,2].includes(data.reflection)?data.reflection:null,step:data.step,version:VERSION};
}
export function score(data){validateResponses(data);const scores={D:0,I:0,S:0,C:0};for(const type of Object.values(data.answers))scores[type]++;return {scores,pattern:classify(scores)};}
export function fallbackReport(pattern){
 if(pattern.kind==='balanced')return {headline:'You chose a range of team approaches.',summary:'Your responses were spread fairly evenly across action, enthusiasm, support and clarity. This short experience did not identify a clear leading tendency.',strengths:['Considering outcomes','Including people','Checking requirements'],watch:'Your preferred approach may be less obvious to teammates.',tip:'Explain what matters most to you in the current situation and why.'};
 if(pattern.kind==='primary')return {...PROFILES[pattern.types[0]]};
 const chosen=pattern.types.map(k=>PROFILES[k]);
 return {headline:'You bring a blend of approaches.',summary:`Your choices suggest a blend of ${pattern.types.map(k=>TYPES[k].toLowerCase()).join(', ')}. You may draw on these preferences in different team situations.`,strengths:[...new Set(chosen.flatMap(p=>p.strengths.slice(0,2)))].slice(0,3),watch:chosen.map(p=>p.watch).join(' '),tip:'Discuss which approach the current situation needs, then agree a next action together.'};
}
export function reportText(p){const r=p.report;return `WildDrift Team Instinct\n${p.name} · ${p.company}\n${p.pattern.label}\n\n${r.headline}\n${r.summary}\n\nThree strengths\n${r.strengths.map(s=>'• '+s).join('\n')}\n\nWatch-out: ${r.watch}\nTry this: ${r.tip}\n\n${p.draft?.reflection===2?'You were experimenting; treat these insights as exploratory.\n':''}${DISCLAIMER}`;}
export function normalisePhone(raw){let s=String(raw??'').replace(/[\s()-]/g,'');if(/^0\d{9}$/.test(s))s='+94'+s.slice(1);if(!/^\+[1-9]\d{7,14}$/.test(s))throw new Error('Enter a valid WhatsApp number with country code, such as +94 77 123 4567.');return s;}
export function normaliseCode(code){const c=String(code??'').trim().toUpperCase();if(!/^[A-Z]{2}\d{3}$/.test(c))throw new Error('Team codes have two letters and three numbers, for example AB482.');return c;}
