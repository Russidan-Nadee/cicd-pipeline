import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ItemsService } from '../../src/items/items.service';
import { PrismaService } from '../../src/prisma.service';

describe('ItemsService', () => {
  let service: ItemsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    item: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const createItemDto = { item: 'test item' };
      const mockItem = { id: 1, item: 'test item', createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.item.create.mockResolvedValue(mockItem);

      const result = await service.create(createItemDto);

      expect(prisma.item.create).toHaveBeenCalledWith({
        data: createItemDto,
      });
      expect(result).toEqual(mockItem);
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems = [
        { id: 1, item: 'item 1', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, item: 'item 2', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrismaService.item.findMany.mockResolvedValue(mockItems);

      const result = await service.findAll();

      expect(prisma.item.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockItems);
    });
  });

  describe('findOne', () => {
    it('should return a single item', async () => {
      const mockItem = { id: 1, item: 'test item', createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.item.findUnique.mockResolvedValue(mockItem);

      const result = await service.findOne(1);

      expect(prisma.item.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException when item not found', async () => {
      mockPrismaService.item.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Item with ID 999 not found');
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const updateItemDto = { item: 'updated item' };
      const mockItem = { id: 1, item: 'updated item', createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.item.findUnique.mockResolvedValue(mockItem);
      mockPrismaService.item.update.mockResolvedValue(mockItem);

      const result = await service.update(1, updateItemDto);

      expect(prisma.item.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateItemDto,
      });
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException when item not found', async () => {
      mockPrismaService.item.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { item: 'test' })).rejects.toThrow(NotFoundException);
      await expect(service.update(999, { item: 'test' })).rejects.toThrow('Item with ID 999 not found');
    });
  });

  describe('remove', () => {
    it('should delete an item', async () => {
      const mockItem = { id: 1, item: 'test item', createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.item.findUnique.mockResolvedValue(mockItem);
      mockPrismaService.item.delete.mockResolvedValue(mockItem);

      const result = await service.remove(1);

      expect(prisma.item.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException when item not found', async () => {
      mockPrismaService.item.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow('Item with ID 999 not found');
    });
  });
});
