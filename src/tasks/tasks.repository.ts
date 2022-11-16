import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
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
  async findTaskByID(id: string, user: User): Promise<Task> {
    return await this.tasksRepository.findOneBy({ id: id, user: user });
  }
  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.tasksRepository.create({
      title: title,
      description: description,
      user: user,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async removeTaskByID(id: string, user: User): Promise<boolean> {
    const result = await this.tasksRepository.delete({ id: id, user: user });
    return result.affected > 0;
  }
  async updateTaskByID(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.findTaskByID(id, user);
    if (task) {
      task.status = status;
      this.tasksRepository.save(task);
    }
    return task;
  }
  async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user });

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
