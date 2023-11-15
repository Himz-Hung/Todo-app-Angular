import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoServiceService } from '../../services/todo-service.service';
import { Todo } from '../models/todo.models';
import { Subscription } from 'rxjs';
import { IntergateApiService } from 'src/app/services/intergate-api.service';
@Component({
  selector: 'app-add-or-edit',
  templateUrl: './add-or-edit.component.html',
  styleUrls: ['./add-or-edit.component.scss'],
})
export class AddOrEditComponent implements OnInit, OnChanges {
  @Output() refuseEdit = new EventEmitter<boolean>();
  @Output() closeDialog = new EventEmitter<boolean>();
  @Input() edit!: boolean;
  private subscription!: Subscription;
  reactiveForm: FormGroup;
  alertNotify: boolean = false;
  todo!: Todo;
  cancelDialog() {
    this.closeDialog.emit(true);
    this.reactiveForm.controls['content'].markAsUntouched();
    this.reactiveForm.controls['date'].markAsUntouched();
    this.reactiveForm.reset();
    if (this.edit) {
      this.subscription.unsubscribe();
      this.edit = false;
      this.refuseEdit.emit(false);
    }
  }
  constructor(
    private todoService: TodoServiceService,
  ) {
    this.reactiveForm = new FormGroup({
      content: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['edit']) {
      if (this.edit) {
        this.updateData();
        this.updateForm();
      }
    }
  }
  ngOnInit(): void {}
  updateData() {
    this.subscription = this.todoService.todoEdit$.subscribe((edit) => {
      this.todo = edit;
    });
  }
  updateForm() {
    this.reactiveForm.get('content')?.patchValue(this.todo.content);
    this.reactiveForm.get('date')?.patchValue(this.todo.date);
  }
  checkInput(type: string): boolean {
    if (type && this.reactiveForm.get(type)?.value.trim() === '') {
      this.reactiveForm.controls[type].setErrors({ incorrect: true });
      this.reactiveForm.get(type)?.markAsTouched;
      return false;
    } else return true;
  }
  onSubmit() {
    this.reactiveForm.markAllAsTouched();
    if (this.checkInput('content') && this.checkInput('date')) {
      if (this.edit) {
        this.todoService.updateTodo(
          this.todo.id,
          this.reactiveForm.get('content')?.value,
          this.reactiveForm.get('date')?.value
        );
        this.cancelDialog();
        return true;
      } else {
        this.todoService.addTodo(
          this.reactiveForm.get('content')?.value,
          this.reactiveForm.get('date')?.value
        );
        this.cancelDialog();
        return true;
      }
    }
    return false;
  }
}
