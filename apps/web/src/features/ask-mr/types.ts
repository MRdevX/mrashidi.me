import type { AskMrMessageMetadata, AskMrToolSet } from "@mrashidi/types";
import type { UIDataTypes, UIMessage } from "ai";

export type AskMrUIMessage = UIMessage<AskMrMessageMetadata, UIDataTypes, AskMrToolSet>;

export type AskMrFeedbackRating = "up" | "down";
