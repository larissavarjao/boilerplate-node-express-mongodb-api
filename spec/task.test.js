const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const { authorizationToken, setupDataBase, taskOne, taskThree } = require("./fixtures/db");

beforeEach(setupDataBase);

test("Should create task for user", async () => {
    const newTask = { description: "Testing this awesome course" };
    const response = await request(app).post("/tasks")
        .set("Authorization", authorizationToken)
        .send(newTask);

    expect(response.status).toBe(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
    expect(task.description).toBe(newTask.description);
});

test("Should get only user tasks", async () => {
    const response = await request(app).get("/tasks")
        .set("Authorization", authorizationToken)
        .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
});

test("Should delete users tasks", async () => {
    const response = await request(app).delete(`/tasks/${taskThree._id}`)
        .set("Authorization", authorizationToken)
        .send();

    expect(response.status).toBe(404);
    const task = await Task.findById(taskThree._id);
    expect(task).not.toBeNull();
});
