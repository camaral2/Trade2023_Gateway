import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

describe('Acao (e2e)', () => {
  let app;
  let api;

  const urlAuth = process.env.ADM_URL;
  let jwtToken = '';
  const jwtTokenFake =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const username = process.env.ADM_USER;
  const password = process.env.ADM_PASSWD;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    //app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    api = await app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Login', () => {
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

          expect(jwtToken).toMatch(
            /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
          ); // jwt regex
        });
    });
  });

  describe('Should list all Acao', () => {
    it('Should list with token empty', async () => {
      const resp = await request(api).get(`/acao`).expect(HttpStatus.FORBIDDEN);

      expect(resp.body.error).toBeDefined();
    });

    it('Should list send token invalid', async () => {
      const resp = await request(api)
        .get(`/acao`)
        .set('Authorization', `Bearer ${jwtTokenFake}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(resp.body.error).toBeDefined();
    });

    it('Should list all compra send token valid', async () => {
      const resp = await request(api)
        .get(`/acao/`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);

      expect(resp.body.acoes).toBeDefined();

      // Validate if the result is an array
      expect(resp.body.acoes).toBeInstanceOf(Array);

      // Validate if the array length is 5
      expect(resp.body.acoes.length).toBeGreaterThan(0);

      // Validate if all objects have the required attributes
      for (const obj of resp.body.acoes) {
        expect(obj).toHaveProperty('url');
        expect(obj).toHaveProperty('acao');
        expect(obj).toHaveProperty('desc');
      }
    });
  });
});
