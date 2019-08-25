var config = {}

config.host = process.env.HOST || "https://2020idolchampdb.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "O8Nmif5l7cT578PgL9gJpUiKhJkuLg8ofZQNGwYOsydMJJKgWbApZbGvPBR55i3XADPbYPfbkHfjzxOUXNIUMg==";
config.databaseId = "ToDoList";
config.collectionId = "Items";

module.exports = config;