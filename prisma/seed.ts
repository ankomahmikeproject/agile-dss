import { PrismaClient, Criterion } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding (Step 3: Populating Knowledge Base)...');

  await prisma.frameworkScore.deleteMany({});
  await prisma.criterion.deleteMany({});
  await prisma.framework.deleteMany({});

  const criteriaData = [
    { name: 'Team Size', description: 'Scale of the organization in terms of the number of teams.' },
    { name: 'Governance', description: 'The level of formal process and compliance oversight required.' },
    { name: 'Technical Excellence', description: 'Importance of engineering practices like CI/CD and TDD.' },
    { name: 'Flexibility', description: 'The ability to adapt or customize the framework to local needs.' },
    { name: 'Organization Culture', description: 'Alignment with decentralized vs. centralized decision-making.' },
    { name: 'Market Dynamic', description: 'The speed of change in your specific industry sector.' }
  ];

  const createdCriteria: Record<string, Criterion> = {};

  for (const c of criteriaData) {
    const newCriterion = await prisma.criterion.create({ 
      data: {
        name: c.name,
        description: c.description
      } 
    });
    createdCriteria[c.name] = newCriterion;
  }

  
  const frameworks = [
    { 
      name: 'SAFe', 
      description: 'Scaled Agile Framework: Highly structured, best for large enterprises with strict compliance.',
      scores: { 'Team Size': 10, 'Governance': 10, 'Technical Excellence': 7, 'Flexibility': 3, 'Organization Culture': 3, 'Market Dynamic': 6 } 
    },
    { 
      name: 'LeSS', 
      description: 'Large-Scale Scrum: Minimalist and decentralized, focuses on simplicity.',
      scores: { 'Team Size': 7, 'Governance': 3, 'Technical Excellence': 9, 'Flexibility': 6, 'Organization Culture': 10, 'Market Dynamic': 9 } 
    },
    { 
      name: 'DA', 
      description: 'Disciplined Agile: A toolkit approach that offers high customizability.',
      scores: { 'Team Size': 8, 'Governance': 6, 'Technical Excellence': 6, 'Flexibility': 10, 'Organization Culture': 7, 'Market Dynamic': 7 } 
    },
    { 
      name: 'Scrum@Scale', 
      description: 'A lightweight scaling framework based on the Scrum Guide.',
      scores: { 'Team Size': 8, 'Governance': 5, 'Technical Excellence': 7, 'Flexibility': 8, 'Organization Culture': 8, 'Market Dynamic': 8 } 
    }
  ];

  for (const f of frameworks) {
    const fw = await prisma.framework.create({ 
      data: { 
        name: f.name,
        description: f.description 
      } 
    });
    
    for (const [cName, value] of Object.entries(f.scores)) {
      if (createdCriteria[cName]) {
        await prisma.frameworkScore.create({
          data: {
            frameworkId: fw.id,
            criterionId: createdCriteria[cName].id,
            value: parseFloat(value.toString())
          }
        });
      }
    }
  }

  console.log('Success: Knowledge Base retrieved and seeded into local database.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });