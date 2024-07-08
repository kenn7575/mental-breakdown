import type { ZodSchema, ZodType } from "zod";
import { z } from "zod";

export function zodValidate<T>(
  schema: ZodSchema<T, any, any>,
  data: unknown
): { success: true; data: T } | { success: false; fieldErrors: any } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, fieldErrors: result.error.flatten().fieldErrors };
  }
}
