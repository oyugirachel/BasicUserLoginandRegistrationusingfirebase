const expect = require('expect');
const request = require('supertest');
const db = admin.firestore();


const { app } = require("./../index");
describe('POST /register', () => {
    it('should create a user', (done) => {
        var email = "ex@emil.com";
        var password = "12345678!";

        request(app)
            .post('/register')
            .send({ email, password })
            .expect((res) => {
                expect(res.headers['x-auth']).not.toBeNull();
                expect(res.body._id).not.toBeNull();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) return done(err);

                User.findOne({ email }).then((user) => {
                    expect(user).not.toBeNull();
                    expect(user.password).not.toBe(password);
                    done();
                });
            });
    });

    it('should return validation errors if request is invaild', (done) => {
        request(app)
            .post('/register')
            .send({
                email: "someRandomText",
                password: "011001RandomPswd"
            })
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        request(app)
            .post('/register')
            .send({
                email: users[0].email,
                password: "12345670"
            })
            .expect(400)
            .end(done);
    });
});


describe('POST /login', () => {
    it('Should login user and return auth token', (done) => {
        request(app)
            .post('/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).not.toBeNull();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toHaveProperty('access', 'auth');
                    expect(user.tokens[1]).toHaveProperty('token', res.headers['x-auth']);
                    done();
                }).catch((err) => done(err));
            })
    });

    it('Should reject invalid login', (done) => {
        request(app)
            .post('/login')
            .send({
                email: users[1].email,
                password: users[1].password + '1'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeUndefined();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done();
                }).catch((err) => done(err));
            })
    });
});