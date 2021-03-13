const {MongoClient} = require('mongodb');
const credentials = require('./mongoAuth.json');
const uri = `${credentials.client}/${credentials.database}?retryWrites=true&w=majority`
const mongoClient = new MongoClient(uri);

module.exports = {

    /**
     * @param topicSelect: there are 5 topics the user gets to choose from ["Entertainment", "Finance", "Politics", "World", "Health"]
     * @return random: It returns 5 random articles of the topic of choice
     */
    getRandomNewsByTopic: async (topicSelect: string) => {
        await mongoClient.connect();

        const random = await mongoClient.db(`${credentials.database}`).collection(`${credentials.collection[0]}`).aggregate(
            [{$match: {topic: topicSelect}},
            {$sample: {size: 5}}]
        ).toArray();

        mongoClient.logout()
        return random;
    },
    /**
     * @param topicSelect: there are 5 topics the user gets to choose from ["Entertainment", "Finance", "Politics", "World", "Health"]
     * @return allByTopic: gets all the entries within a single topic
     */
    getAllByTopic: async (topicSelect: string) => {
        await mongoClient.connect();
        const allByTopic = await mongoClient.db(`${credentials.database}`).collection(`${credentials.collection[0]}`).find({topic: topicSelect}).toArray();
        await mongoClient.logout();
        return allByTopic;
    }

};