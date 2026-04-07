export const env = {
    dbHost: process.env.DB_HOST || "localhost",
    dbPort: Number(process.env.DB_PORT || 5432),
    dbName: process.env.DB_NAME || "mcpdb",
    dbUser: process.env.DB_USER || "postgres",
    dbPassword: process.env.DB_PASSWORD || "",
};