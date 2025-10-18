import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/items (GET)', () => {
    it('should return an array of items', () => {
      return request(app.getHttpServer())
        .get('/items')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/items (POST)', () => {
    it('should create a new item', () => {
      return request(app.getHttpServer())
        .post('/items')
        .send({ item: 'test e2e item' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.item).toBe('test e2e item');
        });
    });
  });

  describe('/items/:id (GET)', () => {
    it('should return a single item', async () => {
      const created = await request(app.getHttpServer())
        .post('/items')
        .send({ item: 'test item for get' });

      return request(app.getHttpServer())
        .get(`/items/${created.body.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(created.body.id);
          expect(res.body.item).toBe('test item for get');
        });
    });
  });

  describe('/items/:id (PATCH)', () => {
    it('should update an item', async () => {
      const created = await request(app.getHttpServer())
        .post('/items')
        .send({ item: 'item to update' });

      return request(app.getHttpServer())
        .patch(`/items/${created.body.id}`)
        .send({ item: 'updated item' })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(created.body.id);
          expect(res.body.item).toBe('updated item');
        });
    });
  });

  describe('/items/:id (DELETE)', () => {
    it('should delete an item', async () => {
      const created = await request(app.getHttpServer())
        .post('/items')
        .send({ item: 'item to delete' });

      return request(app.getHttpServer())
        .delete(`/items/${created.body.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(created.body.id);
        });
    });
  });
});
