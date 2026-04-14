import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateSAW } from '@/lib/engine';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📥 EVALUATE REQUEST RECEIVED");

    const { weights, sector } = body; 

    // SYSTEM VALIDATES INPUT 
    if (!weights || !sector) {
      return NextResponse.json({ error: 'Incomplete Input.' }, { status: 400 });
    }

    // RETRIEVE KNOWLEDGE BASE 
    const frameworks = await prisma.framework.findMany({
      include: {
        scores: {
          select: { criterionId: true, value: true },
        },
      },
    });

    if (!frameworks || frameworks.length === 0) {
      return NextResponse.json({ error: 'Profiles not found.' }, { status: 500 });
    }

    // MATHEMATICAL ENGINE (SAW CALCULATION) 
    const rankings = calculateSAW(frameworks, weights);
    const topResult = rankings[0];

    // AI STRATEGIC INSIGHT
    let aiInsight = "Standard alignment protocols applied.";
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `
        Context: You are a Senior Strategic Advisor at Agile-Decision Support.
        Sector: ${sector}
        Top Recommendation: ${topResult.name} (Score: ${topResult.score}%)
        Priority Weights: ${JSON.stringify(weights)}
        
        Task: Provide a 2-sentence executive insight explaining why this framework is the strategic winner based on the user's specific priorities. 
        Tone: Aggressive, precise, authoritative. No fluff.
      `;

      const aiResponse = await model.generateContent(prompt);
      aiInsight = aiResponse.response.text().trim();
    } catch (aiError) {
      console.error("⚠️ AI Insight Generation Failed:", aiError);
      // Fallback to static insight if API fails
    }

    console.log("✅ EVALUATION COMPLETE");
    
    // Return BOTH the rankings and the AI insight
    return NextResponse.json({
      rankings,
      aiInsight 
    });

  } catch (error) {
    console.error('MCDA Engine Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}