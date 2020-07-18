let server;
const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');

describe('/api/genres', () => {
    beforeEach(() => {server = require('../../index');})
    afterEach(async () => {
        server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return list of genre stored in Test DB', async () => {
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name == 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name == 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a single genre based on a valid id parameter', async () =>{
            const genre = new Genre({name: 'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id); 
           
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name','genre1');
        });

        it('should throw error with status 404 for invalid id', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        it('should return 401 error for unregistered users', async () => {
            const res = await request(server)
            .post('/api/genres')
            .send({name: 'genre1'});

            expect(res.status).toBe(401);
        });

        // it('should return 400 error for invalid i/p for name less than 5 characters', async () => {
        //     const token = new User().generateAuthToken();
            
        //     const res = await request(server)
        //     .post('/api/genres')
        //     .set('x-auth-token', token)
        //     .send({name:'12'});

        //     expect(res.status).toBe(400);
        // });

        it('should return 400 error for invalid i/p for name greater than 255 characters', async () => {
            const name = new Array(257).join('a');
            const token = new User().generateAuthToken();
            
            const res = await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: name});

            expect(res.status).toBe(400);
        });
    });
});

