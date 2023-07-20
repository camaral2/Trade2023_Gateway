import { Test, TestingModule } from '@nestjs/testing';
import { AcaoController } from './acao.controller';
import { userAuthRequestSuccess } from './mocks/userAuth-request-success.mock';
import { Observable, of } from 'rxjs';
import { acaoConfigRequestSuccess } from './mocks/acaoConfig-request-success.mock';
import { GetAcaoConfigResponseDto } from './dto/get-acao-config-response.dto';

describe('AcaoController', () => {
  let controller: AcaoController;

  const dataUserMockObservable = new Observable((observer) => {
    observer.next(userAuthRequestSuccess);
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

  const listAcaoMock = [acaoConfigRequestSuccess];

  const mockHttpServiceAc = {
    send: jest.fn().mockResolvedValue(of(listAcaoMock)),
    close: jest.fn(),
  };

  const acMicroServiceProvider = {
    provide: 'AC_MICROSERVICE',
    useValue: mockHttpServiceAc,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcaoController],
      providers: [acMicroServiceProvider, authMicroServiceProvider],
    }).compile();

    controller = module.get<AcaoController>(AcaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all acao', async () => {
    const ret: GetAcaoConfigResponseDto = await controller.getAcao();
    expect(ret).toEqual({
      acoes: listAcaoMock,
    });
    expect(mockHttpServiceAc.send).toHaveBeenCalled();
  });
});
