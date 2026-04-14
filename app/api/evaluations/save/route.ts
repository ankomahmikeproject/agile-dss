import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log("📥 RECEIVED SAVE DATA:", body);

    const { userId, sector, weights, results } = body;

    if (!results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: "Results missing or invalid" }, { status: 400 });
    }

    const savedEval = await prisma.userEvaluation.create({
      data: {
        userId: userId || "anonymous",
        sector: sector || "General",
        recommendation: String(results[0].name), 
        score: Number(results[0].score),         
        weights: weights as Prisma.InputJsonValue, 
        results: results as Prisma.InputJsonValue, 
      } as any
    });

    console.log("✅ DB SAVE SUCCESSFUL:", savedEval.id);
    return NextResponse.json(savedEval);

  } catch (error) {
    console.error("❌ DATABASE SAVE ERROR:", error);
    return NextResponse.json(
      { 
        error: "Persistence Error", 
        details: error instanceof Error ? error.message : "Unknown" 
      }, 
      { status: 500 }
    );
  }
}