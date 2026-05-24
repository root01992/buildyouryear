import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/db';
import { readSession } from '@/lib/session';

export const runtime = 'nodejs';

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const users = await getUsersCollection();
    const user = await users.findOne(
      { _id: new ObjectId(session.sub) },
      { projection: { passwordHash: 0, data: 0 } },
    );
    if (!user) return NextResponse.json({ user: null }, { status: 401 });

    return NextResponse.json({
      user: {
        id: user._id!.toString(),
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt.getTime(),
      },
    });
  } catch (err) {
    console.error('[me] failed:', err);
    return NextResponse.json({ user: null, error: 'Session lookup failed.' }, { status: 500 });
  }
}
