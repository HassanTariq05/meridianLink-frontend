import { z } from 'zod'

export const MetricsSchema = z.record(z.string(), z.number())

export const RecordsSchema = z.object({
  id: z.string(),
  uid: z.string(),
  userId: z.string(),
  organizationId: z.string(),
  logId: z.string(),
  recordType: z.enum(['measurement', 'summary']),
  sourceType: z.string(),
  sourceModel: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string(),
  utcOffset: z.number().optional(),
  metrics: MetricsSchema,
})

export type Record = z.infer<typeof RecordsSchema>
