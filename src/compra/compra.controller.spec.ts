import { Test, TestingModule } from '@nestjs/testing';
import { CompraController } from './compra.controller';
import { Observable, of } from 'rxjs';
import { GetComprasResponseDto } from './dto/get-compra-response.dto';
import { compraRequestSuccess } from './mocks/compra-request-success.mock';
describe('CompraController', () => {
  let controller: CompraController;

  const userAuth = {
    username: 'test',
    password: '112233',
    name: 'Cristian',
    isActive: true,
  };

  const dataUserMockObservable = new Observable((observer) => {
    observer.next(userAuth);
  });

  dataUserMockObservable.subscribe();

  const mockHttpServiceAuth = {
    send: jest
      .fn()
      .mockImplementation(() => Promise.resolve(of(dataUserMockObservable))),
    close: jest.fn(),
  };

  const authMicroServiceProvider = {
    provide: 'AUTH_CLIENT',
    useValue: mockHttpServiceAuth,
  };

  const listAcaoMock = [compraRequestSuccess];

  const mockHttpServiceCad = {
    send: jest.fn().mockResolvedValue(of(listAcaoMock)),
    close: jest.fn(),
  };

  const cadMicroServiceProvider = {
    provide: 'CAD_MICROSERVICE',
    useValue: mockHttpServiceCad,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompraController],
      providers: [cadMicroServiceProvider, authMicroServiceProvider],
    }).compile();

    controller = module.get<CompraController>(CompraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get compra of User', async () => {
    const userId = '69c04ba0-f28f-11ed-a05b-0242ac120003';

    const ret: GetComprasResponseDto = await controller.getCompra(userId);
    expect(ret).toEqual({
      compras: listAcaoMock,
    });
    expect(mockHttpServiceCad.send).toHaveBeenCalled();
  });
});
