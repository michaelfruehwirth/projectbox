"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_angular_1 = require("nativescript-angular");
var forms_1 = require("nativescript-angular/forms");
var http_1 = require("nativescript-angular/http");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var router_1 = require("nativescript-angular/router");
var nativescript_ng_shadow_1 = require("nativescript-ng-shadow");
//import { AppShortcuts } from "nativescript-app-shortcuts";
/* Navigation */
var angular_1 = require("nativescript-pro-ui/sidedrawer/angular");
var angular_2 = require("nativescript-pro-ui/listview/angular");
/* use fontawesome */
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var app_component_1 = require("./app.component");
var app_routing_1 = require("./app.routing");
/* components */
var login_component_1 = require("./pages/login/login.component");
var meeting_detail_component_1 = require("./pages/meeting_detail/meeting_detail.component");
var todo_component_1 = require("./pages/todo/todo.component");
var todo_detail_component_1 = require("./pages/todo_detail/todo_detail.component");
var dashboard_component_1 = require("./pages/dashboard/dashboard.component");
var ticket_component_1 = require("./pages/ticket/ticket.component");
var ticket_detail_component_1 = require("./pages/ticket_detail/ticket_detail.component");
var nav_component_1 = require("./pages/nav/nav.component");
var meeting_component_1 = require("./pages/meeting/meeting.component");
var settings_component_1 = require("./pages/settings/settings.component");
var tutorial_component_1 = require("./pages/tutorial/tutorial.component");
/*services*/
var user_service_1 = require("./shared/user/user.service");
var meeting_service_1 = require("./shared/meeting/meeting.service");
var todo_service_1 = require("./shared/todo/todo.service");
var ticket_service_1 = require("./shared/ticket/ticket.service");
/* forms components */
var angular_3 = require("nativescript-drop-down/angular");
var element_registry_1 = require("nativescript-angular/element-registry");
element_registry_1.registerElement("Fab", function () { return require("nativescript-floatingactionbutton").Fab; });
/* slides */
var nativescript_ngx_slides_1 = require("nativescript-ngx-slides");
var AppModule = (function () {
    function AppModule(routerExtensions, 
        //private zone: NgZone,
        userService, meetingService, ticketService, todoService) {
        this.routerExtensions = routerExtensions;
        this.userService = userService;
        this.meetingService = meetingService;
        this.ticketService = ticketService;
        this.todoService = todoService;
        /*
            new AppShortcuts().setQuickActionCallback(shortcutItem => {
          console.log(`The app was launched by shortcut type '${shortcutItem.type}'`);
        
              // this is where you handle any specific case for the shortcut, based on its type
              if (shortcutItem.type === "dashboard") {
                //this.deeplink("/page1");
                console.log("dashboard");
              } else if (shortcutItem.type === "task") {
                //this.deeplink("/page2");
                console.log("task");
              } else if (shortcutItem.type === "meeting") {
                //this.deeplink("/page2");
                console.log("meeting");
              } else if (shortcutItem.type === "ticket") {
                //this.deeplink("/page2");
                console.log("ticket");
              } else if (shortcutItem.type === "setting") {
                //this.deeplink("/page2");
                console.log("seeting");
              }
            });
          }
        
          private deeplink(to: string): void {
            this.zone.run(() => {
              this.routerExtensions.navigate([to], {
                animated: false
              });
            });
            */
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                nativescript_module_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                http_1.NativeScriptHttpModule,
                router_1.NativeScriptRouterModule,
                nativescript_ng_shadow_1.NgShadowModule,
                angular_3.DropDownModule,
                nativescript_ngx_slides_1.SlidesModule,
                router_1.NativeScriptRouterModule.forChild(app_routing_1.routes),
                router_1.NativeScriptRouterModule.forRoot(app_routing_1.routes),
                nativescript_ngx_fonticon_1.TNSFontIconModule.forRoot({
                    'fa': './fonts/font-awesome.css'
                })
            ],
            declarations: [
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                todo_component_1.TodoComponent,
                todo_detail_component_1.Todo_detailComponent,
                ticket_component_1.TicketComponent,
                ticket_detail_component_1.Ticket_detailComponent,
                meeting_detail_component_1.Meeting_detailComponent,
                meeting_component_1.MeetingComponent,
                nav_component_1.NavComponent,
                dashboard_component_1.DashboardComponent,
                settings_component_1.SettingsComponent,
                tutorial_component_1.TutorialComponent,
                angular_2.LISTVIEW_DIRECTIVES,
                angular_1.SIDEDRAWER_DIRECTIVES
            ],
            bootstrap: [app_component_1.AppComponent],
            schemas: [core_1.NO_ERRORS_SCHEMA],
            providers: [
                user_service_1.UserService,
                meeting_service_1.MeetingService,
                ticket_service_1.TicketService,
                todo_service_1.TodoService
            ]
        }),
        __metadata("design:paramtypes", [nativescript_angular_1.RouterExtensions,
            user_service_1.UserService,
            meeting_service_1.MeetingService,
            ticket_service_1.TicketService,
            todo_service_1.TodoService])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFHM0QsNkRBQXdEO0FBQ3hELG9EQUFxRTtBQUNyRSxrREFBbUU7QUFDbkUsZ0ZBQThFO0FBQzlFLHNEQUF1RTtBQUN2RSxpRUFBd0Q7QUFFeEQsNERBQTREO0FBQzVELGdCQUFnQjtBQUNoQixrRUFBK0U7QUFDL0UsZ0VBQTJFO0FBRTNFLHFCQUFxQjtBQUNyQix1RUFBa0Y7QUFFbEYsaURBQStDO0FBQy9DLDZDQUF1QztBQUd2QyxnQkFBZ0I7QUFDaEIsaUVBQStEO0FBQy9ELDRGQUEwRjtBQUMxRiw4REFBNEQ7QUFDNUQsbUZBQWlGO0FBQ2pGLDZFQUEyRTtBQUMzRSxvRUFBa0U7QUFDbEUseUZBQXVGO0FBQ3ZGLDJEQUF5RDtBQUN6RCx1RUFBcUU7QUFDckUsMEVBQXdFO0FBQ3hFLDBFQUF3RTtBQUd4RSxZQUFZO0FBQ1osMkRBQXlEO0FBQ3pELG9FQUFrRTtBQUNsRSwyREFBeUQ7QUFDekQsaUVBQStEO0FBRS9ELHNCQUFzQjtBQUN0QiwwREFBZ0U7QUFDaEUsMEVBQXdFO0FBQ3hFLGtDQUFlLENBQUMsS0FBSyxFQUFFLGNBQU0sT0FBQSxPQUFPLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxHQUFHLEVBQWhELENBQWdELENBQUMsQ0FBQztBQUUvRSxZQUFZO0FBQ1osbUVBQXVEO0FBMEN2RDtJQUNJLG1CQUFvQixnQkFBa0M7UUFDNUMsdUJBQXVCO1FBQ2YsV0FBd0IsRUFDeEIsY0FBOEIsRUFDOUIsYUFBNEIsRUFDNUIsV0FBd0I7UUFMdEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUVwQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFFOUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQThCTTtJQUNKLENBQUM7SUF2Q1UsU0FBUztRQXhDckIsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLHdDQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2Qiw2QkFBc0I7Z0JBQ3RCLGlDQUF3QjtnQkFDeEIsdUNBQWM7Z0JBQ1osd0JBQWM7Z0JBQ2Qsc0NBQVk7Z0JBQ2QsaUNBQXdCLENBQUMsUUFBUSxDQUFDLG9CQUFNLENBQUM7Z0JBQ3pDLGlDQUF3QixDQUFDLE9BQU8sQ0FBQyxvQkFBTSxDQUFDO2dCQUN6Qyw2Q0FBaUIsQ0FBQyxPQUFPLENBQUM7b0JBQzFCLElBQUksRUFBRSwwQkFBMEI7aUJBQ2hDLENBQUM7YUFDRDtZQUNELFlBQVksRUFBRTtnQkFDWiw0QkFBWTtnQkFDWixnQ0FBYztnQkFDZCw4QkFBYTtnQkFDYiw0Q0FBb0I7Z0JBQ3BCLGtDQUFlO2dCQUNmLGdEQUFzQjtnQkFDdEIsa0RBQXVCO2dCQUN2QixvQ0FBZ0I7Z0JBQ2hCLDRCQUFZO2dCQUNaLHdDQUFrQjtnQkFDbEIsc0NBQWlCO2dCQUNqQixzQ0FBaUI7Z0JBQ2pCLDZCQUFtQjtnQkFDbkIsK0JBQXFCO2FBQ3RCO1lBQ0QsU0FBUyxFQUFFLENBQUMsNEJBQVksQ0FBQztZQUN6QixPQUFPLEVBQUUsQ0FBQyx1QkFBZ0IsQ0FBQztZQUMzQixTQUFTLEVBQUM7Z0JBQ1IsMEJBQVc7Z0JBQ1gsZ0NBQWM7Z0JBQ2QsOEJBQWE7Z0JBQ2IsMEJBQVc7YUFDWjtTQUNGLENBQUM7eUNBRXdDLHVDQUFnQjtZQUV2QiwwQkFBVztZQUNSLGdDQUFjO1lBQ2YsOEJBQWE7WUFDZiwwQkFBVztPQU5qQyxTQUFTLENBd0NyQjtJQUFELGdCQUFDO0NBQUEsQUF4Q0QsSUF3Q0M7QUF4Q1ksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IE5nWm9uZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IGlzSU9TIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvcGxhdGZvcm1cIjtcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhclwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9mb3Jtc1wiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcclxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcclxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBOZ1NoYWRvd01vZHVsZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZy1zaGFkb3cnO1xyXG5pbXBvcnQgeyBIdHRwIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcclxuLy9pbXBvcnQgeyBBcHBTaG9ydGN1dHMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFwcC1zaG9ydGN1dHNcIjtcclxuLyogTmF2aWdhdGlvbiAqL1xyXG5pbXBvcnQgeyBTSURFRFJBV0VSX0RJUkVDVElWRVMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyL2FuZ3VsYXJcIjtcclxuaW1wb3J0IHsgTElTVFZJRVdfRElSRUNUSVZFUyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1wcm8tdWkvbGlzdHZpZXcvYW5ndWxhcic7XHJcblxyXG4vKiB1c2UgZm9udGF3ZXNvbWUgKi9cclxuaW1wb3J0IHsgVE5TRm9udEljb25Nb2R1bGUsIFROU0ZvbnRJY29uU2VydmljZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5cclxuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSBcIi4vYXBwLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyByb3V0ZXMgfSBmcm9tIFwiLi9hcHAucm91dGluZ1wiO1xyXG5cclxuXHJcbi8qIGNvbXBvbmVudHMgKi8gXHJcbmltcG9ydCB7IExvZ2luQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvbG9naW4vbG9naW4uY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IE1lZXRpbmdfZGV0YWlsQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvbWVldGluZ19kZXRhaWwvbWVldGluZ19kZXRhaWwuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFRvZG9Db21wb25lbnQgfSBmcm9tIFwiLi9wYWdlcy90b2RvL3RvZG8uY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFRvZG9fZGV0YWlsQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvdG9kb19kZXRhaWwvdG9kb19kZXRhaWwuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IERhc2hib2FyZENvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFRpY2tldENvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL3RpY2tldC90aWNrZXQuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFRpY2tldF9kZXRhaWxDb21wb25lbnQgfSBmcm9tIFwiLi9wYWdlcy90aWNrZXRfZGV0YWlsL3RpY2tldF9kZXRhaWwuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IE5hdkNvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL25hdi9uYXYuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IE1lZXRpbmdDb21wb25lbnQgfSBmcm9tIFwiLi9wYWdlcy9tZWV0aW5nL21lZXRpbmcuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFNldHRpbmdzQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvc2V0dGluZ3Mvc2V0dGluZ3MuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFR1dG9yaWFsQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvdHV0b3JpYWwvdHV0b3JpYWwuY29tcG9uZW50XCI7XHJcblxyXG5cclxuLypzZXJ2aWNlcyovXHJcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSBcIi4vc2hhcmVkL3VzZXIvdXNlci5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IE1lZXRpbmdTZXJ2aWNlIH0gZnJvbSBcIi4vc2hhcmVkL21lZXRpbmcvbWVldGluZy5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IFRvZG9TZXJ2aWNlIH0gZnJvbSBcIi4vc2hhcmVkL3RvZG8vdG9kby5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IFRpY2tldFNlcnZpY2UgfSBmcm9tIFwiLi9zaGFyZWQvdGlja2V0L3RpY2tldC5zZXJ2aWNlXCI7XHJcblxyXG4vKiBmb3JtcyBjb21wb25lbnRzICovXHJcbmltcG9ydCB7IERyb3BEb3duTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1kcm9wLWRvd24vYW5ndWxhclwiO1xyXG5pbXBvcnQgeyByZWdpc3RlckVsZW1lbnQgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeVwiO1xyXG5yZWdpc3RlckVsZW1lbnQoXCJGYWJcIiwgKCkgPT4gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1mbG9hdGluZ2FjdGlvbmJ1dHRvblwiKS5GYWIpO1xyXG5cclxuLyogc2xpZGVzICovXHJcbmltcG9ydCB7IFNsaWRlc01vZHVsZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtc2xpZGVzJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxyXG4gICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXHJcbiAgICBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlLFxyXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxyXG4gICAgTmdTaGFkb3dNb2R1bGUsIC8vbmctc2hhZG93IHBsdWdpblxyXG4gICAgICBEcm9wRG93bk1vZHVsZSxcclxuICAgICAgU2xpZGVzTW9kdWxlLFxyXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvckNoaWxkKHJvdXRlcyksXHJcbiAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUuZm9yUm9vdChyb3V0ZXMpLFxyXG4gICBUTlNGb250SWNvbk1vZHVsZS5mb3JSb290KHtcclxuXHRcdFx0J2ZhJzogJy4vZm9udHMvZm9udC1hd2Vzb21lLmNzcydcclxuXHRcdH0pXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIEFwcENvbXBvbmVudCxcclxuICAgIExvZ2luQ29tcG9uZW50LFxyXG4gICAgVG9kb0NvbXBvbmVudCxcclxuICAgIFRvZG9fZGV0YWlsQ29tcG9uZW50LFxyXG4gICAgVGlja2V0Q29tcG9uZW50LFxyXG4gICAgVGlja2V0X2RldGFpbENvbXBvbmVudCxcclxuICAgIE1lZXRpbmdfZGV0YWlsQ29tcG9uZW50LFxyXG4gICAgTWVldGluZ0NvbXBvbmVudCxcclxuICAgIE5hdkNvbXBvbmVudCxcclxuICAgIERhc2hib2FyZENvbXBvbmVudCxcclxuICAgIFNldHRpbmdzQ29tcG9uZW50LFxyXG4gICAgVHV0b3JpYWxDb21wb25lbnQsXHJcbiAgICBMSVNUVklFV19ESVJFQ1RJVkVTLFxyXG4gICAgU0lERURSQVdFUl9ESVJFQ1RJVkVTXHJcbiAgXSxcclxuICBib290c3RyYXA6IFtBcHBDb21wb25lbnRdLFxyXG4gIHNjaGVtYXM6IFtOT19FUlJPUlNfU0NIRU1BXSxcclxuICBwcm92aWRlcnM6W1xyXG4gICAgVXNlclNlcnZpY2UsXHJcbiAgICBNZWV0aW5nU2VydmljZSxcclxuICAgIFRpY2tldFNlcnZpY2UsXHJcbiAgICBUb2RvU2VydmljZVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgLy9wcml2YXRlIHpvbmU6IE5nWm9uZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIHVzZXJTZXJ2aWNlIDpVc2VyU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIG1lZXRpbmdTZXJ2aWNlIDpNZWV0aW5nU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIHRpY2tldFNlcnZpY2UgOlRpY2tldFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSB0b2RvU2VydmljZSA6VG9kb1NlcnZpY2VcclxuICAgICAgICAgICAgKSB7XHJcbi8qXHJcbiAgICBuZXcgQXBwU2hvcnRjdXRzKCkuc2V0UXVpY2tBY3Rpb25DYWxsYmFjayhzaG9ydGN1dEl0ZW0gPT4ge1xyXG4gIGNvbnNvbGUubG9nKGBUaGUgYXBwIHdhcyBsYXVuY2hlZCBieSBzaG9ydGN1dCB0eXBlICcke3Nob3J0Y3V0SXRlbS50eXBlfSdgKTtcclxuXHJcbiAgICAgIC8vIHRoaXMgaXMgd2hlcmUgeW91IGhhbmRsZSBhbnkgc3BlY2lmaWMgY2FzZSBmb3IgdGhlIHNob3J0Y3V0LCBiYXNlZCBvbiBpdHMgdHlwZVxyXG4gICAgICBpZiAoc2hvcnRjdXRJdGVtLnR5cGUgPT09IFwiZGFzaGJvYXJkXCIpIHtcclxuICAgICAgICAvL3RoaXMuZGVlcGxpbmsoXCIvcGFnZTFcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJkYXNoYm9hcmRcIik7XHJcbiAgICAgIH0gZWxzZSBpZiAoc2hvcnRjdXRJdGVtLnR5cGUgPT09IFwidGFza1wiKSB7XHJcbiAgICAgICAgLy90aGlzLmRlZXBsaW5rKFwiL3BhZ2UyXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidGFza1wiKTtcclxuICAgICAgfSBlbHNlIGlmIChzaG9ydGN1dEl0ZW0udHlwZSA9PT0gXCJtZWV0aW5nXCIpIHtcclxuICAgICAgICAvL3RoaXMuZGVlcGxpbmsoXCIvcGFnZTJcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJtZWV0aW5nXCIpO1xyXG4gICAgICB9IGVsc2UgaWYgKHNob3J0Y3V0SXRlbS50eXBlID09PSBcInRpY2tldFwiKSB7XHJcbiAgICAgICAgLy90aGlzLmRlZXBsaW5rKFwiL3BhZ2UyXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidGlja2V0XCIpO1xyXG4gICAgICB9IGVsc2UgaWYgKHNob3J0Y3V0SXRlbS50eXBlID09PSBcInNldHRpbmdcIikge1xyXG4gICAgICAgIC8vdGhpcy5kZWVwbGluayhcIi9wYWdlMlwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInNlZXRpbmdcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZWVwbGluayh0bzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcclxuICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFt0b10sIHtcclxuICAgICAgICBhbmltYXRlZDogZmFsc2VcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgICovXHJcbiAgfVxyXG59XHJcbiJdfQ==