import {handleOperation,HttpError} from '../lib/backend.js';
const READ=new Set(['config','me','dashboard']);
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');
 try{
 const url=new URL(req.url,'http://localhost');const op=req.query?.op||url.searchParams.get('op');
 if(!op||!/^[a-z-]+$/.test(op))throw new HttpError(404,'Page not found.');
 const expected=READ.has(op)?'GET':'POST';if(req.method!==expected){res.setHeader('Allow',expected);throw new HttpError(405,'Method not allowed.');}
 if(req.method==='POST'){
  const origin=req.headers.origin;const expectedOrigin=process.env.APP_URL?new URL(process.env.APP_URL).origin:null;
  if(!origin||!expectedOrigin||origin!==expectedOrigin)throw new HttpError(403,'Please open the experience from its own website.');
  if(!req.headers['content-type']?.startsWith('application/json'))throw new HttpError(415,'Please send a valid request.');
 }
 let body=req.body;
 if(body===undefined&&req.method==='POST'){let raw='';for await(const part of req){raw+=part;if(Buffer.byteLength(raw)>16384)throw new HttpError(413,'Request is too large.');}body=JSON.parse(raw||'{}');}
 if(typeof body==='string'){if(Buffer.byteLength(body)>16384)throw new HttpError(413,'Request is too large.');body=JSON.parse(body);}
 if(body!==undefined&&(body===null||typeof body!=='object'||Array.isArray(body)))throw new HttpError(400,'Invalid request.');
 if(body&&Buffer.byteLength(JSON.stringify(body))>16384)throw new HttpError(413,'Request is too large.');
 const result=await handleOperation(op,req,res,body);res.statusCode=200;res.end(JSON.stringify(result));
 }catch(e){res.statusCode=e.status||((e instanceof SyntaxError||/^Please|^Invalid|^Enter|^Choose|^Team codes/.test(e.message))?400:500);res.end(JSON.stringify({error:e.status||res.statusCode===400?e.message:'Something went wrong. Please try again.'}));}
}
