const {MongoClient} = require('mongodb');
const credentials = require('../server/mongoAuth.json');
const uri = `${credentials.client}/${credentials.database}?retryWrites=true&w=majority`
const mongoClient = new MongoClient(uri);

module.exports = {

    getRandomNewsByTopic: async (topicSelect: string) => {
        await mongoClient.connect();

        const random = await mongoClient.db(`${credentials.database}`).collection(`${credentials.collection[0]}`).aggregate(
            [{$match: {topic: topicSelect}},
            {$sample: {size: 3}}]
        ).toArray();
        mongoClient.logout()
        return random;
    },
    getAllByTopic: async (topicSelect: string) => {
        await mongoClient.connect();
        const random = await mongoClient.db(`${credentials.database}`).collection(`${credentials.collection[0]}`).find().project({
            '_id': 0,
            topic: topicSelect
        }).toArray();
        await mongoClient.logout();
        return random;
    }

};