import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersUsecase } from '@app/modules/users/usecase/users.usecase';
import { createControllerTestingModule } from '../../core/utils/test-modules';
import { UsersHttpController } from '../../../src/modules/users/controller/users.http.controller';
import { UsersFactory } from './users.factory';
import { Err, Ok } from 'oxide.ts';
import { UserNotFoundError } from '../../../src/modules/users/users.error';

const mockUser = UsersFactory.build();
const mockUsers = UsersFactory.buildList(2);

const mockUsersUsecase = {
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('UsersHttpController', () => {
  let app: INestApplication;
  let usecase: typeof mockUsersUsecase;

  beforeAll(async () => {
    const { module, nestApp } = await createControllerTestingModule(
      UsersHttpController,
      [
        {
          provide: UsersUsecase,
          useValue: mockUsersUsecase,
        },
      ],
    );

    app = nestApp;
    usecase = module.get(UsersUsecase);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      usecase.findAll.mockResolvedValue(Ok(mockUsers));

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect(({ body }) => {
          expect(usecase.findAll).toHaveBeenCalled();

          expect(body).toEqual(mockUsers);
          expect(body).toHaveLength(2);
          expect(body[0]).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
          );
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a single user', async () => {
      usecase.findOne.mockResolvedValue(Ok(mockUser));

      return request(app.getHttpServer())
        .get('/users/1')
        .expect(200)
        .expect(({ body }) => {
          expect(usecase.findOne).toHaveBeenCalledWith(1);

          expect(body).toEqual(mockUser);
          expect(body).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
          );
        });
    });

    it('should return 400 if user not found', async () => {
      usecase.findOne.mockResolvedValue(Err(new UserNotFoundError()));

      return request(app.getHttpServer())
        .get('/users/1')
        .expect(400)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(400);
        });
    });

    it('should return 500 if theres an unexpected error', async () => {
      usecase.findOne.mockResolvedValue(Err(new Error('Unexpected')));

      return request(app.getHttpServer())
        .get('/users/1')
        .expect(500)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(500);
          expect(body.message).toBe('Unexpected');
        });
    });
  });
});
