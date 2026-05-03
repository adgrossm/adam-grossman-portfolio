// /api/lib/jcc-gate.js
// Gate logic shared across all JCC scanners.
// Philosophy: be conservative on rejection, generous on letting things through to scoring.
// Better to score a borderline role and let the AI judge it than to silently filter
// something that turns out to be a fit.

import {
  ROLE_KEYWORDS,
  TITLE_EXCLUSIONS,
  INTERNATIONAL_KEYWORDS,
  TITLE_LOCATION_DROPS,
  CHARLOTTE_METRO_CITIES,
  ELIGIBLE_STATES,
  SINGLE_STATE_REMOTE,
  US_STATES,
  IN_OFFICE_PATTERNS,
  STATE_EXCLUSION_PATTERNS,
  HQ_TAG_PATTERN
} from './jcc-config.js';

// ===== TITLE GATE =====
// Returns true if the title matches a target role and is not on the exclusion list.
export function isRelevantTitle(title) {
  if (!title) return false;
  const lower = title.toLowerCase();
  if (TITLE_EXCLUSIONS.some(ex => lower.includes(ex))) return false;
  return ROLE_KEYWORDS.some(kw => lower.includes(kw));
}

// ===== LOCATION GATE (PASS 1: based on location field only) =====
// Used at the title-filter stage when only the location string is available.
// Returns true if the location is at least plausibly compatible (US, remote, or Charlotte metro).
// Conservative: when in doubt, return true and let downstream gates make the call.
export function isAllowedLocation(location, title, isRemote = false, country = '') {
  if (TITLE_LOCATION_DROPS.some(rx => rx.test(title || ''))) return false;
  if (country && country !== 'USA' && country !== 'US' && country !== 'United States') return false;

  const loc = (location || '').toLowerCase();
  if (INTERNATIONAL_KEYWORDS.some(c => loc.includes(c))) return false;
  if (isRemote) return true;
  if (!loc) return true;
  if (CHARLOTTE_METRO_CITIES.some(c => loc.includes(c))) return true;
  if (loc.includes('united states') || loc.includes(', us') || loc.includes('usa')) return true;
  if (loc.includes('remote')) return true;
  return false;
}

// ===== SINGLE-STATE REMOTE CHECK =====
// Catches "Remote - CA", "Remote (USA - California)", etc.
// Returns { isSingleState: bool, state: string|null }
// If the matched state is NC or SC, treat as eligible. Anything else: skip.
export function checkSingleStateRemote(location) {
  if (!location) return { isSingleState: false, state: null };
  const match = location.match(SINGLE_STATE_REMOTE);
  if (!match) return { isSingleState: false, state: null };

  const candidate = (match[1] || '').trim().toLowerCase();
  // Filter out generic words that can match the regex's broad pattern
  if (['usa', 'us', 'united states', 'north america', 'na', 'usa only'].includes(candidate)) {
    return { isSingleState: false, state: null };
  }

  // Check if candidate is a state name or abbreviation
  const isAbbrev = candidate.length === 2 && US_STATES[candidate];
  const isFullName = Object.values(US_STATES).includes(candidate);
  if (!isAbbrev && !isFullName) return { isSingleState: false, state: null };

  const stateName = isAbbrev ? US_STATES[candidate] : candidate;
  const isEligible = ELIGIBLE_STATES.includes(stateName.toLowerCase());

  return {
    isSingleState: true,
    state: stateName,
    isEligible
  };
}

// ===== HQ / IN-PERSON TAG IN LOCATION FIELD =====
// Catches "New York, NY (HQ)" and similar. Skip if HQ-tagged outside Charlotte metro.
export function hasInPersonHQTag(location) {
  if (!location) return false;
  if (!HQ_TAG_PATTERN.test(location)) return false;
  // If HQ tag is in Charlotte metro, fine
  const loc = location.toLowerCase();
  if (CHARLOTTE_METRO_CITIES.some(c => loc.includes(c))) return false;
  return true;
}

// ===== ANCHOR DAY / IN-OFFICE LANGUAGE IN JD BODY =====
// Returns true if the JD body contains language requiring in-person presence.
// Should be run only when the location is not already in Charlotte metro.
export function requiresInOfficeNonLocal(listing, location) {
  if (!listing) return false;
  const loc = (location || '').toLowerCase();
  // If already in Charlotte metro, in-office language is fine
  if (CHARLOTTE_METRO_CITIES.some(c => loc.includes(c))) return false;
  return IN_OFFICE_PATTERNS.some(rx => rx.test(listing));
}

// ===== STATE EXCLUSION LANGUAGE IN JD BODY =====
// Detects "we cannot employ candidates residing in [...]" patterns.
// Returns { hasExclusion: bool, excludesNCorSC: bool, excludedStates: [string] }
export function checkStateExclusion(listing) {
  if (!listing) return { hasExclusion: false, excludesNCorSC: false, excludedStates: [] };

  for (const pattern of STATE_EXCLUSION_PATTERNS) {
    const match = listing.match(pattern);
    if (match && match[1]) {
      const exclusionText = match[1].toLowerCase();
      const excludedStates = [];

      // Check each state name and abbreviation
      for (const [abbrev, fullName] of Object.entries(US_STATES)) {
        // Match full name as a word boundary
        const fullNameRx = new RegExp(`\\b${fullName.replace(/\s+/g, '\\s+')}\\b`, 'i');
        // Match abbreviation as a comma-or-space-separated token
        const abbrevRx = new RegExp(`(?:^|[\\s,])${abbrev}(?:$|[\\s,.])`, 'i');
        if (fullNameRx.test(exclusionText) || abbrevRx.test(exclusionText)) {
          excludedStates.push(fullName);
        }
      }

      const excludesNCorSC = excludedStates.includes('north carolina') || excludedStates.includes('south carolina');
      return { hasExclusion: true, excludesNCorSC, excludedStates };
    }
  }

  return { hasExclusion: false, excludesNCorSC: false, excludedStates: [] };
}

// ===== INTERNATIONAL SCOPE IN JD BODY =====
// Returns true if the JD body indicates international scope without an explicit US allowance.
export function hasInternationalListingScope(listing) {
  if (!listing) return false;
  const internationalRx = /\b(emea|apac|latam|united kingdom|ireland|germany|france|spain|netherlands|portugal|italy|brazil|mexico|japan|korea|singapore|south africa|peru|chile|poland|new zealand|australia|dubai|uae|united arab emirates|saudi arabia|riyadh|bahrain|qatar|kuwait|oman)\b/i;
  const usExceptionRx = /\b(united states|us-based|us only|remote in the us|north america only|usa only)\b/i;
  return internationalRx.test(listing) && !usExceptionRx.test(listing);
}

// ===== FOREIGN LANGUAGE REQUIRED =====
// Returns true if the JD body requires non-English language fluency.
export function requiresForeignLanguage(listing) {
  if (!listing) return false;
  return /must speak (german|french|spanish|portuguese|japanese|korean|mandarin|dutch|italian)|(german|french|portuguese|korean|japanese|spanish|mandarin|dutch|italian) speaking|fluent in (german|french|spanish|portuguese|japanese|korean|mandarin|dutch|italian)/i.test(listing);
}

// ===== HELPER: IS LOCATION IN CHARLOTTE METRO =====
export function isLocalToCharlotte(location) {
  if (!location) return false;
  return new RegExp(CHARLOTTE_METRO_CITIES.join('|'), 'i').test(location);
}

// ===== HELPER: DOES LOCATION SAY REMOTE =====
export function locationSaysRemote(location) {
  return (location || '').toLowerCase().includes('remote');
}

// ===== MASTER GATE EVALUATION =====
// Runs all post-fetch gates against a job's location and listing body.
// Returns { pass: bool, reason: string|null, severity: 'hard'|'soft'|null }
//
// Severity:
//   'hard' = silent skip, no log (clear-cut: international, foreign language, single-state non-NC/SC)
//   'soft' = skip but log to gate_log table (judgment call: anchor days, HQ-tag, state exclusion)
export function evaluateContentGates(job, listing) {
  const location = job.location || '';
  const isRemote = !!job.isRemote;

  // ===== HARD GATES (silent skip) =====

  // International location field (catches "Remote, United Arab Emirates" etc.)
  // Runs even when isRemote=true because international remote is still international.
  const locLower = location.toLowerCase();
  if (INTERNATIONAL_KEYWORDS.some(c => locLower.includes(c))) {
    return { pass: false, reason: 'international_location_field', severity: 'hard' };
  }

  // International scope in listing without US exception
  if (hasInternationalListingScope(listing) && !isRemote && !locationSaysRemote(location)) {
    return { pass: false, reason: 'international_scope_in_listing', severity: 'hard' };
  }

  // Foreign language required
  if (requiresForeignLanguage(listing)) {
    return { pass: false, reason: 'foreign_language_required', severity: 'hard' };
  }

  // Single-state remote restricted to non-NC/SC state
  const stateCheck = checkSingleStateRemote(location);
  if (stateCheck.isSingleState && !stateCheck.isEligible) {
    return {
      pass: false,
      reason: `single_state_remote_${stateCheck.state.replace(/\s+/g, '_')}`,
      severity: 'hard'
    };
  }

  // Onsite outside Charlotte (no remote, no local match)
  if (!isRemote && !locationSaysRemote(location) && !isLocalToCharlotte(location)) {
    return { pass: false, reason: 'onsite_outside_charlotte', severity: 'hard' };
  }

  // ===== SOFT GATES (log + skip) =====

  // HQ tag in location field outside Charlotte
  if (hasInPersonHQTag(location)) {
    return { pass: false, reason: 'hq_tag_outside_charlotte', severity: 'soft' };
  }

  // Anchor day / in-office language for non-Charlotte location
  if (requiresInOfficeNonLocal(listing, location)) {
    return { pass: false, reason: 'in_office_required_non_charlotte', severity: 'soft' };
  }

  // State-exclusion language that excludes NC or SC
  const exclusion = checkStateExclusion(listing);
  if (exclusion.hasExclusion && exclusion.excludesNCorSC) {
    const excluded = exclusion.excludedStates.includes('north carolina') ? 'NC' : 'SC';
    return { pass: false, reason: `state_exclusion_includes_${excluded}`, severity: 'soft' };
  }

  return { pass: true, reason: null, severity: null };
}
