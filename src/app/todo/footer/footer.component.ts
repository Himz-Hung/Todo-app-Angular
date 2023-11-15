import { Component, OnInit } from '@angular/core';
import { TodoServiceService } from 'src/app/services/todo-service.service';
import { Todo } from '../models/todo.models';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  counter: number = 0;
  constructor(private todoService: TodoServiceService) {}
  ngOnInit(): void {
    this.todoService.todos$.subscribe((Todo) => {
      this.counter = Todo.length;
    });
  }
}
