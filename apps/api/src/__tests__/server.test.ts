import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from "../server";
const app = createServer();

// Authentication routes:
describe('Auth API', () => {
  // new user
  describe('POST /api/v1/signup', () => {
    it('should sign up a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/signup')
        .send({
          username: 'sharath',
          password: 'random',
          type: 'admin',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('userId');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/v1/signup')
        .send({});
      expect(response.status).toBe(400);
    });
  });

  // login
  describe('POST /api/v1/signin', () => {
    it('should sign in successfully', async () => {
      const response = await request(app)
        .post('/api/v1/signin')
        .send({
          username: 'sharath',
          password: 'random',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 403 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/signin')
        .send({
          username: 'wronguser',
          password: 'wrongpass',
        });
      expect(response.status).toBe(403);
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/v1/signin')
        .send({});
      expect(response.status).toBe(400);
    });

  });
});

describe('User Information API', () => {
  describe('POST /api/v1/user/metadata', () => {
    it('should update user metadata successfully', async () => {
      const token = 'your_auth_token'; // Replace with a valid token
      const response = await request(app)
        .post('/api/v1/user/metadata')
        .set('Authorization', `Bearer ${token}`)
        .send({
          avatarId: '123',
        });
      expect(response.status).toBe(200);
    });

    it('should return 403 for unauthorized access', async () => {
      const response = await request(app)
        .post('/api/v1/user/metadata')
        .send({
          avatarId: '123',
        });
      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/v1/avatars', () => {
    it('should retrieve available avatars', async () => {
      const response = await request(app)
        .get('/api/v1/avatars');
      expect(response.status).toBe(200);
      expect(response.body.avatars).toBeDefined();
    });
  });
});

describe('Space Dashboard API', () => {
  describe('POST /api/v1/space', () => {
    it('should create a space successfully', async () => {
      const token = 'your_auth_token'; // Replace with a valid token
      const response = await request(app)
        .post('/api/v1/space')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test',
          dimensions: '100x200',
          mapId: 'map1',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('spaceId');
    });

    it('should return 400 for invalid space data', async () => {
      const token = 'your_auth_token'; // Replace with a valid token
      const response = await request(app)
        .post('/api/v1/space')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/space/all', () => {
    it('should retrieve all spaces for the user', async () => {
      const token = 'your_auth_token'; // Replace with a valid token
      const response = await request(app)
        .get('/api/v1/space/all')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.spaces).toBeDefined();
    });
  });
});


// import supertest from "supertest";
// import { describe, it, expect } from "vitest";
// import { createServer } from "../server";
//
// describe("server", () => {
//   it("status check returns 200", async () => {
//     await supertest(createServer())
//       .get("/status")
//       .expect(200)
//       .then((res) => {
//         expect(res.body.ok).toBe(true);
//       });
//   });
//
//   it("message endpoint says hello", async () => {
//     await supertest(createServer())
//       .get("/message/jared")
//       .expect(200)
//       .then((res) => {
//         expect(res.body.message).toBe("hello jared");
//       });
//   });
// });

