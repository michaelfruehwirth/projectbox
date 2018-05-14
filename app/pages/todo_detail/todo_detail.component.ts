import {Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef} from "@angular/core";
import { User } from "../../shared/user/user";
import { Router, ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { StatusService } from "../../shared/status/status.service";
import { Todo, Tracking, Comment } from "../../shared/todo/todo";
import { TodoService } from "../../shared/todo/todo.service";
import "rxjs/add/operator/switchMap";
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { UserService } from "../../shared/user/user.service";
var timer = require("timer");
/* date picker */
import { ModalDatetimepicker, PickerOptions } from 'nativescript-modal-datetimepicker';
import {Config} from "../../shared/config";
import { SelectedIndexChangedEventData } from "nativescript-drop-down";


@Component({
  selector: "pb-todo_detail",
  providers: [TodoService, StatusService, UserService],
  templateUrl: "pages/todo_detail/todo_detail.html",
  styleUrls: ["pages/todo_detail/todo_detail-common.css", "pages/todo_detail/todo_detail.css"]
})

export class Todo_detailComponent {
  selectedUserIndex: number;
  selectedPhaseIndex: number;
  selectedProjectIndex: any;
  projectList: string[] = new Array<string>();
  userIds: string[] = new Array<string>();
  phaseIds: string[] = new Array<string>();
  userSelection: string[] = new Array<string>();
  projectIds: string[] = new Array<string>();
  todo: Todo;
  public newTracking = new Tracking();
  public newTimerTracking = new Tracking();
  public newComment = new Comment();
  public phaseSelection :string[] = new Array<string>();  //dropdown selection zur auswahl der phase in der ein task created werden soll. wird befüllt nachdem der user ein Projekt ausgewählt hat.
  task_tabs: string;
  trackings :Tracking[] = new Array<Tracking>();
  isPL :boolean;
  userAvatar :string = "";
  totalTime :number = 0;
  totalTimeString :string;
  @ViewChild("commentText") commentTextField: ElementRef;

    /* date picker */
    public date: string;
    private modalDatetimepicker: ModalDatetimepicker;


  constructor
  (
    private router: Router,
    private routerExtensions: RouterExtensions,
    private route: ActivatedRoute,
    private statusService :StatusService,
    private todoService :TodoService,
    private page: Page,
    private _changeDetectionRef: ChangeDetectorRef,
    private fonticon: TNSFontIconService,
    private userService: UserService,
  )
  {
    this.route.params.subscribe((params) => {
      this.getTodo(params["id"]);
    });

    this.totalTimeString = "00:00:00";

    this.userAvatar = Config.apiUrl + "v2/user/avatar/" + this.userService.getCurrentUser().avatar + "?access_token=" + Config.token;

    this.task_tabs = 'timetracking';

    this.page.css = "Page { background-color: #ffffff; } .page { padding-left: 0; padding:20; background-color: #ffffff;}";
      this.modalDatetimepicker = new ModalDatetimepicker();
  }

  navigateto(pagename: string) {
    this.routerExtensions.navigate([pagename], {
      transition: {
          name: "slide",
          curve: "easeOut"
      }
    });
  }

  getTodo(todo_id :string){
    this.todoService.getSingleTodo(todo_id)
      .then((data) => {
        this.todo = data.tasks[0];
        let date = new Date(this.todo.due_date);
        date.setMonth(date.getMonth()+1);
        this.date = (date.getDate() < 10? '0'+date.getDate() : date.getDate()) + "." + ((date.getMonth()+1) < 10? '0'+(date.getMonth()+1) : (date.getMonth()+1)) + "." + date.getFullYear().toString();
        this.todo.comments = data.comments;
        if(this.todo.comments){
          this.todo.comments.forEach((comment) => {
            this.userService.getUser(comment.user_id)
                .then((data) => {
                  comment.userImage = Config.apiUrl + "v2/user/avatar/" + data.users[0].avatar + "?access_token=" + Config.token;
                  comment.userFName = data.users[0].first_name;
                  comment.userLName = data.users[0].last_name;
                });
            var date = new Date (comment.created_at);
            var month = date.setMonth(date.getMonth()+1);
            comment.date = date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + " um " + (date.getHours()>9?date.getHours():"0"+date.getHours()) + ":" + (date.getMinutes()>9?date.getMinutes():"0"+date.getMinutes()) + " Uhr";
          });
        }
        let trackingsprocessed :number = 0;
        this.todo.trackings.forEach((tracking, index, array) => {
          this.todoService.fillTracking(tracking)
          .then((data) => {
            let startDate = new Date (data.trackings[0].created_at);
            startDate.setMonth(startDate.getMonth()+1);
            let start_minfix = startDate.getMinutes() < 10? 0 + startDate.getMinutes().toString() : startDate.getMinutes().toString();
            let start_hourfix = startDate.getHours() < 10? 0 + startDate.getHours().toString() :  startDate.getHours().toString();
            data.trackings[0].startDateString = (startDate.getDate() < 10? '0'+startDate.getDate() : startDate.getDate()) + "." + (startDate.getMonth() < 10? '0'+startDate.getMonth() : startDate.getMonth()) + "." + startDate.getFullYear().toString().substring(2,4);
            data.trackings[0].startTimeString = start_hourfix + ":" + start_minfix + ":" + startDate.getSeconds();
            let endDate = new Date (data.trackings[0].finished_at);
            let end_minfix = endDate.getMinutes() < 10? 0 + endDate.getMinutes().toString() :  endDate.getMinutes().toString();
            let end_hourfix = endDate.getHours() < 10? 0 + endDate.getHours().toString() : endDate.getHours().toString();
            data.trackings[0].endTimeString = end_hourfix + ":" + end_minfix + ":" + endDate.getSeconds();

            let elapsedTime = Math.round((new Date(data.trackings[0].finished_at).getTime() - new Date(data.trackings[0].started_at).getTime())/1000);
            this.totalTime += elapsedTime; //counting together the length of all trackings
            trackingsprocessed++;
            if(trackingsprocessed === array.length) {
              let minsecs = this.totalTime%3600;
              let hours = (this.totalTime-minsecs)/3600;
              let seconds = minsecs%60;
              let minutes = (minsecs-seconds)/60;
              this.totalTimeString = "" + (hours>9?hours:"0"+hours) + ":" + (minutes>9?minutes:"0"+minutes) + ":" + (seconds>9?seconds:"0"+seconds);
            }
            let minsecs = elapsedTime%3600;
            let hours = (elapsedTime-minsecs)/3600;
            let seconds = minsecs%60;
            let minutes = (minsecs-seconds)/60;
            data.trackings[0].timerString = "" + (hours>9?hours:"0"+hours) + ":" + (minutes>9?minutes:"0"+minutes) + ":" + (seconds>9?seconds:"0"+seconds);
            return data;
          })
          .then((data) => {
            if(data.trackings[0].finished){
              this.trackings.push(data.trackings[0]);
            }
          });

        });
        this.userService.getSingleProject(this.todo.project)
          .then((data) =>{
            this.isPL = (data.projects[0].user == this.userService.getCurrentUser().id);
        });
        this.userService.getProjects()
        .then((data) => {
          data.projects.forEach((project) => {
            this.projectIds[this.projectList.push(project.name)-1] = project.id;
            if(this.todo.project == project.id){
              this.selectedProjectIndex = this.projectList.length-1;
              this.fillDropDown(project.id);
            }
          });
        });
      });
  }

    createComment(){
        let tf = this.commentTextField.nativeElement;
        tf.dismissSoftInput();
        this.newComment.task = this.todo.id;
        this.todoService.createComment(this.newComment)
          .then(() => {
            if(!this.todo.comments){
              this.todo.comments = new Array<Comment>();
            }
            this.newComment.userImage = Config.apiUrl + "v2/user/avatar/" + this.userService.getCurrentUser().avatar + "?access_token=" + Config.token;
            this.newComment.userFName = this.userService.getCurrentUser().first_name;
            this.newComment.userLName = this.userService.getCurrentUser().last_name;
            this.newComment.created_at = "jetzt";
            this.todo.comments.push(this.newComment);
            this.newComment = new Comment();
          });
    }

    state(id) {
        this.task_tabs = id;
    }

    getAvatar(user_id){
      this.userService.getUser(user_id)
        .then((data) => {
          return Config.apiUrl + "v2/user/avatar/" + data.avatar + "?access_token=" + Config.token;
        });
    }

    cancel() {
        this.routerExtensions.backToPreviousPage();
    }

    saveTodo() {
      this.todo.phase_id = this.todo.phase;
      this.todo.responsible_id = this.todo.responsible;
      this.todo.project_id = this.todo.project;
      this.todoService.updateTodo(this.todo);
      this.cancel();
    }

    /* date picker */
    selectDate() {
        this.modalDatetimepicker.pickDate(<PickerOptions>{
            title: "Datum auswählen",
            theme: "dark",
            startingDate: new Date(),
            maxDate: new Date('2030-12-31'), /* hier maxDate setzen */
            minDate: new Date()
        }).then((result:any) => {
            if (result) {
                this.date = (result.day>9?result.day:"0"+result.day) + "." + (result.month>9?result.month:"0"+result.month) + "." + result.year;
                this.todo.due_date = new Date(result.year, result.month-1, result.day);
            }
        })
            .catch((error) => {
                console.log("Error: " + error);
            });
    };

    deleteTracking(t :Tracking){
      this.todoService.deleteTracking(t.id)
        .then(() => {
          //this.reloadTrackings();
          this.trackings.splice(this.trackings.indexOf(t), 1);
          this.totalTime -= Math.round((new Date(t.finished_at).getTime() - new Date(t.started_at).getTime())/1000);
          if(this.totalTime <= 0){
            this.totalTimeString = "00:00:00";
          }else{
            let minsecs = this.totalTime%3600;
            let hours = (this.totalTime-minsecs)/3600;
            let seconds = minsecs%60;
            let minutes = (minsecs-seconds)/60;
            this.totalTimeString = "" + (hours>9?hours:"0"+hours) + ":" + (minutes>9?minutes:"0"+minutes) + ":" + (seconds>9?seconds:"0"+seconds);
          }
        });
    }

   /* reloadTrackings(){
      this.todoService.getSingleTodo(this.todo.id)
      .then((data) => {
        this.todo.trackings = data.tasks[0].trackings;
        this.trackings = new Array<Tracking>();
        let trackingsprocessed :number = 0;
        this.totalTime = 0;
        this.todo.trackings.forEach((tracking, index, array) => {
          this.todoService.fillTracking(tracking)
          .then((data) => {
            let elapsedTime = Math.round((new Date(data.trackings[0].finished_at).getTime() - new Date(data.trackings[0].started_at).getTime())/1000);
            this.totalTime += elapsedTime; //counting together the length of all trackings
            trackingsprocessed++;
            if(trackingsprocessed === array.length) {
              let minsecs = this.totalTime%3600;
              let hours = (this.totalTime-minsecs)/3600;
              let seconds = minsecs%60;
              let minutes = (minsecs-seconds)/60;
              this.totalTimeString = "" + (hours>9?hours:"0"+hours) + ":" + (minutes>9?minutes:"0"+minutes) + ":" + (seconds>9?seconds:"0"+seconds);
            }
            let minsecs = elapsedTime%3600;
            let hours = (elapsedTime-minsecs)/3600;
            let seconds = minsecs%60;
            let minutes = (minsecs-seconds)/60;
            data.trackings[0].timerString = "" + (hours>9?hours:"0"+hours) + ":" + (minutes>9?minutes:"0"+minutes) + ":" + (seconds>9?seconds:"0"+seconds);
            
            return data;

          })
          .then((data) => {
            if(data.trackings[0].finished){
              this.trackings.push(data.trackings[0]);
            }
          });
        });
      });
    } */

    getPhases(args: SelectedIndexChangedEventData){
      this.todo.project = this.projectIds[args.newIndex];
      this.userService.getSingleProject(this.todo.project)
        .then(
          (data) => {
            this.phaseSelection = new Array<string>();
            this.userSelection = new Array<string>();
            data.phases.forEach((phase) => {
              this.phaseIds[this.phaseSelection.push(phase.name)-1] = phase.id;
            });
            data.users.forEach((user) => {
              this.userIds[this.userSelection.push(user.first_name + " " + user.last_name)-1] = user.id;
            });
          },
          (error) => {})
    }

    selectPhase(args: SelectedIndexChangedEventData){
      this.todo.phase = this.phaseIds[args.newIndex];
    }

    selectUser(args: SelectedIndexChangedEventData){
      this.todo.responsible = this.userIds[args.newIndex];
    }
    fillDropDown(project_id){
      this.userService.getSingleProject(project_id)
        .then((data) => {
          this.phaseSelection = new Array<string>();
          this.userSelection = new Array<string>();
          data.phases.forEach((phase) => {
            this.phaseIds[this.phaseSelection.push(phase.name)-1] = phase.id;
            if(this.todo.phase == phase.id){
              this.selectedPhaseIndex = this.phaseSelection.length-1
            }
          });


          data.users.forEach((user) => {
            this.userIds[this.userSelection.push(user.first_name + " " + user.last_name)-1] = user.id;
            if(this.todo.responsible == user.id){
              this.selectedUserIndex = this.userSelection.length-1
            }
          });
        });
      
    }

}
