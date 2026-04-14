import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const mode = searchParams.get('mode');

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    //CLEAR ALL
    if (mode === 'all') {
      await prisma.userEvaluation.deleteMany({
        where: { userId: userId }
      });
      return NextResponse.json({ success: true });
    }

    // SINGLE DELETE
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

    await prisma.userEvaluation.delete({
      where: {
        id: id,
        userId: userId 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE ERROR:", error);
    return NextResponse.json({ error: "Database rejection" }, { status: 500 });
  }
}