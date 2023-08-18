import { Test, TestingModule } from '@nestjs/testing';
import { CompraController } from './compra.controller';
import { Observable, of } from 'rxjs';
import { GetComprasResponseDto } from './dto/get-compra-response.dto';
import { compraRequestSuccess } from './mocks/compra-request-success.mock';
import { CreateCompraDto } from './dto/create-compra.dto';
import { CompraResponseDto } from './dto/compra-response.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { SetSaleCompraDto } from './dto/set-sale-compra.dto';
import { CompraIdDto } from './dto/compra-Id.dto';
import { ReturnDeleteUpdateDto } from 'src/utils/return-delete-update.dto';
import { CompraRequestDto } from './dto/compra-request.dto';
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
    const acao = 'MGLU3';

    const ret: GetComprasResponseDto = await controller.getCompra(userId, acao);
    expect(ret).toEqual({
      compras: listAcaoMock,
    });
    expect(mockHttpServiceCad.send).toHaveBeenCalled();
  });

  it('should create compra of User', async () => {
    const compraRequest: CreateCompraDto = compraRequestSuccess;

    const compraResponse: CompraResponseDto = {
      compra: compraRequestSuccess,
    };

    mockHttpServiceCad.send.mockResolvedValue(of(compraResponse));
    const ret: CompraResponseDto = await controller.createCompra(compraRequest);

    expect(ret.compra).toEqual(compraRequest);
    expect(mockHttpServiceCad.send).toHaveBeenCalled();
    expect(mockHttpServiceCad.send).toHaveBeenCalledWith(
      'compra_create',
      compraRequest,
    );
  });

  it('should update compra of User', async () => {
    const compraRequest: CompraRequestDto = {
      id: compraRequestSuccess._id,
      compra: compraRequestSuccess,
    };

    const compraResponse: ReturnDeleteUpdateDto = {
      affected: 1,
    };

    mockHttpServiceCad.send.mockResolvedValue(of(compraResponse));
    const ret: ReturnDeleteUpdateDto = await controller.updateCompra(
      compraRequest,
    );

    expect(ret.affected).toEqual(1);
    expect(mockHttpServiceCad.send).toHaveBeenCalled();
    expect(mockHttpServiceCad.send).toHaveBeenCalledWith(
      'compra_update',
      compraRequest,
    );
  });

  it('should update compra for Sale of User', async () => {
    const compraRequest: CompraRequestDto = {
      id: compraRequestSuccess._id,
      compra: compraRequestSuccess,
    };

    const compraResponse: ReturnDeleteUpdateDto = {
      affected: 1,
    };

    mockHttpServiceCad.send.mockResolvedValue(of(compraResponse));
    const ret: ReturnDeleteUpdateDto = await controller.setVendaCompra(
      compraRequest,
    );

    expect(ret.affected).toEqual(1);
    expect(mockHttpServiceCad.send).toHaveBeenCalled();
    expect(mockHttpServiceCad.send).toHaveBeenCalledWith(
      'compra_venda',
      compraRequest,
    );
  });

  it('should delete compra of User', async () => {
    const compraRequest: CompraRequestDto = {
      id: compraRequestSuccess._id,
      compra: null,
    };

    const compraResponse: ReturnDeleteUpdateDto = {
      affected: 1,
    };

    mockHttpServiceCad.send.mockResolvedValue(of(compraResponse));
    const ret: ReturnDeleteUpdateDto = await controller.deleteCompra(
      compraRequest,
    );

    expect(ret.affected).toEqual(1);
    expect(mockHttpServiceCad.send).toHaveBeenCalled();
    expect(mockHttpServiceCad.send).toHaveBeenCalledWith(
      'compra_remove',
      compraRequest,
    );
  });
});
