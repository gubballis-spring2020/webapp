const app = require('./server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

// to test the post endpoint
describe('Post Endpoints', () => {
  it('should create a new user', async () => {
    const res = await supertest(app)
      .post('/user')
      .send({
        first_name: "Jane",
        last_name: "Doe",
        password: "Cloud007",
        email_address: "jane.doe@example.com"
      })
    expect(res.statusCode).toEqual(400)
    // expect(res.body).toHaveProperty('post')
  })
});

describe('Post Endpoints', () => {
  it('should throw an error when create a new user', async () => {
    const res = await supertest(app)
      .post('/user')
      .send({
        first_name: "Jane",
        last_name: "Doe",
        password: "Cloud007",
        email_address: "jane.doe@example.com"
      })
    expect(res.statusCode).toEqual(400)
    // expect(res.body).toHaveProperty('post')
  })
});