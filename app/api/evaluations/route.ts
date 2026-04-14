import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: "Missing UID" }, { status: 400 });

  try {
    const history = await prisma.userEvaluation.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}