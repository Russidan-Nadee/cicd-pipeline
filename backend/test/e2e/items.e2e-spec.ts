import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/items (GET)', () => {
    it('should return an array of items', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const response = await request(app.getHttpServer())
        .get('/items')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/items (POST)', () => {
    it('should create a new item', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const response = await request(app.getHttpServer())
        .post('/items')
        .send({ item: 'test e2e item' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.item).toBe('test e2e item');
    });
  });

  describe('/items/:id (GET)', () => {
    it('should return a single item', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const created = await request(app.getHttpServer())
        .post('/items')
        .send({ item: 'test item for get' });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const createdId = created.body.id as string;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const response = await request(app.getHttpServer())
        .get(`/items/${createdId}`)
        .expect(200);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.id).toBe(created.body.id);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.item).toBe('test item for get');
    });
  });

  describe('/items/:id (PATCH)', () => {
    it('should update an item', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const created = await request(app.getHttpServer())
        .post('/items')
        .send({ item: 'item to update' });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const createdId = created.body.id as string;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const response = await request(app.getHttpServer())
        .patch(`/items/${createdId}`)
        .send({ item: 'updated item' })
        .expect(200);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.id).toBe(created.body.id);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.item).toBe('updated item');
    });
  });

  describe('/items/:id (DELETE)', () => {
    it('should delete an item', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const created = await request(app.getHttpServer())
        .post('/items')
        .send({ item: 'item to delete' });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const createdId = created.body.id as string;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const response = await request(app.getHttpServer())
        .delete(`/items/${createdId}`)
        .expect(200);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.id).toBe(created.body.id);
    });
  });
});
