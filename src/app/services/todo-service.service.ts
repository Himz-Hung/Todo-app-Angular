import { Injectable } from '@angular/core';
import { Todo } from '../todo/models/todo.models';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../todo/models/filter.models';
import { IntergateApiService } from './intergate-api.service';
@Injectable({
  providedIn: 'root',
})
export class TodoServiceService {
  private currTodo!: Todo;
  private todos: Todo[] = [];
  private filteredTodo: Todo[] = [];
  private displayFilterSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<
    Todo[]
  >([]);
  private currFilter: Filter = Filter.All;
  private timing: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private todoNow: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private flag: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private todoEdit: BehaviorSubject<Todo> = new BehaviorSubject<Todo>(
    this.currTodo
  );

  private currTiming = 0;
  private currentDate = new Date();
  private hours = this.currentDate.getHours();
  private minutes = this.currentDate.getMinutes();
  private year = String(this.currentDate.getFullYear());
  private month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
  private day = String(this.currentDate.getDate()).padStart(2, '0');

  private todayTodo: Todo[] = [];
  private todayTodoSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<
    Todo[]
  >([]);

  flag$: Observable<boolean> = this.flag.asObservable();
  todoNow$: Observable<number> = this.todoNow.asObservable();
  todayTodo$: Observable<Todo[]> = this.todayTodoSubject.asObservable();
  todoEdit$: Observable<Todo> = this.todoEdit.asObservable();
  todos$: Observable<Todo[]> = this.displayFilterSubject.asObservable();
  timing$: Observable<number> = this.timing.asObservable();

  constructor(private intergateApiService: IntergateApiService) {}
  fetchFromStorage() {
    this.intergateApiService.getTodo().subscribe((todoList) => {
      this.todos = todoList;
      this.flag.next(true);
    });
    this.filteredTodo = [...this.todos];
    this.todos.forEach((todo) => {
      this.checkDate(todo);
    });
    this.updateTodosData();
  }
  private updateTodosData() {
    this.displayFilterSubject.next(this.filteredTodo);
    this.todayTodoSubject.next(this.todayTodo);
    if (this.todayTodo.length > 0) {
      this.getCurrentTime();
      this.timing.next(this.getTimingTodo(this.findNearestTodo()));
    } else {
      this.timing.next(-1);
    }
  }
  filterTodos(filter: Filter, isFiltering: boolean = true) {
    this.currFilter = filter;
    switch (filter) {
      case Filter.Active:
        this.filteredTodo = this.todos.filter((todo) => !todo.checkComplete);
        break;
      case Filter.Completed:
        this.filteredTodo = this.todos.filter((todo) => todo.checkComplete);
        break;
      case Filter.All:
        this.filteredTodo = [...this.todos];
        break;
    }
    if (isFiltering) {
      this.updateTodosData();
    }
  }
  refeshData() {
    this.filteredTodo = [];
    this.intergateApiService.getTodo().subscribe((todoList) => {
      this.todos = todoList;
      this.flag.next(true);
    });
    this.filteredTodo = [...this.todos];
  }
  addTodo(content: string, date: string) {
    let id = 1;
    this.todos.forEach((todo) => {
      if (todo.id > id) {
        id = todo.id;
      }
    });
    id++;
    if (!this.todos.length) {
      id = 1;
    }
    const newTodo = new Todo(id, content, date);
    this.todos.unshift(newTodo);
    this.checkDate(newTodo);
    this.updateToStorage(3, newTodo);
  }
  updateToStorage(selection: number, todo: Todo) {
    switch (selection) {
      case 1:
        this.intergateApiService.putTodo(todo).subscribe(() => {
          this.refeshData();
        });
        break;
      case 2:
        this.intergateApiService.delTodo(todo).subscribe(() => {
          this.refeshData();
        });
        break;
      case 3:
        this.intergateApiService.postTodo(todo).subscribe(() => {
          this.refeshData();
        });
        break;
    }
    this.filterTodos(this.currFilter, false);
    this.updateTodosData();
  }
  changeTodoStatus(id: number, complete: boolean) {
    let index = this.todos.findIndex((todo) => todo.id == id);
    const todo = this.todos[index];
    todo.checkComplete = complete;
    if (complete) {
      let indexToday = this.todayTodo.findIndex((todo) => todo.id == id);
      if (indexToday != -1) {
        this.todayTodo.splice(indexToday, 1);
      }
    } else {
      this.checkDate(todo);
    }
    this.todos.splice(index, 1, todo);
    this.updateToStorage(1, todo);
  }
  nextTodo(todo: Todo) {
    this.todoEdit.next(todo);
  }
  updateTodo(id: number, content: string, date: string) {
    let index = this.todos.findIndex((todo) => todo.id == id);
    const todo = this.todos[index];
    todo.content = content;
    todo.date = date;
    let indexToday = this.todayTodo.findIndex((todo) => todo.id == id);
    if (indexToday != -1) {
      if (
        todo.date.split('-')[2].split('T')[0] != this.day ||
        todo.date.split('-')[0] != this.year ||
        todo.date.split('-')[1] != this.month
      ) {
        this.todayTodo.splice(indexToday, 1);
      } else {
        this.todayTodo.splice(indexToday, 1, todo);
      }
    } else {
      this.checkDate(todo);
    }
    this.todos.splice(index, 1, todo);
    this.updateToStorage(1, todo);
  }
  removeTodo(id: number) {
    const newTodo = new Todo(id, '', '');
    let indexToday = this.todayTodo.findIndex((todo) => todo.id == id);
    let indexLocal = this.todos.findIndex((todo) => todo.id == id);
    if (indexToday != -1) {
      this.todayTodo.splice(indexToday, 1);
    }
    this.todos.splice(indexLocal, 1);
    this.updateToStorage(2, newTodo);
  }
  checkDate(todo: Todo, update: boolean = true) {
    if (
      todo.date.split('-')[2].split('T')[0] == this.day &&
      todo.date.split('-')[0] == this.year &&
      todo.date.split('-')[1] == this.month &&
      !todo.checkComplete
    ) {
      this.todayTodo.push(todo);
    }
  }
  calculateSecond(h: number, m: number): number {
    return h * 60 * 60 + m * 60;
  }

  getCurrentTime() {
    this.currentDate = new Date();
    this.hours = this.currentDate.getHours();
    this.minutes = this.currentDate.getMinutes();
  }

  getSecondTodo(todo: Todo): number {
    let todoTime = todo.date.split('T')[1];
    let h = Number(todoTime.split(':')[0]);
    let m = Number(todoTime.split(':')[1]);
    return this.calculateSecond(h, m);
  }
  findNearestTodo(): number {
    let seconds: number = new Date().getSeconds();
    let currentTime: number = this.calculateSecond(this.hours, this.minutes);
    let todoAfterCurrTime: Todo[] = [];
    let nearestTodo = 0;
    for (let i = 0; i < this.todayTodo.length; i++) {
      if (this.getSecondTodo(this.todayTodo[i]) > currentTime) {
        todoAfterCurrTime.push(this.todayTodo[i]);
      }
    }
    if (todoAfterCurrTime.length == 0) {
      return -1;
    }
    let smallest: number = this.getSecondTodo(todoAfterCurrTime[0]);
    for (let i = 0; i < todoAfterCurrTime.length; i++) {
      if (this.getSecondTodo(todoAfterCurrTime[i]) <= smallest) {
        smallest = this.getSecondTodo(todoAfterCurrTime[i]);
        this.currTiming = todoAfterCurrTime[i].id;
        nearestTodo = todoAfterCurrTime[i].id;
      }
    }
    this.todoNow.next(nearestTodo);
    return smallest - seconds;
  }
  getTimingTodo(smallest: number): number {
    let currentTime: number = this.calculateSecond(this.hours, this.minutes);
    if (smallest == -1) {
      return -1;
    } else {
      if (3600 > smallest - currentTime) {
        return smallest - currentTime;
      } else return smallest - currentTime - 3600;
    }
  }
  checkFinished() {
    let index = -1;
    for (let i = 0; i < this.todayTodo.length; i++) {
      if (this.todayTodo[i].id == this.currTiming) {
        index = i;
      }
    }
    this.todayTodo.splice(index, 1);
    this.updateTodosData();
  }
}
