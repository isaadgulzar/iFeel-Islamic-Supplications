import { Dua } from "../../types";

// Import all duas
import { angryDuas } from "./angry";
import { anxiousDuas } from "./anxious";
import { boredDuas } from "./bored";
import { confidentDuas } from "./confident";
import { confusedDuas } from "./confused";
import { contentDuas } from "./content";
import { depressedDuas } from "./depressed";
import { doubtfulDuas } from "./doubtful";
import { gratefulDuas } from "./grateful";
import { greedyDuas } from "./greedy";
import { guiltyDuas } from "./guilty";
import { happyDuas } from "./happy";
import { hurtDuas } from "./hurt";
import { hypocriticalDuas } from "./hypocritical";
import { indecisiveDuas } from "./indecisive";
import { jealousDuas } from "./jealous";
import { lazyDuas } from "./lazy";
import { lonelyDuas } from "./lonely";
import { lostDuas } from "./lost";
import { nervousDuas } from "./nervous";
import { overwhelmedDuas } from "./overwhelmed";
import { regretDuas } from "./regret";
import { sadDuas } from "./sad";
import { scaredDuas } from "./scared";
import { suicidalDuas } from "./suicidal";
import { tiredDuas } from "./tired";
import { unlovedDuas } from "./unloved";
import { weakDuas } from "./weak";
import { anticipationDuas } from "./anticipation";
import { curiousDuas } from "./curious";
import { defeatedDuas } from "./defeated";
import { desireDuas } from "./desire";
import { desperateDuas } from "./desperate";
import { determinedDuas } from "./determined";
import { enviousDuas } from "./envious";
import { hatredDuas } from "./hatred";
import { humiliatedDuas } from "./humiliated";
import { impatientDuas } from "./impatient";
import { insecureDuas } from "./insecure";
import { irritatedDuas } from "./irritated";
import { loveDuas } from "./love";
import { nostalgicDuas } from "./nostalgic";
import { peacefulDuas } from "./peaceful";
import { satisfiedDuas } from "./satisfied";
import { uncertainDuas } from "./uncertain";
import { uneasyDuas } from "./uneasy";

// Combined array for backward compatibility
export const DUAS: Dua[] = [
  ...angryDuas,
  ...anxiousDuas,
  ...boredDuas,
  ...confidentDuas,
  ...confusedDuas,
  ...contentDuas,
  ...depressedDuas,
  ...doubtfulDuas,
  ...gratefulDuas,
  ...greedyDuas,
  ...guiltyDuas,
  ...happyDuas,
  ...hurtDuas,
  ...hypocriticalDuas,
  ...indecisiveDuas,
  ...jealousDuas,
  ...lazyDuas,
  ...lonelyDuas,
  ...lostDuas,
  ...nervousDuas,
  ...overwhelmedDuas,
  ...regretDuas,
  ...sadDuas,
  ...scaredDuas,
  ...suicidalDuas,
  ...tiredDuas,
  ...unlovedDuas,
  ...weakDuas,
  ...anticipationDuas,
  ...curiousDuas,
  ...defeatedDuas,
  ...desireDuas,
  ...desperateDuas,
  ...determinedDuas,
  ...enviousDuas,
  ...hatredDuas,
  ...humiliatedDuas,
  ...impatientDuas,
  ...insecureDuas,
  ...irritatedDuas,
  ...loveDuas,
  ...nostalgicDuas,
  ...peacefulDuas,
  ...satisfiedDuas,
  ...uncertainDuas,
  ...uneasyDuas,
];

// Export by category for easier access
export const DUAS_BY_CATEGORY: Record<string, Dua[]> = {
  angry: angryDuas,
  anxious: anxiousDuas,
  bored: boredDuas,
  confident: confidentDuas,
  confused: confusedDuas,
  content: contentDuas,
  depressed: depressedDuas,
  doubtful: doubtfulDuas,
  grateful: gratefulDuas,
  greedy: greedyDuas,
  guilty: guiltyDuas,
  happy: happyDuas,
  hurt: hurtDuas,
  hypocritical: hypocriticalDuas,
  indecisive: indecisiveDuas,
  jealous: jealousDuas,
  lazy: lazyDuas,
  lonely: lonelyDuas,
  lost: lostDuas,
  nervous: nervousDuas,
  overwhelmed: overwhelmedDuas,
  regret: regretDuas,
  sad: sadDuas,
  scared: scaredDuas,
  suicidal: suicidalDuas,
  tired: tiredDuas,
  unloved: unlovedDuas,
  weak: weakDuas,
  anticipation: anticipationDuas,
  curious: curiousDuas,
  defeated: defeatedDuas,
  desire: desireDuas,
  desperate: desperateDuas,
  determined: determinedDuas,
  envious: enviousDuas,
  hatred: hatredDuas,
  humiliated: humiliatedDuas,
  impatient: impatientDuas,
  insecure: insecureDuas,
  irritated: irritatedDuas,
  love: loveDuas,
  nostalgic: nostalgicDuas,
  peaceful: peacefulDuas,
  satisfied: satisfiedDuas,
  uncertain: uncertainDuas,
  uneasy: uneasyDuas,
};

// Helper functions
export function getDuasByCategory(categoryId: string): Dua[] {
  return DUAS_BY_CATEGORY[categoryId] || [];
}

export function getDuaById(id: string): Dua | undefined {
  return DUAS.find((dua) => dua.id === id);
}
