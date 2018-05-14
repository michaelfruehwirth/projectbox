import { Injectable } from '@angular/core';

import { Meeting } from './meeting';
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/toPromise';
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
export class MeetingService {

  headers :Headers = new Headers();

  constructor(private http: Http) {
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", "Bearer "+ Config.token);
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }

  saveMeetings(meetingsToSave :any){
    setString("meetings", JSON.stringify(meetingsToSave));
  }

  getSavedMeetings (){
    return JSON.parse(getString("meetings"));
  }
  

  getMeetings() {
    return this.http.get(
      Config.apiUrl + "v2/meetings",
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  createMeeting(meeting :Meeting){
    delete meeting.id;
    return this.http.post(
      Config.apiUrl + "v2/meetings",
      ("{\"meeting\": " + JSON.stringify(meeting) + "}"),
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  update(meeting :Meeting){
    let id :string = meeting.id + "";
    delete meeting.id;
    return this.http.put(
      Config.apiUrl + "v2/meetings/" + id,
      ("{\"meeting\": " + JSON.stringify(meeting) + "}"),
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
      console.dir(data);
    })
    .catch(this.handleErrors)
    .toPromise();
  }

  delete(id :string){
    return this.http.delete(
      Config.apiUrl + "v2/meetings/" + id,
      { headers: this.headers }
    )
    .map(response => response.json())
    .do(data => {
    })
    .catch(this.handleErrors)
    .toPromise();
  }

}