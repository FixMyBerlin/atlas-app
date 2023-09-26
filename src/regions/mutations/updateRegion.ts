import { resolver } from "@blitzjs/rpc";
import db from "db";
import { UpdateRegionSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(UpdateRegionSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const region = await db.region.update({ where: { id }, data });

    return region;
  }
);
