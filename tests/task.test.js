const supertest = require('supertest');
const Task = require('../src/models/task')
const {
    userOneId,
    userOne,
    userTwo,
    setupDatabase,
    taskOne,
    taskTwo,
    taskThree
} = require('./fixtures/db')
const app = require('../src/app')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    let response = await supertest(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'Testing task'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
});

test('should get tasks for user one', async () => {
    let response = await supertest(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

    expect(response.body.length).toBe(2)
});

test('Should not let another user to delete another users note', async () => {
    let response = await supertest(app)
    .delete('/tasks/' + taskTwo._id)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(404)

    const task = await Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
});