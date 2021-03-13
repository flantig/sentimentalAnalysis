import express, {Request, Response} from 'express';

const app = express();
const cors = require("cors");
const mongoUser = require("./mongoUser.ts");
const mongoNews = require("./mongoNews.ts");

/**
 * @import mongoUser: Please check this file to see what everything does, the following server requests simply send off a response to the webapp
 * @request post: ["/register/:user/:password"]
 * @request get: ["/login/:user/:password", "/users", "/users/:user"]
 */

app.use(cors());
app.use(express.json())

/**
 * @mongoUser returns a new user to the mongo database, there's no email authentication for this thing so it'll just return "done"
 */
app.post("/register/:user/:password", async (req: Request, res: Response) => {
    try {
        console.log(req.params)
        const {user, password} = await req.params;
        console.log(req.params.user);
        await mongoUser.register(user, password);


        res.json({message: "Successfully registered!", status: "done"});
    } catch (err) {
        console.error(err);
    }
})

/**
 * @mongoUser logs the user into the database, if the authentication was botched by the user it'll spit out an error otherwise it'll return the username back.
 */
app.get("/login/:user/:password", async (req: Request, res: Response) => {
    try {
        const {user, password} = await req.params;

        const attempt = await mongoUser.login(user, password);

        if (attempt) {
            res.json({message: "Successfully logged in!", username: user})
        } else {
            res.json({message: "Who are you?", error: "INCORRECT PASSWORD"})
        }

    } catch (err) {
        console.error(err)
    }
})

/**
 * @mongoUser returns a list of all the users
 */
app.get("/users", async (res: Response) => {
    try {

        const users = await mongoUser.allUsers();

        res.json({message: "Here are all of the users!", data: users})
    } catch (err) {
        console.error(err);
    }
})

/**
 * @mongoUser checks if a particular user exists, returns boolean
 */
app.get("/users/:user", async (req: Request, res: Response) => {
    try {
        const {user} = await req.params;
        console.log(user)
        const existence = await mongoUser.doesUserExist(user);

        if (existence) {
            res.json({message: "This user roams the earth", exist: true})
        } else {
            res.json({message: "This user has yet to be given the spark of life", exist: false})
        }

    } catch (err) {
        console.error(err);
    }
})

/**
 * @mongoNews returns 5 random articles
 */
app.get("/news/random/:topic", async (req: Request, res: Response) => {
    try {
        const {topic} = await req.params;

        const randomNews = await mongoNews.getRandomNewsByTopic(topic);

        res.json({message:"Here's five random news articles with your article of choice!", data: randomNews})
    } catch (err) {
        console.log(err);
    }
})

/**
 * @mongoNews returns all articles from a single topic
 */
app.get("/news/:topic", async (req: Request, res: Response) => {
    try {
        const {topic} = await req.params;

        const news = await mongoNews.getAllByTopic(topic);

        res.json({message:"Here is everything in a given topic", data: news})
    } catch (err) {
        console.log(err);
    }
})



app.listen(5000, () => {
    console.log("server has started on port 5000");
});