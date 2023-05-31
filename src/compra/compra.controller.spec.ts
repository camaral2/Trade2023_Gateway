import { Test, TestingModule } from '@nestjs/testing';
import { CompraController } from './compra.controller';
import { Observable } from 'rxjs';
import { GetComprasResponseDto } from './dto/get-compra-response.dto';
import { compraRequestSuccess } from '../mocks/compra-request-success.mock';
describe('CompraController', () => {
  let controller: CompraController;

  const listAcaoMock = [compraRequestSuccess];

  const dataAcaoMockObservable = new Observable((observer) => {
    observer.next(listAcaoMock);
  });

  dataAcaoMockObservable.subscribe();

  const mockHttpService = {
    send: jest.fn().mockResolvedValue(dataAcaoMockObservable),
  };

  const cadMicroServiceProvider = {
    provide: 'CAD_MICROSERVICE',
    useValue: mockHttpService,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompraController],
      providers: [cadMicroServiceProvider],
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
    expect(mockHttpService.send).toHaveBeenCalled();
  });
});
