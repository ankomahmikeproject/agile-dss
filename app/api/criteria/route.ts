import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET() {
  try {
    //  RETRIEVE STORED CRITERIA
    // This pulls the decision factors (Name, Description) from the Criterion table
    const criteria = await prisma.criterion.findMany({
      orderBy: { 
        name: 'asc' // Sorting by name often makes the form feel more organized
      }
    });

    // If the database is empty (after a reset), we send a 404 to trigger the UI warning
    if (!criteria || criteria.length === 0) {
      return NextResponse.json(
        { error: "No criteria found. Ensure the database is seeded." }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(criteria);
  } catch (error) {
    // This logs the specific failure to the  terminal
    console.error("❌ DATABASE FETCH ERROR (Criteria):", error);
    
    return NextResponse.json(
      { error: "Internal Server Error: Failed to load criteria from database." }, 
      { status: 500 }
    );
  }
}