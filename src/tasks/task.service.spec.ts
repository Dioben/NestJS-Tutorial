import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findTaskByID: jest.fn(),
});

const mockUser = {
  username: 'name',
  tasks: [],
  id: 'sample text',
  password: 'pw',
};

describe('Tasks Service', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    //init module with service and repo
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    tasksRepository = await module.get<TasksRepository>(TasksRepository);
  });
  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns result', async () => {
      //this is good for promises, better than mockReturnedValue
      tasksRepository.getTasks.mockResolvedValue('value');

      const result = await tasksService.getTasks({}, mockUser);
      expect(result).toEqual('value');
    });
  });

  describe('getTaskByID', () => {
    it('calls repository method and returns result', async () => {
      const mockTask = {
        title: 'test',
        description: 'test desc',
        id: 'id',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findTaskByID.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskByID('smth', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls repository method and handles error', () => {
      tasksRepository.findTaskByID.mockResolvedValue(null);
      expect(tasksService.getTaskByID('smth', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
