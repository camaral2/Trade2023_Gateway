import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const urlAuth = process.env.ADM_URL;
  const username = process.env.ADM_USER;
  const password = process.env.ADM_PASSWD;

  let jwtToken = '';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer()).get('/').expect(200).expect({
      app: 'trade2023_gateway',
      author: 'Cristian dos Santos Amaral',
      email: 'cristian_amaral@hotmail.com',
      version: process.env.npm_package_version,
    });
  });

  it('should get error for Forbidden', async () => {
    await request(app.getHttpServer()).post('/').expect(HttpStatus.FORBIDDEN);
  });

  it('should log a user in and return a JWT token', async () => {
    await request(urlAuth)
      .post('auth/login')
      .send({ username, password })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.username).toEqual(username);
        expect(res.body.password).toBeUndefined();
        expect(res.body.token.access_token).toBeDefined();

        jwtToken = res.body.token.access_token;
      });
  });

  it('should post', async () => {
    await request(app.getHttpServer())
      .post('/')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(HttpStatus.CREATED)
      .expect({
        app: 'trade2023_gateway',
        author: 'Cristian dos Santos Amaral',
        email: 'cristian_amaral@hotmail.com',
        version: process.env.npm_package_version,
      });
  });
});
