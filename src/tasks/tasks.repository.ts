import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/crerate-task-dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './dto/task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}
  async findTaskByID(id: string): Promise<Task> {
    return await this.tasksRepository.findOneBy({ id: id });
  }
  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.tasksRepository.create({
      title: title,
      description: description,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async removeTaskByID(id: string): Promise<boolean> {
    const result = await this.tasksRepository.delete(id);
    return result.affected > 0;
  }
  async updateTaskByID(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.findTaskByID(id);
    if (task) {
      task.status = status;
      this.tasksRepository.save(task);
    }
    return task;
  }
  async getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.tasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }
    if (search) {
      const expandedSearch = `%${search.toLowerCase()}%`;
      query.andWhere(
        new Brackets((qb) =>
          qb
            .andWhere('LOWER(task.title) LIKE :search', {
              search: expandedSearch,
            })
            .orWhere('LOWER(task.description) LIKE :search', {
              search: expandedSearch,
            }),
        ),
      );
    }
    return query.getMany();
  }
}
