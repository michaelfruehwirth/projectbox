"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_1 = require("../../shared/user/user");
var user_service_1 = require("../../shared/user/user.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var status_service_1 = require("../../shared/status/status.service");
var ticket_1 = require("../../shared/ticket/ticket");
var ticket_service_1 = require("../../shared/ticket/ticket.service");
require("rxjs/add/operator/switchMap");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var nav_component_1 = require("../nav/nav.component");
var TicketComponent = (function () {
    function TicketComponent(router, routerExtensions, activatedRoute, userService, statusService, ticketService, _changeDetectionRef, page, fonticon, navState) {
        this.router = router;
        this.routerExtensions = routerExtensions;
        this.activatedRoute = activatedRoute;
        this.userService = userService;
        this.statusService = statusService;
        this.ticketService = ticketService;
        this._changeDetectionRef = _changeDetectionRef;
        this.page = page;
        this.fonticon = fonticon;
        this.navState = navState;
        this.curUser = new user_1.User;
        this.newTicket = new ticket_1.Ticket();
        this.projectSelection = new Array();
        this.userSelection = new Array();
        this.projectList = new Array();
        this.projectIds = new Array();
        this.userIds = new Array();
        this.nav = navState;
        this.curUser = this.userService.getCurrentUser();
    }
    TicketComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ticketService.getTickets().then(function (data) { return _this.displayTickets(data); }, function (error) { return _this.displayTickets(false); }).then(function () {
            _this.ticketForDetail = new Array(_this.tickets.length);
            _this.tickets.forEach(function (element) {
                _this.ticketForDetail[element.id] = false;
            });
        });
        this.userService.getProjects()
            .then(function (data) {
            _this.projectList = new Array();
            data.projects.forEach(function (project) {
                console.log(project.name);
                _this.projectIds[_this.projectList.push(project.name) - 1] = project.id;
            });
        });
        this.page.css = "Page { background-color: #ECEDEE; } .page { padding-left: 20; background-color: #ECEDEE;}";
    };
    TicketComponent.prototype.expand = function (id) {
        this.ticketForDetail[id] = !this.ticketForDetail[id];
    };
    TicketComponent.prototype.displayTickets = function (data) {
        var _this = this;
        if (data) {
            this.ticketService.saveTickets(data);
            this.tickets = data.tickets;
        }
        else {
            data = this.ticketService.getSavedTickets();
            this.tickets = data.tickets;
        }
        this.tickets.forEach(function (ticket) {
            if (ticket.completed) {
                _this.tickets.splice(_this.tickets.indexOf(ticket), 1);
            }
            else {
                _this.userService.getSingleProject(ticket.project)
                    .then(function (data) {
                    ticket.project = data.projects[0].name;
                    ticket.color = data.projects[0].color;
                });
            }
        });
        this.tickets.sort(function (a, b) { return a.priority - b.priority; });
    };
    TicketComponent.prototype.cr_ticket = function () {
        this.create = true;
        this.page.css = "Page { background-color: #ffffff; } .page { padding-left: 0; padding:20; background-color: #ffffff;}";
    };
    TicketComponent.prototype.cancel = function () {
        this.create = false;
        this.page.css = "Page { background-color: #ECEDEE; } .page { padding-left: 10; background-color: #ECEDEE;}";
    };
    TicketComponent.prototype.createTicket = function () {
        var _this = this;
        this.ticketService.createTicket(this.newTicket)
            .then(function (data) { _this.newTicket.id = data.ticket.id; _this.ticketService.updateTicket(_this.newTicket).then(function (data) { _this.ngOnInit(); }); });
        alert("Ticket erstellt");
        this.create = false;
    };
    TicketComponent.prototype.getUsers = function (args) {
        var _this = this;
        this.newTicket.project = this.projectIds[args.newIndex];
        this.userService.getSingleProject(this.newTicket.project)
            .then(function (data) {
            _this.userSelection = new Array();
            data.users.forEach(function (user) {
                console.log(user.first_name);
                _this.userIds[_this.userSelection.push(user.first_name + " " + user.last_name) - 1] = user.id;
            });
        }, function (error) { });
    };
    TicketComponent.prototype.selectUser = function (args) {
        this.newTicket.responsible = this.userIds[args.newIndex];
    };
    TicketComponent.prototype.deleteTicket = function (t_id) {
        var _this = this;
        this.ticketService.deleteTicket(t_id).then(function () { alert("Ticket erfolgreich gelöscht!"); _this.ngOnInit(); });
    };
    TicketComponent.prototype.finished = function (t) {
        var _this = this;
        t.completed = true;
        this.ticketService.updateTicket(t).then(function (data) { _this.ngOnInit(); alert("Ticket erfolgreich abgeschlossen!"); });
    };
    TicketComponent.prototype.goToDetail = function (t_id) {
        this.routerExtensions.navigate(["ticket_detail/" + t_id], {
            transition: {
                name: "slideTop",
                curve: "easeOut"
            }
        });
    };
    TicketComponent = __decorate([
        core_1.Component({
            selector: "pb-ticket",
            providers: [ticket_service_1.TicketService, status_service_1.StatusService, user_service_1.UserService],
            templateUrl: "pages/ticket/ticket.html",
            styleUrls: ["pages/ticket/ticket-common.css", "pages/ticket/ticket.css"]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            router_2.RouterExtensions,
            router_1.ActivatedRoute,
            user_service_1.UserService,
            status_service_1.StatusService,
            ticket_service_1.TicketService,
            core_1.ChangeDetectorRef,
            page_1.Page,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            nav_component_1.NavComponent])
    ], TicketComponent);
    return TicketComponent;
}());
exports.TicketComponent = TicketComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlja2V0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRpY2tldC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBK0Y7QUFDL0YsK0NBQThDO0FBQzlDLCtEQUE2RDtBQUM3RCwwQ0FBeUQ7QUFDekQsc0RBQStEO0FBQy9ELGdDQUErQjtBQUMvQixxRUFBbUU7QUFDbkUscURBQW9EO0FBQ3BELHFFQUFtRTtBQUNuRSx1Q0FBcUM7QUFLckMsdUVBQStEO0FBRS9ELHNEQUFvRDtBQVlwRDtJQWNFLHlCQUVVLE1BQWMsRUFDZCxnQkFBa0MsRUFDbEMsY0FBOEIsRUFDOUIsV0FBd0IsRUFDeEIsYUFBNEIsRUFDNUIsYUFBNEIsRUFDNUIsbUJBQXNDLEVBQ3RDLElBQVUsRUFDVixRQUE0QixFQUM1QixRQUFzQjtRQVR0QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFtQjtRQUN0QyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1YsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQXBCaEMsWUFBTyxHQUFTLElBQUksV0FBSSxDQUFDO1FBQ2xCLGNBQVMsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO1FBRWpDLHFCQUFnQixHQUFhLElBQUksS0FBSyxFQUFVLENBQUM7UUFDakQsa0JBQWEsR0FBYSxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQzlDLGdCQUFXLEdBQWEsSUFBSSxLQUFLLEVBQVUsQ0FBQztRQUNuRCxlQUFVLEdBQWEsSUFBSSxLQUFLLEVBQVUsQ0FBQztRQUMzQyxZ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QUFRLEdBQVIsVUFBUyxDQUFTO1FBQWxCLGlCQUdDO1FBRkcsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFNLEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBLENBQUEsQ0FBQyxDQUFDLENBQUM7SUFDcEgsQ0FBQztJQUVELG9DQUFVLEdBQVYsVUFBVyxJQUFZO1FBQ25CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsRUFBRTtZQUN0RCxVQUFVLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLEtBQUssRUFBRSxTQUFTO2FBQ25CO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQXhJUSxlQUFlO1FBUDNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsV0FBVztZQUNyQixTQUFTLEVBQUUsQ0FBQyw4QkFBYSxFQUFFLDhCQUFhLEVBQUUsMEJBQVcsQ0FBQztZQUN0RCxXQUFXLEVBQUUsMEJBQTBCO1lBQ3ZDLFNBQVMsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLHlCQUF5QixDQUFDO1NBQ3pFLENBQUM7eUNBa0JrQixlQUFNO1lBQ0kseUJBQWdCO1lBQ2xCLHVCQUFjO1lBQ2pCLDBCQUFXO1lBQ1QsOEJBQWE7WUFDYiw4QkFBYTtZQUNQLHdCQUFpQjtZQUNoQyxXQUFJO1lBQ0EsOENBQWtCO1lBQ2xCLDRCQUFZO09BekJyQixlQUFlLENBeUkzQjtJQUFELHNCQUFDO0NBQUEsQUF6SUQsSUF5SUM7QUF6SVksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgT25Jbml0LCBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlclwiO1xyXG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXNlci91c2VyLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgUm91dGVyLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7IFN0YXR1c1NlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3N0YXR1cy9zdGF0dXMuc2VydmljZVwiO1xyXG5pbXBvcnQgeyBUaWNrZXQgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3RpY2tldC90aWNrZXRcIjtcclxuaW1wb3J0IHsgVGlja2V0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdGlja2V0L3RpY2tldC5zZXJ2aWNlXCI7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL3N3aXRjaE1hcFwiO1xyXG5pbXBvcnQgeyBMaXN0Vmlld0V2ZW50RGF0YSwgUmFkTGlzdFZpZXcgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9saXN0dmlld1wiO1xyXG5pbXBvcnQgKiBhcyBGcmFtZU1vZHVsZSBmcm9tIFwidWkvZnJhbWVcIjtcclxuaW1wb3J0IHsgUmFkU2lkZURyYXdlckNvbXBvbmVudCwgU2lkZURyYXdlclR5cGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyL2FuZ3VsYXJcIjtcclxuaW1wb3J0IHsgUmFkU2lkZURyYXdlciB9IGZyb20gJ25hdGl2ZXNjcmlwdC1wcm8tdWkvc2lkZWRyYXdlcic7XHJcbmltcG9ydCB7IFROU0ZvbnRJY29uU2VydmljZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ1aS9kaWFsb2dzXCI7XHJcbmltcG9ydCB7IE5hdkNvbXBvbmVudCB9IGZyb20gXCIuLi9uYXYvbmF2LmNvbXBvbmVudFwiO1xyXG5pbXBvcnQge1RyYWNraW5nfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3RvZG8vdG9kb1wiO1xyXG5pbXBvcnQge1NlbGVjdGVkSW5kZXhDaGFuZ2VkRXZlbnREYXRhfSBmcm9tIFwibmF0aXZlc2NyaXB0LWRyb3AtZG93blwiO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcInBiLXRpY2tldFwiLFxyXG4gIHByb3ZpZGVyczogW1RpY2tldFNlcnZpY2UsIFN0YXR1c1NlcnZpY2UsIFVzZXJTZXJ2aWNlXSxcclxuICB0ZW1wbGF0ZVVybDogXCJwYWdlcy90aWNrZXQvdGlja2V0Lmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcInBhZ2VzL3RpY2tldC90aWNrZXQtY29tbW9uLmNzc1wiLCBcInBhZ2VzL3RpY2tldC90aWNrZXQuY3NzXCJdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgVGlja2V0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgdGlja2V0cyA6VGlja2V0W107XHJcbiAgdGlja2V0Rm9yRGV0YWlsIDpCb29sZWFuW107XHJcbiAgY3JlYXRlOiBib29sZWFuO1xyXG4gIGN1clVzZXIgOlVzZXIgPSBuZXcgVXNlcjtcclxuICBwdWJsaWMgbmV3VGlja2V0IDpUaWNrZXQgPSBuZXcgVGlja2V0KCk7XHJcbiAgbmF2OiBOYXZDb21wb25lbnQ7XHJcbiAgcHVibGljIHByb2plY3RTZWxlY3Rpb24gOnN0cmluZ1tdID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICBwdWJsaWMgdXNlclNlbGVjdGlvbiA6c3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gIHB1YmxpYyBwcm9qZWN0TGlzdDogc3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gIHByb2plY3RJZHMgOnN0cmluZ1tdID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICB1c2VySWRzIDpzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yXHJcbiAgKFxyXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcclxuICAgIHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucyxcclxuICAgIHByaXZhdGUgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlLFxyXG4gICAgcHJpdmF0ZSB1c2VyU2VydmljZTogVXNlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0YXR1c1NlcnZpY2UgOlN0YXR1c1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHRpY2tldFNlcnZpY2UgOlRpY2tldFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3Rpb25SZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG4gICAgcHJpdmF0ZSBmb250aWNvbjogVE5TRm9udEljb25TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBuYXZTdGF0ZTogTmF2Q29tcG9uZW50XHJcbiAgICApXHJcbiAge1xyXG4gICAgdGhpcy5uYXYgPSBuYXZTdGF0ZTtcclxuICAgIHRoaXMuY3VyVXNlciA9IHRoaXMudXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy50aWNrZXRTZXJ2aWNlLmdldFRpY2tldHMoKS50aGVuKFxyXG4gICAgICAoZGF0YSkgPT4gdGhpcy5kaXNwbGF5VGlja2V0cyhkYXRhKSwgXHJcbiAgICAgIChlcnJvcikgPT4gdGhpcy5kaXNwbGF5VGlja2V0cyhmYWxzZSlcclxuICAgICkudGhlbigoKSA9PiB7XHJcbiAgICAgIHRoaXMudGlja2V0Rm9yRGV0YWlsID0gbmV3IEFycmF5PEJvb2xlYW4+KHRoaXMudGlja2V0cy5sZW5ndGgpO1xyXG4gICAgICB0aGlzLnRpY2tldHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIHRoaXMudGlja2V0Rm9yRGV0YWlsW2VsZW1lbnQuaWRdID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnVzZXJTZXJ2aWNlLmdldFByb2plY3RzKClcclxuICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0TGlzdCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgICAgZGF0YS5wcm9qZWN0cy5mb3JFYWNoKChwcm9qZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb2plY3QubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdElkc1t0aGlzLnByb2plY3RMaXN0LnB1c2gocHJvamVjdC5uYW1lKS0xXSA9IHByb2plY3QuaWQ7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgdGhpcy5wYWdlLmNzcyA9IFwiUGFnZSB7IGJhY2tncm91bmQtY29sb3I6ICNFQ0VERUU7IH0gLnBhZ2UgeyBwYWRkaW5nLWxlZnQ6IDIwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjRUNFREVFO31cIjtcclxuICB9XHJcblxyXG4gIGV4cGFuZChpZCA6c3RyaW5nKXtcclxuICAgIHRoaXMudGlja2V0Rm9yRGV0YWlsW2lkXSA9ICF0aGlzLnRpY2tldEZvckRldGFpbFtpZF07XHJcbiAgfVxyXG5cclxuXHJcbiAgZGlzcGxheVRpY2tldHMoZGF0YSA6YW55KXtcclxuXHJcbiAgICBpZihkYXRhKXtcclxuICAgICAgdGhpcy50aWNrZXRTZXJ2aWNlLnNhdmVUaWNrZXRzKGRhdGEpO1xyXG4gICAgICB0aGlzLnRpY2tldHMgPSBkYXRhLnRpY2tldHM7XHJcblxyXG4gICAgfWVsc2V7XHJcblxyXG4gICAgICBkYXRhID0gdGhpcy50aWNrZXRTZXJ2aWNlLmdldFNhdmVkVGlja2V0cygpXHJcbiAgICAgIHRoaXMudGlja2V0cyA9IGRhdGEudGlja2V0cztcclxuICAgICAgXHJcbiAgICB9XHJcbiAgICB0aGlzLnRpY2tldHMuZm9yRWFjaCgodGlja2V0KSA9PiB7XHJcbiAgICAgIGlmKHRpY2tldC5jb21wbGV0ZWQpe1xyXG4gICAgICAgICAgdGhpcy50aWNrZXRzLnNwbGljZSh0aGlzLnRpY2tldHMuaW5kZXhPZih0aWNrZXQpLCAxKVxyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnVzZXJTZXJ2aWNlLmdldFNpbmdsZVByb2plY3QodGlja2V0LnByb2plY3QpXHJcbiAgICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgdGlja2V0LnByb2plY3QgPSBkYXRhLnByb2plY3RzWzBdLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgIHRpY2tldC5jb2xvciA9IGRhdGEucHJvamVjdHNbMF0uY29sb3I7XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRpY2tldHMuc29ydCgoYSwgYikgPT4gYS5wcmlvcml0eS1iLnByaW9yaXR5KTtcclxuICB9XHJcblxyXG4gIGNyX3RpY2tldCgpIHtcclxuICAgIHRoaXMuY3JlYXRlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnBhZ2UuY3NzID0gXCJQYWdlIHsgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjsgfSAucGFnZSB7IHBhZGRpbmctbGVmdDogMDsgcGFkZGluZzoyMDsgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjt9XCI7XHJcbiAgfVxyXG5cclxuICBjYW5jZWwoKSB7XHJcbiAgICB0aGlzLmNyZWF0ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5wYWdlLmNzcyA9IFwiUGFnZSB7IGJhY2tncm91bmQtY29sb3I6ICNFQ0VERUU7IH0gLnBhZ2UgeyBwYWRkaW5nLWxlZnQ6IDEwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjRUNFREVFO31cIjtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVRpY2tldCgpIHtcclxuICAgICAgdGhpcy50aWNrZXRTZXJ2aWNlLmNyZWF0ZVRpY2tldCh0aGlzLm5ld1RpY2tldClcclxuICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7dGhpcy5uZXdUaWNrZXQuaWQgPSBkYXRhLnRpY2tldC5pZDt0aGlzLnRpY2tldFNlcnZpY2UudXBkYXRlVGlja2V0KHRoaXMubmV3VGlja2V0KS50aGVuKChkYXRhKSA9PiB7dGhpcy5uZ09uSW5pdCgpfSl9KVxyXG4gICAgICBhbGVydChcIlRpY2tldCBlcnN0ZWxsdFwiKTtcclxuICAgICAgdGhpcy5jcmVhdGUgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gICAgZ2V0VXNlcnMoYXJnczogU2VsZWN0ZWRJbmRleENoYW5nZWRFdmVudERhdGEpe1xyXG4gICAgICAgIHRoaXMubmV3VGlja2V0LnByb2plY3QgPSB0aGlzLnByb2plY3RJZHNbYXJncy5uZXdJbmRleF07XHJcbiAgICAgICAgdGhpcy51c2VyU2VydmljZS5nZXRTaW5nbGVQcm9qZWN0KHRoaXMubmV3VGlja2V0LnByb2plY3QpXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJTZWxlY3Rpb24gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEudXNlcnMuZm9yRWFjaCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyLmZpcnN0X25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJJZHNbdGhpcy51c2VyU2VsZWN0aW9uLnB1c2godXNlci5maXJzdF9uYW1lICsgXCIgXCIgKyB1c2VyLmxhc3RfbmFtZSktMV0gPSB1c2VyLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge30pXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0VXNlcihhcmdzOiBTZWxlY3RlZEluZGV4Q2hhbmdlZEV2ZW50RGF0YSl7XHJcbiAgICAgICAgdGhpcy5uZXdUaWNrZXQucmVzcG9uc2libGUgPSB0aGlzLnVzZXJJZHNbYXJncy5uZXdJbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlVGlja2V0KHRfaWQgOnN0cmluZyl7XHJcbiAgICAgIHRoaXMudGlja2V0U2VydmljZS5kZWxldGVUaWNrZXQodF9pZCkudGhlbigoKSA9PiB7YWxlcnQoXCJUaWNrZXQgZXJmb2xncmVpY2ggZ2Vsw7ZzY2h0IVwiKTt0aGlzLm5nT25Jbml0KCl9KTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5pc2hlZCh0IDpUaWNrZXQpe1xyXG4gICAgICAgIHQuY29tcGxldGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRpY2tldFNlcnZpY2UudXBkYXRlVGlja2V0KHQpLnRoZW4oKGRhdGEpID0+IHt0aGlzLm5nT25Jbml0KCk7YWxlcnQoXCJUaWNrZXQgZXJmb2xncmVpY2ggYWJnZXNjaGxvc3NlbiFcIil9KTtcclxuICAgIH1cclxuXHJcbiAgICBnb1RvRGV0YWlsKHRfaWQgOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInRpY2tldF9kZXRhaWwvXCIgKyB0X2lkXSwge1xyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlVG9wXCIsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJlYXNlT3V0XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==