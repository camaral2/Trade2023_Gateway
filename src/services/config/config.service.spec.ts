import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    service = new ConfigService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a valid port number', () => {
    const port = parseInt(service.get('port'));
    expect(typeof port).toBe('number');
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThan(65536);
  });

  it('should get valid options for acaoService', () => {
    const acaoService = service.get('acaoService');
    expect(acaoService).toBeDefined();
    expect(typeof acaoService).toBe('object');
    expect(acaoService.options).toBeDefined();
    expect(typeof acaoService.options).toBe('object');
    expect(acaoService.options.port).toBeDefined();

    const port = parseInt(acaoService.options.port);
    expect(typeof port).toBe('number');
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThan(65536);

    expect(acaoService.options.host).toBeDefined();
    expect(typeof acaoService.options.host).toBe('string');
  });

  it('should get valid options for cadService', () => {
    const cadService = service.get('cadService');
    expect(cadService).toBeDefined();
    expect(typeof cadService).toBe('object');
    expect(cadService.options).toBeDefined();
    expect(typeof cadService.options).toBe('object');
    expect(cadService.options.port).toBeDefined();

    const port = parseInt(cadService.options.port);
    expect(typeof port).toBe('number');
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThan(65536);

    expect(cadService.options.host).toBeDefined();
    expect(typeof cadService.options.host).toBe('string');

    expect(port).toEqual(5002);
    expect(cadService.options.host).toEqual('localhost');
  });

  it('should get valid options for authService', () => {
    const authService = service.get('authService');
    expect(authService).toBeDefined();
    expect(typeof authService).toBe('object');
    expect(authService.options).toBeDefined();
    expect(typeof authService.options).toBe('object');
    expect(authService.options.port).toBeDefined();

    const port = parseInt(authService.options.port);
    expect(typeof port).toBe('number');
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThan(65536);

    expect(authService.options.host).toBeDefined();
    expect(typeof authService.options.host).toBe('string');

    expect(authService.options.port).toEqual(31074);
    expect(authService.options.host).toEqual('200.98.128.106');
  });

  it('should get a valid MONGO_URL', () => {
    const mongoUrl = service.get('MONGO_URL');
    expect(mongoUrl).toBeDefined();
    expect(typeof mongoUrl).toBe('string');
  });
});
