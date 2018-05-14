"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_1 = require("../../shared/user/user");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var status_service_1 = require("../../shared/status/status.service");
var todo_1 = require("../../shared/todo/todo");
var todo_service_1 = require("../../shared/todo/todo.service");
require("rxjs/add/operator/switchMap");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var user_service_1 = require("../../shared/user/user.service");
var nav_component_1 = require("../nav/nav.component");
/* date picker */
var nativescript_modal_datetimepicker_1 = require("nativescript-modal-datetimepicker");
var timer = require("timer");
var TodoComponent = (function () {
    function TodoComponent(router, routerExtensions, activatedRoute, statusService, todoService, page, _changeDetectionRef, fonticon, userService, navState) {
        this.router = router;
        this.routerExtensions = routerExtensions;
        this.activatedRoute = activatedRoute;
        this.statusService = statusService;
        this.todoService = todoService;
        this.page = page;
        this._changeDetectionRef = _changeDetectionRef;
        this.fonticon = fonticon;
        this.userService = userService;
        this.navState = navState;
        this.newTodo = new todo_1.Todo();
        this.newTracking = new todo_1.Tracking();
        this.newTimerTracking = new todo_1.Tracking();
        this.newComment = new todo_1.Comment();
        this.curUser = new user_1.User;
        this.phaseSelection = new Array(); //dropdown selection zur auswahl der phase in der ein task created werden soll. wird befüllt nachdem der user ein Projekt ausgewählt hat.
        this.userSelection = new Array();
        this.currentTrackings = new Array();
        this.projectList = new Array();
        this.projectIds = new Array();
        this.phaseIds = new Array();
        this.userIds = new Array();
        this.monthNames = ["Jänner", "Februar", "März", "April", "Mai", "Juni",
            "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        this.nav = navState;
        this.curUser = this.userService.getCurrentUser();
        this.modalDatetimepicker = new nativescript_modal_datetimepicker_1.ModalDatetimepicker();
    }
    TodoComponent.prototype.ngOnInit = function () {
        var _this = this;
        var that = this;
        this.todoService.getTodos()
            .then(function (data) { return _this.displayTodos(data); }, function (error) { return _this.displayTodos(null); });
        this.userService.getProjects()
            .then(function (data) {
            data.projects.forEach(function (project) {
                _this.projectIds[_this.projectList.push(project.name) - 1] = project.id;
            });
        });
        this.create = false;
        this.page.css = ".details { height: 0;}";
        this.phaseSelection.push("Zuerst ein Projekt auswählen!");
    };
    TodoComponent.prototype.cr_task = function () {
        this.create = true;
        this.page.css = "Page { background-color: #ffffff; } .page { padding-left: 0; padding:20; background-color: #ffffff;}";
    };
    TodoComponent.prototype.cancel = function () {
        this.create = false;
        this.page.css = "Page { background-color: #ECEDEE; } .page { padding-left: 10; background-color: #ECEDEE;}";
    };
    TodoComponent.prototype.expand = function (id) {
        this.todoForDetail[id] = !this.todoForDetail[id];
        this.page.css = ".details { height: auto; }";
    };
    TodoComponent.prototype.displayTodos = function (data) {
        var _this = this;
        if (data) {
            this.todoService.saveTodos(data);
            this.todos = data.tasks;
        }
        else {
            data = this.todoService.getSavedTodos();
            this.todos = data.tasks;
        }
        data.tasks.forEach(function (todo) {
            var date = new Date(todo.due_date);
            todo.due_date_string = "bis " + date.getDate() + ". " + _this.monthNames[date.getMonth()] + " " + date.getFullYear();
        });
        this.todos.sort(function (a, b) { return new Date(a.due_date).getTime() - new Date(b.due_date).getTime(); });
        this.todos.forEach(function (todo) {
            todo.trackingsFull = new Array();
        });
        this.todos.forEach(function (todo, index) {
            /*Projektfarben für tasks herausfinden*/
            _this.userService.getSingleProject(todo.project_id)
                .then(function (data) { _this.todos[index].color = data.projects[0].color; _this.todos[index].project = data.projects[0].name; }, function (error) { });
            /*-*/
            /*kommentare für task laden und in das objekt hinzufügen*/
            _this.todoService.fillComments(todo.id)
                .then(function (data) { _this.todos[index].comments = data.comments; }, function (error) { });
            /*-*/
            /*trackings*/
            todo.trackings.forEach(function (tracking) {
                _this.todoService.fillTracking(tracking) //todoService gibt zur trackingID ein tracking objekt zurück
                    .then(function (data) {
                    _this.todos[index].trackingsFull.push(data.trackings[0]);
                    if (!data.trackings[0].finished) {
                        _this.currentTrackings[todo.id] = data.trackings[0];
                        _this.currentTrackings[todo.id].trackedSeconds = Math.round((new Date().getTime() - new Date(data.trackings[0].started_at).getTime()) / 1000);
                    }
                }, function (error) { });
            });
            if (!_this.currentTrackings[todo.id]) {
                _this.currentTrackings[todo.id] = new todo_1.Tracking();
                _this.currentTrackings[todo.id].finished = true;
            }
            _this.currentTrackings[todo.id].timerString = "00:00:00"; //default wert für alle timerStrings
        });
        if (!this.tracker) {
            this.tracker = setInterval(function () {
                _this.todos.forEach(function (todo) {
                    if (!_this.currentTrackings[todo.id].finished) {
                        _this.currentTrackings[todo.id].trackedSeconds++;
                        var minsecs = _this.currentTrackings[todo.id].trackedSeconds % 3600;
                        var hours = (_this.currentTrackings[todo.id].trackedSeconds - minsecs) / 3600;
                        var seconds = minsecs % 60;
                        var minutes = (minsecs - seconds) / 60;
                        _this.currentTrackings[todo.id].timerString = "" + (hours > 9 ? hours : "0" + hours) + ":" + (minutes > 9 ? minutes : "0" + minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds);
                    }
                });
            }, 1000);
        }
        this.todoForDetail = new Array(this.todos.length);
        this.todos.forEach(function (element) {
            _this.todoForDetail[element.id] = false;
        });
    };
    TodoComponent.prototype.createTracking = function (task_id) {
        //started_at, finished_at, description müssen ins frontend gebinded werden
        this.newTracking.task = task_id;
        this.todoService.createTracking(this.newTracking);
    };
    TodoComponent.prototype.navigateto = function (pagename) {
        this.routerExtensions.navigate([pagename], {
            transition: {
                name: "slide",
                curve: "easeOut"
            }
        });
    };
    TodoComponent.prototype.createTodo = function () {
        var _this = this;
        var dueDate = this.newTodo.due_date_string.split(".");
        this.newTodo.due_date = new Date(+dueDate[2], +dueDate[1] - 1, +dueDate[0]);
        this.todoService.createTodo(this.newTodo)
            .then(function () {
            _this.create = false;
            _this.ngOnInit();
        });
    };
    TodoComponent.prototype.createComment = function (task_id) {
        this.newComment.task = task_id;
        this.todoService.createComment(this.newComment);
    };
    TodoComponent.prototype.getPhases = function (args) {
        var _this = this;
        this.newTodo.project = this.projectIds[args.newIndex];
        this.userService.getSingleProject(this.newTodo.project)
            .then(function (data) {
            _this.phaseSelection = new Array();
            _this.userSelection = new Array();
            data.phases.forEach(function (phase) {
                _this.phaseIds[_this.phaseSelection.push(phase.name) - 1] = phase.id;
            });
            data.users.forEach(function (user) {
                _this.userIds[_this.userSelection.push(user.first_name + " " + user.last_name) - 1] = user.id;
            });
        }, function (error) { });
    };
    TodoComponent.prototype.selectPhase = function (args) {
        this.newTodo.phase = this.phaseIds[args.newIndex];
    };
    TodoComponent.prototype.selectUser = function (args) {
        this.newTodo.responsible = this.userIds[args.newIndex];
    };
    TodoComponent.prototype.startTimer = function (task_id) {
        var _this = this;
        if (this.currentTrackings[task_id].finished) {
            this.currentTrackings[task_id] = new todo_1.Tracking();
            this.currentTrackings[task_id].task = task_id;
            this.currentTrackings[task_id].started_at = new Date();
            this.currentTrackings[task_id].finished = false;
            this.currentTrackings[task_id].description = "another actual mobile tracking";
            this.currentTrackings[task_id].user = null;
            this.currentTrackings[task_id].trackedSeconds = 0;
            this.currentTrackings[task_id].timerString = "00:00:00";
            this.todoService.createTracking(this.currentTrackings[task_id])
                .then(function (data) {
                _this.currentTrackings[task_id].id = data.trackings[0].id;
            });
        }
        else {
            this.currentTrackings[task_id].finished = true;
            this.currentTrackings[task_id].finished_at = new Date();
            this.todoService.updateTracking(this.currentTrackings[task_id]);
        }
    };
    TodoComponent.prototype.state = function (id) {
        this.task_tabs = id;
    };
    TodoComponent.prototype.goToDetail = function (todo_id) {
        this.routerExtensions.navigate(["todo_detail/" + todo_id], {
            transition: {
                name: "slideTop",
                curve: "easeOut"
            }
        });
    };
    /* gesten */
    TodoComponent.prototype.onSwipe = function (args) {
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
    };
    TodoComponent.prototype.finished = function (task) {
        task.completed = true;
        this.todoService.updateTodo(task);
        this.todos.splice(this.todos.indexOf(task), 1);
        var options = {
            title: "Bestätigung",
            message: "Aufgabe '" + task.name + "' wurde erledigt.",
            okButtonText: "OK"
        };
        alert(options);
    };
    /* date picker */
    TodoComponent.prototype.selectDate = function () {
        var _this = this;
        this.modalDatetimepicker.pickDate({
            title: "Datum auswählen",
            theme: "dark",
            startingDate: new Date(),
            maxDate: new Date('2030-01-01'),
            minDate: new Date()
        }).then(function (result) {
            if (result) {
                _this.newTodo.due_date_string = result.day + "." + result.month + "." + result.year;
            }
        })
            .catch(function (error) {
            console.log("Error: " + error);
        });
    };
    ;
    TodoComponent.prototype.deleteTodo = function (t_id) {
        var _this = this;
        this.todoService.deleteTodo(t_id)
            .then(function () { alert("Task erfolgreich gelöscht!"); _this.ngOnInit(); }, function (error) { alert("Fehler beim löschen des Tasks"); });
    };
    TodoComponent = __decorate([
        core_1.Component({
            selector: "pb-todo",
            providers: [todo_service_1.TodoService, status_service_1.StatusService, user_service_1.UserService],
            templateUrl: "pages/todo/todo.html",
            styleUrls: ["pages/todo/todo-common.css", "pages/todo/todo.css"]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            router_2.RouterExtensions,
            router_1.ActivatedRoute,
            status_service_1.StatusService,
            todo_service_1.TodoService,
            page_1.Page,
            core_1.ChangeDetectorRef,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            user_service_1.UserService,
            nav_component_1.NavComponent])
    ], TodoComponent);
    return TodoComponent;
}());
exports.TodoComponent = TodoComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kby5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0b2RvLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RjtBQUM3RiwrQ0FBOEM7QUFDOUMsMENBQXlEO0FBQ3pELHNEQUErRDtBQUMvRCxnQ0FBK0I7QUFDL0IscUVBQW1FO0FBQ25FLCtDQUFpRTtBQUNqRSwrREFBNkQ7QUFDN0QsdUNBQXFDO0FBQ3JDLHVFQUErRDtBQUMvRCwrREFBNkQ7QUFDN0Qsc0RBQW9EO0FBSXBELGlCQUFpQjtBQUNqQix1RkFBdUY7QUFDdkYsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBVTdCO0lBK0JFLHVCQUVVLE1BQWMsRUFDZCxnQkFBa0MsRUFDbEMsY0FBOEIsRUFDOUIsYUFBNEIsRUFDNUIsV0FBd0IsRUFDeEIsSUFBVSxFQUNWLG1CQUFzQyxFQUN0QyxRQUE0QixFQUM1QixXQUF3QixFQUN4QixRQUFzQjtRQVR0QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNWLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBbUI7UUFDdEMsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQXpDekIsWUFBTyxHQUFTLElBQUksV0FBSSxFQUFFLENBQUM7UUFDM0IsZ0JBQVcsR0FBRyxJQUFJLGVBQVEsRUFBRSxDQUFDO1FBQzdCLHFCQUFnQixHQUFHLElBQUksZUFBUSxFQUFFLENBQUM7UUFDbEMsZUFBVSxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFDbEMs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QUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDdkYsQ0FBQztRQUNMLENBQUMsQ0FBQzthQUNHLEtBQUssQ0FBQyxVQUFDLEtBQUs7WUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFBQSxDQUFDO0lBRUYsa0NBQVUsR0FBVixVQUFXLElBQVk7UUFBdkIsaUJBS0M7UUFKQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7YUFDOUIsSUFBSSxDQUFDLGNBQU8sS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQSxLQUFJLENBQUMsUUFBUSxFQUFFLENBQUEsQ0FBQSxDQUFDLEVBQzNELFVBQUMsS0FBSyxJQUFNLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFBLENBQUEsQ0FBQyxDQUFDLENBQUM7SUFFL0QsQ0FBQztJQTlTUSxhQUFhO1FBUHpCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsU0FBUztZQUNuQixTQUFTLEVBQUUsQ0FBQywwQkFBVyxFQUFFLDhCQUFhLEVBQUUsMEJBQVcsQ0FBQztZQUNwRCxXQUFXLEVBQUUsc0JBQXNCO1lBQ25DLFNBQVMsRUFBRSxDQUFDLDRCQUE0QixFQUFFLHFCQUFxQixDQUFDO1NBQ2pFLENBQUM7eUNBbUNrQixlQUFNO1lBQ0kseUJBQWdCO1lBQ2xCLHVCQUFjO1lBQ2YsOEJBQWE7WUFDZiwwQkFBVztZQUNsQixXQUFJO1lBQ1csd0JBQWlCO1lBQzVCLDhDQUFrQjtZQUNmLDBCQUFXO1lBQ2QsNEJBQVk7T0ExQ3JCLGFBQWEsQ0ErU3pCO0lBQUQsb0JBQUM7Q0FBQSxBQS9TRCxJQStTQztBQS9TWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBWaWV3Q2hpbGQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlclwiO1xyXG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0IHsgU3RhdHVzU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc3RhdHVzL3N0YXR1cy5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IFRvZG8sIFRyYWNraW5nLCBDb21tZW50IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC90b2RvL3RvZG9cIjtcclxuaW1wb3J0IHsgVG9kb1NlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3RvZG8vdG9kby5zZXJ2aWNlXCI7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL3N3aXRjaE1hcFwiO1xyXG5pbXBvcnQgeyBUTlNGb250SWNvblNlcnZpY2UgfSBmcm9tICduYXRpdmVzY3JpcHQtbmd4LWZvbnRpY29uJztcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlci5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IE5hdkNvbXBvbmVudCB9IGZyb20gXCIuLi9uYXYvbmF2LmNvbXBvbmVudFwiO1xyXG5pbXBvcnQge0Ryb3BEb3duLCBWYWx1ZUxpc3QsIFNlbGVjdGVkSW5kZXhDaGFuZ2VkRXZlbnREYXRhfSBmcm9tIFwibmF0aXZlc2NyaXB0LWRyb3AtZG93blwiO1xyXG5pbXBvcnQge1N3aXBlR2VzdHVyZUV2ZW50RGF0YX0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvZ2VzdHVyZXNcIjtcclxuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9kaWFsb2dzXCI7XHJcbi8qIGRhdGUgcGlja2VyICovXHJcbmltcG9ydCB7IE1vZGFsRGF0ZXRpbWVwaWNrZXIsIFBpY2tlck9wdGlvbnMgfSBmcm9tICduYXRpdmVzY3JpcHQtbW9kYWwtZGF0ZXRpbWVwaWNrZXInO1xyXG52YXIgdGltZXIgPSByZXF1aXJlKFwidGltZXJcIik7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwicGItdG9kb1wiLFxyXG4gIHByb3ZpZGVyczogW1RvZG9TZXJ2aWNlLCBTdGF0dXNTZXJ2aWNlLCBVc2VyU2VydmljZV0sXHJcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvdG9kby90b2RvLmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcInBhZ2VzL3RvZG8vdG9kby1jb21tb24uY3NzXCIsIFwicGFnZXMvdG9kby90b2RvLmNzc1wiXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFRvZG9Db21wb25lbnQge1xyXG4gIHB1YmxpYyBuZXdUb2RvIDpUb2RvID0gbmV3IFRvZG8oKTtcclxuICBwdWJsaWMgbmV3VHJhY2tpbmcgPSBuZXcgVHJhY2tpbmcoKTtcclxuICBwdWJsaWMgbmV3VGltZXJUcmFja2luZyA9IG5ldyBUcmFja2luZygpO1xyXG4gIHB1YmxpYyBuZXdDb21tZW50ID0gbmV3IENvbW1lbnQoKTtcclxuICBjdXJVc2VyIDpVc2VyID0gbmV3IFVzZXI7XHJcbiAgdG9kb3MgOlRvZG9bXTtcclxuICB0b2RvRm9yRGV0YWlsIDpib29sZWFuW107XHJcbiAgdGltZXN0YXJ0IDpzdHJpbmc7XHJcbiAgY3JlYXRlIDpib29sZWFuO1xyXG4gIG5hdjogTmF2Q29tcG9uZW50O1xyXG4gIHB1YmxpYyBwaGFzZVNlbGVjdGlvbiA6c3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpOyAvL2Ryb3Bkb3duIHNlbGVjdGlvbiB6dXIgYXVzd2FobCBkZXIgcGhhc2UgaW4gZGVyIGVpbiB0YXNrIGNyZWF0ZWQgd2VyZGVuIHNvbGwuIHdpcmQgYmVmw7xsbHQgbmFjaGRlbSBkZXIgdXNlciBlaW4gUHJvamVrdCBhdXNnZXfDpGhsdCBoYXQuXHJcbiAgcHVibGljIHVzZXJTZWxlY3Rpb24gOnN0cmluZ1tdID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICBjdXJyZW50VHJhY2tpbmdzIDpUcmFja2luZ1tdID0gbmV3IEFycmF5PFRyYWNraW5nPigpO1xyXG4gIHB1YmxpYyBwcm9qZWN0TGlzdDogc3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gIC8vdGltZXJTdHJpbmcgOnN0cmluZztcclxuICB0cmFja2VyIDphbnk7XHJcbiAgdGFza190YWJzOiBzdHJpbmc7XHJcbiAgc2VsZWN0ZWRQcm9qZWN0OiBzdHJpbmc7XHJcbiAgcHJvamVjdElkcyA6c3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gIHBoYXNlSWRzIDpzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgdXNlcklkcyA6c3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gIGRpcmVjdGlvbjogbnVtYmVyO1xyXG4gICAgbW9udGhOYW1lcyA9IFtcIkrDpG5uZXJcIiwgXCJGZWJydWFyXCIsIFwiTcOkcnpcIiwgXCJBcHJpbFwiLCBcIk1haVwiLCBcIkp1bmlcIixcclxuICAgICAgICBcIkp1bGlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZXplbWJlclwiXHJcbiAgICBdO1xyXG5cclxuICAgIC8qIGRhdGUgcGlja2VyICovXHJcbiAgICBwdWJsaWMgZGF0ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBtb2RhbERhdGV0aW1lcGlja2VyOiBNb2RhbERhdGV0aW1lcGlja2VyO1xyXG5cclxuICBjb25zdHJ1Y3RvclxyXG4gIChcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXHJcbiAgICBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsXHJcbiAgICBwcml2YXRlIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcclxuICAgIHByaXZhdGUgc3RhdHVzU2VydmljZSA6U3RhdHVzU2VydmljZSxcclxuICAgIHByaXZhdGUgdG9kb1NlcnZpY2UgOlRvZG9TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0aW9uUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcclxuICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBuYXZTdGF0ZTogTmF2Q29tcG9uZW50XHJcbiAgKVxyXG4gIHtcclxuICAgIHRoaXMubmF2ID0gbmF2U3RhdGU7XHJcbiAgICB0aGlzLmN1clVzZXIgPSB0aGlzLnVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICB0aGlzLm1vZGFsRGF0ZXRpbWVwaWNrZXIgPSBuZXcgTW9kYWxEYXRldGltZXBpY2tlcigpO1xyXG5cclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy50b2RvU2VydmljZS5nZXRUb2RvcygpXHJcbiAgICAudGhlbihcclxuICAgICAgKGRhdGEpID0+IHRoaXMuZGlzcGxheVRvZG9zKGRhdGEpLFxyXG4gICAgICAoZXJyb3IpID0+IHRoaXMuZGlzcGxheVRvZG9zKG51bGwpXHJcbiAgICApO1xyXG4gICAgdGhpcy51c2VyU2VydmljZS5nZXRQcm9qZWN0cygpXHJcbiAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICBkYXRhLnByb2plY3RzLmZvckVhY2goKHByb2plY3QpID0+IHtcclxuICAgICAgICB0aGlzLnByb2plY3RJZHNbdGhpcy5wcm9qZWN0TGlzdC5wdXNoKHByb2plY3QubmFtZSktMV0gPSBwcm9qZWN0LmlkO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5jcmVhdGUgPSBmYWxzZTtcclxuICAgIHRoaXMucGFnZS5jc3MgPSBcIi5kZXRhaWxzIHsgaGVpZ2h0OiAwO31cIjtcclxuICAgIHRoaXMucGhhc2VTZWxlY3Rpb24ucHVzaChcIlp1ZXJzdCBlaW4gUHJvamVrdCBhdXN3w6RobGVuIVwiKTtcclxuICB9XHJcblxyXG4gIGNyX3Rhc2soKSB7XHJcbiAgICB0aGlzLmNyZWF0ZSA9IHRydWU7XHJcbiAgICB0aGlzLnBhZ2UuY3NzID0gXCJQYWdlIHsgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjsgfSAucGFnZSB7IHBhZGRpbmctbGVmdDogMDsgcGFkZGluZzoyMDsgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjt9XCI7XHJcbiAgfVxyXG5cclxuICBjYW5jZWwoKSB7XHJcbiAgICB0aGlzLmNyZWF0ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5wYWdlLmNzcyA9IFwiUGFnZSB7IGJhY2tncm91bmQtY29sb3I6ICNFQ0VERUU7IH0gLnBhZ2UgeyBwYWRkaW5nLWxlZnQ6IDEwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjRUNFREVFO31cIjtcclxuICB9XHJcblxyXG4gZXhwYW5kKGlkIDpzdHJpbmcpe1xyXG4gICAgdGhpcy50b2RvRm9yRGV0YWlsW2lkXSA9ICF0aGlzLnRvZG9Gb3JEZXRhaWxbaWRdO1xyXG4gICAgdGhpcy5wYWdlLmNzcyA9IFwiLmRldGFpbHMgeyBoZWlnaHQ6IGF1dG87IH1cIjtcclxuICB9XHJcblxyXG4gIGRpc3BsYXlUb2RvcyhkYXRhIDphbnkpe1xyXG4gICAgICAgIGlmKGRhdGEpe1xyXG4gICAgICAgICAgdGhpcy50b2RvU2VydmljZS5zYXZlVG9kb3MoZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLnRvZG9zID0gZGF0YS50YXNrcztcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGRhdGEgPSB0aGlzLnRvZG9TZXJ2aWNlLmdldFNhdmVkVG9kb3MoKTtcclxuICAgICAgICAgIHRoaXMudG9kb3MgPSBkYXRhLnRhc2tzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkYXRhLnRhc2tzLmZvckVhY2godG9kbyA9PiB7XHJcbiAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHRvZG8uZHVlX2RhdGUpO1xyXG4gICAgICAgICAgdG9kby5kdWVfZGF0ZV9zdHJpbmcgPSBcImJpcyBcIiArIGRhdGUuZ2V0RGF0ZSgpICsgXCIuIFwiICsgdGhpcy5tb250aE5hbWVzW2RhdGUuZ2V0TW9udGgoKV0gKyBcIiBcIiArIGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudG9kb3Muc29ydCgoYSwgYikgPT4ge3JldHVybiBuZXcgRGF0ZShhLmR1ZV9kYXRlKS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShiLmR1ZV9kYXRlKS5nZXRUaW1lKCl9KTtcclxuICAgICAgICB0aGlzLnRvZG9zLmZvckVhY2godG9kbyA9PiB7XHJcbiAgICAgICAgICB0b2RvLnRyYWNraW5nc0Z1bGwgPSBuZXcgQXJyYXk8VHJhY2tpbmc+KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudG9kb3MuZm9yRWFjaCgodG9kbywgaW5kZXgpID0+IHsgICAgICAgIC8vYWxsZSB0b2RvcyBkdXJjaGxhdWZlblxyXG4gICAgICAgICAgLypQcm9qZWt0ZmFyYmVuIGbDvHIgdGFza3MgaGVyYXVzZmluZGVuKi9cclxuICAgICAgICAgIHRoaXMudXNlclNlcnZpY2UuZ2V0U2luZ2xlUHJvamVjdCh0b2RvLnByb2plY3RfaWQpXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgIChkYXRhKSA9PiB7dGhpcy50b2Rvc1tpbmRleF0uY29sb3IgPSBkYXRhLnByb2plY3RzWzBdLmNvbG9yO3RoaXMudG9kb3NbaW5kZXhdLnByb2plY3QgPSBkYXRhLnByb2plY3RzWzBdLm5hbWV9LFxyXG4gICAgICAgICAgICAgIChlcnJvcikgPT4ge31cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgLyotKi9cclxuICAgICAgICAgICAgLyprb21tZW50YXJlIGbDvHIgdGFzayBsYWRlbiB1bmQgaW4gZGFzIG9iamVrdCBoaW56dWbDvGdlbiovXHJcbiAgICAgICAgICB0aGlzLnRvZG9TZXJ2aWNlLmZpbGxDb21tZW50cyh0b2RvLmlkKVxyXG4gICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAoZGF0YSkgPT4ge3RoaXMudG9kb3NbaW5kZXhdLmNvbW1lbnRzID0gZGF0YS5jb21tZW50c30sXHJcbiAgICAgICAgICAgICAgKGVycm9yKSA9PiB7fVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIC8qLSovXHJcbiAgICAgICAgICAvKnRyYWNraW5ncyovXHJcbiAgICAgICAgICB0b2RvLnRyYWNraW5ncy5mb3JFYWNoKHRyYWNraW5nID0+IHsvL2bDvHIgamVkZXMgdG9kbyBhbGxlIHRyYWNraW5ncyBkdXJjaGxhdWZlblxyXG4gICAgICAgICAgICB0aGlzLnRvZG9TZXJ2aWNlLmZpbGxUcmFja2luZyh0cmFja2luZykgICAvL3RvZG9TZXJ2aWNlIGdpYnQgenVyIHRyYWNraW5nSUQgZWluIHRyYWNraW5nIG9iamVrdCB6dXLDvGNrXHJcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy50b2Rvc1tpbmRleF0udHJhY2tpbmdzRnVsbC5wdXNoKGRhdGEudHJhY2tpbmdzWzBdKTtcclxuICAgICAgICAgICAgICBpZighZGF0YS50cmFja2luZ3NbMF0uZmluaXNoZWQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdzW3RvZG8uaWRdID0gZGF0YS50cmFja2luZ3NbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUcmFja2luZ3NbdG9kby5pZF0udHJhY2tlZFNlY29uZHMgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGRhdGEudHJhY2tpbmdzWzBdLnN0YXJ0ZWRfYXQpLmdldFRpbWUoKSkvMTAwMCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyb3IpID0+IHt9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgaWYoIXRoaXMuY3VycmVudFRyYWNraW5nc1t0b2RvLmlkXSl7ICAvL3dlbm4gbm9jaCBrZWluIFRyYWNraW5nIHZvcmhhbmRlbiBpc3RcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdzW3RvZG8uaWRdID0gbmV3IFRyYWNraW5nKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRyYWNraW5nc1t0b2RvLmlkXS5maW5pc2hlZCA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRUcmFja2luZ3NbdG9kby5pZF0udGltZXJTdHJpbmcgPSBcIjAwOjAwOjAwXCI7IC8vZGVmYXVsdCB3ZXJ0IGbDvHIgYWxsZSB0aW1lclN0cmluZ3NcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZighdGhpcy50cmFja2VyKXtcclxuICAgICAgICAgIHRoaXMudHJhY2tlciA9IHNldEludGVydmFsKCgpID0+IHsgLy9JbnRlcnZhbCBkZXIgY3VycmVudFRyYWNraW5ncyBuYWNoIHVuZmluaXNoZWQgZHVyc3VjaHQgdW5kIGJlaSBhbGwgZGllc2VuIGVpbnMgcmF1ZnrDpGhsdFxyXG4gICAgICAgICAgICB0aGlzLnRvZG9zLmZvckVhY2goKHRvZG8pID0+e1xyXG4gICAgICAgICAgICAgIGlmKCF0aGlzLmN1cnJlbnRUcmFja2luZ3NbdG9kby5pZF0uZmluaXNoZWQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdzW3RvZG8uaWRdLnRyYWNrZWRTZWNvbmRzKys7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWluc2VjcyA9IHRoaXMuY3VycmVudFRyYWNraW5nc1t0b2RvLmlkXS50cmFja2VkU2Vjb25kcyUzNjAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IGhvdXJzID0gKHRoaXMuY3VycmVudFRyYWNraW5nc1t0b2RvLmlkXS50cmFja2VkU2Vjb25kcy1taW5zZWNzKS8zNjAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlY29uZHMgPSBtaW5zZWNzJTYwO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSAobWluc2Vjcy1zZWNvbmRzKS82MDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRyYWNraW5nc1t0b2RvLmlkXS50aW1lclN0cmluZyA9IFwiXCIgKyAoaG91cnM+OT9ob3VyczpcIjBcIitob3VycykgKyBcIjpcIiArIChtaW51dGVzPjk/bWludXRlczpcIjBcIittaW51dGVzKSArIFwiOlwiICsgKHNlY29uZHM+OT9zZWNvbmRzOlwiMFwiK3NlY29uZHMpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudG9kb0ZvckRldGFpbCA9IG5ldyBBcnJheTxib29sZWFuPih0aGlzLnRvZG9zLmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy50b2Rvcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnRvZG9Gb3JEZXRhaWxbZWxlbWVudC5pZF0gPSBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICBjcmVhdGVUcmFja2luZyh0YXNrX2lkIDpzdHJpbmcpe1xyXG4gICAgLy9zdGFydGVkX2F0LCBmaW5pc2hlZF9hdCwgZGVzY3JpcHRpb24gbcO8c3NlbiBpbnMgZnJvbnRlbmQgZ2ViaW5kZWQgd2VyZGVuXHJcbiAgICB0aGlzLm5ld1RyYWNraW5nLnRhc2sgPSB0YXNrX2lkO1xyXG4gICAgdGhpcy50b2RvU2VydmljZS5jcmVhdGVUcmFja2luZyh0aGlzLm5ld1RyYWNraW5nKTtcclxuICB9XHJcblxyXG4gIG5hdmlnYXRldG8ocGFnZW5hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtwYWdlbmFtZV0sIHtcclxuICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgY3VydmU6IFwiZWFzZU91dFwiXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgICBjcmVhdGVUb2RvKCl7XHJcbiAgICAgIGxldCBkdWVEYXRlID0gdGhpcy5uZXdUb2RvLmR1ZV9kYXRlX3N0cmluZy5zcGxpdChcIi5cIik7XHJcbiAgICAgIHRoaXMubmV3VG9kby5kdWVfZGF0ZSA9IG5ldyBEYXRlKCtkdWVEYXRlWzJdLCArZHVlRGF0ZVsxXS0xLCArZHVlRGF0ZVswXSk7XHJcbiAgICAgIHRoaXMudG9kb1NlcnZpY2UuY3JlYXRlVG9kbyh0aGlzLm5ld1RvZG8pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubmdPbkluaXQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNyZWF0ZUNvbW1lbnQodGFza19pZCA6c3RyaW5nKXtcclxuICAgICAgdGhpcy5uZXdDb21tZW50LnRhc2sgPSB0YXNrX2lkO1xyXG4gICAgICB0aGlzLnRvZG9TZXJ2aWNlLmNyZWF0ZUNvbW1lbnQodGhpcy5uZXdDb21tZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQaGFzZXMoYXJnczogU2VsZWN0ZWRJbmRleENoYW5nZWRFdmVudERhdGEpe1xyXG4gICAgICB0aGlzLm5ld1RvZG8ucHJvamVjdCA9IHRoaXMucHJvamVjdElkc1thcmdzLm5ld0luZGV4XTtcclxuICAgICAgdGhpcy51c2VyU2VydmljZS5nZXRTaW5nbGVQcm9qZWN0KHRoaXMubmV3VG9kby5wcm9qZWN0KVxyXG4gICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5waGFzZVNlbGVjdGlvbiA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgIHRoaXMudXNlclNlbGVjdGlvbiA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgIGRhdGEucGhhc2VzLmZvckVhY2goKHBoYXNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5waGFzZUlkc1t0aGlzLnBoYXNlU2VsZWN0aW9uLnB1c2gocGhhc2UubmFtZSktMV0gPSBwaGFzZS5pZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRhdGEudXNlcnMuZm9yRWFjaCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMudXNlcklkc1t0aGlzLnVzZXJTZWxlY3Rpb24ucHVzaCh1c2VyLmZpcnN0X25hbWUgKyBcIiBcIiArIHVzZXIubGFzdF9uYW1lKS0xXSA9IHVzZXIuaWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIChlcnJvcikgPT4ge30pXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0UGhhc2UoYXJnczogU2VsZWN0ZWRJbmRleENoYW5nZWRFdmVudERhdGEpe1xyXG4gICAgICB0aGlzLm5ld1RvZG8ucGhhc2UgPSB0aGlzLnBoYXNlSWRzW2FyZ3MubmV3SW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFVzZXIoYXJnczogU2VsZWN0ZWRJbmRleENoYW5nZWRFdmVudERhdGEpe1xyXG4gICAgICB0aGlzLm5ld1RvZG8ucmVzcG9uc2libGUgPSB0aGlzLnVzZXJJZHNbYXJncy5uZXdJbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRUaW1lcih0YXNrX2lkIDpzdHJpbmcpe1xyXG4gICAgICBpZih0aGlzLmN1cnJlbnRUcmFja2luZ3NbdGFza19pZF0uZmluaXNoZWQpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNraW5nc1t0YXNrX2lkXSA9IG5ldyBUcmFja2luZygpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNraW5nc1t0YXNrX2lkXS50YXNrID0gdGFza19pZDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja2luZ3NbdGFza19pZF0uc3RhcnRlZF9hdCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdzW3Rhc2tfaWRdLmZpbmlzaGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdzW3Rhc2tfaWRdLmRlc2NyaXB0aW9uID0gXCJhbm90aGVyIGFjdHVhbCBtb2JpbGUgdHJhY2tpbmdcIjtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja2luZ3NbdGFza19pZF0udXNlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdzW3Rhc2tfaWRdLnRyYWNrZWRTZWNvbmRzID0gMDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja2luZ3NbdGFza19pZF0udGltZXJTdHJpbmcgPSBcIjAwOjAwOjAwXCI7XHJcbiAgICAgICAgdGhpcy50b2RvU2VydmljZS5jcmVhdGVUcmFja2luZyh0aGlzLmN1cnJlbnRUcmFja2luZ3NbdGFza19pZF0pXHJcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUcmFja2luZ3NbdGFza19pZF0uaWQgPSBkYXRhLnRyYWNraW5nc1swXS5pZDtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgIH1lbHNle1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNraW5nc1t0YXNrX2lkXS5maW5pc2hlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdzW3Rhc2tfaWRdLmZpbmlzaGVkX2F0ID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLnRvZG9TZXJ2aWNlLnVwZGF0ZVRyYWNraW5nKHRoaXMuY3VycmVudFRyYWNraW5nc1t0YXNrX2lkXSk7XHJcbiAgICAgIH0gXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGUoaWQpIHtcclxuICAgICAgICB0aGlzLnRhc2tfdGFicyA9IGlkO1xyXG4gICAgfVxyXG4gICAgZ29Ub0RldGFpbCh0b2RvX2lkIDpzdHJpbmcpe1xyXG4gICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1widG9kb19kZXRhaWwvXCIgKyB0b2RvX2lkXSwge1xyXG4gICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgbmFtZTogXCJzbGlkZVRvcFwiLFxyXG4gICAgICAgICAgICBjdXJ2ZTogXCJlYXNlT3V0XCJcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyogZ2VzdGVuICovXHJcbiAgICBvblN3aXBlKGFyZ3M6IFN3aXBlR2VzdHVyZUV2ZW50RGF0YSkge1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gYXJncy5kaXJlY3Rpb247XHJcbiAgICAgICAgLyogbmFjaCByZWNodHMgKi9cclxuICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLm5hdi5zdGF0ZSgnbWVldGluZycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKiBuYWNoIGxpbmtzICovXHJcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5uYXYuc3RhdGUoJ2Rhc2hib2FyZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogbmFjaCB1bnRlbiAqL1xyXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubmF2LnN0YXRlKCd0aWNrZXQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZpbmlzaGVkKHRhc2sgOlRvZG8pe1xyXG4gICAgICB0YXNrLmNvbXBsZXRlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMudG9kb1NlcnZpY2UudXBkYXRlVG9kbyh0YXNrKTtcclxuICAgICAgdGhpcy50b2Rvcy5zcGxpY2UodGhpcy50b2Rvcy5pbmRleE9mKHRhc2spLCAxKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIkJlc3TDpHRpZ3VuZ1wiLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkF1ZmdhYmUgJ1wiICsgdGFzay5uYW1lICsgXCInIHd1cmRlIGVybGVkaWd0LlwiLFxyXG4gICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGFsZXJ0KG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIGRhdGUgcGlja2VyICovXHJcbiAgICBzZWxlY3REYXRlKCkge1xyXG4gICAgICAgIHRoaXMubW9kYWxEYXRldGltZXBpY2tlci5waWNrRGF0ZSg8UGlja2VyT3B0aW9ucz57XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIkRhdHVtIGF1c3fDpGhsZW5cIixcclxuICAgICAgICAgICAgdGhlbWU6IFwiZGFya1wiLFxyXG4gICAgICAgICAgICBzdGFydGluZ0RhdGU6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICAgIG1heERhdGU6IG5ldyBEYXRlKCcyMDMwLTAxLTAxJyksIC8qIGhpZXIgbWF4RGF0ZSBzZXR6ZW4gKi9cclxuICAgICAgICAgICAgbWluRGF0ZTogbmV3IERhdGUoKVxyXG4gICAgICAgIH0pLnRoZW4oKHJlc3VsdDphbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdUb2RvLmR1ZV9kYXRlX3N0cmluZyA9IHJlc3VsdC5kYXkgKyBcIi5cIiArIHJlc3VsdC5tb250aCArIFwiLlwiICsgcmVzdWx0LnllYXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZVRvZG8odF9pZCA6c3RyaW5nKXtcclxuICAgICAgdGhpcy50b2RvU2VydmljZS5kZWxldGVUb2RvKHRfaWQpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge2FsZXJ0KFwiVGFzayBlcmZvbGdyZWljaCBnZWzDtnNjaHQhXCIpO3RoaXMubmdPbkluaXQoKX0sXHJcbiAgICAgICAgICAgICAgKGVycm9yKSA9PiB7YWxlcnQoXCJGZWhsZXIgYmVpbSBsw7ZzY2hlbiBkZXMgVGFza3NcIil9KTtcclxuXHJcbiAgICB9XHJcbn1cclxuIl19