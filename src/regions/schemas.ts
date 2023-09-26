import { z } from "zod";

export const CreateRegionSchema = z.object({
  slug: z.string(),
  shortName: z.string(),
  name: z.string(),
  public: z.string(),
  // template: __fieldName__: z.__zodType__(),
});
export const UpdateRegionSchema = CreateRegionSchema.merge(
  z.object({
    id: z.number(),
  })
);

export const DeleteRegionSchema = z.object({
  id: z.number(),
});
