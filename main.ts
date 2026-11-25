// Tell a Whole Story in 32 Characters — u-xvader-tell-a-whole-story-in-32-characters-f86dd978
//
// The entry is one Wi-Fi network name, no longer than 32 characters, that
// carries a joke and implies an entire story in the few words a phone shows
// in its network list.
//
// The story in a single breath: a proposal, followed by a password change.
//   "She said yes"           -> the opening: he proposed, she accepted.
//   "Then changed the WiFi"  -> the twist and the ending: she locked him
//   out of the network — and, the reader understands, out of her life.
// The network name itself is the punchline: the stranger staring at the
// list is looking at the very network she changed. No explanation needed,
// and no recycled stock joke ("Pretty Fly for a Wi-Fi",
// "FBI Surveillance Van").
//
// Other names weighed up (each counted by hand, all within 32 characters):
//   - "MetHerAtStarbucks,MarriedByWiFi" (31) — meeting to marriage, but
//     "MarriedByWiFi" is muddled: Wi-Fi plays no part in the story.
//   - "HeLeft,SheKeptTheDogAndWiFi" (27) — a breakup with a clean split,
//     but "she kept the dog" is a worn-out divorce cliche.
//   - "FirstDateHere,LastSeenAtCourt" (29) — romance to courtroom, dark
//     and funny, but nothing about it is Wi-Fi-specific.
//   - "SheSaidYes,ThenChangedTheWiFi" (29) — CHOSEN: proposal, twist,
//     and ending in nine words; the Wi-Fi is the plot device itself.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

// The Wi-Fi network name. Counted character by character: 29 characters.
const NETWORK_NAME = "SheSaidYes,ThenChangedTheWiFi";

// Bounty rule: the story has to fit in one Wi-Fi network name, which is
// capped at 32 characters.
const MAX_NAME_LENGTH = 32;

// A Wi-Fi name appears as a single line in a phone's network list, so the
// entry may not contain any line break whatsoever.
const FORBIDDEN_BREAKS = ["\n", "\r"] as const;

const ENTRY_OUTPUT_PATH = "/output/entry.txt";

// ---------------------------------------------------------------------------
// Checks — one small check per rule, so a failure names the rule broken.
// ---------------------------------------------------------------------------

/** Count characters the way a reader sees them (code points, not UTF-16 units). */
function countVisibleCharacters(line: string): number {
  return [...line].length;
}

/** The name is displayed as a single line, so no newline may sneak in. */
function requireSingleLine(line: string): void {
  for (const breaker of FORBIDDEN_BREAKS) {
    if (line.includes(breaker)) {
      throw new Error("Entry must be a single line with no newline.");
    }
  }
}

/** The entry must be non-empty and fit inside the 32-character cap. */
function checkLength(line: string): void {
  const length = countVisibleCharacters(line);
  if (length < 1 || length > MAX_NAME_LENGTH) {
    throw new Error(
      `Entry must be 1 to ${MAX_NAME_LENGTH} characters, got ${length}.`,
    );
  }
}

/** A name of only spaces would show up as a blank network in the list. */
function rejectBlank(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("Entry must not be only white space.");
  }
}

/** Run every rule above in order; throws on the first rule the entry breaks. */
function validateEntry(line: string): void {
  requireSingleLine(line);
  checkLength(line);
  rejectBlank(line);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

/** Create the output folder (and any missing parents) when it is absent. */
function ensureDirectoryExists(filePath: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
}

/** Write the validated entry to disk, creating the output folder if needed. */
function saveEntry(line: string, outputPath: string): void {
  ensureDirectoryExists(outputPath);
  writeFileSync(outputPath, line, "utf8");
}

/** Validate the entry, then write it out exactly as written — no trailing
 * newline, no extra formatting: the file must contain only the network name. */
function main(): void {
  validateEntry(NETWORK_NAME);
  saveEntry(NETWORK_NAME, ENTRY_OUTPUT_PATH);
}

main();
