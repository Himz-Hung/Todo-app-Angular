import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFilterComponent } from './todo-filter/todo-filter.component';
import { AddOrEditComponent } from './add-or-edit/add-or-edit.component';
import { FooterComponent } from './footer/footer.component';
import { TodolistComponent } from './todolist/todolist.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DateTimeConverterPipe } from './todo-item/date-time-converter.pipe';



@NgModule({
  declarations: [
    TodoFilterComponent,
    AddOrEditComponent,
    FooterComponent,
    TodolistComponent,
    TodoItemComponent,
    DateTimeConverterPipe
  ],
  imports: [
    CommonModule,ReactiveFormsModule
  ],
  exports:[
    TodolistComponent,
    FooterComponent,
    AddOrEditComponent,
    TodoFilterComponent,
  ]
})
export class TodoModule { }
