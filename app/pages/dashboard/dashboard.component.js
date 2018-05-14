"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_service_1 = require("../../shared/user/user.service");
/*import { Router, ActivatedRoute } from "@angular/router";*/
var router_1 = require("nativescript-angular/router");
var meeting_service_1 = require("../../shared/meeting/meeting.service");
require("rxjs/add/operator/switchMap");
/*import { ListViewEventData, RadListView } from "nativescript-pro-ui/listview";
import * as FrameModule from "ui/frame";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-pro-ui/sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-pro-ui/sidedrawer';*/
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var user_1 = require("../../shared/user/user");
var todo_service_1 = require("../../shared/todo/todo.service");
var ticket_service_1 = require("../../shared/ticket/ticket.service");
var nav_component_1 = require("../nav/nav.component");
var status_service_1 = require("../../shared/status/status.service");
var page_1 = require("ui/page");
var DashboardComponent = (function () {
    function DashboardComponent(
        /*private router: Router,*/
        routerExtensions, 
        /*private pageRoute: PageRoute,*/
        userService, meetingService, todoService, ticketService, _changeDetectionRef, fonticon, navState, page, zone) {
        this.routerExtensions = routerExtensions;
        this.userService = userService;
        this.meetingService = meetingService;
        this.todoService = todoService;
        this.ticketService = ticketService;
        this._changeDetectionRef = _changeDetectionRef;
        this.fonticon = fonticon;
        this.navState = navState;
        this.page = page;
        this.zone = zone;
        this.curUser = new user_1.User;
        this.meetings = new Array();
        this.displayedMeetings = new Array();
        this.displayedTodos = new Array();
        this.selectedProject = null; //id of the selected project
        this.all_projects = false;
        this.monthNames = ["Jänner", "Februar", "März", "April", "Mai", "Juni",
            "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        this.isUpdating = false;
        this.nav = navState;
        this.page.css = ".page {  padding-top: 10; padding-left: 10; padding-bottom: 20; background-color: #ECEDEE;}";
        /* this.curUser = this.userService.getCurrentUser();
         this.avatar = "https://secure.projectbox.eu/v2/user/avatar/" + this.curUser.avatar + "?access_token=" + this.curUser.access_token;
     */
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getProjects().then(function (data) { return _this.displayProjects(data); }, function (error) { return _this.displayProjects(false); });
        this.meetingService.getMeetings().then(function (data) { return _this.displayMeetings(data); }, function (error) { return _this.displayMeetings(false); });
        this.ticketService.getTickets().then(function (data) { return _this.displayTickets(data); }, function (error) { return _this.displayTickets(false); });
        this.todoService.getTodos().then(function (data) { return _this.displayTodos(data); }, function (error) { return _this.displayTodos(false); });
    };
    DashboardComponent.prototype.ngAfterViewInit = function () {
    };
    DashboardComponent.prototype.displayTickets = function (data) {
        if (data) {
            this.ticketService.saveTickets(data);
            this.tickets = data.tickets;
        }
        else {
            data = this.ticketService.getSavedTickets();
            this.tickets = data.tickets;
        }
    };
    DashboardComponent.prototype.displayTodos = function (data) {
        var _this = this;
        if (data) {
            data.tasks.forEach(function (todo, index) {
                /*Projektfarben für tasks herausfinden*/
                _this.userService.getSingleProject(todo.project_id)
                    .then(function (data) { data.projects[0].color ? todo.color = data.projects[0].color : null; }, function (error) { });
            });
            this.todoService.saveTodos(data);
            this.todos = data.tasks;
        }
        else {
            data = this.todoService.getSavedTodos();
            this.todos = data.tasks;
        }
        if (this.selectedProject) {
            this.displayedTodos = new Array();
            data.tasks.forEach(function (todo) {
                if (todo.project == _this.selectedProject) {
                    _this.displayedTodos.push(todo);
                }
            });
        }
        else {
            this.displayedTodos = this.todos;
        }
        this.displayedTodos.splice(3, this.displayedTodos.length - 1);
        this.displayedTodos.forEach(function (todo) {
            var date = new Date(todo.due_date);
            todo.due_date_string = "bis " + date.getDate() + ". " + _this.monthNames[date.getMonth()] + " " + date.getFullYear();
        });
    };
    DashboardComponent.prototype.displayMeetings = function (data) {
        var _this = this;
        if (!data) {
            data = this.meetingService.getSavedMeetings();
        }
        else {
            this.meetingService.saveMeetings(data);
        }
        data.meetings.forEach(function (meeting) {
            _this.userService.getSingleProject(meeting.project)
                .then(function (data) {
                meeting.project_color = data.projects[0].color;
            }, function (error) { });
            var curDate = new Date();
            var date = new Date(meeting.date);
            if (curDate.getDate() == date.getDate() && curDate.getMonth() == date.getMonth() && curDate.getFullYear() == date.getFullYear()) {
                meeting.dateFormatted = "HEUTE";
            }
            else {
                date.setMonth(date.getMonth() + 1);
                meeting.dateFormatted = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + "." + (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()) + "." + date.getFullYear().toString().substring(2, 4);
            }
        });
        this.meetings = data.meetings;
        if (this.selectedProject) {
            this.displayedMeetings = new Array();
            data.meetings.forEach(function (meeting) {
                if (meeting.project == _this.selectedProject) {
                    _this.displayedMeetings.push(meeting);
                }
            });
        }
        else {
            this.displayedMeetings = this.meetings;
        }
        this.meetings.sort(function (a, b) { return new Date(a.date).getTime() - new Date(b.date).getTime(); });
        this.displayedMeetings.splice(3, this.displayedMeetings.length - 1);
    };
    DashboardComponent.prototype.displayProjects = function (data) {
        if (data) {
            this.userService.saveProjects(data);
            this.projects = data.projects;
        }
        else {
            data = this.userService.getSavedProjects();
            this.projects = data.projects;
        }
    };
    DashboardComponent.prototype.filterByProject = function (id) {
        if (this.selectedProject === id) {
            this.selectedProject = null; //project de-selecten
        }
        else {
            this.selectedProject = id;
        }
        this.aktualisieren();
    };
    DashboardComponent.prototype.aktualisieren = function () {
        this.ngOnInit();
    };
    DashboardComponent.prototype.showDetail = function (id) {
        this.routerExtensions.navigate(["/meeting_detail/" + id], {
            transition: {
                name: "slide",
                curve: "easeOut"
            }
        });
    };
    DashboardComponent.prototype.setSelectedProject = function (id) {
        this.selectedProject = id;
        this.ngOnInit();
    };
    DashboardComponent.prototype.state = function (view) {
        this.nav.appState = view + '';
    };
    DashboardComponent.prototype.showAllProjects = function () {
        this.all_projects = true;
    };
    DashboardComponent.prototype.limitProjects = function () {
        this.all_projects = false;
    };
    /* gesten */
    DashboardComponent.prototype.onSwipe = function (args) {
        this.direction = args.direction;
        /* nach rechts */
        if (this.direction == 2) {
            this.state('todo');
        }
        /* nach links */
        if (this.direction == 1) {
            this.state('meeting');
        }
        /* nach unten */
        if (this.direction == 4) {
            this.state('ticket');
        }
    };
    DashboardComponent = __decorate([
        core_1.Component({
            selector: "pb-dashboard",
            providers: [user_service_1.UserService, meeting_service_1.MeetingService, todo_service_1.TodoService, ticket_service_1.TicketService, status_service_1.StatusService],
            templateUrl: "pages/dashboard/dashboard.html",
            styleUrls: ["pages/dashboard/dashboard-common.css", "pages/dashboard/dashboard.css"]
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            user_service_1.UserService,
            meeting_service_1.MeetingService,
            todo_service_1.TodoService,
            ticket_service_1.TicketService,
            core_1.ChangeDetectorRef,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            nav_component_1.NavComponent,
            page_1.Page,
            core_1.NgZone])
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRhc2hib2FyZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBdUc7QUFDdkcsK0RBQTZEO0FBQzdELDZEQUE2RDtBQUM3RCxzREFBK0Q7QUFFL0Qsd0VBQXNFO0FBV3RFLHVDQUFxQztBQUNyQzs7O2lFQUdpRTtBQUNqRSx1RUFBK0Q7QUFDL0QsK0NBQThDO0FBQzlDLCtEQUE2RDtBQUM3RCxxRUFBbUU7QUFHbkUsc0RBQW9EO0FBQ3BELHFFQUFpRTtBQUNqRSxnQ0FBNkI7QUFTN0I7SUFvQkU7UUFFRSwyQkFBMkI7UUFDbkIsZ0JBQWtDO1FBQzFDLGlDQUFpQztRQUN6QixXQUF3QixFQUN4QixjQUE4QixFQUM5QixXQUF3QixFQUN4QixhQUE0QixFQUM1QixtQkFBc0MsRUFDdEMsUUFBNEIsRUFDNUIsUUFBc0IsRUFDdEIsSUFBVSxFQUNWLElBQVk7UUFWWixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBRWxDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1Qix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQW1CO1FBQ3RDLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLGFBQVEsR0FBUixRQUFRLENBQWM7UUFDdEIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNWLFNBQUksR0FBSixJQUFJLENBQVE7UUEvQnRCLFlBQU8sR0FBUyxJQUFJLFdBQUksQ0FBQztRQUV6QixhQUFRLEdBQWMsSUFBSSxLQUFLLEVBQVcsQ0FBQztRQUMzQyxzQkFBaUIsR0FBYyxJQUFJLEtBQUssRUFBVyxDQUFDO1FBQ3BELG1CQUFjLEdBQVcsSUFBSSxLQUFLLEVBQVEsQ0FBQztRQUUzQyxvQkFBZSxHQUFXLElB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QUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUVELGdCQUFnQjtRQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QixDQUFDO0lBQ0wsQ0FBQztJQTFOUSxrQkFBa0I7UUFQOUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxjQUFjO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLDBCQUFXLEVBQUUsZ0NBQWMsRUFBRSwwQkFBVyxFQUFFLDhCQUFhLEVBQUUsOEJBQWEsQ0FBQztZQUNuRixXQUFXLEVBQUUsZ0NBQWdDO1lBQzdDLFNBQVMsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLCtCQUErQixDQUFDO1NBQ3JGLENBQUM7eUNBeUI0Qix5QkFBZ0I7WUFFckIsMEJBQVc7WUFDUixnQ0FBYztZQUNqQiwwQkFBVztZQUNULDhCQUFhO1lBQ1Asd0JBQWlCO1lBQzVCLDhDQUFrQjtZQUNsQiw0QkFBWTtZQUNoQixXQUFJO1lBQ0osYUFBTTtPQWpDWCxrQkFBa0IsQ0EyTjlCO0lBQUQseUJBQUM7Q0FBQSxBQTNORCxJQTJOQztBQTNOWSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgT25Jbml0LCBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgTmdab25lIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlci5zZXJ2aWNlXCI7XHJcbi8qaW1wb3J0IHsgUm91dGVyLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjsqL1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBNZWV0aW5nIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9tZWV0aW5nL21lZXRpbmdcIjtcclxuaW1wb3J0IHsgTWVldGluZ1NlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL21lZXRpbmcvbWVldGluZy5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IFByb2plY3QsIFBpdm90IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91c2VyL3Byb2plY3RcIlxyXG5pbXBvcnQge1xyXG4gIEdlc3R1cmVFdmVudERhdGEsXHJcbiAgR2VzdHVyZVR5cGVzLFxyXG4gIFBhbkdlc3R1cmVFdmVudERhdGEsXHJcbiAgUGluY2hHZXN0dXJlRXZlbnREYXRhLFxyXG4gIFJvdGF0aW9uR2VzdHVyZUV2ZW50RGF0YSxcclxuICBTd2lwZUdlc3R1cmVFdmVudERhdGEsXHJcbiAgVG91Y2hHZXN0dXJlRXZlbnREYXRhXHJcbn0gZnJvbSBcInVpL2dlc3R1cmVzXCI7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL3N3aXRjaE1hcFwiO1xyXG4vKmltcG9ydCB7IExpc3RWaWV3RXZlbnREYXRhLCBSYWRMaXN0VmlldyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL2xpc3R2aWV3XCI7XHJcbmltcG9ydCAqIGFzIEZyYW1lTW9kdWxlIGZyb20gXCJ1aS9mcmFtZVwiO1xyXG5pbXBvcnQgeyBSYWRTaWRlRHJhd2VyQ29tcG9uZW50LCBTaWRlRHJhd2VyVHlwZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL3NpZGVkcmF3ZXIvYW5ndWxhclwiO1xyXG5pbXBvcnQgeyBSYWRTaWRlRHJhd2VyIH0gZnJvbSAnbmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyJzsqL1xyXG5pbXBvcnQgeyBUTlNGb250SWNvblNlcnZpY2UgfSBmcm9tICduYXRpdmVzY3JpcHQtbmd4LWZvbnRpY29uJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXNlci91c2VyXCI7XHJcbmltcG9ydCB7IFRvZG9TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC90b2RvL3RvZG8uc2VydmljZVwiO1xyXG5pbXBvcnQgeyBUaWNrZXRTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC90aWNrZXQvdGlja2V0LnNlcnZpY2VcIjtcclxuaW1wb3J0IHtUb2RvLCBUcmFja2luZ30gZnJvbSBcIi4uLy4uL3NoYXJlZC90b2RvL3RvZG9cIjtcclxuaW1wb3J0IHsgVGlja2V0IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC90aWNrZXQvdGlja2V0XCI7XHJcbmltcG9ydCB7IE5hdkNvbXBvbmVudCB9IGZyb20gXCIuLi9uYXYvbmF2LmNvbXBvbmVudFwiO1xyXG5pbXBvcnQge1N0YXR1c1NlcnZpY2V9IGZyb20gXCIuLi8uLi9zaGFyZWQvc3RhdHVzL3N0YXR1cy5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7UGFnZX0gZnJvbSBcInVpL3BhZ2VcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcInBiLWRhc2hib2FyZFwiLFxyXG4gIHByb3ZpZGVyczogW1VzZXJTZXJ2aWNlLCBNZWV0aW5nU2VydmljZSwgVG9kb1NlcnZpY2UsIFRpY2tldFNlcnZpY2UsIFN0YXR1c1NlcnZpY2VdLFxyXG4gIHRlbXBsYXRlVXJsOiBcInBhZ2VzL2Rhc2hib2FyZC9kYXNoYm9hcmQuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wicGFnZXMvZGFzaGJvYXJkL2Rhc2hib2FyZC1jb21tb24uY3NzXCIsIFwicGFnZXMvZGFzaGJvYXJkL2Rhc2hib2FyZC5jc3NcIl1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBEYXNoYm9hcmRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkluaXQge1xyXG5cclxuICBjdXJVc2VyIDpVc2VyID0gbmV3IFVzZXI7XHJcbiAgbWVldGluZ2RhdGEgOmFueTtcclxuICBtZWV0aW5ncyA6TWVldGluZ1tdID0gbmV3IEFycmF5PE1lZXRpbmc+KCk7XHJcbiAgZGlzcGxheWVkTWVldGluZ3MgOk1lZXRpbmdbXSA9IG5ldyBBcnJheTxNZWV0aW5nPigpO1xyXG4gIGRpc3BsYXllZFRvZG9zIDpUb2RvW10gPSBuZXcgQXJyYXk8VG9kbz4oKTtcclxuICBwcm9qZWN0cyA6UHJvamVjdFtdO1xyXG4gIHNlbGVjdGVkUHJvamVjdCA6c3RyaW5nID0gbnVsbDsgLy9pZCBvZiB0aGUgc2VsZWN0ZWQgcHJvamVjdFxyXG4gIGF2YXRhciA6c3RyaW5nO1xyXG4gIHRvZG9zIDpUb2RvW107XHJcbiAgdGlja2V0cyA6VGlja2V0W107XHJcbiAgYWxsX3Byb2plY3RzIDpib29sZWFuID0gZmFsc2U7XHJcbiAgbmF2IDpOYXZDb21wb25lbnQ7XHJcbiAgbW9udGhOYW1lcyA9IFtcIkrDpG5uZXJcIiwgXCJGZWJydWFyXCIsIFwiTcOkcnpcIiwgXCJBcHJpbFwiLCBcIk1haVwiLCBcIkp1bmlcIixcclxuICAgICAgICBcIkp1bGlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZXplbWJlclwiXHJcbiAgICBdO1xyXG4gIHB1YmxpYyBkaXJlY3Rpb246IG51bWJlcjtcclxuICBpc1VwZGF0aW5nID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yXHJcbiAgKFxyXG4gICAgLypwcml2YXRlIHJvdXRlcjogUm91dGVyLCovXHJcbiAgICBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsXHJcbiAgICAvKnByaXZhdGUgcGFnZVJvdXRlOiBQYWdlUm91dGUsKi9cclxuICAgIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBtZWV0aW5nU2VydmljZSA6TWVldGluZ1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHRvZG9TZXJ2aWNlIDpUb2RvU2VydmljZSxcclxuICAgIHByaXZhdGUgdGlja2V0U2VydmljZSA6VGlja2V0U2VydmljZSxcclxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdGlvblJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBwcml2YXRlIGZvbnRpY29uOiBUTlNGb250SWNvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIG5hdlN0YXRlOiBOYXZDb21wb25lbnQsXHJcbiAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsXHJcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZVxyXG4gIClcclxuICB7XHJcbiAgICAgIHRoaXMubmF2ID0gbmF2U3RhdGU7XHJcbiAgICAgIHRoaXMucGFnZS5jc3MgPSBcIi5wYWdlIHsgIHBhZGRpbmctdG9wOiAxMDsgcGFkZGluZy1sZWZ0OiAxMDsgcGFkZGluZy1ib3R0b206IDIwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjRUNFREVFO31cIjtcclxuXHJcbiAgIC8qIHRoaXMuY3VyVXNlciA9IHRoaXMudXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgIHRoaXMuYXZhdGFyID0gXCJodHRwczovL3NlY3VyZS5wcm9qZWN0Ym94LmV1L3YyL3VzZXIvYXZhdGFyL1wiICsgdGhpcy5jdXJVc2VyLmF2YXRhciArIFwiP2FjY2Vzc190b2tlbj1cIiArIHRoaXMuY3VyVXNlci5hY2Nlc3NfdG9rZW47XHJcbiovXHJcbiAgfVxyXG4gIFxyXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMudXNlclNlcnZpY2UuZ2V0UHJvamVjdHMoKS50aGVuKFxyXG4gICAgICAoZGF0YSkgPT4gdGhpcy5kaXNwbGF5UHJvamVjdHMoZGF0YSksXHJcbiAgICAgIChlcnJvcikgPT4gdGhpcy5kaXNwbGF5UHJvamVjdHMoZmFsc2UpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMubWVldGluZ1NlcnZpY2UuZ2V0TWVldGluZ3MoKS50aGVuKFxyXG4gICAgICAoZGF0YSkgPT4gdGhpcy5kaXNwbGF5TWVldGluZ3MoZGF0YSksXHJcbiAgICAgIChlcnJvcikgPT4gdGhpcy5kaXNwbGF5TWVldGluZ3MoZmFsc2UpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMudGlja2V0U2VydmljZS5nZXRUaWNrZXRzKCkudGhlbihcclxuICAgICAgKGRhdGEpID0+IHRoaXMuZGlzcGxheVRpY2tldHMoZGF0YSksIFxyXG4gICAgICAoZXJyb3IpID0+IHRoaXMuZGlzcGxheVRpY2tldHMoZmFsc2UpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMudG9kb1NlcnZpY2UuZ2V0VG9kb3MoKS50aGVuKFxyXG4gICAgICAoZGF0YSkgPT4gdGhpcy5kaXNwbGF5VG9kb3MoZGF0YSksXHJcbiAgICAgIChlcnJvcikgPT4gdGhpcy5kaXNwbGF5VG9kb3MoZmFsc2UpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuXHJcbiAgfVxyXG5cclxuICBkaXNwbGF5VGlja2V0cyhkYXRhIDphbnkpe1xyXG4gICAgaWYoZGF0YSl7XHJcbiAgICAgIHRoaXMudGlja2V0U2VydmljZS5zYXZlVGlja2V0cyhkYXRhKTtcclxuICAgICAgdGhpcy50aWNrZXRzID0gZGF0YS50aWNrZXRzO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGRhdGEgPSB0aGlzLnRpY2tldFNlcnZpY2UuZ2V0U2F2ZWRUaWNrZXRzKCk7XHJcbiAgICAgIHRoaXMudGlja2V0cyA9IGRhdGEudGlja2V0cztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRpc3BsYXlUb2RvcyhkYXRhIDphbnkpIHtcclxuICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgIGRhdGEudGFza3MuZm9yRWFjaCgodG9kbywgaW5kZXgpID0+IHsgICAgICAgIC8vYWxsZSB0b2RvcyBkdXJjaGxhdWZlblxyXG4gICAgICAgICAgLypQcm9qZWt0ZmFyYmVuIGbDvHIgdGFza3MgaGVyYXVzZmluZGVuKi9cclxuICAgICAgICAgIHRoaXMudXNlclNlcnZpY2UuZ2V0U2luZ2xlUHJvamVjdCh0b2RvLnByb2plY3RfaWQpXHJcbiAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgIChkYXRhKSA9PiB7ZGF0YS5wcm9qZWN0c1swXS5jb2xvcj90b2RvLmNvbG9yID0gZGF0YS5wcm9qZWN0c1swXS5jb2xvcjpudWxsfSxcclxuICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7fVxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMudG9kb1NlcnZpY2Uuc2F2ZVRvZG9zKGRhdGEpO1xyXG4gICAgICAgICAgdGhpcy50b2RvcyA9IGRhdGEudGFza3M7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkYXRhID0gdGhpcy50b2RvU2VydmljZS5nZXRTYXZlZFRvZG9zKCk7XHJcbiAgICAgICAgICB0aGlzLnRvZG9zID0gZGF0YS50YXNrcztcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZFByb2plY3QpIHtcclxuICAgICAgICAgIHRoaXMuZGlzcGxheWVkVG9kb3MgPSBuZXcgQXJyYXk8VG9kbz4oKTtcclxuICAgICAgICAgIGRhdGEudGFza3MuZm9yRWFjaCh0b2RvID0+IHtcclxuICAgICAgICAgICAgICBpZiAodG9kby5wcm9qZWN0ID09IHRoaXMuc2VsZWN0ZWRQcm9qZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheWVkVG9kb3MucHVzaCh0b2RvKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZGlzcGxheWVkVG9kb3MgPSB0aGlzLnRvZG9zO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZGlzcGxheWVkVG9kb3Muc3BsaWNlKDMsdGhpcy5kaXNwbGF5ZWRUb2Rvcy5sZW5ndGgtMSk7XHJcbiAgICAgIHRoaXMuZGlzcGxheWVkVG9kb3MuZm9yRWFjaCgodG9kbykgPT4ge1xyXG4gICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0b2RvLmR1ZV9kYXRlKTtcclxuICAgICAgICAgIHRvZG8uZHVlX2RhdGVfc3RyaW5nID0gXCJiaXMgXCIgKyBkYXRlLmdldERhdGUoKSArIFwiLiBcIiArIHRoaXMubW9udGhOYW1lc1tkYXRlLmdldE1vbnRoKCldICsgXCIgXCIgKyBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGlzcGxheU1lZXRpbmdzKGRhdGEgOmFueSl7XHJcbiAgICBpZighZGF0YSl7XHJcbiAgICAgIGRhdGEgPSB0aGlzLm1lZXRpbmdTZXJ2aWNlLmdldFNhdmVkTWVldGluZ3MoKTtcclxuICAgIH1lbHNlIHtcclxuICAgICAgICB0aGlzLm1lZXRpbmdTZXJ2aWNlLnNhdmVNZWV0aW5ncyhkYXRhKTtcclxuICAgIH1cclxuICAgICAgICAgIGRhdGEubWVldGluZ3MuZm9yRWFjaChtZWV0aW5nID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VyU2VydmljZS5nZXRTaW5nbGVQcm9qZWN0KG1lZXRpbmcucHJvamVjdClcclxuICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtZWV0aW5nLnByb2plY3RfY29sb3IgPSBkYXRhLnByb2plY3RzWzBdLmNvbG9yXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChlcnJvcikgPT4ge31cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIHZhciBjdXJEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUobWVldGluZy5kYXRlKTtcclxuICAgICAgICAgIGlmIChjdXJEYXRlLmdldERhdGUoKSA9PSBkYXRlLmdldERhdGUoKSAmJiBjdXJEYXRlLmdldE1vbnRoKCkgPT0gZGF0ZS5nZXRNb250aCgpICYmIGN1ckRhdGUuZ2V0RnVsbFllYXIoKSA9PSBkYXRlLmdldEZ1bGxZZWFyKCkpIHtcclxuICAgICAgICAgICAgICBtZWV0aW5nLmRhdGVGb3JtYXR0ZWQgPSBcIkhFVVRFXCI7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpKzEpO1xyXG4gICAgICAgICAgICAgIG1lZXRpbmcuZGF0ZUZvcm1hdHRlZCA9IChkYXRlLmdldERhdGUoKSA8IDEwPyAnMCcrZGF0ZS5nZXREYXRlKCkgOiBkYXRlLmdldERhdGUoKSkgKyBcIi5cIiArIChkYXRlLmdldE1vbnRoKCkgPCAxMD8gJzAnK2RhdGUuZ2V0TW9udGgoKSA6IGRhdGUuZ2V0TW9udGgoKSkgKyBcIi5cIiArIGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpLnN1YnN0cmluZygyLDQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIHRoaXMubWVldGluZ3MgPSBkYXRhLm1lZXRpbmdzO1xyXG4gICAgaWYodGhpcy5zZWxlY3RlZFByb2plY3Qpe1xyXG4gICAgICB0aGlzLmRpc3BsYXllZE1lZXRpbmdzID0gbmV3IEFycmF5PE1lZXRpbmc+KCk7XHJcbiAgICAgIGRhdGEubWVldGluZ3MuZm9yRWFjaChtZWV0aW5nID0+IHtcclxuICAgICAgICBpZihtZWV0aW5nLnByb2plY3QgPT0gdGhpcy5zZWxlY3RlZFByb2plY3Qpe1xyXG4gICAgICAgICAgdGhpcy5kaXNwbGF5ZWRNZWV0aW5ncy5wdXNoKG1lZXRpbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdGhpcy5kaXNwbGF5ZWRNZWV0aW5ncyA9IHRoaXMubWVldGluZ3M7XHJcbiAgICB9XHJcbiAgICB0aGlzLm1lZXRpbmdzLnNvcnQoKGEsIGIpID0+IHtyZXR1cm4gbmV3IERhdGUoYS5kYXRlKS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShiLmRhdGUpLmdldFRpbWUoKX0pO1xyXG4gICAgICB0aGlzLmRpc3BsYXllZE1lZXRpbmdzLnNwbGljZSgzLHRoaXMuZGlzcGxheWVkTWVldGluZ3MubGVuZ3RoLTEpO1xyXG4gIH1cclxuICBkaXNwbGF5UHJvamVjdHMoZGF0YSA6YW55KXtcclxuICAgIGlmKGRhdGEpe1xyXG4gICAgICB0aGlzLnVzZXJTZXJ2aWNlLnNhdmVQcm9qZWN0cyhkYXRhKTtcclxuICAgICAgdGhpcy5wcm9qZWN0cyA9IGRhdGEucHJvamVjdHM7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgZGF0YSA9IHRoaXMudXNlclNlcnZpY2UuZ2V0U2F2ZWRQcm9qZWN0cygpO1xyXG4gICAgICB0aGlzLnByb2plY3RzID0gZGF0YS5wcm9qZWN0cztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZpbHRlckJ5UHJvamVjdChpZCA6c3RyaW5nKXtcclxuICAgIGlmKHRoaXMuc2VsZWN0ZWRQcm9qZWN0ID09PSBpZCl7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRQcm9qZWN0ID0gbnVsbDsgLy9wcm9qZWN0IGRlLXNlbGVjdGVuXHJcbiAgICB9ZWxzZXtcclxuICAgICAgdGhpcy5zZWxlY3RlZFByb2plY3QgPSBpZDtcclxuICAgIH1cclxuICAgIHRoaXMuYWt0dWFsaXNpZXJlbigpO1xyXG4gIH1cclxuXHJcbiAgYWt0dWFsaXNpZXJlbigpe1xyXG4gICAgdGhpcy5uZ09uSW5pdCgpO1xyXG4gIH1cclxuICBzaG93RGV0YWlsKGlkOiBudW1iZXIpIHtcclxuICAgIFxyXG4gICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiL21lZXRpbmdfZGV0YWlsL1wiICsgaWRdLCB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgY3VydmU6IFwiZWFzZU91dFwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG4gIHNldFNlbGVjdGVkUHJvamVjdChpZCA6c3RyaW5nKXtcclxuICAgIHRoaXMuc2VsZWN0ZWRQcm9qZWN0ID0gaWQ7XHJcbiAgICB0aGlzLm5nT25Jbml0KCk7XHJcbiAgfVxyXG5cclxuICBzdGF0ZSh2aWV3KSB7XHJcbiAgICB0aGlzLm5hdi5hcHBTdGF0ZSA9IHZpZXcgKyAnJztcclxuICB9XHJcblxyXG4gIHNob3dBbGxQcm9qZWN0cygpIHtcclxuICAgIHRoaXMuYWxsX3Byb2plY3RzID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGxpbWl0UHJvamVjdHMoKSB7XHJcbiAgICB0aGlzLmFsbF9wcm9qZWN0cyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLyogZ2VzdGVuICovXHJcbiAgICBvblN3aXBlKGFyZ3M6IFN3aXBlR2VzdHVyZUV2ZW50RGF0YSkge1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gYXJncy5kaXJlY3Rpb247XHJcbiAgICAgICAgLyogbmFjaCByZWNodHMgKi9cclxuICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlKCd0b2RvJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBuYWNoIGxpbmtzICovXHJcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSgnbWVldGluZycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogbmFjaCB1bnRlbiAqL1xyXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUoJ3RpY2tldCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=