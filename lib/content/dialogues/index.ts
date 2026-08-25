import type { DialogueTree } from "@/lib/content/types";
import { halloway } from "./halloway";
import { ashford } from "./ashford";
import { reilly } from "./reilly";
import { cobb } from "./cobb";

export const allDialogues: DialogueTree[] = [halloway, ashford, reilly, cobb];

export const dialoguesByNpcId: Record<string, DialogueTree> = Object.fromEntries(
  allDialogues.map((d) => [d.npcId, d]),
);
