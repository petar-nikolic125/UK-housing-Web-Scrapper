import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull(),
  price: integer("price").notNull(),
  size: integer("size").notNull(), // in sqm
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  imageUrl: text("image_url"),
  primeLocationUrl: text("prime_location_url"),
  description: text("description"),
  hasGarden: boolean("has_garden").default(false),
  hasParking: boolean("has_parking").default(false),
  isArticle4: boolean("is_article4").default(false),
  yearlyProfit: integer("yearly_profit"),
  leftInDeal: integer("left_in_deal"),
  postcode: text("postcode").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const searches = pgTable("searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  radius: integer("radius").notNull(),
  maxPrice: integer("max_price").default(500000),
  minSize: integer("min_size").default(90),
  excludeArticle4: boolean("exclude_article4").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertSearchSchema = createInsertSchema(searches).omit({
  id: true,
  createdAt: true,
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertSearch = z.infer<typeof insertSearchSchema>;
export type Search = typeof searches.$inferSelect;

// Search filters interface
export interface PropertyFilters {
  query?: string;
  radius?: number;
  maxPrice?: number;
  minSize?: number;
  excludeArticle4?: boolean;
  sortBy?: 'profit' | 'price' | 'size' | 'recent';
}
