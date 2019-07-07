const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Hermione",
    email: "hermione@gryffindor.com",
    password: "leviosa",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: "Fitzwilliam",
    email: "fitzwilliam@darcy.com",
    password: "janeausten",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
};

const authorizationToken = `Bearer ${userOne.tokens[0].token}`;
const authorizationTokenUserTwo = `Bearer ${userTwo.tokens[0].token}`;

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "First task",
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Second task",
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Third task",
    completed: true,
    owner: userTwoId
}

const setupDataBase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOne,
    userOneId,
    taskOne,
    taskThree,
    authorizationToken,
    authorizationTokenUserTwo,
    setupDataBase
}