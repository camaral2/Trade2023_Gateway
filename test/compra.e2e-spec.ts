import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
//import * as mongoose from 'mongoose';
import { AppModule } from './../src/app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
//import { userSignupRequestSuccess } from './mocks/user-signup-request-success.mock';
//import { taskCreateRequestSuccess } from './mocks/task-create-request-success.mock';
//import { taskUpdateRequestSuccess } from './mocks/task-update-request-success.mock';

describe('Tasks (e2e)', () => {
  let app;
  let api;

  const urlAuth = process.env.ADM_URL;
  let jwtToken = '';
  const jwtTokenFake =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const userId = '63b34f5da25fbb24d295ab24';
  const username = process.env.ADM_USER;
  const password = process.env.ADM_PASSWD;
  const acao = 'MGLU3';

  beforeAll(async () => {
    //await mongoose.connect(process.env.MONGO_DSN, { useNewUrlParser: true });
    //await mongoose.connection.dropDatabase();
  });

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

  describe('Should list all compra of user', () => {
    it('Should list all compra send token empty', async () => {
      const resp = await request(api)
        .get(`/compra/${userId}/${acao}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(resp.body.error).toBeDefined();
    });

    it('Should list all compra send token invalid', async () => {
      const resp = await request(api)
        .get(`/compra/${userId}/${acao}`)
        .set('Authorization', `Bearer ${jwtTokenFake}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(resp.body.error).toBeDefined();
    });

    it('Should list all compra send token valid', async () => {
      const resp = await request(api)
        .get(`/compra/${userId}/${acao}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);

      expect(resp.body.compras).toBeDefined();

      expect(resp.body.compras[0]._id).toBeDefined();
      expect(resp.body.compras[0]._id).not.toBeNull();
    });
  });
});
