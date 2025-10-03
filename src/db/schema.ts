import { sql } from "drizzle-orm";
import {
  index,
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
} from "drizzle-orm/pg-core";

const advocates = pgTable("advocates", {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    city: text("city").notNull(),
    degree: text("degree").notNull(),
    specialties: jsonb("payload").default([]).notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index('search_index').using(
      'gin',
      sql`( 
        setweight(to_tsvector('english', ${table.firstName}), 'A') ||
        setweight(to_tsvector('english', ${table.lastName}), 'A') ||
        setweight(to_tsvector('english', ${table.city}), 'B') ||
        setweight(to_tsvector('english', ${table.degree}), 'C') ||
        setweight(to_tsvector('english', ${table.specialties}), 'B')
      )`,
    ),
  ]);

export { advocates };
