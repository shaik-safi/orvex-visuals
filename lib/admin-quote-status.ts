export const QUOTE_PIPELINE_STATUSES = [
  "new",
  "contacted",
  "quote_sent",
  "follow_up",
  "negotiating",
  "confirmed",
  "cancelled",
] as const

export type QuotePipelineStatus = (typeof QUOTE_PIPELINE_STATUSES)[number]

export const DEFAULT_QUOTE_PIPELINE_STATUS: QuotePipelineStatus = "new"

export function isQuotePipelineStatus(value: unknown): value is QuotePipelineStatus {
  return typeof value === "string" && QUOTE_PIPELINE_STATUSES.includes(value as QuotePipelineStatus)
}