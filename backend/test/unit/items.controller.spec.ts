import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from '../../src/items/items.controller';
import { ItemsService } from '../../src/items/items.service';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  const mockItemsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: mockItemsService,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const createItemDto = { item: 'test item' };
      const mockItem = { id: 1, item: 'test item', createdAt: new Date(), updatedAt: new Date() };

      mockItemsService.create.mockResolvedValue(mockItem);

      const result = await controller.create(createItemDto);

      expect(service.create).toHaveBeenCalledWith(createItemDto);
      expect(result).toEqual(mockItem);
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems = [
        { id: 1, item: 'item 1', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, item: 'item 2', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockItemsService.findAll.mockResolvedValue(mockItems);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockItems);
    });
  });

  describe('findOne', () => {
    it('should return a single item', async () => {
      const mockItem = { id: 1, item: 'test item', createdAt: new Date(), updatedAt: new Date() };

      mockItemsService.findOne.mockResolvedValue(mockItem);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockItem);
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const updateItemDto = { item: 'updated item' };
      const mockItem = { id: 1, item: 'updated item', createdAt: new Date(), updatedAt: new Date() };

      mockItemsService.update.mockResolvedValue(mockItem);

      const result = await controller.update('1', updateItemDto);

      expect(service.update).toHaveBeenCalledWith(1, updateItemDto);
      expect(result).toEqual(mockItem);
    });
  });

  describe('remove', () => {
    it('should delete an item', async () => {
      const mockItem = { id: 1, item: 'test item', createdAt: new Date(), updatedAt: new Date() };

      mockItemsService.remove.mockResolvedValue(mockItem);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockItem);
    });
  });
});
