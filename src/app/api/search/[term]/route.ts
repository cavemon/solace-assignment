import db from "@/db";
import { advocates } from "@/db/schema";
import { type NextRequest } from 'next/server'
import { sql } from 'drizzle-orm';

export async function GET(_req: NextRequest, ctx: RouteContext<'/search/[term]'>) {
  const { term } = await ctx.params
  const searchTerm = `${term.replace(' ', '  <-> ')}:*` // allow matches that are not exact, i.e. "Jos" returns "Josh", searches full terms
  const data = await db.select().from(advocates)
    .where(sql`(
             setweight(to_tsvector('english', ${advocates.firstName}), 'A') ||
             setweight(to_tsvector('english', ${advocates.lastName}), 'A') ||
             setweight(to_tsvector('english', ${advocates.city}), 'B') ||
             setweight(to_tsvector('english', ${advocates.degree}), 'C') ||
             setweight(to_tsvector('english', ${advocates.specialties}), 'B'))
               @@ to_tsquery('english', ${searchTerm}
           )`)

  return Response.json({ data });
}