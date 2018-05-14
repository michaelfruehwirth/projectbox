"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var status_service_1 = require("../../shared/status/status.service");
var todo_1 = require("../../shared/todo/todo");
var todo_service_1 = require("../../shared/todo/todo.service");
require("rxjs/add/operator/switchMap");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var user_service_1 = require("../../shared/user/user.service");
var timer = require("timer");
/* date picker */
var nativescript_modal_datetimepicker_1 = require("nativescript-modal-datetimepicker");
var config_1 = require("../../shared/config");
var Todo_detailComponent = (function () {
    function Todo_detailComponent(router, routerExtensions, route, statusService, todoService, page, _changeDetectionRef, fonticon, userService) {
        var _this = this;
        this.router = router;
        this.routerExtensions = routerExtensions;
        this.route = route;
        this.statusService = statusService;
        this.todoService = todoService;
        this.page = page;
        this._changeDetectionRef = _changeDetectionRef;
        this.fonticon = fonticon;
        this.userService = userService;
        this.projectList = new Array();
        this.userIds = new Array();
        this.phaseIds = new Array();
        this.userSelection = new Array();
        this.projectIds = new Array();
        this.newTracking = new todo_1.Tracking();
        this.newTimerTracking = new todo_1.Tracking();
        this.newComment = new todo_1.Comment();
        this.phaseSelection = new Array(); //dropdown selection zur auswahl der phase in der ein task created werden soll. wird befüllt nachdem der user ein Projekt ausgewählt hat.
        this.trackings = new Array();
        this.userAvatar = "";
        this.totalTime = 0;
        this.route.params.subscribe(function (params) {
            _this.getTodo(params["id"]);
        });
        this.totalTimeString = "00:00:00";
        this.userAvatar = config_1.Config.apiUrl + "v2/user/avatar/" + this.userService.getCurrentUser().avatar + "?access_token=" + config_1.Config.token;
        this.task_tabs = 'timetracking';
        this.page.css = "Page { background-color: #ffffff; } .page { padding-left: 0; padding:20; background-color: #ffffff;}";
        this.modalDatetimepicker = new nativescript_modal_datetimepicker_1.ModalDatetimepicker();
    }
    Todo_detailComponent.prototype.navigateto = function (pagename) {
        this.routerExtensions.navigate([pagename], {
            transition: {
                name: "slide",
                curve: "easeOut"
            }
        });
    };
    Todo_detailComponent.prototype.getTodo = function (todo_id) {
        var _this = this;
        this.todoService.getSingleTodo(todo_id)
            .then(function (data) {
            _this.todo = data.tasks[0];
            var date = new Date(_this.todo.due_date);
            date.setMonth(date.getMonth() + 1);
            _this.date = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + "." + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "." + date.getFullYear().toString();
            _this.todo.comments = data.comments;
            if (_this.todo.comments) {
                _this.todo.comments.forEach(function (comment) {
                    _this.userService.getUser(comment.user_id)
                        .then(function (data) {
                        comment.userImage = config_1.Config.apiUrl + "v2/user/avatar/" + data.users[0].avatar + "?access_token=" + config_1.Config.token;
                        comment.userFName = data.users[0].first_name;
                        comment.userLName = data.users[0].last_name;
                    });
                    var date = new Date(comment.created_at);
                    var month = date.setMonth(date.getMonth() + 1);
                    comment.date = date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + " um " + (date.getHours() > 9 ? date.getHours() : "0" + date.getHours()) + ":" + (date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()) + " Uhr";
                });
            }
            var trackingsprocessed = 0;
            _this.todo.trackings.forEach(function (tracking, index, array) {
                _this.todoService.fillTracking(tracking)
                    .then(function (data) {
                    var startDate = new Date(data.trackings[0].created_at);
                    startDate.setMonth(startDate.getMonth() + 1);
                    var start_minfix = startDate.getMinutes() < 10 ? 0 + startDate.getMinutes().toString() : startDate.getMinutes().toString();
                    var start_hourfix = startDate.getHours() < 10 ? 0 + startDate.getHours().toString() : startDate.getHours().toString();
                    data.trackings[0].startDateString = (startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate()) + "." + (startDate.getMonth() < 10 ? '0' + startDate.getMonth() : startDate.getMonth()) + "." + startDate.getFullYear().toString().substring(2, 4);
                    data.trackings[0].startTimeString = start_hourfix + ":" + start_minfix + ":" + startDate.getSeconds();
                    var endDate = new Date(data.trackings[0].finished_at);
                    var end_minfix = endDate.getMinutes() < 10 ? 0 + endDate.getMinutes().toString() : endDate.getMinutes().toString();
                    var end_hourfix = endDate.getHours() < 10 ? 0 + endDate.getHours().toString() : endDate.getHours().toString();
                    data.trackings[0].endTimeString = end_hourfix + ":" + end_minfix + ":" + endDate.getSeconds();
                    var elapsedTime = Math.round((new Date(data.trackings[0].finished_at).getTime() - new Date(data.trackings[0].started_at).getTime()) / 1000);
                    _this.totalTime += elapsedTime; //counting together the length of all trackings
                    trackingsprocessed++;
                    if (trackingsprocessed === array.length) {
                        var minsecs_1 = _this.totalTime % 3600;
                        var hours_1 = (_this.totalTime - minsecs_1) / 3600;
                        var seconds_1 = minsecs_1 % 60;
                        var minutes_1 = (minsecs_1 - seconds_1) / 60;
                        _this.totalTimeString = "" + (hours_1 > 9 ? hours_1 : "0" + hours_1) + ":" + (minutes_1 > 9 ? minutes_1 : "0" + minutes_1) + ":" + (seconds_1 > 9 ? seconds_1 : "0" + seconds_1);
                    }
                    var minsecs = elapsedTime % 3600;
                    var hours = (elapsedTime - minsecs) / 3600;
                    var seconds = minsecs % 60;
                    var minutes = (minsecs - seconds) / 60;
                    data.trackings[0].timerString = "" + (hours > 9 ? hours : "0" + hours) + ":" + (minutes > 9 ? minutes : "0" + minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds);
                    return data;
                })
                    .then(function (data) {
                    if (data.trackings[0].finished) {
                        _this.trackings.push(data.trackings[0]);
                    }
                });
            });
            _this.userService.getSingleProject(_this.todo.project)
                .then(function (data) {
                _this.isPL = (data.projects[0].user == _this.userService.getCurrentUser().id);
            });
            _this.userService.getProjects()
                .then(function (data) {
                data.projects.forEach(function (project) {
                    _this.projectIds[_this.projectList.push(project.name) - 1] = project.id;
                    if (_this.todo.project == project.id) {
                        _this.selectedProjectIndex = _this.projectList.length - 1;
                        _this.fillDropDown(project.id);
                    }
                });
            });
        });
    };
    Todo_detailComponent.prototype.createComment = function () {
        var _this = this;
        var tf = this.commentTextField.nativeElement;
        tf.dismissSoftInput();
        this.newComment.task = this.todo.id;
        this.todoService.createComment(this.newComment)
            .then(function () {
            if (!_this.todo.comments) {
                _this.todo.comments = new Array();
            }
            _this.newComment.userImage = config_1.Config.apiUrl + "v2/user/avatar/" + _this.userService.getCurrentUser().avatar + "?access_token=" + config_1.Config.token;
            _this.newComment.userFName = _this.userService.getCurrentUser().first_name;
            _this.newComment.userLName = _this.userService.getCurrentUser().last_name;
            _this.newComment.created_at = "jetzt";
            _this.todo.comments.push(_this.newComment);
            _this.newComment = new todo_1.Comment();
        });
    };
    Todo_detailComponent.prototype.state = function (id) {
        this.task_tabs = id;
    };
    Todo_detailComponent.prototype.getAvatar = function (user_id) {
        this.userService.getUser(user_id)
            .then(function (data) {
            return config_1.Config.apiUrl + "v2/user/avatar/" + data.avatar + "?access_token=" + config_1.Config.token;
        });
    };
    Todo_detailComponent.prototype.cancel = function () {
        this.routerExtensions.backToPreviousPage();
    };
    Todo_detailComponent.prototype.saveTodo = function () {
        this.todo.phase_id = this.todo.phase;
        this.todo.responsible_id = this.todo.responsible;
        this.todo.project_id = this.todo.project;
        this.todoService.updateTodo(this.todo);
        this.cancel();
    };
    /* date picker */
    Todo_detailComponent.prototype.selectDate = function () {
        var _this = this;
        this.modalDatetimepicker.pickDate({
            title: "Datum auswählen",
            theme: "dark",
            startingDate: new Date(),
            maxDate: new Date('2030-12-31'),
            minDate: new Date()
        }).then(function (result) {
            if (result) {
                _this.date = (result.day > 9 ? result.day : "0" + result.day) + "." + (result.month > 9 ? result.month : "0" + result.month) + "." + result.year;
                _this.todo.due_date = new Date(result.year, result.month - 1, result.day);
            }
        })
            .catch(function (error) {
            console.log("Error: " + error);
        });
    };
    ;
    Todo_detailComponent.prototype.deleteTracking = function (t) {
        var _this = this;
        this.todoService.deleteTracking(t.id)
            .then(function () {
            //this.reloadTrackings();
            _this.trackings.splice(_this.trackings.indexOf(t), 1);
            _this.totalTime -= Math.round((new Date(t.finished_at).getTime() - new Date(t.started_at).getTime()) / 1000);
            if (_this.totalTime <= 0) {
                _this.totalTimeString = "00:00:00";
            }
            else {
                var minsecs = _this.totalTime % 3600;
                var hours = (_this.totalTime - minsecs) / 3600;
                var seconds = minsecs % 60;
                var minutes = (minsecs - seconds) / 60;
                _this.totalTimeString = "" + (hours > 9 ? hours : "0" + hours) + ":" + (minutes > 9 ? minutes : "0" + minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds);
            }
        });
    };
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
    Todo_detailComponent.prototype.getPhases = function (args) {
        var _this = this;
        this.todo.project = this.projectIds[args.newIndex];
        this.userService.getSingleProject(this.todo.project)
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
    Todo_detailComponent.prototype.selectPhase = function (args) {
        this.todo.phase = this.phaseIds[args.newIndex];
    };
    Todo_detailComponent.prototype.selectUser = function (args) {
        this.todo.responsible = this.userIds[args.newIndex];
    };
    Todo_detailComponent.prototype.fillDropDown = function (project_id) {
        var _this = this;
        this.userService.getSingleProject(project_id)
            .then(function (data) {
            _this.phaseSelection = new Array();
            _this.userSelection = new Array();
            data.phases.forEach(function (phase) {
                _this.phaseIds[_this.phaseSelection.push(phase.name) - 1] = phase.id;
                if (_this.todo.phase == phase.id) {
                    _this.selectedPhaseIndex = _this.phaseSelection.length - 1;
                }
            });
            data.users.forEach(function (user) {
                _this.userIds[_this.userSelection.push(user.first_name + " " + user.last_name) - 1] = user.id;
                if (_this.todo.responsible == user.id) {
                    _this.selectedUserIndex = _this.userSelection.length - 1;
                }
            });
        });
    };
    __decorate([
        core_1.ViewChild("commentText"),
        __metadata("design:type", core_1.ElementRef)
    ], Todo_detailComponent.prototype, "commentTextField", void 0);
    Todo_detailComponent = __decorate([
        core_1.Component({
            selector: "pb-todo_detail",
            providers: [todo_service_1.TodoService, status_service_1.StatusService, user_service_1.UserService],
            templateUrl: "pages/todo_detail/todo_detail.html",
            styleUrls: ["pages/todo_detail/todo_detail-common.css", "pages/todo_detail/todo_detail.css"]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            router_2.RouterExtensions,
            router_1.ActivatedRoute,
            status_service_1.StatusService,
            todo_service_1.TodoService,
            page_1.Page,
            core_1.ChangeDetectorRef,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            user_service_1.UserService])
    ], Todo_detailComponent);
    return Todo_detailComponent;
}());
exports.Todo_detailComponent = Todo_detailComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb19kZXRhaWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidG9kb19kZXRhaWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlHO0FBRXpHLDBDQUF5RDtBQUN6RCxzREFBK0Q7QUFDL0QsZ0NBQStCO0FBQy9CLHFFQUFtRTtBQUNuRSwrQ0FBaUU7QUFDakUsK0RBQTZEO0FBQzdELHVDQUFxQztBQUNyQyx1RUFBK0Q7QUFDL0QsK0RBQTZEO0FBQzdELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixpQkFBaUI7QUFDakIsdUZBQXVGO0FBQ3ZGLDhDQUEyQztBQVczQztJQTJCRSw4QkFFVSxNQUFjLEVBQ2QsZ0JBQWtDLEVBQ2xDLEtBQXFCLEVBQ3JCLGFBQTRCLEVBQzVCLFdBQXdCLEVBQ3hCLElBQVUsRUFDVixtQkFBc0MsRUFDdEMsUUFBNEIsRUFDNUIsV0FBd0I7UUFWbEMsaUJBeUJDO1FBdkJTLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFNBQUksR0FBSixJQUFJLENBQU07UUFDVix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQW1CO1FBQ3RDLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBakNsQyxnQkFBVyxHQUFhLElBQUksS0FBSyxFQUFVLENBQUM7UUFDNUMsWUFBTyxHQUFhLElBQUksS0FBSyxFQUFVLENBQUM7UUFDeEMsYUFBUSxHQUFhLElBQUksS0FBSyxFQUFVLENBQUM7UUFDekMsa0JBQWEsR0FBYSxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQzlDLGVBQVUsR0FBYSxJQUFJLEtBQUssRUFBVSxD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R0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQzFGLEVBQUUsQ0FBQSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFDO29CQUNuQyxLQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFBO2dCQUN0RCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUF6UnVCO1FBQXpCLGdCQUFTLENBQUMsYUFBYSxDQUFDO2tDQUFtQixpQkFBVTtrRUFBQztJQXBCNUMsb0JBQW9CO1FBUGhDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFNBQVMsRUFBRSxDQUFDLDBCQUFXLEVBQUUsOEJBQWEsRUFBRSwwQkFBVyxDQUFDO1lBQ3BELFdBQVcsRUFBRSxvQ0FBb0M7WUFDakQsU0FBUyxFQUFFLENBQUMsMENBQTBDLEVBQUUsbUNBQW1DLENBQUM7U0FDN0YsQ0FBQzt5Q0ErQmtCLGVBQU07WUFDSSx5QkFBZ0I7WUFDM0IsdUJBQWM7WUFDTiw4QkFBYTtZQUNmLDBCQUFXO1lBQ2xCLFdBQUk7WUFDVyx3QkFBaUI7WUFDNUIsOENBQWtCO1lBQ2YsMEJBQVc7T0FyQ3ZCLG9CQUFvQixDQStTaEM7SUFBRCwyQkFBQztDQUFBLEFBL1NELElBK1NDO0FBL1NZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBWaWV3Q2hpbGQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIEVsZW1lbnRSZWZ9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlclwiO1xyXG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0IHsgU3RhdHVzU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc3RhdHVzL3N0YXR1cy5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IFRvZG8sIFRyYWNraW5nLCBDb21tZW50IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC90b2RvL3RvZG9cIjtcclxuaW1wb3J0IHsgVG9kb1NlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3RvZG8vdG9kby5zZXJ2aWNlXCI7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL3N3aXRjaE1hcFwiO1xyXG5pbXBvcnQgeyBUTlNGb250SWNvblNlcnZpY2UgfSBmcm9tICduYXRpdmVzY3JpcHQtbmd4LWZvbnRpY29uJztcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlci5zZXJ2aWNlXCI7XHJcbnZhciB0aW1lciA9IHJlcXVpcmUoXCJ0aW1lclwiKTtcclxuLyogZGF0ZSBwaWNrZXIgKi9cclxuaW1wb3J0IHsgTW9kYWxEYXRldGltZXBpY2tlciwgUGlja2VyT3B0aW9ucyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1tb2RhbC1kYXRldGltZXBpY2tlcic7XHJcbmltcG9ydCB7Q29uZmlnfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBTZWxlY3RlZEluZGV4Q2hhbmdlZEV2ZW50RGF0YSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duXCI7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwicGItdG9kb19kZXRhaWxcIixcclxuICBwcm92aWRlcnM6IFtUb2RvU2VydmljZSwgU3RhdHVzU2VydmljZSwgVXNlclNlcnZpY2VdLFxyXG4gIHRlbXBsYXRlVXJsOiBcInBhZ2VzL3RvZG9fZGV0YWlsL3RvZG9fZGV0YWlsLmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcInBhZ2VzL3RvZG9fZGV0YWlsL3RvZG9fZGV0YWlsLWNvbW1vbi5jc3NcIiwgXCJwYWdlcy90b2RvX2RldGFpbC90b2RvX2RldGFpbC5jc3NcIl1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBUb2RvX2RldGFpbENvbXBvbmVudCB7XHJcbiAgc2VsZWN0ZWRVc2VySW5kZXg6IG51bWJlcjtcclxuICBzZWxlY3RlZFBoYXNlSW5kZXg6IG51bWJlcjtcclxuICBzZWxlY3RlZFByb2plY3RJbmRleDogYW55O1xyXG4gIHByb2plY3RMaXN0OiBzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgdXNlcklkczogc3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gIHBoYXNlSWRzOiBzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgdXNlclNlbGVjdGlvbjogc3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gIHByb2plY3RJZHM6IHN0cmluZ1tdID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICB0b2RvOiBUb2RvO1xyXG4gIHB1YmxpYyBuZXdUcmFja2luZyA9IG5ldyBUcmFja2luZygpO1xyXG4gIHB1YmxpYyBuZXdUaW1lclRyYWNraW5nID0gbmV3IFRyYWNraW5nKCk7XHJcbiAgcHVibGljIG5ld0NvbW1lbnQgPSBuZXcgQ29tbWVudCgpO1xyXG4gIHB1YmxpYyBwaGFzZVNlbGVjdGlvbiA6c3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpOyAgLy9kcm9wZG93biBzZWxlY3Rpb24genVyIGF1c3dhaGwgZGVyIHBoYXNlIGluIGRlciBlaW4gdGFzayBjcmVhdGVkIHdlcmRlbiBzb2xsLiB3aXJkIGJlZsO8bGx0IG5hY2hkZW0gZGVyIHVzZXIgZWluIFByb2pla3QgYXVzZ2V3w6RobHQgaGF0LlxyXG4gIHRhc2tfdGFiczogc3RyaW5nO1xyXG4gIHRyYWNraW5ncyA6VHJhY2tpbmdbXSA9IG5ldyBBcnJheTxUcmFja2luZz4oKTtcclxuICBpc1BMIDpib29sZWFuO1xyXG4gIHVzZXJBdmF0YXIgOnN0cmluZyA9IFwiXCI7XHJcbiAgdG90YWxUaW1lIDpudW1iZXIgPSAwO1xyXG4gIHRvdGFsVGltZVN0cmluZyA6c3RyaW5nO1xyXG4gIEBWaWV3Q2hpbGQoXCJjb21tZW50VGV4dFwiKSBjb21tZW50VGV4dEZpZWxkOiBFbGVtZW50UmVmO1xyXG5cclxuICAgIC8qIGRhdGUgcGlja2VyICovXHJcbiAgICBwdWJsaWMgZGF0ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBtb2RhbERhdGV0aW1lcGlja2VyOiBNb2RhbERhdGV0aW1lcGlja2VyO1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3JcclxuICAoXHJcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxyXG4gICAgcHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLFxyXG4gICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXHJcbiAgICBwcml2YXRlIHN0YXR1c1NlcnZpY2UgOlN0YXR1c1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHRvZG9TZXJ2aWNlIDpUb2RvU2VydmljZSxcclxuICAgIHByaXZhdGUgcGFnZTogUGFnZSxcclxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdGlvblJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBwcml2YXRlIGZvbnRpY29uOiBUTlNGb250SWNvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcclxuICApXHJcbiAge1xyXG4gICAgdGhpcy5yb3V0ZS5wYXJhbXMuc3Vic2NyaWJlKChwYXJhbXMpID0+IHtcclxuICAgICAgdGhpcy5nZXRUb2RvKHBhcmFtc1tcImlkXCJdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudG90YWxUaW1lU3RyaW5nID0gXCIwMDowMDowMFwiO1xyXG5cclxuICAgIHRoaXMudXNlckF2YXRhciA9IENvbmZpZy5hcGlVcmwgKyBcInYyL3VzZXIvYXZhdGFyL1wiICsgdGhpcy51c2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpLmF2YXRhciArIFwiP2FjY2Vzc190b2tlbj1cIiArIENvbmZpZy50b2tlbjtcclxuXHJcbiAgICB0aGlzLnRhc2tfdGFicyA9ICd0aW1ldHJhY2tpbmcnO1xyXG5cclxuICAgIHRoaXMucGFnZS5jc3MgPSBcIlBhZ2UgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmOyB9IC5wYWdlIHsgcGFkZGluZy1sZWZ0OiAwOyBwYWRkaW5nOjIwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO31cIjtcclxuICAgICAgdGhpcy5tb2RhbERhdGV0aW1lcGlja2VyID0gbmV3IE1vZGFsRGF0ZXRpbWVwaWNrZXIoKTtcclxuICB9XHJcblxyXG4gIG5hdmlnYXRldG8ocGFnZW5hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtwYWdlbmFtZV0sIHtcclxuICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgY3VydmU6IFwiZWFzZU91dFwiXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0VG9kbyh0b2RvX2lkIDpzdHJpbmcpe1xyXG4gICAgdGhpcy50b2RvU2VydmljZS5nZXRTaW5nbGVUb2RvKHRvZG9faWQpXHJcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b2RvID0gZGF0YS50YXNrc1swXTtcclxuICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKHRoaXMudG9kby5kdWVfZGF0ZSk7XHJcbiAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkrMSk7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gKGRhdGUuZ2V0RGF0ZSgpIDwgMTA/ICcwJytkYXRlLmdldERhdGUoKSA6IGRhdGUuZ2V0RGF0ZSgpKSArIFwiLlwiICsgKChkYXRlLmdldE1vbnRoKCkrMSkgPCAxMD8gJzAnKyhkYXRlLmdldE1vbnRoKCkrMSkgOiAoZGF0ZS5nZXRNb250aCgpKzEpKSArIFwiLlwiICsgZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy50b2RvLmNvbW1lbnRzID0gZGF0YS5jb21tZW50cztcclxuICAgICAgICBpZih0aGlzLnRvZG8uY29tbWVudHMpe1xyXG4gICAgICAgICAgdGhpcy50b2RvLmNvbW1lbnRzLmZvckVhY2goKGNvbW1lbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VyU2VydmljZS5nZXRVc2VyKGNvbW1lbnQudXNlcl9pZClcclxuICAgICAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbW1lbnQudXNlckltYWdlID0gQ29uZmlnLmFwaVVybCArIFwidjIvdXNlci9hdmF0YXIvXCIgKyBkYXRhLnVzZXJzWzBdLmF2YXRhciArIFwiP2FjY2Vzc190b2tlbj1cIiArIENvbmZpZy50b2tlbjtcclxuICAgICAgICAgICAgICAgICAgY29tbWVudC51c2VyRk5hbWUgPSBkYXRhLnVzZXJzWzBdLmZpcnN0X25hbWU7XHJcbiAgICAgICAgICAgICAgICAgIGNvbW1lbnQudXNlckxOYW1lID0gZGF0YS51c2Vyc1swXS5sYXN0X25hbWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSAoY29tbWVudC5jcmVhdGVkX2F0KTtcclxuICAgICAgICAgICAgdmFyIG1vbnRoID0gZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkrMSk7XHJcbiAgICAgICAgICAgIGNvbW1lbnQuZGF0ZSA9IGRhdGUuZ2V0RGF0ZSgpICsgXCIuXCIgKyBkYXRlLmdldE1vbnRoKCkgKyBcIi5cIiArIGRhdGUuZ2V0RnVsbFllYXIoKSArIFwiIHVtIFwiICsgKGRhdGUuZ2V0SG91cnMoKT45P2RhdGUuZ2V0SG91cnMoKTpcIjBcIitkYXRlLmdldEhvdXJzKCkpICsgXCI6XCIgKyAoZGF0ZS5nZXRNaW51dGVzKCk+OT9kYXRlLmdldE1pbnV0ZXMoKTpcIjBcIitkYXRlLmdldE1pbnV0ZXMoKSkgKyBcIiBVaHJcIjtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdHJhY2tpbmdzcHJvY2Vzc2VkIDpudW1iZXIgPSAwO1xyXG4gICAgICAgIHRoaXMudG9kby50cmFja2luZ3MuZm9yRWFjaCgodHJhY2tpbmcsIGluZGV4LCBhcnJheSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy50b2RvU2VydmljZS5maWxsVHJhY2tpbmcodHJhY2tpbmcpXHJcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhcnREYXRlID0gbmV3IERhdGUgKGRhdGEudHJhY2tpbmdzWzBdLmNyZWF0ZWRfYXQpO1xyXG4gICAgICAgICAgICBzdGFydERhdGUuc2V0TW9udGgoc3RhcnREYXRlLmdldE1vbnRoKCkrMSk7XHJcbiAgICAgICAgICAgIGxldCBzdGFydF9taW5maXggPSBzdGFydERhdGUuZ2V0TWludXRlcygpIDwgMTA/IDAgKyBzdGFydERhdGUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkgOiBzdGFydERhdGUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGxldCBzdGFydF9ob3VyZml4ID0gc3RhcnREYXRlLmdldEhvdXJzKCkgPCAxMD8gMCArIHN0YXJ0RGF0ZS5nZXRIb3VycygpLnRvU3RyaW5nKCkgOiAgc3RhcnREYXRlLmdldEhvdXJzKCkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgZGF0YS50cmFja2luZ3NbMF0uc3RhcnREYXRlU3RyaW5nID0gKHN0YXJ0RGF0ZS5nZXREYXRlKCkgPCAxMD8gJzAnK3N0YXJ0RGF0ZS5nZXREYXRlKCkgOiBzdGFydERhdGUuZ2V0RGF0ZSgpKSArIFwiLlwiICsgKHN0YXJ0RGF0ZS5nZXRNb250aCgpIDwgMTA/ICcwJytzdGFydERhdGUuZ2V0TW9udGgoKSA6IHN0YXJ0RGF0ZS5nZXRNb250aCgpKSArIFwiLlwiICsgc3RhcnREYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKS5zdWJzdHJpbmcoMiw0KTtcclxuICAgICAgICAgICAgZGF0YS50cmFja2luZ3NbMF0uc3RhcnRUaW1lU3RyaW5nID0gc3RhcnRfaG91cmZpeCArIFwiOlwiICsgc3RhcnRfbWluZml4ICsgXCI6XCIgKyBzdGFydERhdGUuZ2V0U2Vjb25kcygpO1xyXG4gICAgICAgICAgICBsZXQgZW5kRGF0ZSA9IG5ldyBEYXRlIChkYXRhLnRyYWNraW5nc1swXS5maW5pc2hlZF9hdCk7XHJcbiAgICAgICAgICAgIGxldCBlbmRfbWluZml4ID0gZW5kRGF0ZS5nZXRNaW51dGVzKCkgPCAxMD8gMCArIGVuZERhdGUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkgOiAgZW5kRGF0ZS5nZXRNaW51dGVzKCkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgbGV0IGVuZF9ob3VyZml4ID0gZW5kRGF0ZS5nZXRIb3VycygpIDwgMTA/IDAgKyBlbmREYXRlLmdldEhvdXJzKCkudG9TdHJpbmcoKSA6IGVuZERhdGUuZ2V0SG91cnMoKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBkYXRhLnRyYWNraW5nc1swXS5lbmRUaW1lU3RyaW5nID0gZW5kX2hvdXJmaXggKyBcIjpcIiArIGVuZF9taW5maXggKyBcIjpcIiArIGVuZERhdGUuZ2V0U2Vjb25kcygpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGVsYXBzZWRUaW1lID0gTWF0aC5yb3VuZCgobmV3IERhdGUoZGF0YS50cmFja2luZ3NbMF0uZmluaXNoZWRfYXQpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGRhdGEudHJhY2tpbmdzWzBdLnN0YXJ0ZWRfYXQpLmdldFRpbWUoKSkvMTAwMCk7XHJcbiAgICAgICAgICAgIHRoaXMudG90YWxUaW1lICs9IGVsYXBzZWRUaW1lOyAvL2NvdW50aW5nIHRvZ2V0aGVyIHRoZSBsZW5ndGggb2YgYWxsIHRyYWNraW5nc1xyXG4gICAgICAgICAgICB0cmFja2luZ3Nwcm9jZXNzZWQrKztcclxuICAgICAgICAgICAgaWYodHJhY2tpbmdzcHJvY2Vzc2VkID09PSBhcnJheS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBsZXQgbWluc2VjcyA9IHRoaXMudG90YWxUaW1lJTM2MDA7XHJcbiAgICAgICAgICAgICAgbGV0IGhvdXJzID0gKHRoaXMudG90YWxUaW1lLW1pbnNlY3MpLzM2MDA7XHJcbiAgICAgICAgICAgICAgbGV0IHNlY29uZHMgPSBtaW5zZWNzJTYwO1xyXG4gICAgICAgICAgICAgIGxldCBtaW51dGVzID0gKG1pbnNlY3Mtc2Vjb25kcykvNjA7XHJcbiAgICAgICAgICAgICAgdGhpcy50b3RhbFRpbWVTdHJpbmcgPSBcIlwiICsgKGhvdXJzPjk/aG91cnM6XCIwXCIraG91cnMpICsgXCI6XCIgKyAobWludXRlcz45P21pbnV0ZXM6XCIwXCIrbWludXRlcykgKyBcIjpcIiArIChzZWNvbmRzPjk/c2Vjb25kczpcIjBcIitzZWNvbmRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbWluc2VjcyA9IGVsYXBzZWRUaW1lJTM2MDA7XHJcbiAgICAgICAgICAgIGxldCBob3VycyA9IChlbGFwc2VkVGltZS1taW5zZWNzKS8zNjAwO1xyXG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IG1pbnNlY3MlNjA7XHJcbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gKG1pbnNlY3Mtc2Vjb25kcykvNjA7XHJcbiAgICAgICAgICAgIGRhdGEudHJhY2tpbmdzWzBdLnRpbWVyU3RyaW5nID0gXCJcIiArIChob3Vycz45P2hvdXJzOlwiMFwiK2hvdXJzKSArIFwiOlwiICsgKG1pbnV0ZXM+OT9taW51dGVzOlwiMFwiK21pbnV0ZXMpICsgXCI6XCIgKyAoc2Vjb25kcz45P3NlY29uZHM6XCIwXCIrc2Vjb25kcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGRhdGEudHJhY2tpbmdzWzBdLmZpbmlzaGVkKXtcclxuICAgICAgICAgICAgICB0aGlzLnRyYWNraW5ncy5wdXNoKGRhdGEudHJhY2tpbmdzWzBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudXNlclNlcnZpY2UuZ2V0U2luZ2xlUHJvamVjdCh0aGlzLnRvZG8ucHJvamVjdClcclxuICAgICAgICAgIC50aGVuKChkYXRhKSA9PntcclxuICAgICAgICAgICAgdGhpcy5pc1BMID0gKGRhdGEucHJvamVjdHNbMF0udXNlciA9PSB0aGlzLnVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCkuaWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudXNlclNlcnZpY2UuZ2V0UHJvamVjdHMoKVxyXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICBkYXRhLnByb2plY3RzLmZvckVhY2goKHByb2plY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0SWRzW3RoaXMucHJvamVjdExpc3QucHVzaChwcm9qZWN0Lm5hbWUpLTFdID0gcHJvamVjdC5pZDtcclxuICAgICAgICAgICAgaWYodGhpcy50b2RvLnByb2plY3QgPT0gcHJvamVjdC5pZCl7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFByb2plY3RJbmRleCA9IHRoaXMucHJvamVjdExpc3QubGVuZ3RoLTE7XHJcbiAgICAgICAgICAgICAgdGhpcy5maWxsRHJvcERvd24ocHJvamVjdC5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gICAgY3JlYXRlQ29tbWVudCgpe1xyXG4gICAgICAgIGxldCB0ZiA9IHRoaXMuY29tbWVudFRleHRGaWVsZC5uYXRpdmVFbGVtZW50O1xyXG4gICAgICAgIHRmLmRpc21pc3NTb2Z0SW5wdXQoKTtcclxuICAgICAgICB0aGlzLm5ld0NvbW1lbnQudGFzayA9IHRoaXMudG9kby5pZDtcclxuICAgICAgICB0aGlzLnRvZG9TZXJ2aWNlLmNyZWF0ZUNvbW1lbnQodGhpcy5uZXdDb21tZW50KVxyXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy50b2RvLmNvbW1lbnRzKXtcclxuICAgICAgICAgICAgICB0aGlzLnRvZG8uY29tbWVudHMgPSBuZXcgQXJyYXk8Q29tbWVudD4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5ld0NvbW1lbnQudXNlckltYWdlID0gQ29uZmlnLmFwaVVybCArIFwidjIvdXNlci9hdmF0YXIvXCIgKyB0aGlzLnVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCkuYXZhdGFyICsgXCI/YWNjZXNzX3Rva2VuPVwiICsgQ29uZmlnLnRva2VuO1xyXG4gICAgICAgICAgICB0aGlzLm5ld0NvbW1lbnQudXNlckZOYW1lID0gdGhpcy51c2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpLmZpcnN0X25hbWU7XHJcbiAgICAgICAgICAgIHRoaXMubmV3Q29tbWVudC51c2VyTE5hbWUgPSB0aGlzLnVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCkubGFzdF9uYW1lO1xyXG4gICAgICAgICAgICB0aGlzLm5ld0NvbW1lbnQuY3JlYXRlZF9hdCA9IFwiamV0enRcIjtcclxuICAgICAgICAgICAgdGhpcy50b2RvLmNvbW1lbnRzLnB1c2godGhpcy5uZXdDb21tZW50KTtcclxuICAgICAgICAgICAgdGhpcy5uZXdDb21tZW50ID0gbmV3IENvbW1lbnQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlKGlkKSB7XHJcbiAgICAgICAgdGhpcy50YXNrX3RhYnMgPSBpZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBdmF0YXIodXNlcl9pZCl7XHJcbiAgICAgIHRoaXMudXNlclNlcnZpY2UuZ2V0VXNlcih1c2VyX2lkKVxyXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gQ29uZmlnLmFwaVVybCArIFwidjIvdXNlci9hdmF0YXIvXCIgKyBkYXRhLmF2YXRhciArIFwiP2FjY2Vzc190b2tlbj1cIiArIENvbmZpZy50b2tlbjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjYW5jZWwoKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLmJhY2tUb1ByZXZpb3VzUGFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVUb2RvKCkge1xyXG4gICAgICB0aGlzLnRvZG8ucGhhc2VfaWQgPSB0aGlzLnRvZG8ucGhhc2U7XHJcbiAgICAgIHRoaXMudG9kby5yZXNwb25zaWJsZV9pZCA9IHRoaXMudG9kby5yZXNwb25zaWJsZTtcclxuICAgICAgdGhpcy50b2RvLnByb2plY3RfaWQgPSB0aGlzLnRvZG8ucHJvamVjdDtcclxuICAgICAgdGhpcy50b2RvU2VydmljZS51cGRhdGVUb2RvKHRoaXMudG9kbyk7XHJcbiAgICAgIHRoaXMuY2FuY2VsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogZGF0ZSBwaWNrZXIgKi9cclxuICAgIHNlbGVjdERhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5tb2RhbERhdGV0aW1lcGlja2VyLnBpY2tEYXRlKDxQaWNrZXJPcHRpb25zPntcclxuICAgICAgICAgICAgdGl0bGU6IFwiRGF0dW0gYXVzd8OkaGxlblwiLFxyXG4gICAgICAgICAgICB0aGVtZTogXCJkYXJrXCIsXHJcbiAgICAgICAgICAgIHN0YXJ0aW5nRGF0ZTogbmV3IERhdGUoKSxcclxuICAgICAgICAgICAgbWF4RGF0ZTogbmV3IERhdGUoJzIwMzAtMTItMzEnKSwgLyogaGllciBtYXhEYXRlIHNldHplbiAqL1xyXG4gICAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpXHJcbiAgICAgICAgfSkudGhlbigocmVzdWx0OmFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGUgPSAocmVzdWx0LmRheT45P3Jlc3VsdC5kYXk6XCIwXCIrcmVzdWx0LmRheSkgKyBcIi5cIiArIChyZXN1bHQubW9udGg+OT9yZXN1bHQubW9udGg6XCIwXCIrcmVzdWx0Lm1vbnRoKSArIFwiLlwiICsgcmVzdWx0LnllYXI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZG8uZHVlX2RhdGUgPSBuZXcgRGF0ZShyZXN1bHQueWVhciwgcmVzdWx0Lm1vbnRoLTEsIHJlc3VsdC5kYXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZWxldGVUcmFja2luZyh0IDpUcmFja2luZyl7XHJcbiAgICAgIHRoaXMudG9kb1NlcnZpY2UuZGVsZXRlVHJhY2tpbmcodC5pZClcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAvL3RoaXMucmVsb2FkVHJhY2tpbmdzKCk7XHJcbiAgICAgICAgICB0aGlzLnRyYWNraW5ncy5zcGxpY2UodGhpcy50cmFja2luZ3MuaW5kZXhPZih0KSwgMSk7XHJcbiAgICAgICAgICB0aGlzLnRvdGFsVGltZSAtPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSh0LmZpbmlzaGVkX2F0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZSh0LnN0YXJ0ZWRfYXQpLmdldFRpbWUoKSkvMTAwMCk7XHJcbiAgICAgICAgICBpZih0aGlzLnRvdGFsVGltZSA8PSAwKXtcclxuICAgICAgICAgICAgdGhpcy50b3RhbFRpbWVTdHJpbmcgPSBcIjAwOjAwOjAwXCI7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgbGV0IG1pbnNlY3MgPSB0aGlzLnRvdGFsVGltZSUzNjAwO1xyXG4gICAgICAgICAgICBsZXQgaG91cnMgPSAodGhpcy50b3RhbFRpbWUtbWluc2VjcykvMzYwMDtcclxuICAgICAgICAgICAgbGV0IHNlY29uZHMgPSBtaW5zZWNzJTYwO1xyXG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IChtaW5zZWNzLXNlY29uZHMpLzYwO1xyXG4gICAgICAgICAgICB0aGlzLnRvdGFsVGltZVN0cmluZyA9IFwiXCIgKyAoaG91cnM+OT9ob3VyczpcIjBcIitob3VycykgKyBcIjpcIiArIChtaW51dGVzPjk/bWludXRlczpcIjBcIittaW51dGVzKSArIFwiOlwiICsgKHNlY29uZHM+OT9zZWNvbmRzOlwiMFwiK3NlY29uZHMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgLyogcmVsb2FkVHJhY2tpbmdzKCl7XHJcbiAgICAgIHRoaXMudG9kb1NlcnZpY2UuZ2V0U2luZ2xlVG9kbyh0aGlzLnRvZG8uaWQpXHJcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b2RvLnRyYWNraW5ncyA9IGRhdGEudGFza3NbMF0udHJhY2tpbmdzO1xyXG4gICAgICAgIHRoaXMudHJhY2tpbmdzID0gbmV3IEFycmF5PFRyYWNraW5nPigpO1xyXG4gICAgICAgIGxldCB0cmFja2luZ3Nwcm9jZXNzZWQgOm51bWJlciA9IDA7XHJcbiAgICAgICAgdGhpcy50b3RhbFRpbWUgPSAwO1xyXG4gICAgICAgIHRoaXMudG9kby50cmFja2luZ3MuZm9yRWFjaCgodHJhY2tpbmcsIGluZGV4LCBhcnJheSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy50b2RvU2VydmljZS5maWxsVHJhY2tpbmcodHJhY2tpbmcpXHJcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZWxhcHNlZFRpbWUgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZShkYXRhLnRyYWNraW5nc1swXS5maW5pc2hlZF9hdCkuZ2V0VGltZSgpIC0gbmV3IERhdGUoZGF0YS50cmFja2luZ3NbMF0uc3RhcnRlZF9hdCkuZ2V0VGltZSgpKS8xMDAwKTtcclxuICAgICAgICAgICAgdGhpcy50b3RhbFRpbWUgKz0gZWxhcHNlZFRpbWU7IC8vY291bnRpbmcgdG9nZXRoZXIgdGhlIGxlbmd0aCBvZiBhbGwgdHJhY2tpbmdzXHJcbiAgICAgICAgICAgIHRyYWNraW5nc3Byb2Nlc3NlZCsrO1xyXG4gICAgICAgICAgICBpZih0cmFja2luZ3Nwcm9jZXNzZWQgPT09IGFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIGxldCBtaW5zZWNzID0gdGhpcy50b3RhbFRpbWUlMzYwMDtcclxuICAgICAgICAgICAgICBsZXQgaG91cnMgPSAodGhpcy50b3RhbFRpbWUtbWluc2VjcykvMzYwMDtcclxuICAgICAgICAgICAgICBsZXQgc2Vjb25kcyA9IG1pbnNlY3MlNjA7XHJcbiAgICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSAobWluc2Vjcy1zZWNvbmRzKS82MDtcclxuICAgICAgICAgICAgICB0aGlzLnRvdGFsVGltZVN0cmluZyA9IFwiXCIgKyAoaG91cnM+OT9ob3VyczpcIjBcIitob3VycykgKyBcIjpcIiArIChtaW51dGVzPjk/bWludXRlczpcIjBcIittaW51dGVzKSArIFwiOlwiICsgKHNlY29uZHM+OT9zZWNvbmRzOlwiMFwiK3NlY29uZHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBtaW5zZWNzID0gZWxhcHNlZFRpbWUlMzYwMDtcclxuICAgICAgICAgICAgbGV0IGhvdXJzID0gKGVsYXBzZWRUaW1lLW1pbnNlY3MpLzM2MDA7XHJcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gbWluc2VjcyU2MDtcclxuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSAobWluc2Vjcy1zZWNvbmRzKS82MDtcclxuICAgICAgICAgICAgZGF0YS50cmFja2luZ3NbMF0udGltZXJTdHJpbmcgPSBcIlwiICsgKGhvdXJzPjk/aG91cnM6XCIwXCIraG91cnMpICsgXCI6XCIgKyAobWludXRlcz45P21pbnV0ZXM6XCIwXCIrbWludXRlcykgKyBcIjpcIiArIChzZWNvbmRzPjk/c2Vjb25kczpcIjBcIitzZWNvbmRzKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG5cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBpZihkYXRhLnRyYWNraW5nc1swXS5maW5pc2hlZCl7XHJcbiAgICAgICAgICAgICAgdGhpcy50cmFja2luZ3MucHVzaChkYXRhLnRyYWNraW5nc1swXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0gKi9cclxuXHJcbiAgICBnZXRQaGFzZXMoYXJnczogU2VsZWN0ZWRJbmRleENoYW5nZWRFdmVudERhdGEpe1xyXG4gICAgICB0aGlzLnRvZG8ucHJvamVjdCA9IHRoaXMucHJvamVjdElkc1thcmdzLm5ld0luZGV4XTtcclxuICAgICAgdGhpcy51c2VyU2VydmljZS5nZXRTaW5nbGVQcm9qZWN0KHRoaXMudG9kby5wcm9qZWN0KVxyXG4gICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5waGFzZVNlbGVjdGlvbiA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgIHRoaXMudXNlclNlbGVjdGlvbiA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgIGRhdGEucGhhc2VzLmZvckVhY2goKHBoYXNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5waGFzZUlkc1t0aGlzLnBoYXNlU2VsZWN0aW9uLnB1c2gocGhhc2UubmFtZSktMV0gPSBwaGFzZS5pZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRhdGEudXNlcnMuZm9yRWFjaCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMudXNlcklkc1t0aGlzLnVzZXJTZWxlY3Rpb24ucHVzaCh1c2VyLmZpcnN0X25hbWUgKyBcIiBcIiArIHVzZXIubGFzdF9uYW1lKS0xXSA9IHVzZXIuaWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIChlcnJvcikgPT4ge30pXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0UGhhc2UoYXJnczogU2VsZWN0ZWRJbmRleENoYW5nZWRFdmVudERhdGEpe1xyXG4gICAgICB0aGlzLnRvZG8ucGhhc2UgPSB0aGlzLnBoYXNlSWRzW2FyZ3MubmV3SW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFVzZXIoYXJnczogU2VsZWN0ZWRJbmRleENoYW5nZWRFdmVudERhdGEpe1xyXG4gICAgICB0aGlzLnRvZG8ucmVzcG9uc2libGUgPSB0aGlzLnVzZXJJZHNbYXJncy5uZXdJbmRleF07XHJcbiAgICB9XHJcbiAgICBmaWxsRHJvcERvd24ocHJvamVjdF9pZCl7XHJcbiAgICAgIHRoaXMudXNlclNlcnZpY2UuZ2V0U2luZ2xlUHJvamVjdChwcm9qZWN0X2lkKVxyXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnBoYXNlU2VsZWN0aW9uID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgIHRoaXMudXNlclNlbGVjdGlvbiA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICBkYXRhLnBoYXNlcy5mb3JFYWNoKChwaGFzZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBoYXNlSWRzW3RoaXMucGhhc2VTZWxlY3Rpb24ucHVzaChwaGFzZS5uYW1lKS0xXSA9IHBoYXNlLmlkO1xyXG4gICAgICAgICAgICBpZih0aGlzLnRvZG8ucGhhc2UgPT0gcGhhc2UuaWQpe1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQaGFzZUluZGV4ID0gdGhpcy5waGFzZVNlbGVjdGlvbi5sZW5ndGgtMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgZGF0YS51c2Vycy5mb3JFYWNoKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcklkc1t0aGlzLnVzZXJTZWxlY3Rpb24ucHVzaCh1c2VyLmZpcnN0X25hbWUgKyBcIiBcIiArIHVzZXIubGFzdF9uYW1lKS0xXSA9IHVzZXIuaWQ7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudG9kby5yZXNwb25zaWJsZSA9PSB1c2VyLmlkKXtcclxuICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVXNlckluZGV4ID0gdGhpcy51c2VyU2VsZWN0aW9uLmxlbmd0aC0xXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICBcclxuICAgIH1cclxuXHJcbn1cclxuIl19