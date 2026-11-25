// Tell a Whole Story in 32 Characters — u-xvader-tell-a-whole-story-in-32-characters-f86dd978
//
// Entry: a single Wi-Fi network name, at most 32 characters, that lands a
// joke and implies a whole story in the few words a phone shows in its
// network list.
//
// The story, in one breath: a proposal, then a password change.
//   "She said yes"  -> the beginning: he proposed, she accepted.
//   "Then changed the WiFi" -> the middle and the end: she locked him out
//   of the network (and, the reader understands, out of her life).
// The Wi-Fi name itself IS the punchline: the network a stranger is staring
// at is the very network she changed. No explanation needed, no stock joke
// ("Pretty Fly for a Wi-Fi", "FBI Surveillance Van") recycled.
//
// Candidates considered (all counted by hand, <= 32 chars):
//   - "MetHerAtStarbucks,MarriedByWiFi" (31) — meeting to marriage, but
//     "MarriedByWiFi" is muddled: Wi-Fi plays no role in the story.
//   - "HeLeft,SheKeptTheDogAndWiFi" (27) — a breakup with a clear split,
//     but "she kept the dog" is a tired divorce cliche.
//   - "FirstDateHere,LastSeenAtCourt" (29) — romance to courtroom, dark
//     and funny, but not Wi-Fi-specific at all.
//   - "SheSaidYes,ThenChangedTheWiFi" (29) — CHOSEN: proposal, twist,
//     and ending in nine words; the Wi-Fi is the plot device itself.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// The Wi-Fi network name. Counted character by character: 29 characters.
const ENTRY = "SheSaidYes,ThenChangedTheWiFi";

// Bounty rule: the story must fit in a single Wi-Fi network name, which
// caps out at 32 characters.
const MAX_CHARS = 32;

// A Wi-Fi name is shown as one line in a phone's network list, so the
// entry may not contain any line break at all.
const LINE_BREAKS = ["\n", "\r"] as const;

const OUTPUT_PATH = "/output/entry.txt";

// ---------------------------------------------------------------------------
// Validation — one small check per rule, so a failure names the rule broken.
// ---------------------------------------------------------------------------

/** Count characters the way a reader sees them (code points, not UTF-16 units). */
function countCharacters(line: string): number {
  return [...line].length;
}

/** The entry must be non-empty and fit inside the 32-character cap. */
function validateLength(line: string): void {
  const length = countCharacters(line);
  if (length < 1 || length > MAX_CHARS) {
    throw new Error(
      `Entry must be 1 to ${MAX_CHARS} characters, got ${length}.`,
    );
  }
}

/** A name of only spaces would show up as a blank network in the list. */
function validateNotBlank(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("Entry must not be only white space.");
  }
}

/** The entry is displayed as a single line, so no newline may sneak in. */
function assertSingleLine(line: string): void {
  for (const breaker of LINE_BREAKS) {
    if (line.includes(breaker)) {
      throw new Error("Entry must be a single line with no newline.");
    }
  }
}

/** Run every rule above in order; throws on the first rule the entry breaks. */
function validateLine(line: string): void {
  validateLength(line);
  validateNotBlank(line);
  assertSingleLine(line);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

/** Write the validated entry to disk, creating the output folder if needed. */
function writeEntry(line: string, outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, line, "utf8");
}

/** Validate the entry, then write it out exactly as written — no trailing
 * newline, no extra formatting: the file must contain only the network name. */
function main(): void {
  validateLine(ENTRY);
  writeEntry(ENTRY, OUTPUT_PATH);
}

main();
