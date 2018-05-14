"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var login_component_1 = require("./pages/login/login.component");
var meeting_detail_component_1 = require("./pages/meeting_detail/meeting_detail.component");
var todo_component_1 = require("./pages/todo/todo.component");
var dashboard_component_1 = require("./pages/dashboard/dashboard.component");
var ticket_component_1 = require("./pages/ticket/ticket.component");
var ticket_detail_component_1 = require("./pages/ticket_detail/ticket_detail.component");
var nav_component_1 = require("./pages/nav/nav.component");
var meeting_component_1 = require("./pages/meeting/meeting.component");
var settings_component_1 = require("./pages/settings/settings.component");
var todo_detail_component_1 = require("./pages/todo_detail/todo_detail.component");
var tutorial_component_1 = require("./pages/tutorial/tutorial.component");
exports.routes = [
    { path: "", component: login_component_1.LoginComponent },
    { path: "nav", component: nav_component_1.NavComponent,
        children: [
            { path: "dashboard", component: dashboard_component_1.DashboardComponent, outlet: 'dashboardoutlet' },
            { path: "ticket", component: ticket_component_1.TicketComponent, outlet: 'ticketoutlet' },
            { path: "todo", component: todo_component_1.TodoComponent, outlet: 'todooutlet' },
            { path: "meeting", component: meeting_component_1.MeetingComponent, outlet: 'meetingoutlet' },
            { path: "settings", component: settings_component_1.SettingsComponent, outlet: 'settingsoutlet' }
        ]
    },
    { path: "meeting_detail/:id", component: meeting_detail_component_1.Meeting_detailComponent },
    { path: "todo_detail/:id", component: todo_detail_component_1.Todo_detailComponent },
    { path: "ticket_detail/:id", component: ticket_detail_component_1.Ticket_detailComponent },
    { path: "login", component: login_component_1.LoginComponent },
    { path: "tutorial", component: tutorial_component_1.TutorialComponent }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.NativeScriptRouterModule.forRoot(exports.routes)],
            exports: [router_1.NativeScriptRouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAucm91dGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5QztBQUN6QyxzREFBdUU7QUFHdkUsaUVBQStEO0FBQy9ELDRGQUEwRjtBQUMxRiw4REFBNEQ7QUFDNUQsNkVBQTJFO0FBQzNFLG9FQUFrRTtBQUNsRSx5RkFBdUY7QUFDdkYsMkRBQXlEO0FBQ3pELHVFQUFxRTtBQUNyRSwwRUFBd0U7QUFDeEUsbUZBQWlGO0FBQ2pGLDBFQUF3RTtBQUUzRCxRQUFBLE1BQU0sR0FBRztJQUNwQixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGdDQUFjLEVBQUU7SUFDdkMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSw0QkFBWTtRQUNwQyxRQUFRLEVBQUU7WUFDUixFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLHdDQUFrQixFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRTtZQUMvRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLGtDQUFlLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRTtZQUN0RSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLDhCQUFhLEVBQUcsTUFBTSxFQUFFLFlBQVksRUFBQztZQUNoRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLG9DQUFnQixFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUM7WUFDeEUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxzQ0FBaUIsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUU7U0FDN0U7S0FDRjtJQUNELEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLFNBQVMsRUFBRSxrREFBdUIsRUFBRTtJQUNsRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsNENBQW9CLEVBQUU7SUFDNUQsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLGdEQUFzQixFQUFFO0lBQ2hFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsZ0NBQWMsRUFBRTtJQUM1QyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLHNDQUFpQixFQUFFO0NBRW5ELENBQUM7QUFPRjtJQUFBO0lBQWdDLENBQUM7SUFBcEIsZ0JBQWdCO1FBTDVCLGVBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGlDQUF3QixDQUFDLE9BQU8sQ0FBQyxjQUFNLENBQUMsQ0FBQztZQUNuRCxPQUFPLEVBQUUsQ0FBQyxpQ0FBd0IsQ0FBQztTQUNwQyxDQUFDO09BRVcsZ0JBQWdCLENBQUk7SUFBRCx1QkFBQztDQUFBLEFBQWpDLElBQWlDO0FBQXBCLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcblxyXG5pbXBvcnQgeyBMb2dpbkNvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL2xvZ2luL2xvZ2luLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBNZWV0aW5nX2RldGFpbENvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL21lZXRpbmdfZGV0YWlsL21lZXRpbmdfZGV0YWlsLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBUb2RvQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvdG9kby90b2RvLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRDb21wb25lbnQgfSBmcm9tIFwiLi9wYWdlcy9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBUaWNrZXRDb21wb25lbnQgfSBmcm9tIFwiLi9wYWdlcy90aWNrZXQvdGlja2V0LmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBUaWNrZXRfZGV0YWlsQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvdGlja2V0X2RldGFpbC90aWNrZXRfZGV0YWlsLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBOYXZDb21wb25lbnQgfSBmcm9tIFwiLi9wYWdlcy9uYXYvbmF2LmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBNZWV0aW5nQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvbWVldGluZy9tZWV0aW5nLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBTZXR0aW5nc0NvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL3NldHRpbmdzL3NldHRpbmdzLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBUb2RvX2RldGFpbENvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL3RvZG9fZGV0YWlsL3RvZG9fZGV0YWlsLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBUdXRvcmlhbENvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL3R1dG9yaWFsL3R1dG9yaWFsLmNvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJvdXRlcyA9IFtcclxuICB7IHBhdGg6IFwiXCIsIGNvbXBvbmVudDogTG9naW5Db21wb25lbnQgfSxcclxuICB7IHBhdGg6IFwibmF2XCIsIGNvbXBvbmVudDogTmF2Q29tcG9uZW50LFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyBwYXRoOiBcImRhc2hib2FyZFwiLCBjb21wb25lbnQ6IERhc2hib2FyZENvbXBvbmVudCwgb3V0bGV0OiAnZGFzaGJvYXJkb3V0bGV0JyB9LFxyXG4gICAgICB7IHBhdGg6IFwidGlja2V0XCIsIGNvbXBvbmVudDogVGlja2V0Q29tcG9uZW50LCBvdXRsZXQ6ICd0aWNrZXRvdXRsZXQnIH0sXHJcbiAgICAgIHsgcGF0aDogXCJ0b2RvXCIsIGNvbXBvbmVudDogVG9kb0NvbXBvbmVudCAsIG91dGxldDogJ3RvZG9vdXRsZXQnfSxcclxuICAgICAgeyBwYXRoOiBcIm1lZXRpbmdcIiwgY29tcG9uZW50OiBNZWV0aW5nQ29tcG9uZW50LCBvdXRsZXQ6ICdtZWV0aW5nb3V0bGV0J30sXHJcbiAgICAgIHsgcGF0aDogXCJzZXR0aW5nc1wiLCBjb21wb25lbnQ6IFNldHRpbmdzQ29tcG9uZW50LCBvdXRsZXQ6ICdzZXR0aW5nc291dGxldCcgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAgeyBwYXRoOiBcIm1lZXRpbmdfZGV0YWlsLzppZFwiLCBjb21wb25lbnQ6IE1lZXRpbmdfZGV0YWlsQ29tcG9uZW50IH0sXHJcbiAgeyBwYXRoOiBcInRvZG9fZGV0YWlsLzppZFwiLCBjb21wb25lbnQ6IFRvZG9fZGV0YWlsQ29tcG9uZW50IH0sXHJcbiAgeyBwYXRoOiBcInRpY2tldF9kZXRhaWwvOmlkXCIsIGNvbXBvbmVudDogVGlja2V0X2RldGFpbENvbXBvbmVudCB9LFxyXG4gIHsgcGF0aDogXCJsb2dpblwiLCBjb21wb25lbnQ6IExvZ2luQ29tcG9uZW50IH0sXHJcbiAgeyBwYXRoOiBcInR1dG9yaWFsXCIsIGNvbXBvbmVudDogVHV0b3JpYWxDb21wb25lbnQgfVxyXG4gICAgXHJcbl07XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUuZm9yUm9vdChyb3V0ZXMpXSxcclxuICBleHBvcnRzOiBbTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFJvdXRpbmdNb2R1bGUgeyB9Il19