const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

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

const authorizationToken = `Bearer ${userOne.tokens[0].token}`;

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

test("Should signup a new user", async () => {
    const newUser = {
        name: "Andrew",
        email: "andrew@mead.io",
        password: "56what!!"
    };
    const response = await request(app).post("/users").send(newUser);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
        user: {
            name: newUser.name,
            email: newUser.email
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBe(newUser.password);
});

test("Should login a existing user", async () => {
    const response = await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    });

    expect(response.status).toBe(200);
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login a not existing user", async () => {
    const response = await request(app).post("/users/login").send({
        email: userOne.email,
        password: "password"
    });
    expect(response.status).toBe(400);
});

test("Should get profile for user", async () => {
    const response = await request(app).get("/users/me").set("Authorization", authorizationToken).send();
    expect(response.status).toBe(200);
});

test("Should not get profile for unauthenticated user", async () => {
    const response = await request(app).get("/users/me").send();
    expect(response.status).toBe(401);
});

test("Should delete account for user", async () => {
    const response = await request(app).delete("/users/me").set("Authorization", authorizationToken).send();

    expect(response.status).toBe(200);

    const user = await User.findById(response.body._id);
    expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
    const response = await request(app).delete("/users/me").send();
    expect(response.status).toBe(401);
});

test("Should upload avatar image", async () => {
    const response = await request(app).post("/users/me/avatar")
        .set("Authorization", authorizationToken)
        .attach("avatar", "spec/fixtures/profile-pic.jpg");

    expect(response.status).toBe(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
    const name = "Luna Lovegood";
    const response = await request(app).patch("/users/me")
        .set("Authorization", authorizationToken)
        .send({
            name
        });

    expect(response.status).toBe(200);
    const user = await User.findById(userOneId);
    expect(user).not.toBe(null);
    expect(user.name).toBe(name);
});

test("Should not update invalide user fields", async () => {
    const response = await request(app).patch("/users/me")
        .set("Authorization", authorizationToken)
        .send({
            address: "Hogwarts"
        });

    expect(response.status).toBe(400);

    const user = await User.findById(userOneId);
    expect(user).not.toBe(null);
});
