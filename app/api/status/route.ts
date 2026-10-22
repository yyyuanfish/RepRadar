import {modelStatus} from '@/lib/llm';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){return Response.json(await modelStatus());}
