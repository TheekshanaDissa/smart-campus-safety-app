const request = require('supertest');
const app = require('../src/app');

describe('Health endpoint', () => {
  test('returns ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

describe('Incident validation', () => {
  test('rejects incomplete incident', async () => {
    process.env.ALLOW_UNAUTHENTICATED_DEV = 'true';
    const response = await request(app).post('/api/incidents').send({ title: 'Only title' });
    expect(response.status).toBe(400);
  });
});
