import prisma from '../src/lib/prisma'
import { METHODOLOGY } from '../src/lib/methodology'

async function backfillPhaseData(customerId: string, targetPhase: number) {
  // Always create an assessment if targetPhase > 1 or even if it's 1
  await prisma.assessment.create({
    data: {
      customerId,
      scoreStrategy: targetPhase >= 2 ? 4.5 : 2.5,
      scoreData: targetPhase >= 2 ? 3.5 : 2.0,
      scoreTech: targetPhase >= 2 ? 4.0 : 3.0,
      scoreSecurity: targetPhase >= 2 ? 4.5 : 4.0,
      scoreSkills: targetPhase >= 2 ? 3.0 : 2.0,
      scoreOps: targetPhase >= 2 ? 3.5 : 2.5,
      scoreGovernance: targetPhase >= 2 ? 4.0 : 3.0,
      scoreFinancial: targetPhase >= 2 ? 3.5 : 2.0,
      status: 'COMPLETED',
      completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  })

  // Backfill tasks and deliverables for phases 1 to targetPhase - 1
  for (let phaseNum = 1; phaseNum < targetPhase; phaseNum++) {
    const phaseDef = METHODOLOGY.find(p => p.number === phaseNum)
    if (!phaseDef) continue

    // Complete all subtasks
    for (const subtask of phaseDef.subtasks) {
      await prisma.phaseTask.create({
        data: {
          customerId,
          phaseNumber: phaseNum,
          taskKey: subtask.key,
          completed: true,
          completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        }
      })
    }

    // Complete all deliverables
    for (const deliv of phaseDef.deliverables) {
      await prisma.deliverable.create({
        data: {
          customerId,
          phaseNumber: phaseNum,
          deliverableKey: deliv.key,
          status: 'COMPLETED',
          generatedContent: `# Generated Draft for ${deliv.title}\n\nThis was automatically generated and completed during Phase ${phaseNum}.`,
          generatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        }
      })
    }
  }

  // Generate some drafts for the current phase if > 1
  if (targetPhase > 1) {
    const currentPhaseDef = METHODOLOGY.find(p => p.number === targetPhase)
    if (currentPhaseDef) {
       for (const subtask of currentPhaseDef.subtasks.slice(0, 2)) {
         await prisma.phaseTask.create({
            data: {
              customerId,
              phaseNumber: targetPhase,
              taskKey: subtask.key,
              completed: true,
              completedAt: new Date()
            }
          })
       }
    }
  }
}


async function main() {
  console.log('Clearing existing data...')
  // Clear all data due to cascade relations. Deleting Customer clears UseCase, PhaseTask, Deliverable, Document, Assessment
  await prisma.customer.deleteMany({})

  console.log('Inserting 8 companies with 3 Use Cases each...')

  // Phase 1 Company
  const techNova = await prisma.customer.create({
    data: {
      name: 'TechNova',
      industry: 'Software',
      employees: '50-200',
      ambitionLevel: 5,
      currentPhase: 1,
      useCases: {
        create: [
          {
            title: 'Automated Code Generation',
            description: 'AI-assisted code generation for common boilerplate code.',
            department: 'Engineering',
            expectedBenefits: 'Faster time to market, reduced developer fatigue.',
            roiEstimate: 85000,
            priority: 'HIGH',
            phase: 1,
            status: 'DRAFT'
          },
          {
            title: 'Customer Support Bot',
            description: 'Implementation of a basic conversational bot to handle L1 support tickets.',
            department: 'Support',
            expectedBenefits: 'Reduced ticket volume, faster response times.',
            roiEstimate: 45000,
            priority: 'MEDIUM',
            phase: 1,
            status: 'DRAFT'
          },
          {
            title: 'Automated QA Testing',
            description: 'Generative AI to write and maintain E2E tests.',
            department: 'Engineering',
            expectedBenefits: 'Higher test coverage and reduced manual QA effort.',
            roiEstimate: 60000,
            priority: 'HIGH',
            phase: 1,
            status: 'DRAFT'
          }
        ]
      }
    }
  })
  await backfillPhaseData(techNova.id, 1)

  // Phase 2 Company
  const finSecure = await prisma.customer.create({
    data: {
      name: 'FinSecure',
      industry: 'Finance',
      employees: '500-1000',
      ambitionLevel: 4,
      currentPhase: 2,
      useCases: {
        create: [
          {
            title: 'Fraud Detection Analytics',
            description: 'Machine learning model to detect anomalous transaction patterns in real-time.',
            department: 'Risk Management',
            expectedBenefits: 'Significant reduction in fraudulent transactions and financial losses.',
            roiEstimate: 250000,
            priority: 'HIGH',
            phase: 2,
            status: 'PILOTING'
          },
          {
            title: 'Document Data Extraction',
            description: 'Extracting data from KYC documents automatically using OCR and NLP.',
            department: 'Operations',
            expectedBenefits: 'Faster customer onboarding.',
            roiEstimate: 75000,
            priority: 'MEDIUM',
            phase: 2,
            status: 'DRAFT'
          },
          {
            title: 'Predictive Credit Scoring',
            description: 'Using alternative AI models to evaluate creditworthiness.',
            department: 'Lending',
            expectedBenefits: 'Expanded customer base and lower default rates.',
            roiEstimate: 120000,
            priority: 'HIGH',
            phase: 2,
            status: 'DRAFT'
          }
        ]
      }
    }
  })
  await backfillPhaseData(finSecure.id, 2)

  // Phase 3 Company
  const healthLink = await prisma.customer.create({
    data: {
      name: 'HealthLink',
      industry: 'Healthcare',
      employees: '1000-5000',
      ambitionLevel: 4,
      currentPhase: 3,
      useCases: {
        create: [
          {
            title: 'Medical Imaging Analysis',
            description: 'AI assistant to highlight potential abnormalities in X-rays and MRIs.',
            department: 'Radiology',
            expectedBenefits: 'Faster diagnosis and reduced human error.',
            roiEstimate: 300000,
            priority: 'HIGH',
            phase: 3,
            status: 'PRODUCTION'
          },
          {
            title: 'Patient Triage System',
            description: 'NLP based symptom checker for initial patient routing.',
            department: 'Operations',
            expectedBenefits: 'Reduced wait times and better resource allocation.',
            roiEstimate: 95000,
            priority: 'MEDIUM',
            phase: 2,
            status: 'PILOTING'
          },
          {
            title: 'Automated Appointment Scheduling',
            description: 'Smart scheduling assistant for optimizing doctor availability.',
            department: 'Administration',
            expectedBenefits: 'Fewer no-shows and optimized calendars.',
            roiEstimate: 40000,
            priority: 'LOW',
            phase: 1,
            status: 'APPROVED'
          }
        ]
      }
    }
  })
  await backfillPhaseData(healthLink.id, 3)

  // Phase 4 Company
  const autoDrive = await prisma.customer.create({
    data: {
      name: 'AutoDrive',
      industry: 'Automotive',
      employees: '5000+',
      ambitionLevel: 5,
      currentPhase: 4,
      useCases: {
        create: [
          {
            title: 'Predictive Maintenance',
            description: 'IoT sensor anomaly detection to predict equipment failure before it happens.',
            department: 'Manufacturing',
            expectedBenefits: 'Drastically reduced unplanned downtime.',
            roiEstimate: 500000,
            priority: 'HIGH',
            phase: 4,
            status: 'PRODUCTION'
          },
          {
            title: 'Supply Chain Optimization',
            description: 'AI forecasting for part demands and logistics rerouting.',
            department: 'Logistics',
            expectedBenefits: 'Lower inventory costs and fewer stockouts.',
            roiEstimate: 200000,
            priority: 'HIGH',
            phase: 3,
            status: 'PRODUCTION'
          },
          {
            title: 'Visual Quality Inspection',
            description: 'Computer vision to detect defects on the assembly line.',
            department: 'Quality Assurance',
            expectedBenefits: 'Higher product yield and less manual inspection.',
            roiEstimate: 150000,
            priority: 'MEDIUM',
            phase: 3,
            status: 'PILOTING'
          }
        ]
      }
    }
  })
  await backfillPhaseData(autoDrive.id, 4)

  // Phase 5 Company
  const retailMax = await prisma.customer.create({
    data: {
      name: 'RetailMax',
      industry: 'Retail',
      employees: '1000-5000',
      ambitionLevel: 3,
      currentPhase: 5,
      useCases: {
        create: [
          {
            title: 'Hyper-Personalized Recommendations',
            description: 'Real-time recommendation engine based on browsing and purchase history.',
            department: 'E-commerce',
            expectedBenefits: 'Increased average order value and conversion rate.',
            roiEstimate: 350000,
            priority: 'HIGH',
            phase: 5,
            status: 'PRODUCTION'
          },
          {
            title: 'Dynamic Pricing',
            description: 'Algorithmic pricing adjustments based on demand, competitor prices, and inventory.',
            department: 'Sales',
            expectedBenefits: 'Maximized margins and competitive positioning.',
            roiEstimate: 280000,
            priority: 'HIGH',
            phase: 4,
            status: 'PRODUCTION'
          },
          {
            title: 'Inventory Demand Forecasting',
            description: 'Predicting stock requirements across regions using weather and trend data.',
            department: 'Procurement',
            expectedBenefits: 'Reduced holding costs and minimized overstock.',
            roiEstimate: 120000,
            priority: 'MEDIUM',
            phase: 4,
            status: 'PRODUCTION'
          }
        ]
      }
    }
  })
  await backfillPhaseData(retailMax.id, 5)

  // Phase 1 Company
  const agriGrow = await prisma.customer.create({
    data: {
      name: 'AgriGrow',
      industry: 'Agriculture',
      employees: '200-500',
      ambitionLevel: 4,
      currentPhase: 1,
      useCases: {
        create: [
          {
            title: 'Crop Yield Prediction',
            description: 'Satellite imagery and soil data analysis to estimate future yields.',
            department: 'Operations',
            expectedBenefits: 'Better farm management and revenue forecasting.',
            roiEstimate: 180000,
            priority: 'HIGH',
            phase: 1,
            status: 'DRAFT'
          },
          {
            title: 'Pest Detection via Drones',
            description: 'Drone-captured image analysis to identify pest infestations early.',
            department: 'Farming',
            expectedBenefits: 'Targeted pesticide use and saved crop value.',
            roiEstimate: 95000,
            priority: 'MEDIUM',
            phase: 1,
            status: 'DRAFT'
          },
          {
            title: 'Automated Irrigation Control',
            description: 'Smart irrigation schedules based on weather forecasts and soil moisture.',
            department: 'Facilities',
            expectedBenefits: 'Water conservation and optimized growth.',
            roiEstimate: 45000,
            priority: 'LOW',
            phase: 1,
            status: 'DRAFT'
          }
        ]
      }
    }
  })
  await backfillPhaseData(agriGrow.id, 1)

  // Phase 2 Company
  const eduTech = await prisma.customer.create({
    data: {
      name: 'EduTech',
      industry: 'Education',
      employees: '50-200',
      ambitionLevel: 5,
      currentPhase: 2,
      useCases: {
        create: [
          {
            title: 'Personalized Learning Paths',
            description: 'AI tutoring system that adapts curriculum based on student performance.',
            department: 'Curriculum',
            expectedBenefits: 'Improved student outcomes and engagement.',
            roiEstimate: 150000,
            priority: 'HIGH',
            phase: 2,
            status: 'PILOTING'
          },
          {
            title: 'Student Dropout Prediction',
            description: 'Early warning system identifying at-risk students based on engagement metrics.',
            department: 'Student Success',
            expectedBenefits: 'Higher retention rates.',
            roiEstimate: 85000,
            priority: 'MEDIUM',
            phase: 1,
            status: 'APPROVED'
          },
          {
            title: 'Automated Essay Grading',
            description: 'NLP model to assist teachers in grading written assignments.',
            department: 'Academics',
            expectedBenefits: 'Reduced teacher workload.',
            roiEstimate: 40000,
            priority: 'LOW',
            phase: 2,
            status: 'DRAFT'
          }
        ]
      }
    }
  })
  await backfillPhaseData(eduTech.id, 2)

  // Phase 3 Company
  const logistiCorp = await prisma.customer.create({
    data: {
      name: 'LogistiCorp',
      industry: 'Logistics',
      employees: '1000-5000',
      ambitionLevel: 4,
      currentPhase: 3,
      useCases: {
        create: [
          {
            title: 'Dynamic Route Optimization',
            description: 'Real-time delivery route adjustments considering traffic and weather.',
            department: 'Operations',
            expectedBenefits: 'Fuel savings and faster delivery times.',
            roiEstimate: 400000,
            priority: 'HIGH',
            phase: 3,
            status: 'PRODUCTION'
          },
          {
            title: 'Warehouse Automation Bots',
            description: 'Vision-guided robots for automated picking and packing.',
            department: 'Fulfillment',
            expectedBenefits: 'Increased throughput and reduced labor costs.',
            roiEstimate: 250000,
            priority: 'HIGH',
            phase: 2,
            status: 'PILOTING'
          },
          {
            title: 'Fleet Maintenance Prediction',
            description: 'Telematics analysis to predict vehicle breakdowns.',
            department: 'Maintenance',
            expectedBenefits: 'Minimal downtime and extended vehicle lifespan.',
            roiEstimate: 120000,
            priority: 'MEDIUM',
            phase: 2,
            status: 'PILOTING'
          }
        ]
      }
    }
  })
  await backfillPhaseData(logistiCorp.id, 3)

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
