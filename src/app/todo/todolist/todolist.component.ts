import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, filter } from 'rxjs';
import { Todo } from '../models/todo.models';
import { TodoServiceService } from '../../services/todo-service.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss'],
})
export class TodolistComponent implements OnInit {
  @Output() edit: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  todo$: Observable<Todo[]> = new Observable();
  constructor(private todoService: TodoServiceService) {}
  ngOnInit(): void {
    this.todo$ = this.todoService.todos$;
  }
  onChangeTodoStatus(todo: Todo) {
    this.todoService.changeTodoStatus(todo.id, todo.checkComplete);
  }
  removeTodo(todo: Todo) {
    this.ngOnInit();
    this.todoService.removeTodo(todo.id);
  }
  enableEdit(toggle: boolean) {
    this.edit.emit(toggle);
  }
}
