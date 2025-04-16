jest.setTimeout(10000);

const request = require('supertest');
const app = require('./app');
const { pool } = require('./uploadController'); 

describe('POST /upload', () => {
  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app).post('/upload');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('No file uploaded');
  });

  afterAll(async () => {
    try {
      await pool.end(); 
    } catch (error) {
      console.error("Error closing PostgreSQL pool", error);
    }
  });
});