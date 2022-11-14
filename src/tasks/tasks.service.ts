import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/crerate-task-dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }
  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }
  getTaskByID(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }
  removeTaskByID(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id != id);
  }
  updateTaskByID(id: string, status: TaskStatus): Task {
    const task: Task = this.getTaskByID(id);
    task.status = status;
    return task;
  }

  getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[] {
    const { status, search } = filterDTO;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }
}
