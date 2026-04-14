import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import { assessmentData } from '../src/lib/assessment-data'
import { copilotAssessmentData } from '../src/lib/copilot-assessment-data'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: dbPath })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting migration of assessment data...')

  // ── General AI domains ──────────────────────────────────────────────────
  console.log('Seeding General AI domains...')
  for (const domain of assessmentData) {
    const dbDomain = await prisma.assessmentDomain.upsert({
      where: { name: domain.name },
      update: {
        description: domain.description,
        weight: domain.weight,
        trackType: 'GENERAL',
      },
      create: {
        name: domain.name,
        description: domain.description,
        weight: domain.weight,
        trackType: 'GENERAL',
      },
    })

    console.log(`  [GENERAL] ${dbDomain.name}`)

    for (const q of domain.questions) {
      await prisma.assessmentQuestion.upsert({
        where: { id: q.id },
        update: {
          text: q.text,
          weight: q.weight,
          scoringGuide: JSON.stringify(q.scoringGuide || {}),
          domainId: dbDomain.id,
        },
        create: {
          id: q.id,
          text: q.text,
          weight: q.weight,
          scoringGuide: JSON.stringify(q.scoringGuide || {}),
          domainId: dbDomain.id,
        },
      })
    }
  }

  // ── Copilot domains ──────────────────────────────────────────────────────
  console.log('Seeding Copilot domains...')
  for (const domain of copilotAssessmentData) {
    const dbDomain = await prisma.assessmentDomain.upsert({
      where: { name: domain.name },
      update: {
        description: domain.description,
        weight: domain.weight,
        trackType: 'COPILOT',
      },
      create: {
        name: domain.name,
        description: domain.description,
        weight: domain.weight,
        trackType: 'COPILOT',
      },
    })

    console.log(`  [COPILOT] ${dbDomain.name}`)

    for (const q of domain.questions) {
      await prisma.assessmentQuestion.upsert({
        where: { id: q.id },
        update: {
          text: q.text,
          weight: q.weight,
          scoringGuide: JSON.stringify(q.scoringGuide || {}),
          domainId: dbDomain.id,
        },
        create: {
          id: q.id,
          text: q.text,
          weight: q.weight,
          scoringGuide: JSON.stringify(q.scoringGuide || {}),
          domainId: dbDomain.id,
        },
      })
    }
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
