"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_1 = require("nativescript-angular/platform");
var router_1 = require("nativescript-angular/router");
var app_routing_1 = require("../../app.routing");
var dashboard_component_1 = require("../dashboard/dashboard.component");
var ticket_component_1 = require("../ticket/ticket.component");
var todo_component_1 = require("../todo/todo.component");
var nav_component_1 = require("../nav/nav.component");
var settings_component_1 = require("../settings/settings.component");
var meeting_component_1 = require("../meeting/meeting.component");
var NavModule = (function () {
    function NavModule() {
    }
    NavModule = __decorate([
        core_1.NgModule({
            bootstrap: [nav_component_1.NavComponent],
            entryComponents: [dashboard_component_1.DashboardComponent, ticket_component_1.TicketComponent, todo_component_1.TodoComponent, settings_component_1.SettingsComponent, meeting_component_1.MeetingComponent],
            imports: [
                router_1.NativeScriptRouterModule,
                router_1.NativeScriptRouterModule.forRoot(app_routing_1.routes)
            ]
        })
    ], NavModule);
    return NavModule;
}());
exports.NavModule = NavModule;
platform_1.platformNativeScriptDynamic().bootstrapModule(NavModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5hdi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBb0Q7QUFDcEQsMERBQTRFO0FBQzVFLHNEQUF1RTtBQUV2RSxpREFBMkM7QUFDM0Msd0VBQXNFO0FBQ3RFLCtEQUE2RDtBQUM3RCx5REFBc0Q7QUFDdEQsc0RBQW9EO0FBQ3BELHFFQUFtRTtBQUNuRSxrRUFBZ0U7QUFZaEU7SUFBQTtJQUF3QixDQUFDO0lBQVosU0FBUztRQVRyQixlQUFRLENBQUM7WUFDTixTQUFTLEVBQUUsQ0FBQyw0QkFBWSxDQUFDO1lBQ3pCLGVBQWUsRUFBRSxDQUFDLHdDQUFrQixFQUFFLGtDQUFlLEVBQUUsOEJBQWEsRUFBRSxzQ0FBaUIsRUFBRSxvQ0FBZ0IsQ0FBQztZQUMxRyxPQUFPLEVBQUU7Z0JBQ0wsaUNBQXdCO2dCQUN4QixpQ0FBd0IsQ0FBQyxPQUFPLENBQUMsb0JBQU0sQ0FBQzthQUMzQztTQUNKLENBQUM7T0FFVyxTQUFTLENBQUc7SUFBRCxnQkFBQztDQUFBLEFBQXpCLElBQXlCO0FBQVosOEJBQVM7QUFFdEIsc0NBQTJCLEVBQUUsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgcGxhdGZvcm1OYXRpdmVTY3JpcHREeW5hbWljIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3BsYXRmb3JtXCI7XHJcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uU3RhcnQsIE5hdmlnYXRpb25FbmQgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IHJvdXRlcyB9IGZyb20gXCIuLi8uLi9hcHAucm91dGluZ1wiO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRDb21wb25lbnQgfSBmcm9tIFwiLi4vZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgVGlja2V0Q29tcG9uZW50IH0gZnJvbSBcIi4uL3RpY2tldC90aWNrZXQuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFRvZG9Db21wb25lbnR9IGZyb20gXCIuLi90b2RvL3RvZG8uY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IE5hdkNvbXBvbmVudCB9IGZyb20gXCIuLi9uYXYvbmF2LmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBTZXR0aW5nc0NvbXBvbmVudCB9IGZyb20gXCIuLi9zZXR0aW5ncy9zZXR0aW5ncy5jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgTWVldGluZ0NvbXBvbmVudCB9IGZyb20gXCIuLi9tZWV0aW5nL21lZXRpbmcuY29tcG9uZW50XCI7XHJcblxyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGJvb3RzdHJhcDogW05hdkNvbXBvbmVudF0sXHJcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtEYXNoYm9hcmRDb21wb25lbnQsIFRpY2tldENvbXBvbmVudCwgVG9kb0NvbXBvbmVudCwgU2V0dGluZ3NDb21wb25lbnQsIE1lZXRpbmdDb21wb25lbnRdLFxyXG4gICAgaW1wb3J0czogW1xyXG4gICAgICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSxcclxuICAgICAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUuZm9yUm9vdChyb3V0ZXMpXHJcbiAgICBdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgTmF2TW9kdWxlIHt9XHJcblxyXG5wbGF0Zm9ybU5hdGl2ZVNjcmlwdER5bmFtaWMoKS5ib290c3RyYXBNb2R1bGUoTmF2TW9kdWxlKTsiXX0=