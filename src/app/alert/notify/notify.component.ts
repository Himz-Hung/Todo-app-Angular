import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  DoCheck,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TodoServiceService } from '../../services/todo-service.service';
import { Subscription, count } from 'rxjs';
import { Todo } from '../../todo/models/todo.models';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit, OnDestroy, DoCheck, OnChanges {
  private currentDate = new Date();
  flag = false;
  private timing: number = 0;
  private interval: any;
  private todoPosition = 0;
  private todoToday: Todo[] = [];
  todoContent: string = '';

  private subcriptionTiming!: Subscription;
  private subcriptionTodo!: Subscription;
  private subcriptionTodoToday!: Subscription;

  constructor(private todoService: TodoServiceService) {}
  ngDoCheck(): void {
    if (this.timing > 0) {
      this.interval = setInterval(() => {
        if (this.timing < 0) {
          clearInterval(this.interval);
          return;
        }
        this.todoToday.forEach((todo) => {
          if (todo.id == this.todoPosition) {
            this.todoContent = todo.content;
          }
        });
        this.todoService.checkFinished();
        this.toggle();
        clearInterval(this.interval);
      }, this.timing);
    } else {
      clearInterval(this.interval);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['timing'] && changes['timing'].currentValue <= 0) {
      clearInterval(this.interval);
    }
  }

  ngOnInit(): void {
    this.subcriptionTiming = this.todoService.timing$.subscribe((time) => {
      this.timing = time * 1000;
    });
    this.subcriptionTodo = this.todoService.todoNow$.subscribe((position) => {
      this.todoPosition = position;
    });
    this.subcriptionTodoToday = this.todoService.todayTodo$.subscribe(
      (todoToday) => {
        this.todoToday = todoToday;
      }
    );
  }

  ngOnDestroy(): void {
      clearInterval(this.interval);
    this.subcriptionTiming.unsubscribe();
    this.subcriptionTodo.unsubscribe();
  }
  @Output() notify = new EventEmitter<number>();
  toggle() {
    this.flag = !this.flag;
  }
}
