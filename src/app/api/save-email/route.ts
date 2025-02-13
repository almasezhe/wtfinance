import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

type Database = {
  emails: { email: string; createdAt: string }[];
};

const adapter = new JSONFile<Database>('emails.json');
const db = new Low<Database>(adapter, { emails: [] });

await db.read();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ success: false, message: "Invalid email" }), { status: 400 });
    }

    db.data.emails.push({ email, createdAt: new Date().toISOString() });
    await db.write();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
    