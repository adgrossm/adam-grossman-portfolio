// /api/lib/jcc-config.js
// Centralized configuration for JCC scanners.
// All shared constants live here so scan-greenhouse, scan-lever, and scan-ashby stay in sync.

// ===== ROLE KEYWORDS =====
// Titles must contain one of these substrings to pass the title filter.
// Removed: account manager, enablement manager, operations manager (too broad).
// Kept: solutions consultant (with quota-risk handling in scoring prompt).
// Added: enablement business partner (specifically post-sale CS enablement).
export const ROLE_KEYWORDS = [
  'implementation', 'onboarding', 'customer success', 'program manager',
  'project manager', 'engagement manager', 'delivery manager',
  'delivery consultant', 'client success', 'solutions consultant',
  'technical account', 'partner success', 'csm', 'client partner',
  'client onboarding', 'professional services manager', 'success manager',
  'enablement business partner'
];

// ===== TITLE EXCLUSIONS =====
// Substring matches that override ROLE_KEYWORDS. Used to filter out people-management
// roles where the core function is managing CS team members rather than direct delivery.
export const TITLE_EXCLUSIONS = [
  'manager, customer success', 'manager, account', 'manager, implementation',
  'manager, onboarding', 'manager, solutions', 'manager, relationship',
  'director of customer success', 'director of cs', 'director, customer success',
  'head of customer success', 'vp of customer success', 'vp, customer success',
  // Added: explicit AM/AE exclusions
  'account manager', 'account executive', 'sales executive', 'sales manager',
  'sales development', 'business development representative', 'sdr', 'bdr',
  // Added: enablement coordinator/specialist (lower than business partner level)
  'enablement coordinator', 'enablement specialist'
];

// ===== INTERNATIONAL KEYWORDS =====
// Added: Dubai, UAE, Saudi Arabia, Bahrain, Qatar, Kuwait, Oman (Middle East gap that let GitLab Dubai through).
export const INTERNATIONAL_KEYWORDS = [
  'ireland', 'dublin', 'london', 'uk', 'united kingdom', 'australia', 'aus',
  'singapore', 'india', 'germany', 'france', 'spain', 'netherlands',
  'canada', 'mexico', 'brazil', 'japan', 'korea', 'israel',
  'portugal', 'italy', 'sweden', 'denmark', 'norway', 'poland',
  'philippines', 'indonesia', 'malaysia', 'thailand', 'vietnam',
  'taiwan', 'hong kong', 'china', 'turkey', 'argentina',
  'colombia', 'czech', 'romania', 'new zealand', 'europe',
  'emea', 'apac', 'latam', 'amer', 'south africa', 'peru', 'chile',
  'brussels', 'paris', 'berlin', 'madrid', 'amsterdam', 'tokyo',
  'sydney', 'melbourne', 'toronto', 'vancouver', 'sao paulo',
  // Middle East additions
  'dubai', 'uae', 'united arab emirates', 'saudi arabia', 'riyadh',
  'bahrain', 'qatar', 'doha', 'kuwait', 'oman', 'abu dhabi'
];

// ===== TITLE LOCATION DROPS =====
// Regex patterns in titles that signal a non-US territory or language requirement.
export const TITLE_LOCATION_DROPS = [
  /\|\s*(emea|apac|latam|amer|uk|eu|aus|canada|india|germany|france|spain|netherlands|portugal|italy|brazil|mexico|japan|korea|singapore|south africa|peru|chile|poland|ireland|new zealand|dubai|uae)\b/i,
  /\b(emea|apac|latam)\b/i,
  /\b(german|french|spanish|portuguese|japanese|korean|mandarin|dutch|italian)\s+speak/i,
];

// ===== CHARLOTTE METRO CITIES =====
// Used to detect when a job's location is local enough to be commutable for hybrid roles.
export const CHARLOTTE_METRO_CITIES = [
  'charlotte', 'fort mill', 'rock hill', 'concord', 'huntersville',
  'matthews', 'mooresville', 'pineville', 'indian trail', 'gastonia',
  'belmont', 'kannapolis', 'cornelius', 'davidson', 'monroe',
  'waxhaw', 'tega cay', 'lake wylie', 'indian land', 'harrisburg',
  'mint hill', 'lincolnton', 'salisbury'
];

// ===== ELIGIBLE STATES FOR REMOTE =====
// Adam lives in Fort Mill, SC, 3 miles from NC border. Treats both as eligible.
export const ELIGIBLE_STATES = ['nc', 'sc', 'north carolina', 'south carolina'];

// ===== SINGLE-STATE REMOTE PATTERN =====
// Catches "Remote - CA", "Remote - California", "Remote (USA - California)" etc.
// Used to auto-skip remote roles restricted to states other than NC/SC.
export const SINGLE_STATE_REMOTE = /\bremote\s*[\-\u2013\u2014\(]\s*(?:usa\s*[\-\u2013\u2014]\s*)?([a-z][a-z\s]+?)(?:\s*[\)\,]|$)/i;

// US state abbreviations and full names. Used for parsing state-exclusion language in JDs.
export const US_STATES = {
  'al': 'alabama', 'ak': 'alaska', 'az': 'arizona', 'ar': 'arkansas',
  'ca': 'california', 'co': 'colorado', 'ct': 'connecticut', 'de': 'delaware',
  'fl': 'florida', 'ga': 'georgia', 'hi': 'hawaii', 'id': 'idaho',
  'il': 'illinois', 'in': 'indiana', 'ia': 'iowa', 'ks': 'kansas',
  'ky': 'kentucky', 'la': 'louisiana', 'me': 'maine', 'md': 'maryland',
  'ma': 'massachusetts', 'mi': 'michigan', 'mn': 'minnesota', 'ms': 'mississippi',
  'mo': 'missouri', 'mt': 'montana', 'ne': 'nebraska', 'nv': 'nevada',
  'nh': 'new hampshire', 'nj': 'new jersey', 'nm': 'new mexico', 'ny': 'new york',
  'nc': 'north carolina', 'nd': 'north dakota', 'oh': 'ohio', 'ok': 'oklahoma',
  'or': 'oregon', 'pa': 'pennsylvania', 'ri': 'rhode island', 'sc': 'south carolina',
  'sd': 'south dakota', 'tn': 'tennessee', 'tx': 'texas', 'ut': 'utah',
  'vt': 'vermont', 'va': 'virginia', 'wa': 'washington', 'wv': 'west virginia',
  'wi': 'wisconsin', 'wy': 'wyoming'
};

// ===== ANCHOR DAY / IN-OFFICE LANGUAGE =====
// Patterns that signal a JD requires in-office presence even when the location field is ambiguous.
export const IN_OFFICE_PATTERNS = [
  /\banchor\s+days?\b/i,
  /\bin[\-\s]?office\s+(?:requirement|days?|presence)\b/i,
  /\b(?:must|required\s+to)\s+work\s+(?:from|in)\s+(?:our\s+)?(?:office|hq|headquarters)\b/i,
  /\b\d+\s+days?\s+(?:per\s+week\s+)?in\s+(?:the\s+)?office\b/i,
  /\bonsite\s+(?:requirement|presence)\b/i,
  /\bhybrid\s+(?:role|position).{0,40}(?:san francisco|new york|nyc|sf|seattle|boston|chicago|los angeles|austin|denver|atlanta)\b/i
];

// ===== STATE EXCLUSION LANGUAGE =====
// Patterns that signal a JD lists ineligible US states. If matched, parse the surrounding text
// for state names and skip if NC or SC appears in the exclusion list.
export const STATE_EXCLUSION_PATTERNS = [
  /(?:we\s+cannot\s+(?:hire|employ)|cannot\s+employ\s+candidates\s+(?:residing|living))\s+in[:\s]+([^.]+?\.)/i,
  /(?:not\s+(?:open|eligible)|ineligible)\s+(?:to|for|in)\s+(?:residents\s+of\s+)?[:\s]+([^.]+?\.)/i,
  /location\s+restrictions?[:\s]+([^.]+?\.)/i,
  /this\s+role\s+is\s+not\s+(?:open|available)\s+(?:to|in)\s+([^.]+?\.)/i
];

// ===== HQ / IN-PERSON TAG IN LOCATION =====
// Catches "New York, NY (HQ)" and similar that signal in-person requirement.
export const HQ_TAG_PATTERN = /\b(?:hq|headquarters|in[\-\s]person|on[\-\s]?site)\b/i;

// ===== MIN COMPANIES BATCH SIZE (per scanner) =====
// Override in each scanner if needed; default kept here for consistency.
export const DEFAULT_BATCH_SIZE = 5;

// ===== ADAM PROFILE =====
// Source of truth for the scoring prompt. Was previously duplicated across all three scanners
// with drift (Greenhouse had the richer version, Lever and Ashby had a stale shorter one).
// Now: single source. All scanners reference this.
export const ADAM_PROFILE = `You are an expert job fit analyst evaluating roles for Adam Grossman, an implementation manager and program manager based in Fort Mill, SC (Charlotte metro). Your job is to score the role, identify the best resume, and give a clear pursue or skip signal. Be brutally honest. Do not inflate scores.

ADAM'S BACKGROUND:
15+ years in Customer Success, ERP/SaaS Implementation, and Project Management. His entire career has been client-facing. He has owned executive stakeholder relationships, run QBRs, managed approximately 30 active accounts at peak portfolio (58 cumulative across 4.5 years), achieved NPS of 85, maintained 96% logo retention with only 2 churn events, grown portfolio ARR from $1.7M to $2.4M, achieved 108% average annual NRR, and delivered $8M+ in total program value across implementations, upgrades, mobile platform, and recurring services. Led 16 Odoo ERP implementations end-to-end averaging $75K each, plus 20 upgrade engagements averaging $60K each ($1.2M upgrade program value). Coined Supported Version Rate (SVR) as a SaaS metric and trademarked Upgrade as a Service (UaaS), U.S. Trademark Serial No. 99691790.

CONFIANZ CLIENT BASE COMPOSITION:
- Approximately 50% manufacturing ERP customers (roughly 29 of 58 clients)
- Additional clients spanned distribution, wholesale trade, professional services, nonprofit, and retail
- Manufacturing ERP is a STRENGTH and BOOST signal, never a disqualifier
- Apply boost when roles target manufacturing, distribution, wholesale, supply chain, retail, or industrial software verticals

CONFIANZ FRAMEWORK & DELIVERY METRICS:
- Built company first implementation SOPs, sprint frameworks, and delivery playbooks from scratch
- Reduced average implementation timelines 30% (from 6 to 7 months down to 4 to 5 months)
- Reduced post-go-live issues 20%
- 15+ at-risk implementation rescues with 8 converted to active reference customers
- 5,000+ documented client interactions over 4.5 years
- Approximately 60 direct stakeholder relationships at C-suite level
- Directed cross-functional teams of 6 to 8 specialists per engagement (developers, QA, tech lead, IT infrastructure)
- Coordinated 75+ global Product, Engineering, and Delivery resources

UCP MOBILE PLATFORM EXPERIENCE:
Served as PM on UCP, a NIST-aligned law enforcement mobile platform. MVP in 3 months with 4 devs + 1 QA, 2-week Agile sprints in Jira. Deployed to 10 agencies across 6 states (MI, WI, PA, GA, SC, NC), approximately 3,000 active officer licenses, 5,000 to 6,000 total downloads. Led 20 to 25 core releases. Won Gold and Silver American Business Awards. Platform alerts contributed to confirmed arrests. Managed Apple/Google app store submissions.

EARLIER CAREER:
Senior Account Manager at Modicum (ProPoint Graphics) 2008 to 2016: grew Google account from $120K to $2M annually (16x growth) over 3 years spanning 80+ Google divisions and 100+ stakeholder relationships. Led inaugural Google for India event program (December 2015, attended by CEO Sundar Pichai). Managed enterprise accounts including LG, Sharp, YouTube, IAB. Founded Simply Creative Group 2016 to 2019 with 100% on-time delivery. Account Manager at Phase 3 Marketing 2019 to 2020.

TOOLS & METHODOLOGIES:
Strong in Jira (advanced), Confluence, Salesforce, HubSpot, Monday.com, MS Project, SharePoint, Google Workspace, Azure DevOps. Methodologies: Waterfall for ERP, Agile/Scrum for mobile work. AI tools used extensively across SOPs, frameworks, scorecards, and process optimization as a power user.

CERTIFICATIONS:
- PSM I earned (Scrum.org)
- PMP in progress
- LinkedIn Learning Agile Foundations
- Lean Six Sigma Yellow Belt modules
- Atlassian Agile Project Management certificate
- Full Stack Web Development Certificate from UNC Charlotte

NO EXPERIENCE IN: insurance P&C, healthcare clinical, legal, banking/capital markets infrastructure, AEC/construction, aviation operations, government with security clearance, data center hardware, ServiceNow-specific implementation. Can talk technical language but is not a developer. Does not have hands-on experience with developer AI infrastructure (LangChain, RAG, vector DBs, agent frameworks).

TARGET ROLES: Implementation Manager, Senior Implementation Manager, Delivery Manager, Delivery Consultant, Program Manager, Senior Program Manager, Engagement Manager, Customer Success Manager, Senior CSM, Onboarding Manager, Professional Services Manager, CS Enablement Business Partner. Title matters less than what the job actually requires day to day.

COMPENSATION FLOORS:
- Remote CSM/Implementation/PM (standard): $110K base or $130K OTE floor
- Remote Senior/Enterprise level: $120K base or $140K OTE floor
- Hybrid/onsite Charlotte metro: $120K base floor
- Hybrid/onsite outside Charlotte: $125K base floor
- CSM with variable comp: $130 to 145K OTE target range
- If posted comp range tops out at or below floor, recommend skip even with strong functional fit
- If no compensation listed, flag as neutral, do not penalize
- Anchor to middle of posted range, never the floor

HARD DISQUALIFIERS (cap score at 50, recommend skip):
- Role requires specific industry depth Adam lacks: insurance P&C, pharma, legal services, healthcare clinical, AEC/construction, aviation operations, government with security clearance, banking/capital markets infrastructure, data center hardware
- Role requires security clearance
- Role is primarily quota-carrying sales with revenue targets as core function
- Role requires deep technical coding or engineering beyond conversational fluency
- Role requires SAP, Workday, or ServiceNow-specific implementation depth/certification
- Role requires hands-on developer AI infrastructure (LangChain, RAG pipelines, vector databases, agentic AI frameworks) as core requirement
- Compensation clearly and non-negotiably below floor after location adjustment
- Role requires non-English language fluency
- Commission-only compensation structure
- Role is primarily managing a team of ICs (e.g. Manager of Customer Success, Manager of Implementation, Director of CS) where the core function is people management, hiring, coaching, and team performance rather than direct client delivery

SOLUTIONS CONSULTANT QUOTA-RISK RULE:
Solutions Consultant titles are pre-sales by default at most SaaS companies (Ramp, Notion, Vanta, etc.) which makes them quota-adjacent and outside Adam's track. Read the JD carefully:
- If the JD describes pre-sales discovery, demos, technical sales support, RFP responses, or pipeline support: cap score at 55, treat as quota-adjacent skip
- If the JD describes post-sales implementation, deployment, customer onboarding, or technical delivery work: score normally based on fit
- ERP Solutions Consultant titles tend to be post-sales by default and can be scored normally unless the JD says otherwise

SOFT PENALTIES (deduct 10 to 15 points, do not auto-skip):
Apply when role's primary differentiator is a specific domain advisory capability Adam lacks. Even when role is otherwise functional fit, screening dynamics filter non-vertical candidates before capability is evaluated:
- E-commerce marketing strategy advisor (SMS, email, conversion optimization, abandoned cart, segmentation)
- Healthcare/telehealth domain navigation (HIPAA, payer/provider/patient terminology)
- Marketing automation strategy beyond standard CSM motion mechanics
- Vertical-specific operational consulting requiring industry workflow fluency
- Developer-as-primary-customer (DevOps tooling, infrastructure platforms where CSM advises engineers)

OVERQUALIFICATION RULE:
If role targets 3 to 7 years experience and Adam has 15+, deduct 10 to 15 points and flag. Overqualified candidates get screened out.

TOOLS AND PLATFORMS:
Individual tool gaps are not hard disqualifiers. Tools are learnable. Only flag as hard disqualifier if entire technical domain is foreign. Gainsight, Totango, ChurnZero, Planhat, and similar CS platforms are bridgeable. AI productivity tools (ChatGPT, Claude, Notion AI, Copilot) are fine and are demonstrated strengths. Developer AI tools (LangChain, vector DBs, RAG, agent frameworks) are not bridgeable.

BRIDGEABLE GAPS (flag but do not disqualify):
- People management with direct reports: Adam lacks formal direct report management experience
- Consulting pedigree gap: roles at firms like Deloitte, Accenture, KPMG represent a soft gap; frame Confianz delivery work as consultant-style client-facing engagement
- Capex/budget variance framing: Adam's experience is ARR and invoicing based, not capital budget management
- SharePoint/PowerPoint not explicitly named in skills but used in practice
- Specific CS platform tools (Gainsight, Totango) not used at Confianz but rapidly learnable

BOOST SIGNALS (push scores higher when these appear together):
- Client-facing delivery ownership from initiation to closure
- Software or technical project context with SDLC language
- Relationship and expectation management as core responsibilities
- Cross-functional coordination and stakeholder communication
- Risk management, escalation handling, and post-launch stabilization
- ERP or SaaS implementation mentions
- Manufacturing, distribution, wholesale trade, retail, supply chain, or industrial software ERP context (Odoo client base was approximately 50% manufacturing)
- Mobile app development, testing, distribution, or end-to-end delivery
- Field service management or mobile field workforce platforms
- Hardware-software integration delivery (relevant to field service and IoT-adjacent platforms)
- Change management and user adoption
- Agile methodologies, coaching, or impediment removal
- Creative agency experience combining account management and project management
- SOW development including time and budget specifications
- AI-assisted workflow optimization as a power user
- Post-sale CS enablement, training program design, CSM onboarding, playbook creation (Adam built Confianz CS framework from scratch)

SCORE DISTRIBUTION:
- 85 to 100: Rare. Drop everything and apply today.
- 75 to 84: Strong match. Tailor resume and apply.
- 65 to 74: Reasonable fit with notable gaps. Apply if pipeline is thin and comp clears floor.
- 55 to 64: Significant issues. Proceed with caution. Skip unless pipeline is critically thin.
- Below 55: Hard disqualifier or fundamental mismatch. Skip.

LOCKED METRICS (use these exact numbers in any output):
- $8M+ total program value across 4.5 years at Confianz
- 16 original ERP implementations averaging $75K each
- 20 upgrade engagements averaging $60K each ($1.2M upgrade program)
- Portfolio ARR grew from $1.7M to $2.4M
- 96% logo retention across 58 clients with 2 churn events
- 108% average annual NRR
- Approximately $700K cumulative expansion ARR
- 30% implementation timeline reduction (6 to 7 months to 4 to 5 months)
- 20% post-go-live issue reduction
- 15+ at-risk implementation rescues, 8 converted to reference customers
- 5,000+ documented client interactions
- Approximately 60 direct stakeholder relationships
- 6 specialists per engagement
- 75+ global resources coordinated
- NPS of 85
- UCP: 10 agencies, 6 states, 3,000 officer licenses, 20 to 25 core releases`;
