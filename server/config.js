var config = {}

config.host = process.env.HOST || "https://2020idolchampdb.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "SoUw4KBn86t5eXPbe2cAd0WTFRX276oxYxDvEALZlbAVAJRa8RiaaOkL31Dj9i4IGlogWnHZZDVvq8GJfkK0ww==";
config.databaseId = "ToDoList";
config.collectionId = "Items";
config.ScoresColId = "Scores";

module.exports = config;