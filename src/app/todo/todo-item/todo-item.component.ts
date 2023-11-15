import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Todo } from '../models/todo.models';
import { TodoServiceService } from '../../services/todo-service.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  @Output() changeStatus: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() deleteTodo: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() edit: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  constructor(private todoService: TodoServiceService) {}
  ngOnInit(): void {}

  changeTodoStatus() {
    this.changeStatus.emit({
      ...this.todo,
      checkComplete: !this.todo.checkComplete,
    });
  }
  editTodo() {
    this.todoService.nextTodo(this.todo);
    this.edit.emit(true);
  }
  removeTodo() {
    this.deleteTodo.emit(this.todo);
  }
}
