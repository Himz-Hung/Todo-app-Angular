import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../todo/models/todo.models';
import { BehaviorSubject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IntergateApiService {
  private readonly apiAddr =
    'https://64a78cd5096b3f0fcc816e31.mockapi.io/todoItems';
  private data: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  constructor(private http: HttpClient) {}
  public getTodo() {
    return this.data.asObservable().pipe(
      switchMap(()=>this.http.get<Todo[]>(`${this.apiAddr}`)))
  }
  public postTodo(todo: Todo) {
    return this.http.post(`${this.apiAddr}`, todo);
  }
  public delTodo(todo: Todo) {
    return this.http.delete(`${this.apiAddr}/${todo.id}`)
  }
  public putTodo(todo: Todo) {
    console.log('hu hu')
    return this.http.put(`${this.apiAddr}/${todo.id}`, todo)
  }
}
