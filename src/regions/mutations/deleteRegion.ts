import { resolver } from "@blitzjs/rpc";
import db from "db";
import { DeleteRegionSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(DeleteRegionSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const region = await db.region.deleteMany({ where: { id } });

    return region;
  }
);
