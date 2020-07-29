const supertest = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken');

const userOneId = new ObjectId()
const userOne = {
    _id: userOneId,
    name: "Test User", 
    email: "test@test.com",
    password: "MyPass777!",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

beforeEach(async ()=> {
    await User.deleteMany()
    await new User(userOne).save()
})


test('Should signup a new user', async () => {
    const response = await supertest(app)
    .post('/users')
    .send({
        name: "Test", 
        email: "pablo@test.com",
        password: "MyPass777!"
    })
    .expect(201)

    //Assert that the database was changed correctly
    let user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assert response body
    expect(response.body).toMatchObject({
        user: {
            name: "Test", 
            email: "pablo@test.com",
        },
        token: user.tokens[0].token
    })

    //Assert password is encrypted

    expect(user.password).not.toBe('MyPass777!')

})

test('Should login a user', async () => {
    let response = await supertest(app)
    .post('/users/login')
    .send({
        email: userOne.email,
        password: userOne.password
    })
    .expect(200)

    //Assert token 
    let user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body.token).toBe(user.tokens[1].token)
});

test('Should not login nonesixtent user', async () => {
    await supertest(app)
    .post('/users/login')
    .send({
        email: 'dummy@test.com',
        password: 'aaaaaaaa'
    })
    .expect(400)
});

test('Should fetch the user profile', async () => {
    await supertest(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

});

test('Should not get profile to unauthenticated users', async () => {
    await supertest(app)
    .get('/users/me')
    .send()
    .expect(401)
});

test('Should delete an account for user', async () => {
    await supertest(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

    let user = await User.findById(userOneId)
    expect(user).toBeNull()
});

test('Should not delete an account for unauthenticated user', async () => {
    await supertest(app)
    .delete('/users/me')
    .expect(401)
});

test('Should upload avatar image', async () => {
    await supertest(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    let user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))

});

test('Should update valid user fields', async () => {
    await supertest(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send( {
        name: "New name",
        password: "Thisisavalidpassword"
    })
    .expect(200)

    let user = await User.findById(userOne._id)
    expect(user.name).toBe('New name')
});

test('Should not update invalid user fields', async () => {
    await supertest(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send( {
        heigth: "New name",
        password: "Thisisavalidpassword"
    })
    .expect(403)
});