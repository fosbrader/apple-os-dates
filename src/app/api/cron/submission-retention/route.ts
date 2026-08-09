import { deleteExpiredSubmissionBlobs } from "@/lib/moderation/blob";
import { createSubmissionRetentionHandler } from "./handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const GET = createSubmissionRetentionHandler({
  deleteExpiredSubmissions: () => deleteExpiredSubmissionBlobs(),
});
