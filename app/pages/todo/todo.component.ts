import {Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef} from "@angular/core";
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
import { NavComponent } from "../nav/nav.component";
import {DropDown, ValueList, SelectedIndexChangedEventData} from "nativescript-drop-down";
import {SwipeGestureEventData} from "tns-core-modules/ui/gestures";
import * as dialogs from "tns-core-modules/ui/dialogs";
/* date picker */
import { ModalDatetimepicker, PickerOptions } from 'nativescript-modal-datetimepicker';
var timer = require("timer");


@Component({
  selector: "pb-todo",
  providers: [TodoService, StatusService, UserService],
  templateUrl: "pages/todo/todo.html",
  styleUrls: ["pages/todo/todo-common.css", "pages/todo/todo.css"]
})

export class TodoComponent {
  public newTodo :Todo = new Todo();
  public newTracking = new Tracking();
  public newTimerTracking = new Tracking();
  public newComment = new Comment();
  curUser :User = new User;
  todos :Todo[];
  todoForDetail :boolean[];
  timestart :string;
  create :boolean;
  nav: NavComponent;
  public phaseSelection :string[] = new Array<string>(); //dropdown selection zur auswahl der phase in der ein task created werden soll. wird befüllt nachdem der user ein Projekt ausgewählt hat.
  public userSelection :string[] = new Array<string>();
  currentTrackings :Tracking[] = new Array<Tracking>();
  public projectList: string[] = new Array<string>();
  //timerString :string;
  tracker :any;
  task_tabs: string;
  selectedProject: string;
  projectIds :string[] = new Array<string>();
  phaseIds :string[] = new Array<string>();
  userIds :string[] = new Array<string>();
  direction: number;
    monthNames = ["Jänner", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];

    /* date picker */
    public date: string;
    private modalDatetimepicker: ModalDatetimepicker;

  constructor
  (
    private router: Router,
    private routerExtensions: RouterExtensions,
    private activatedRoute: ActivatedRoute,
    private statusService :StatusService,
    private todoService :TodoService,
    private page: Page,
    private _changeDetectionRef: ChangeDetectorRef,
    private fonticon: TNSFontIconService,
    private userService: UserService,
    private navState: NavComponent
  )
  {
    this.nav = navState;
    this.curUser = this.userService.getCurrentUser();
    this.modalDatetimepicker = new ModalDatetimepicker();

  }

  ngOnInit(): void {
    var that = this;
    this.todoService.getTodos()
    .then(
      (data) => this.displayTodos(data),
      (error) => this.displayTodos(null)
    );
    this.userService.getProjects()
    .then((data) => {
      data.projects.forEach((project) => {
        this.projectIds[this.projectList.push(project.name)-1] = project.id;
      });
    });
    this.create = false;
    this.page.css = ".details { height: 0;}";
    this.phaseSelection.push("Zuerst ein Projekt auswählen!");
  }

  cr_task() {
    this.create = true;
    this.page.css = "Page { background-color: #ffffff; } .page { padding-left: 0; padding:20; background-color: #ffffff;}";
  }

  cancel() {
    this.create = false;
    this.page.css = "Page { background-color: #ECEDEE; } .page { padding-left: 10; background-color: #ECEDEE;}";
  }

 expand(id :string){
    this.todoForDetail[id] = !this.todoForDetail[id];
    this.page.css = ".details { height: auto; }";
  }

  displayTodos(data :any){
        if(data){
          this.todoService.saveTodos(data);
          this.todos = data.tasks;
        }else{
          data = this.todoService.getSavedTodos();
          this.todos = data.tasks;
        }
        data.tasks.forEach(todo => {
          var date = new Date(todo.due_date);
          todo.due_date_string = "bis " + date.getDate() + ". " + this.monthNames[date.getMonth()] + " " + date.getFullYear();
        })
        this.todos.sort((a, b) => {return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()});
        this.todos.forEach(todo => {
          todo.trackingsFull = new Array<Tracking>();
        });

        this.todos.forEach((todo, index) => {        //alle todos durchlaufen
          /*Projektfarben für tasks herausfinden*/
          this.userService.getSingleProject(todo.project_id)
            .then(
              (data) => {this.todos[index].color = data.projects[0].color;this.todos[index].project = data.projects[0].name},
              (error) => {}
            );
            /*-*/
            /*kommentare für task laden und in das objekt hinzufügen*/
          this.todoService.fillComments(todo.id)
            .then(
              (data) => {this.todos[index].comments = data.comments},
              (error) => {}
          );
          /*-*/
          /*trackings*/
          todo.trackings.forEach(tracking => {//für jedes todo alle trackings durchlaufen
            this.todoService.fillTracking(tracking)   //todoService gibt zur trackingID ein tracking objekt zurück
            .then((data) => {
              this.todos[index].trackingsFull.push(data.trackings[0]);
              if(!data.trackings[0].finished){
                this.currentTrackings[todo.id] = data.trackings[0];
                this.currentTrackings[todo.id].trackedSeconds = Math.round((new Date().getTime() - new Date(data.trackings[0].started_at).getTime())/1000);
              }
            },
            (error) => {});
          });
          if(!this.currentTrackings[todo.id]){  //wenn noch kein Tracking vorhanden ist
            this.currentTrackings[todo.id] = new Tracking();
            this.currentTrackings[todo.id].finished = true;
          }
          this.currentTrackings[todo.id].timerString = "00:00:00"; //default wert für alle timerStrings
        });
        if(!this.tracker){
          this.tracker = setInterval(() => { //Interval der currentTrackings nach unfinished dursucht und bei all diesen eins raufzählt
            this.todos.forEach((todo) =>{
              if(!this.currentTrackings[todo.id].finished){
                this.currentTrackings[todo.id].trackedSeconds++;
                let minsecs = this.currentTrackings[todo.id].trackedSeconds%3600;
                let hours = (this.currentTrackings[todo.id].trackedSeconds-minsecs)/3600;
                let seconds = minsecs%60;
                let minutes = (minsecs-seconds)/60;
                this.currentTrackings[todo.id].timerString = "" + (hours>9?hours:"0"+hours) + ":" + (minutes>9?minutes:"0"+minutes) + ":" + (seconds>9?seconds:"0"+seconds);
              }
            });
          }, 1000);
        }

        this.todoForDetail = new Array<boolean>(this.todos.length);
        this.todos.forEach((element) => {
          this.todoForDetail[element.id] = false;
        });
      }

  createTracking(task_id :string){
    //started_at, finished_at, description müssen ins frontend gebinded werden
    this.newTracking.task = task_id;
    this.todoService.createTracking(this.newTracking);
  }

  navigateto(pagename: string) {
    this.routerExtensions.navigate([pagename], {
      transition: {
          name: "slide",
          curve: "easeOut"
      }
    });
  }

    createTodo(){
      let dueDate = this.newTodo.due_date_string.split(".");
      this.newTodo.due_date = new Date(+dueDate[2], +dueDate[1]-1, +dueDate[0]);
      this.todoService.createTodo(this.newTodo)
      .then(() => {
        this.create = false;
        this.ngOnInit();
      });
    }


    createComment(task_id :string){
      this.newComment.task = task_id;
      this.todoService.createComment(this.newComment);
    }

    getPhases(args: SelectedIndexChangedEventData){
      this.newTodo.project = this.projectIds[args.newIndex];
      this.userService.getSingleProject(this.newTodo.project)
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
      this.newTodo.phase = this.phaseIds[args.newIndex];
    }

    selectUser(args: SelectedIndexChangedEventData){
      this.newTodo.responsible = this.userIds[args.newIndex];
    }

    startTimer(task_id :string){
      if(this.currentTrackings[task_id].finished){
        this.currentTrackings[task_id] = new Tracking();
        this.currentTrackings[task_id].task = task_id;
        this.currentTrackings[task_id].started_at = new Date();
        this.currentTrackings[task_id].finished = false;
        this.currentTrackings[task_id].description = "another actual mobile tracking";
        this.currentTrackings[task_id].user = null;
        this.currentTrackings[task_id].trackedSeconds = 0;
        this.currentTrackings[task_id].timerString = "00:00:00";
        this.todoService.createTracking(this.currentTrackings[task_id])
          .then((data) => {
            this.currentTrackings[task_id].id = data.trackings[0].id;
          });

       }else{
        this.currentTrackings[task_id].finished = true;
        this.currentTrackings[task_id].finished_at = new Date();
        this.todoService.updateTracking(this.currentTrackings[task_id]);
      } 
    }

    state(id) {
        this.task_tabs = id;
    }
    goToDetail(todo_id :string){
      this.routerExtensions.navigate(["todo_detail/" + todo_id], {
        transition: {
            name: "slideTop",
            curve: "easeOut"
        }
    });
    }


    /* gesten */
    onSwipe(args: SwipeGestureEventData) {
        this.direction = args.direction;
        /* nach rechts */
        if (this.direction == 2) {
            this.nav.state('meeting');
        }
        /* nach links */
        if (this.direction == 1) {
            this.nav.state('dashboard');
        }

        /* nach unten */
        if (this.direction == 4) {
            this.nav.state('ticket');
        }
    }


    finished(task :Todo){
      task.completed = true;
      this.todoService.updateTodo(task);
      this.todos.splice(this.todos.indexOf(task), 1);

        let options = {
            title: "Bestätigung",
            message: "Aufgabe '" + task.name + "' wurde erledigt.",
            okButtonText: "OK"
        };

        alert(options);
    }

    /* date picker */
    selectDate() {
        this.modalDatetimepicker.pickDate(<PickerOptions>{
            title: "Datum auswählen",
            theme: "dark",
            startingDate: new Date(),
            maxDate: new Date('2030-01-01'), /* hier maxDate setzen */
            minDate: new Date()
        }).then((result:any) => {
            if (result) {
                this.newTodo.due_date_string = result.day + "." + result.month + "." + result.year;
            }
        })
            .catch((error) => {
                console.log("Error: " + error);
            });
    };

    deleteTodo(t_id :string){
      this.todoService.deleteTodo(t_id)
        .then(() => {alert("Task erfolgreich gelöscht!");this.ngOnInit()},
              (error) => {alert("Fehler beim löschen des Tasks")});

    }
}
