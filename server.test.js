const app = require('./server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

// to test the post endpoint for user
describe('Post Endpoints', () => {
  it('should create a new user', async () => {
    const res = await supertest(app)
      .post('/v1/user')
      .send({
        first_name: "Jane",
        last_name: "Doe",
        password: "Cloud007",
        email_address: "jane.doe@example.com"
      })
    expect(res.statusCode).toEqual(201)
    // expect(res.body).toHaveProperty('post')
  })
});

describe('Post Endpoints', () => {
  it('should throw an error when create a new user', async () => {
    const res = await supertest(app)
      .post('/v1/user')
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



// to test the post endpoint for bills
// describe('Post Endpoints', () => {
//   it('should create a new user', async () => {
//     const res = await supertest(app)
//       .post('/v1/bill')
//       .send({
//         vendor: "Northeastern University",
//         bill_date: "2020-01-06",
//         due_date: "2020-01-12",
//         amount_due: 100.89,
//         paymentStatus: "paid"
//       })
//     expect(res.statusCode).toEqual(201)
//     // expect(res.body).toHaveProperty('post')
//   })
// });