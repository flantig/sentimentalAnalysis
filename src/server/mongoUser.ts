export {};
const {MongoClient} = require('mongodb');
const credentials = require('./mongoAuth.json');
const uri = `${credentials.client}/${credentials.database}?retryWrites=true&w=majority`
const mongoClient = new MongoClient(uri);
const bcrypt = require('bcrypt')

module.exports = {

    validator: async () => {
    },
    /**
     * @const userlog: Fetches data from the database to compare the hash stored there with the password entered by the user
     * @return bcrypt: After comparing the the hash and the password it'll send back a boolean
     */
    login: async (user: string, pass: string) => {
        await mongoClient.connect();

        const userlog = await mongoClient.db(`${credentials.database}`).collection(`${credentials.collection[1]}`).findOne({username: user})

        if (bcrypt.compareSync(pass, userlog.password)) {
            console.log("We're in")
            await mongoClient.logout();
            return true;
        } else {
            console.log("I will salt the earth with the remains of your corpse if you are attempting a brute force attack.")
            await mongoClient.logout();
            return false;
        }


    },
    /**
     * @function register: Registers user with the following parameters: username, password, initial amount of coins, how many news articles viewed that day, creation timestamptz of the account, and the last logged in timestamptz
     * @param user: The username that is selected by the end user
     * @param pass: The password that will never be stored as plain-text in the database.
     * @const hash: This is what will be stored in the database, we used bcrypt to automatically generate a salt based on the number of rounds passed (15).
     */

    register: async (user: string, pass: string) => {
        await mongoClient.connect();
        console.log("This is the user")
        console.log(user);

        const hash = await bcrypt.hash(pass, 15).catch((err: Error) => {
            console.error(err)
        });

        await mongoClient.db(`${credentials.database}`).collection(`${credentials.collection[1]}`).insertOne(
            {
                username: user,
                password: hash,
                coins: 0,
                newsReviewed: 0,
                createdAt: new Date(),
                lastLogged: new Date()
            }
        )

        await mongoClient.logout();
    },

    /**
     * @const users: This only returns the users and nothing else, this can be used to populate a list of users to check out other profiles or something. I'm likely not implementing that over the weekend, but it's here.
     */
    allUsers: async () => {
        await mongoClient.connect();

        const users = await mongoClient.db(`${credentials.database}`).collection(`${credentials.collection[1]}`).find().project(
            {
                _id: 0,
                username: 1,
            }).toArray();


        await mongoClient.logout();
        return users
    },
    /**
     * @return mongoClient.find(): Checks to see how many of the entered username exits, if it's greater than 0 than it returns true otherwise, false.
     */
    doesUserExist: async (user: string) => {
        await mongoClient.connect();

        const exists = (await mongoClient.db(`${credentials.database}`).collection(`${credentials.collection[1]}`).find().project({_id:0, username: user}).toArray()).length

        if (exists > 0) {
            await mongoClient.logout();
            return true;
        } else {
            await mongoClient.logout();
            return false;
        }

    }

}
