import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || userId === 'undefined') {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const history = await prisma.userEvaluation.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(history || []);
  } catch (error) {
    console.error("❌ [HISTORY GET] ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const mode = searchParams.get('mode');

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (mode === 'all') {
      await prisma.userEvaluation.deleteMany({ where: { userId } });
      return NextResponse.json({ success: true });
    }

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.userEvaluation.deleteMany({
      where: { id: id, userId: userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}