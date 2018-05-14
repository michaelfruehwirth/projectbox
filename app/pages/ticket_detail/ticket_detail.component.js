"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var status_service_1 = require("../../shared/status/status.service");
var ticket_service_1 = require("../../shared/ticket/ticket.service");
require("rxjs/add/operator/switchMap");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var user_service_1 = require("../../shared/user/user.service");
var Ticket_detailComponent = (function () {
    function Ticket_detailComponent(router, routerExtensions, route, statusService, ticketService, page, _changeDetectionRef, fonticon, userService) {
        var _this = this;
        this.router = router;
        this.routerExtensions = routerExtensions;
        this.route = route;
        this.statusService = statusService;
        this.ticketService = ticketService;
        this.page = page;
        this._changeDetectionRef = _changeDetectionRef;
        this.fonticon = fonticon;
        this.userService = userService;
        this.projectList = new Array();
        this.userIds = new Array();
        this.userSelection = new Array();
        this.projectIds = new Array();
        this.route.params.subscribe(function (params) {
            _this.getTicket(params["id"]);
        });
        this.page.css = "Page { background-color: #ffffff; } .page { padding-left: 0; padding:20; background-color: #ffffff;}";
    }
    Ticket_detailComponent.prototype.ngOnInit = function () {
    };
    Ticket_detailComponent.prototype.getTicket = function (ticket_id) {
        var _this = this;
        this.ticketService.getSingleTicket(ticket_id)
            .then(function (data) {
            _this.ticket = data.ticket;
            _this.userService.getProjects()
                .then(function (data) {
                data.projects.forEach(function (project) {
                    _this.projectIds[_this.projectList.push(project.name) - 1] = project.id;
                    if (_this.ticket.project == project.id) {
                        _this.selectedProjectIndex = _this.projectList.length - 1;
                        _this.fillDropDown(project.id);
                    }
                });
            });
        });
    };
    Ticket_detailComponent.prototype.navigateto = function (pagename) {
        this.routerExtensions.navigate([pagename], {
            transition: {
                name: "slide",
                curve: "easeOut"
            }
        });
    };
    Ticket_detailComponent.prototype.selectUser = function (args) {
        this.ticket.responsible = this.userIds[args.newIndex];
    };
    Ticket_detailComponent.prototype.fillDropDown = function (project_id) {
        var _this = this;
        this.userService.getSingleProject(project_id)
            .then(function (data) {
            _this.userSelection = new Array();
            data.users.forEach(function (user) {
                _this.userIds[_this.userSelection.push(user.first_name + " " + user.last_name) - 1] = user.id;
                if (_this.ticket.responsible == user.id) {
                    _this.selectedUserIndex = _this.userSelection.length - 1;
                }
            });
        });
    };
    Ticket_detailComponent.prototype.getUsers = function (args) {
        var _this = this;
        this.ticket.project = this.projectIds[args.newIndex];
        this.userService.getSingleProject(this.ticket.project)
            .then(function (data) {
            _this.userSelection = new Array();
            data.users.forEach(function (user) {
                _this.userIds[_this.userSelection.push(user.first_name + " " + user.last_name) - 1] = user.id;
            });
        }, function (error) { });
    };
    Ticket_detailComponent.prototype.cancel = function () {
        this.routerExtensions.backToPreviousPage();
    };
    Ticket_detailComponent.prototype.saveTicket = function () {
        var _this = this;
        this.ticketService.updateTicket(this.ticket)
            .then(function () { _this.cancel(); });
    };
    Ticket_detailComponent = __decorate([
        core_1.Component({
            selector: "pb-ticket_detail",
            providers: [ticket_service_1.TicketService, status_service_1.StatusService, user_service_1.UserService],
            templateUrl: "pages/ticket_detail/ticket_detail.html",
            styleUrls: ["pages/ticket_detail/ticket_detail-common.css", "pages/ticket_detail/ticket_detail.css"]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            router_2.RouterExtensions,
            router_1.ActivatedRoute,
            status_service_1.StatusService,
            ticket_service_1.TicketService,
            page_1.Page,
            core_1.ChangeDetectorRef,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            user_service_1.UserService])
    ], Ticket_detailComponent);
    return Ticket_detailComponent;
}());
exports.Ticket_detailComponent = Ticket_detailComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlja2V0X2RldGFpbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0aWNrZXRfZGV0YWlsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5RztBQUV6RywwQ0FBeUQ7QUFDekQsc0RBQStEO0FBQy9ELGdDQUErQjtBQUMvQixxRUFBbUU7QUFFbkUscUVBQW1FO0FBQ25FLHVDQUFxQztBQUNyQyx1RUFBK0Q7QUFDL0QsK0RBQTZEO0FBWTdEO0lBU0ksZ0NBRVksTUFBYyxFQUNkLGdCQUFrQyxFQUNsQyxLQUFxQixFQUNyQixhQUE0QixFQUM1QixhQUE0QixFQUM1QixJQUFVLEVBQ1YsbUJBQXNDLEVBQ3RDLFFBQTRCLEVBQzVCLFdBQXdCO1FBVnBDLGlCQWtCQztRQWhCVyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1Ysd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFtQjtRQUN0QyxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQWhCcEMsZ0JBQVcsR0FBYSxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQzVDLFlBQU8sR0FBYSxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQ3hDLGtCQUFhLEdBQWEsSUFBSSxLQUFLLEVBQVUsQ0FBQztRQUM5QyxlQUFVLEdBQWEsSUFBSSxLQUFLLEVBQVUsQ0FBQztRQWdCdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBTTtZQUMvQixLQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsc0dBQXNHLENBQUM7SUFDM0gsQ0FBQztJQUVELHlDQUFRLEdBQVI7SUFDQSxDQUFDO0lBRUQsMENBQVMsR0FBVCxVQUFVLFNBQVM7UUFBbkIsaUJBZUM7UUFkRyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7YUFDeEMsSUFBSSxDQUFDLFVBQUMsSUFBSTtZQUNQLEtBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMxQixLQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRTtpQkFDekIsSUFBSSxDQUFDLFVBQUMsSUFBSTtnQkFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU87b0JBQzFCLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7b0JBQ3BFLEVBQUUsQ0FBQSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFDO3dCQUNsQyxLQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDO3dCQUN0RCxLQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbEMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUE7SUFDVixDQUFDO0lBRUQsMkNBQVUsR0FBVixVQUFXLFFBQWdCO1FBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN2QyxVQUFVLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsS0FBSyxFQUFFLFNBQVM7YUFDbkI7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBSUQsMkNBQVUsR0FBVixVQUFXLElBQW1DO1FBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCw2Q0FBWSxHQUFaLFVBQWEsVUFBVTtRQUF2QixpQkFZQztRQVhHLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDO2FBQ3hDLElBQUksQ0FBQyxVQUFDLElBQUk7WUFDUCxLQUFJLENBQUMsYUFBYSxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7WUFFekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2dCQUNwQixLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUMxRixFQUFFLENBQUEsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQztvQkFDbkMsS0FBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQTtnQkFDeEQsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQseUNBQVEsR0FBUixVQUFTLElBQW1DO1FBQTVDLGlCQVdDO1FBVkcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUNqRCxJQUFJLENBQ0QsVUFBQyxJQUFJO1lBQ0QsS0FBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtnQkFDcEIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUM5RixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsRUFDRCxVQUFDLEtBQUssSUFBTSxDQUFDLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQsdUNBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCwyQ0FBVSxHQUFWO1FBQUEsaUJBR0M7UUFGRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ3ZDLElBQUksQ0FBQyxjQUFPLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFsR1Esc0JBQXNCO1FBUGxDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLFNBQVMsRUFBRSxDQUFDLDhCQUFhLEVBQUUsOEJBQWEsRUFBRSwwQkFBVyxDQUFDO1lBQ3RELFdBQVcsRUFBRSx3Q0FBd0M7WUFDckQsU0FBUyxFQUFFLENBQUMsOENBQThDLEVBQUUsdUNBQXVDLENBQUM7U0FDckcsQ0FBQzt5Q0Fhc0IsZUFBTTtZQUNJLHlCQUFnQjtZQUMzQix1QkFBYztZQUNOLDhCQUFhO1lBQ2IsOEJBQWE7WUFDdEIsV0FBSTtZQUNXLHdCQUFpQjtZQUM1Qiw4Q0FBa0I7WUFDZiwwQkFBVztPQW5CM0Isc0JBQXNCLENBcUdsQztJQUFELDZCQUFDO0NBQUEsQUFyR0QsSUFxR0M7QUFyR1ksd0RBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIFZpZXdDaGlsZCwgT25Jbml0LCBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgRWxlbWVudFJlZn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXNlci91c2VyXCI7XHJcbmltcG9ydCB7IFJvdXRlciwgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBTdGF0dXNTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zdGF0dXMvc3RhdHVzLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgVGlja2V0IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC90aWNrZXQvdGlja2V0XCI7XHJcbmltcG9ydCB7IFRpY2tldFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3RpY2tldC90aWNrZXQuc2VydmljZVwiO1xyXG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9zd2l0Y2hNYXBcIjtcclxuaW1wb3J0IHsgVE5TRm9udEljb25TZXJ2aWNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XHJcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91c2VyL3VzZXIuc2VydmljZVwiO1xyXG5pbXBvcnQge0NvbmZpZ30gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWdcIjtcclxuaW1wb3J0IHsgU2VsZWN0ZWRJbmRleENoYW5nZWRFdmVudERhdGEgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWRyb3AtZG93blwiO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcInBiLXRpY2tldF9kZXRhaWxcIixcclxuICBwcm92aWRlcnM6IFtUaWNrZXRTZXJ2aWNlLCBTdGF0dXNTZXJ2aWNlLCBVc2VyU2VydmljZV0sXHJcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvdGlja2V0X2RldGFpbC90aWNrZXRfZGV0YWlsLmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcInBhZ2VzL3RpY2tldF9kZXRhaWwvdGlja2V0X2RldGFpbC1jb21tb24uY3NzXCIsIFwicGFnZXMvdGlja2V0X2RldGFpbC90aWNrZXRfZGV0YWlsLmNzc1wiXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFRpY2tldF9kZXRhaWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXR7XHJcbiAgICBzZWxlY3RlZFVzZXJJbmRleDogbnVtYmVyO1xyXG4gICAgc2VsZWN0ZWRQcm9qZWN0SW5kZXg6IGFueTtcclxuICAgIHByb2plY3RMaXN0OiBzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICB1c2VySWRzOiBzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICB1c2VyU2VsZWN0aW9uOiBzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICBwcm9qZWN0SWRzOiBzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICB0aWNrZXQgOlRpY2tldDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvclxyXG4gICAgKFxyXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLFxyXG4gICAgICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxyXG4gICAgICAgIHByaXZhdGUgc3RhdHVzU2VydmljZSA6U3RhdHVzU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIHRpY2tldFNlcnZpY2UgOlRpY2tldFNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG4gICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdGlvblJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICAgICAgcHJpdmF0ZSBmb250aWNvbjogVE5TRm9udEljb25TZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLFxyXG4gICAgKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucm91dGUucGFyYW1zLnN1YnNjcmliZSgocGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlja2V0KHBhcmFtc1tcImlkXCJdKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wYWdlLmNzcyA9IFwiUGFnZSB7IGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7IH0gLnBhZ2UgeyBwYWRkaW5nLWxlZnQ6IDA7IHBhZGRpbmc6MjA7IGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7fVwiO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRpY2tldCh0aWNrZXRfaWQpe1xyXG4gICAgICAgIHRoaXMudGlja2V0U2VydmljZS5nZXRTaW5nbGVUaWNrZXQodGlja2V0X2lkKVxyXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aWNrZXQgPSBkYXRhLnRpY2tldDtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlclNlcnZpY2UuZ2V0UHJvamVjdHMoKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucHJvamVjdHMuZm9yRWFjaCgocHJvamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0SWRzW3RoaXMucHJvamVjdExpc3QucHVzaChwcm9qZWN0Lm5hbWUpLTFdID0gcHJvamVjdC5pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMudGlja2V0LnByb2plY3QgPT0gcHJvamVjdC5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFByb2plY3RJbmRleCA9IHRoaXMucHJvamVjdExpc3QubGVuZ3RoLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxsRHJvcERvd24ocHJvamVjdC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRldG8ocGFnZW5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbcGFnZW5hbWVdLCB7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImVhc2VPdXRcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzZWxlY3RVc2VyKGFyZ3M6IFNlbGVjdGVkSW5kZXhDaGFuZ2VkRXZlbnREYXRhKXtcclxuICAgICAgICB0aGlzLnRpY2tldC5yZXNwb25zaWJsZSA9IHRoaXMudXNlcklkc1thcmdzLm5ld0luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBmaWxsRHJvcERvd24ocHJvamVjdF9pZCl7XHJcbiAgICAgICAgdGhpcy51c2VyU2VydmljZS5nZXRTaW5nbGVQcm9qZWN0KHByb2plY3RfaWQpXHJcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJTZWxlY3Rpb24gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRhdGEudXNlcnMuZm9yRWFjaCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlcklkc1t0aGlzLnVzZXJTZWxlY3Rpb24ucHVzaCh1c2VyLmZpcnN0X25hbWUgKyBcIiBcIiArIHVzZXIubGFzdF9uYW1lKS0xXSA9IHVzZXIuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy50aWNrZXQucmVzcG9uc2libGUgPT0gdXNlci5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRVc2VySW5kZXggPSB0aGlzLnVzZXJTZWxlY3Rpb24ubGVuZ3RoLTFcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXNlcnMoYXJnczogU2VsZWN0ZWRJbmRleENoYW5nZWRFdmVudERhdGEpe1xyXG4gICAgICAgIHRoaXMudGlja2V0LnByb2plY3QgPSB0aGlzLnByb2plY3RJZHNbYXJncy5uZXdJbmRleF07XHJcbiAgICAgICAgdGhpcy51c2VyU2VydmljZS5nZXRTaW5nbGVQcm9qZWN0KHRoaXMudGlja2V0LnByb2plY3QpXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJTZWxlY3Rpb24gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEudXNlcnMuZm9yRWFjaCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJJZHNbdGhpcy51c2VyU2VsZWN0aW9uLnB1c2godXNlci5maXJzdF9uYW1lICsgXCIgXCIgKyB1c2VyLmxhc3RfbmFtZSktMV0gPSB1c2VyLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge30pXHJcbiAgICB9XHJcblxyXG4gICAgY2FuY2VsKCkge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5iYWNrVG9QcmV2aW91c1BhZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBzYXZlVGlja2V0KCkge1xyXG4gICAgICAgIHRoaXMudGlja2V0U2VydmljZS51cGRhdGVUaWNrZXQodGhpcy50aWNrZXQpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHt0aGlzLmNhbmNlbCgpfSk7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG4iXX0=