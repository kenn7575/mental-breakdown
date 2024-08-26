import { UUID } from "crypto";

export interface CreateModerationReport {
  postId: UUID;
  userId: UUID;
  content: string;
  flags: string[];
  action: ActionResponse;
}
export enum ActionResponse {
  NONE = "none",
  RESCUE = "rescue",
  NOTIFY = "notify",
  SUSPEND = "suspend",
  QUARANTINE = "quarantine",
}
export type Categories = {
  sexual: boolean;
  hate: boolean;
  harassment: boolean;
  "self-harm": boolean;
  "sexual/minors": boolean;
  "hate/threatening": boolean;
  "violence/graphic": boolean;
  "self-harm/intent": boolean;
  "self-harm/instructions": boolean;
  "harassment/threatening": boolean;
  violence: boolean;
};
