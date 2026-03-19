/**
 * AI Intake Demo — Playwright video recording
 * Run:  node record-demo.mjs
 * Output: demo-output/ai-intake-demo.webm
 */
import { chromium } from 'playwright'
import { mkdirSync, readdirSync, renameSync, statSync } from 'fs'
import { join } from 'path'

const BASE     = 'http://localhost:3000'
const NEXUS_ID = 'cmmxz30vo0000mwvrp9yhmtuy'
const OUT_DIR  = join(process.cwd(), 'demo-output')
mkdirSync(OUT_DIR, { recursive: true })

const NOTES = `Meeting Notes — Nexus Manufacturing GmbH
Discovery Workshop — 19 March 2026
Attendees: CEO (Thomas Brandt), CFO (Sabine Koch), Head of Operations (Ralf Mayer), IT Director (Eva Schreiber), Consultant Team

EXECUTIVE SUMMARY
Strong commitment from CEO Thomas Brandt who is acting as our executive sponsor and champion for this AI initiative. He has a clear vision: reduce operational costs by 15% within 18 months using AI. The CFO flagged that the budget for this transformation has been ring-fenced at EUR 800,000 for the first year — a positive signal on the financial side.

TECHNOLOGY LANDSCAPE
The IT Director shared a sobering picture. Nexus runs on a heavily customised SAP ECC 6.0 instance from 2009, on-prem infrastructure with no cloud strategy in place. Legacy architecture is the single biggest blocker — most systems are on-premise and there is no API layer to connect modern AI tooling. Significant investment in cloud migration would be required before advanced AI use cases are feasible.

DATA & ANALYTICS
Data is highly siloed across 4 plant locations with no central data warehouse. Each plant runs its own reporting in Excel. There are significant data quality issues in the production planning module. The team acknowledged that before any AI can be applied, data governance and a centralised data platform are prerequisites.

OPERATIONS & WORKFLOW
The Head of Operations identified two key pain points: (1) purchase invoice processing — the finance and billing team manually processes 3,000+ supplier invoices per month, which is error-prone and slow, and (2) customer complaint handling — the customer support team receives 800+ emails per week, each requiring manual triage and routing to the correct department.

SECURITY & COMPLIANCE
The CFO raised compliance concerns: GDPR obligations for customer data and NIS2 requirements for operational technology security need to be addressed. Risk appetite is moderate — the team wants AI solutions that are explainable and auditable.

SKILLS & TALENT
The Head of Operations confirmed that skills are a significant gap. The workforce has limited digital literacy and there is no existing data science capability in-house. A structured training programme will be essential. Talent acquisition for a Data Engineer role has been approved.

GOVERNANCE
The team confirmed they are beginning to develop AI standards and policy frameworks — they have a draft AI governance charter in progress. Standards for how AI tools can be used internally are being co-developed with Legal.

STRATEGIC ALIGNMENT
The CEO stated priorities are: operational excellence, cost reduction, and becoming a data-driven manufacturer by 2028. The AI initiative has strong executive backing and is linked to the 5-year transformation roadmap. Marketing and content automation was also briefly mentioned as a future consideration for their product catalogue team.

NEXT STEPS
Consultant team to produce an AI Readiness Report. Budget: EUR 800,000 confirmed for Year 1. Finance team to provide invoice volume data for ROI modelling.`

const wait = ms => new Promise(r => setTimeout(r, ms))
const scrollBy  = (pg, px) => pg.evaluate(n => window.scrollBy({ top: n, behavior: 'smooth' }), px)
const scrollTop = pg => pg.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))

async function run() {
    console.log('🎬  Launching browser with video recording…')

    const ctx = await chromium.launchPersistentContext('', {
        headless: false,
        viewport: { width: 1280, height: 800 },
        recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 800 } },
        args: ['--disable-blink-features=AutomationControlled'],
    })

    const pg = await ctx.newPage()
    await pg.setViewportSize({ width: 1280, height: 800 })

    try {
        // ── 1. DASHBOARD ────────────────────────────────────────────────────
        console.log('  1/9  Dashboard overview…')
        await pg.goto(BASE, { waitUntil: 'networkidle' })
        await wait(2800)
        await scrollBy(pg, 350)
        await wait(2000)
        await scrollBy(pg, 350)
        await wait(1500)
        await scrollTop(pg)
        await wait(1200)

        // ── 2. CUSTOMER PORTFOLIO ───────────────────────────────────────────
        console.log('  2/9  Customer portfolio…')
        await pg.click('a[href="/customers"]')
        await pg.waitForLoadState('networkidle')
        await wait(2500)
        const customerLinks = await pg.locator('a[href*="/customers/cmm"]').all()
        for (const c of customerLinks.slice(0, 5)) {
            try { await c.hover({ timeout: 800 }) } catch {}
            await wait(320)
        }
        await wait(800)

        // ── 3. NEXUS PROFILE ────────────────────────────────────────────────
        console.log('  3/9  Nexus Manufacturing profile…')
        await pg.goto(`${BASE}/customers/${NEXUS_ID}`, { waitUntil: 'networkidle' })
        await wait(2800)
        await scrollBy(pg, 300)
        await wait(1500)
        await scrollTop(pg)
        await wait(1000)
        // Highlight the AI Intake button
        await pg.locator(`a[href="/customers/${NEXUS_ID}/intake"]`).hover()
        await wait(1000)

        // ── 4. AI INTAKE PAGE ───────────────────────────────────────────────
        console.log('  4/9  Opening AI Intake…')
        await pg.goto(`${BASE}/customers/${NEXUS_ID}/intake`, { waitUntil: 'networkidle' })
        await wait(2500)

        // ── 5. PASTE MEETING NOTES ──────────────────────────────────────────
        console.log('  5/9  Pasting meeting notes…')
        const textarea = pg.locator('textarea').first()
        await textarea.click()
        await wait(400)
        await textarea.fill(NOTES)
        await wait(600)
        // Scroll textarea to show content
        await pg.evaluate(() => { const t = document.querySelector('textarea'); if (t) t.scrollTop = 250 })
        await wait(900)
        await pg.evaluate(() => { const t = document.querySelector('textarea'); if (t) t.scrollTop = 650 })
        await wait(900)
        await pg.evaluate(() => { const t = document.querySelector('textarea'); if (t) t.scrollTop = 0 })
        await wait(600)

        // Hover the Analyse button
        const analyseBtn = pg.locator('button', { hasText: 'Launch Strategic Analysis' })
        await analyseBtn.scrollIntoViewIfNeeded()
        await analyseBtn.hover()
        await wait(800)

        // ── 6. LAUNCH ANALYSIS ──────────────────────────────────────────────
        console.log('  6/9  Launching analysis…')
        await analyseBtn.click()
        // Show the full AI spinner (3 s delay + buffer)
        await wait(5000)

        // ── 7. REVIEW RESULTS ───────────────────────────────────────────────
        console.log('  7/9  Reviewing results…')
        await pg.waitForSelector('text=Roadmap Update Preview', { timeout: 10000 })
        await wait(2000)
        await scrollBy(pg, 380)
        await wait(2000)
        // Hover a couple of domain rows to show interactivity
        for (const row of (await pg.locator('[class*="rounded-3xl"][class*="border"]').all()).slice(0, 3)) {
            try { await row.hover({ timeout: 600 }) } catch {}
            await wait(400)
        }
        await wait(600)

        // ── 8. REJECT LAST USE CASE ─────────────────────────────────────────
        console.log('  8/9  Toggling off Generative Content use case…')
        // Find the "Reject Proposal" button on the last use case card
        const rejectBtns = pg.locator('button[title="Reject Proposal"]')
        const count = await rejectBtns.count()
        if (count > 0) {
            const lastReject = rejectBtns.nth(count - 1)
            await lastReject.scrollIntoViewIfNeeded()
            await wait(500)
            await lastReject.hover()
            await wait(600)
            await lastReject.click()
            await wait(1500)
        } else {
            console.log('    ⚠ Reject button not found — skipping toggle')
        }
        // Scroll back up to show the updated count in the header
        await scrollTop(pg)
        await wait(1500)

        // ── 9. COMMIT ───────────────────────────────────────────────────────
        console.log('  9/9  Committing approved items…')
        const commitBtn = pg.locator('button', { hasText: 'Commit Approved Items' })
        await commitBtn.scrollIntoViewIfNeeded()
        await commitBtn.hover()
        await wait(800)
        await commitBtn.click()

        // Show saving state
        await pg.waitForSelector('text=Synchronizing Roadmap', { timeout: 6000 }).catch(() => {})
        await wait(2000)

        // Wait for redirect to customer profile
        await pg.waitForURL(`**/${NEXUS_ID}**`, { timeout: 15000 }).catch(() => {})
        await pg.waitForLoadState('networkidle').catch(() => {})
        await wait(3000)

        // Show updated profile — scroll to reveal assessment scores and new use cases
        await scrollBy(pg, 300)
        await wait(1800)
        await scrollBy(pg, 300)
        await wait(1800)

        // Click Phase 2 to show the new use cases
        try {
            const navItems = pg.locator('button').filter({ hasText: '2' })
            const cnt = await navItems.count()
            if (cnt > 0) {
                await navItems.first().click()
                await wait(1200)
                await scrollBy(pg, 400)
                await wait(2500)
            }
        } catch { /* skip */ }

        // Return to dashboard — clean close
        await scrollTop(pg)
        await wait(600)
        await pg.click('a[href="/"]')
        await pg.waitForLoadState('networkidle')
        await wait(3000)

        console.log('\n✅  Recording complete.')

    } catch (err) {
        console.error('\n❌  Error:', err.message)
    } finally {
        // Capture video path BEFORE closing (Playwright finalises after close)
        const video = pg.video()
        await ctx.close()
        await wait(2000)

        if (video) {
            try {
                const src  = await video.path()
                const dest = join(OUT_DIR, 'ai-intake-demo.webm')
                renameSync(src, dest)
                const { size } = statSync(dest)
                console.log(`\n🎬  Video saved → ${dest}  (${(size / 1024 / 1024).toFixed(1)} MB)`)
            } catch (e) {
                console.log('Could not rename video:', e.message)
            }
        }
    }
}

run().catch(e => { console.error(e); process.exit(1) })
