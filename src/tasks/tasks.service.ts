import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/crerate-task-dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './dto/task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO);
  }

  async getTaskByID(id: string): Promise<Task> {
    //return matching task or 404
    const found = await this.tasksRepository.findTaskByID(id);
    this.throwIfIdDoesNotExist(found, id);
    return found;
  }

  async removeTaskByID(id: string): Promise<void> {
    const found = await this.tasksRepository.removeTaskByID(id);
    this.throwIfIdDoesNotExist(found, id);
  }

  async updateTaskByID(id: string, status: TaskStatus): Promise<Task> {
    const found = await this.tasksRepository.updateTaskByID(id, status);
    this.throwIfIdDoesNotExist(found, id);
    return found;
  }

  async getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDTO);
  }
  private throwIfIdDoesNotExist(found: any, id: string) {
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
