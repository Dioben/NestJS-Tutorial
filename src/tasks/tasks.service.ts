import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/crerate-task-dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO, user);
  }

  async getTaskByID(id: string, user: User): Promise<Task> {
    //return matching task or 404
    const found = await this.tasksRepository.findTaskByID(id, user);
    this.throwIfIdDoesNotExist(found, id);
    return found;
  }

  async removeTaskByID(id: string, user: User): Promise<void> {
    const found = await this.tasksRepository.removeTaskByID(id, user);
    this.throwIfIdDoesNotExist(found, id);
  }

  async updateTaskByID(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const found = await this.tasksRepository.updateTaskByID(id, status, user);
    this.throwIfIdDoesNotExist(found, id);
    return found;
  }

  async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDTO, user);
  }
  private throwIfIdDoesNotExist(found: any, id: string) {
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
