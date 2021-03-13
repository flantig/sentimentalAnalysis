import express, {Request, Response} from 'express';

const app = express();
const cors = require("cors");
const mongoUser = require("./mongoUser.ts");

/**
 * @import mongoUser: Please check this file to see what everything does, the following server requests simply send off a response to the webapp
 * @request post: ["/register/:user/:password"]
 * @request get: ["/login/:user/:password", "/users", "/users/:user"]
 */

app.use(cors());
app.use(express.json())

app.post("/register/:user/:password", async (req: Request, res: Response) => {
    try {
        console.log(req.params)
        const {user, password} = await req.params;
        console.log(req.params.user);
        await mongoUser.register(user, password);


        res.json("Successfully registered!");
    } catch (err) {
        console.error(err);
    }
})

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


app.get("/users", async (res: Response) => {
    try {

        const users = await mongoUser.allUsers();

        res.json({message: "Here are all of the users!", usersJSONArray: users})
    } catch (e) {
        console.error(e);
    }
})

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

    } catch (e) {
        console.error(e);
    }
})

app.listen(5000, () => {
    console.log("server has started on port 5000");
});