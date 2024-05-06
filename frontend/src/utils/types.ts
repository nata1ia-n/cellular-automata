import { z } from "zod";

export const apiRequestBodySchema = z.object({
  pattern_number: z.number().min(1).max(255),
  generations_number: z.number().min(1).max(1000),
});

export type APIRequestBody = z.infer<typeof apiRequestBodySchema>;
