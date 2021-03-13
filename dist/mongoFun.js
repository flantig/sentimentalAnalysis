var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { MongoClient } = require('mongodb');
const credentials = require('../src/server/mongoAuth.json');
const uri = `${credentials.client}/${credentials.database}?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri);
module.exports = {
    getRandomNewsByTopic: (topicSelect) => __awaiter(this, void 0, void 0, function* () {
        yield mongoClient.connect();
        const random = yield mongoClient.db(`${credentials.database}`).collection(`${credentials.collection[0]}`).aggregate([{ $match: { topic: topicSelect } },
            { $sample: { size: 3 } }]).toArray();
        mongoClient.logout();
        return random;
    }),
    getAllByTopic: (topicSelect) => __awaiter(this, void 0, void 0, function* () {
        yield mongoClient.connect();
        const random = yield mongoClient.db(`${credentials.database}`).collection(`${credentials.collection[0]}`).find().project({
            '_id': 0,
            topic: topicSelect
        }).toArray();
        yield mongoClient.logout();
        return random;
    })
};
//# sourceMappingURL=mongoFun.js.map