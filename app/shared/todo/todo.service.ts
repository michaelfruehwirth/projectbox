import { Injectable } from '@angular/core';
import { Todo, Tracking, Comment } from './todo';
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../config";
import {
    getBoolean,
    setBoolean,
    getNumber,
    setNumber,
    getString,
    setString,
    hasKey,
    remove,
    clear
} from "application-settings";

@Injectable()
export class TodoService {

  headers :Headers = new Headers();

  constructor(private http: Http) {
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", "Bearer "+ Config.token);
  }


  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }

  getTodos() {
    return this.http.get(
      Config.apiUrl + "v2/tasks",
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
      this.saveTodos(data);
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  createTodo(todo :Todo){
    delete todo.id;
    delete todo.due_date_string;
    return this.http.post(
      Config.apiUrl + "v2/tasks",
      ("{\"task\": " + JSON.stringify(todo) + "}"),
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  updateTodo(todo :Todo){
    let id :string = todo.id + "";
    delete todo.id;
    delete todo.trackingsFull;
    delete todo.due_date_string;
    return this.http.put(
      Config.apiUrl + "v2/tasks/" + id,
      ("{\"task\": " + JSON.stringify(todo) + "}"),
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
      
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  deleteTodo(id :string){
    return this.http.delete(
      Config.apiUrl + "v2/tasks/" + id,
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  fillTracking(tracking :string){
    return this.http.get(
        Config.apiUrl + "v2/trackings/" + tracking,
        { headers: this.headers }
      )
      .map(response => response.json())
      .do(data => {
      })
      .catch(this.handleErrors)
      .toPromise();
  }

  createComment(comment :Comment){
    delete comment.userImage;
    delete comment.id;
    delete comment.task_id;
    delete comment.date;
    delete comment.userFName;
    delete comment.userLName;
    comment.created_at = null;
    comment.project = null;
    comment.user = null;
    delete comment.project_id;
    delete comment.updated_at;
    delete comment.user_id;
    return this.http.post(
      Config.apiUrl + "v2/comments",
      ("{\"comment\": " + JSON.stringify(comment) + "}"),
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  deleteComment(comment_id :string){
    return this.http.delete(
      Config.apiUrl + "v2/comments/" + comment_id,
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  fillComments(todo_id :string){
    return this.http.get(
      Config.apiUrl + "v2/tasks/" + todo_id,
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  saveTodos(todosToSave :any){
    setString("todos", JSON.stringify(todosToSave));
  }

  getSavedTodos (){
    return JSON.parse(getString("todos"));
  }

  createTracking(tracking :Tracking){
    delete tracking.id;
    delete tracking.task_id;
    delete tracking.user_id;
    delete tracking.created_at;
    delete tracking.updated_at;
    tracking.user = null;
    return this.http.post(
      Config.apiUrl + "v2/trackings",
      ("{\"tracking\": " + JSON.stringify(tracking) + "}"),
      { headers: this.headers }
    )
    .map(response => {
      return response.json()
    })
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  deleteTracking(tracking_id :string){
    return this.http.delete(
      Config.apiUrl + "v2/trackings/" + tracking_id,
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  updateTracking(tracking :Tracking){
    let id :string = tracking.id + "";
    delete tracking.id;
    return this.http.put(
      Config.apiUrl + "v2/trackings/" + id,
      ("{\"tracking\": " + JSON.stringify(tracking) + "}"),
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  getSingleTodo(todo_id :string){
    return this.http.get(
      Config.apiUrl + "v2/tasks/" + todo_id,
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }
}
