import {integer, pgTable, varchar, text, json, timestamp, foreignKey} from "drizzle-orm/pg-core";

export const usersTable = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull(),
    email: varchar({length: 255}).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    credits: integer().default(1),
    createdAt: varchar(),
    avatarUrl: varchar(),
    tariff: varchar()
})

export const dietsTable = pgTable('diets', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    dietId: varchar(),
    createdBy: varchar().references(() => usersTable.email),
    createdOn: timestamp().defaultNow(),
    userInput: varchar(),
    apiKey: varchar(),
    goal: varchar(),
    dietType: varchar(),
    height: integer(),
    weight: integer(),
    age: integer(),
    calories: integer(),
    protein: integer(),
    fat: integer(),
    name: varchar(),
    carbs: integer(),
    status: varchar().default('active'),
    gender: varchar(),
    activityLevel: varchar(),
    notes: varchar(),
    updatedOn: timestamp().defaultNow(),
    isConfigured:  integer().default(0),
    eatenMeals: json(),
    restrictions: json()
})

export const dietMealsTable = pgTable('diet_meals', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),

    dietId: integer().references(() => dietsTable.dietId),

    mealId: integer("mealId")
        .references(() => mealsTable.id, { onDelete: "cascade" }),

    mealType: varchar(),

    plannedCalories: integer(),
    plannedProtein: integer(),
    plannedFat: integer(),
    plannedCarbs: integer(),

    createdAt: timestamp().defaultNow(),
})
export const mealsTable = pgTable('meals', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar(),
    dietType: varchar(),
    youtubeVideo: varchar(),
    calories: integer(),
    protein: integer(),
    fat: integer(),
    carbs: integer(),
    imageUrl: varchar()
})

export const mealIngredientsTable = pgTable('meal_ingredients', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    mealId: integer().references(() => mealIngredientsTable.id, { onDelete: "cascade" }),
    ingredientName: varchar(),
    grams: integer(),
    calories: integer(),
    protein: integer(),
    fat: integer(),
    carbs: integer(),
})


export const ingredientReplacementsTable = pgTable('ingredient_replacements', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),

    mealIngredientId: integer().references(() => mealIngredientsTable.id),

    replacedWith: varchar(),
    grams: integer(),

    calories: integer(),
    protein: integer(),
    fat: integer(),
    carbs: integer(),
})

export const aiCallsTable = pgTable("aiCalls", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    assistantName: varchar("assistantName", { length: 255 }).notNull(),
    createdBy: varchar("createdBy", { length: 255 }).references(() => usersTable.email),
    createdOn: timestamp("createdOn").defaultNow(),
    callId: varchar()
});


export const aiMessagesTable = pgTable("aiMessages", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    callId: integer("callId").notNull(),
    role: varchar("role", { length: 50 }).notNull(),
    content: varchar("content", { length: 1000 }).notNull(),
    createdOn: timestamp("createdOn").defaultNow(),
});


export const emailVerifications = pgTable("email_verifications", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: text("email").notNull(),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
});







