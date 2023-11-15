import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Filter, FilterTodo } from '../models/filter.models';
import { TodoServiceService } from '../../services/todo-service.service';

@Component({
  selector: 'app-todo-filter',
  templateUrl: './todo-filter.component.html',
  styleUrls: ['./todo-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TodoFilterComponent implements OnInit {
  FilterTodo: FilterTodo[] = [
    { type: Filter.All, label: 'All', activeCheck: true },
    { type: Filter.Active, label: 'Active', activeCheck: false },
    { type: Filter.Completed, label: 'Completed', activeCheck: false },
  ];
  constructor(private todoService: TodoServiceService) {}
  ngOnInit(): void {
    this.filterSelect(0);
  }
  filterSelect(selection: Filter) {
    this.setActiveBtn(selection);
    this.todoService.filterTodos(selection);
  }
  setActiveBtn(type: Filter) {
    this.FilterTodo.forEach((btn) => {
      btn.activeCheck = btn.type === type;
    });
  }
}
