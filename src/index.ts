const mongoFun = require("./server/mongoNews");

async function test () {
    const result = await mongoFun.getRandomNewsByTopic("Entertainment");
console.log(result)
    return result;
}

async function print() {
    console.log(test())
}

