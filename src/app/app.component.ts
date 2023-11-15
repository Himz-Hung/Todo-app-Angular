import { Component, OnInit } from '@angular/core';
import { TodoServiceService } from './services/todo-service.service';
import { IntergateApiService } from './services/intergate-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  edit: boolean = false;
  flag: boolean = false;
  close: boolean = true;
  constructor(
    private todoService: TodoServiceService
  ) {}

  toggleEdit(toggle: boolean) {
    this.edit = toggle;
  }
  editOff(toggle: boolean) {
    this.edit = toggle;
  }
  closeDialog(toggle: boolean){
    this.close=toggle;
  }
  ngOnInit() {
    this.todoService.fetchFromStorage();
    this.todoService.flag$.subscribe((value) => {
      this.flag = value;
    });
  }
}
