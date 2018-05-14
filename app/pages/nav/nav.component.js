"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_service_1 = require("../../shared/user/user.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
require("rxjs/add/operator/switchMap");
var angular_1 = require("nativescript-pro-ui/sidedrawer/angular");
var user_1 = require("../../shared/user/user");
var app_routing_1 = require("../../app.routing");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var status_service_1 = require("../../shared/status/status.service");
var config_1 = require("../../shared/config");
var NavComponent = (function () {
    function NavComponent(router, routerExtensions, statusService, userService, fonticon, _changeDetectionRef) {
        this.router = router;
        this.routerExtensions = routerExtensions;
        this.statusService = statusService;
        this.userService = userService;
        this.fonticon = fonticon;
        this._changeDetectionRef = _changeDetectionRef;
        this.curUser = new user_1.User;
        this.appState = 'dashboard';
        this.curUser = this.userService.getCurrentUser();
        this.avatar = config_1.Config.apiUrl + "v2/user/avatar/" + this.curUser.avatar + "?access_token=" + config_1.Config.token;
        this.offlinemode = this.statusService.getOfflineMode();
    }
    NavComponent_1 = NavComponent;
    NavComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getFiles().then(function (data) { return _this.displayFiles(data); }, function (error) { return _this.displayFiles(false); });
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    };
    NavComponent.prototype.displayFiles = function (data) {
        if (data) {
            this.userFiles = data.files;
        }
        else {
            data = this.userService.getSavedFiles();
            this.userFiles = data.files;
        }
    };
    NavComponent.prototype.logout = function () {
        this.drawer.closeDrawer();
        this.routerExtensions.navigate(["/login"], {
            animated: true,
            transition: {
                name: "slide",
                curve: "easeOut"
            }
        });
    };
    NavComponent.prototype.state = function (view) {
        this.appState = view + '';
        this.onCloseDrawerTap();
    };
    NavComponent.prototype.ngAfterViewInit = function () {
        /*this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();*/
    };
    NavComponent.prototype.openDrawer = function () {
        this.drawer.showDrawer();
    };
    NavComponent.prototype.onCloseDrawerTap = function () {
        this.drawer.closeDrawer();
    };
    __decorate([
        core_1.ViewChild(angular_1.RadSideDrawerComponent),
        __metadata("design:type", angular_1.RadSideDrawerComponent)
    ], NavComponent.prototype, "drawerComponent", void 0);
    NavComponent = NavComponent_1 = __decorate([
        core_1.Component({
            selector: "pb-nav",
            providers: [user_service_1.UserService, status_service_1.StatusService],
            templateUrl: "pages/nav/nav.html",
            styleUrls: ["pages/nav/nav-common.css"]
        }),
        core_1.NgModule({
            bootstrap: [NavComponent_1],
            imports: [
                router_2.NativeScriptRouterModule,
                router_2.NativeScriptRouterModule.forRoot(app_routing_1.routes)
            ],
            providers: [user_service_1.UserService]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            router_2.RouterExtensions,
            status_service_1.StatusService,
            user_service_1.UserService,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            core_1.ChangeDetectorRef])
    ], NavComponent);
    return NavComponent;
    var NavComponent_1;
}());
exports.NavComponent = NavComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5hdi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUc7QUFDekcsK0RBQTZEO0FBQzdELDBDQUF5RjtBQUN6RixzREFBeUY7QUFFekYsdUNBQXFDO0FBQ3JDLGtFQUFnRztBQUVoRywrQ0FBOEM7QUFFOUMsaURBQTJDO0FBTTNDLHVFQUErRDtBQUMvRCxxRUFBbUU7QUFDbkUsOENBQTJDO0FBbUIzQztJQVFFLHNCQUVVLE1BQWMsRUFDZCxnQkFBa0MsRUFDbEMsYUFBNEIsRUFDNUIsV0FBd0IsRUFDeEIsUUFBNEIsRUFDNUIsbUJBQXNDO1FBTHRDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBbUI7UUFiaEQsWUFBTyxHQUFTLElBQUksV0FBSSxDQUFDO1FBR3pCLGFBQVEsR0FBVyxXQUFXLENBQUM7UUFjN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3RHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUUzRCxDQUFDO3FCQXZCVSxZQUFZO0lBeUJoQiwrQkFBUSxHQUFmO1FBQUEsaUJBUUM7UUFQQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FDOUIsVUFBQyxJQUFJLElBQUssT0FBQSxLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUF2QixDQUF1QixFQUNqQyxVQUFDLEtBQUssSUFBSyxPQUFBLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQXhCLENBQXdCLENBQ3BDLENBQUM7UUFFQSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDO1FBQzlDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsbUNBQVksR0FBWixVQUFhLElBQVM7UUFDcEIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQztZQUNQLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM5QixDQUFDO1FBQUEsSUFBSSxDQUFBLENBQUM7WUFDSixJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDOUIsQ0FBQztJQUNILENBQUM7SUFFRCw2QkFBTSxHQUFOO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDekMsUUFBUSxFQUFDLElBQUk7WUFDYixVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsS0FBSyxFQUFFLFNBQVM7YUFDakI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsNEJBQUssR0FBTCxVQUFNLElBQUk7UUFDUixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUtDLHNDQUFlLEdBQWY7UUFDSTttREFDMkM7SUFDL0MsQ0FBQztJQUVNLGlDQUFVLEdBQWpCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRU0sdUNBQWdCLEdBQXZCO1FBQ0csSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBZDhCO1FBQWxDLGdCQUFTLENBQUMsZ0NBQXNCLENBQUM7a0NBQXlCLGdDQUFzQjt5REFBQztJQTVEckUsWUFBWTtRQWpCeEIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFNBQVMsRUFBRSxDQUFDLDBCQUFXLEVBQUUsOEJBQWEsQ0FBQztZQUN2QyxXQUFXLEVBQUUsb0JBQW9CO1lBQ2pDLFNBQVMsRUFBRSxDQUFDLDBCQUEwQixDQUFDO1NBQ3hDLENBQUM7UUFHRCxlQUFRLENBQUM7WUFDUixTQUFTLEVBQUUsQ0FBQyxjQUFZLENBQUM7WUFDekIsT0FBTyxFQUFFO2dCQUNMLGlDQUF3QjtnQkFDeEIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLG9CQUFNLENBQUM7YUFDM0M7WUFDRCxTQUFTLEVBQUUsQ0FBQywwQkFBVyxDQUFDO1NBQ3pCLENBQUM7eUNBWWtCLGVBQU07WUFDSSx5QkFBZ0I7WUFDbkIsOEJBQWE7WUFDZiwwQkFBVztZQUNkLDhDQUFrQjtZQUNQLHdCQUFpQjtPQWZyQyxZQUFZLENBMkV4QjtJQUFELG1CQUFDOztDQUFBLEFBM0VELElBMkVDO0FBM0VZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBWaWV3Q2hpbGQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlci5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IFJvdXRlciwgQWN0aXZhdGVkUm91dGUsIE5hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvbkVuZCB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucywgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBQcm9qZWN0LCBQaXZvdCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXNlci9wcm9qZWN0XCI7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL3N3aXRjaE1hcFwiO1xyXG5pbXBvcnQgeyBSYWRTaWRlRHJhd2VyQ29tcG9uZW50LCBTaWRlRHJhd2VyVHlwZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL3NpZGVkcmF3ZXIvYW5ndWxhclwiO1xyXG5pbXBvcnQgeyBSYWRTaWRlRHJhd2VyIH0gZnJvbSAnbmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXNlci91c2VyXCI7XHJcbmltcG9ydCB7IHBsYXRmb3JtTmF0aXZlU2NyaXB0RHluYW1pYyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9wbGF0Zm9ybVwiO1xyXG5pbXBvcnQgeyByb3V0ZXMgfSBmcm9tIFwiLi4vLi4vYXBwLnJvdXRpbmdcIjtcclxuaW1wb3J0IHsgRGFzaGJvYXJkQ29tcG9uZW50IH0gZnJvbSBcIi4uL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFRvZG9Db21wb25lbnQgfSBmcm9tIFwiLi4vdG9kby90b2RvLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBUaWNrZXRDb21wb25lbnQgfSBmcm9tIFwiLi4vdGlja2V0L3RpY2tldC5jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgTmF2TW9kdWxlIH0gZnJvbSBcIi4vbmF2Lm1vZHVsZVwiO1xyXG5pbXBvcnQgeyBGaWxlT2JqZWN0IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91c2VyL2ZpbGVPYmplY3RcIlxyXG5pbXBvcnQgeyBUTlNGb250SWNvblNlcnZpY2UgfSBmcm9tICduYXRpdmVzY3JpcHQtbmd4LWZvbnRpY29uJztcclxuaW1wb3J0IHsgU3RhdHVzU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc3RhdHVzL3N0YXR1cy5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7Q29uZmlnfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbmZpZ1wiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwicGItbmF2XCIsXHJcbiAgcHJvdmlkZXJzOiBbVXNlclNlcnZpY2UsIFN0YXR1c1NlcnZpY2VdLFxyXG4gIHRlbXBsYXRlVXJsOiBcInBhZ2VzL25hdi9uYXYuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wicGFnZXMvbmF2L25hdi1jb21tb24uY3NzXCJdXHJcbn0pXHJcblxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBib290c3RyYXA6IFtOYXZDb21wb25lbnRdLFxyXG4gIGltcG9ydHM6IFtcclxuICAgICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxyXG4gICAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUuZm9yUm9vdChyb3V0ZXMpXHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtVc2VyU2VydmljZV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBOYXZDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkluaXQge1xyXG5cclxuICBjdXJVc2VyIDpVc2VyID0gbmV3IFVzZXI7XHJcbiAgdXNlckZpbGVzIDpGaWxlT2JqZWN0W107XHJcbiAgYXZhdGFyIDpzdHJpbmc7XHJcbiAgYXBwU3RhdGUgOnN0cmluZyA9ICdkYXNoYm9hcmQnO1xyXG4gICAgcHVibGljIG9mZmxpbmVtb2RlIDpib29sZWFuO1xyXG5cclxuICBjb25zdHJ1Y3RvclxyXG4gIChcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXHJcbiAgICBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsXHJcbiAgICBwcml2YXRlIHN0YXR1c1NlcnZpY2UgOlN0YXR1c1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdGlvblJlZjogQ2hhbmdlRGV0ZWN0b3JSZWZcclxuICApXHJcbiAge1xyXG5cclxuICAgIHRoaXMuY3VyVXNlciA9IHRoaXMudXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgIHRoaXMuYXZhdGFyID0gQ29uZmlnLmFwaVVybCArIFwidjIvdXNlci9hdmF0YXIvXCIgKyB0aGlzLmN1clVzZXIuYXZhdGFyICsgXCI/YWNjZXNzX3Rva2VuPVwiICsgQ29uZmlnLnRva2VuO1xyXG4gICAgICB0aGlzLm9mZmxpbmVtb2RlID0gdGhpcy5zdGF0dXNTZXJ2aWNlLmdldE9mZmxpbmVNb2RlKCk7XHJcblxyXG4gIH1cclxuICBcclxuICBwdWJsaWMgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlLmdldEZpbGVzKCkudGhlbihcclxuICAgICAgKGRhdGEpID0+IHRoaXMuZGlzcGxheUZpbGVzKGRhdGEpLFxyXG4gICAgICAoZXJyb3IpID0+IHRoaXMuZGlzcGxheUZpbGVzKGZhbHNlKVxyXG4gICAgKTtcclxuXHJcbiAgICAgIHRoaXMuZHJhd2VyID0gdGhpcy5kcmF3ZXJDb21wb25lbnQuc2lkZURyYXdlcjtcclxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0aW9uUmVmLmRldGVjdENoYW5nZXMoKTtcclxuICB9XHJcblxyXG4gIGRpc3BsYXlGaWxlcyhkYXRhIDphbnkpe1xyXG4gICAgaWYoZGF0YSl7XHJcbiAgICAgIHRoaXMudXNlckZpbGVzID0gZGF0YS5maWxlcztcclxuICAgIH1lbHNle1xyXG4gICAgICBkYXRhID0gdGhpcy51c2VyU2VydmljZS5nZXRTYXZlZEZpbGVzKCk7XHJcbiAgICAgIHRoaXMudXNlckZpbGVzID0gZGF0YS5maWxlcztcclxuICAgIH1cclxuICB9XHJcbiAgICAgIFxyXG4gIGxvZ291dCgpe1xyXG4gICAgdGhpcy5kcmF3ZXIuY2xvc2VEcmF3ZXIoKTtcclxuICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCIvbG9naW5cIl0sIHtcclxuICAgICAgYW5pbWF0ZWQ6dHJ1ZSxcclxuICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICBjdXJ2ZTogXCJlYXNlT3V0XCJcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzdGF0ZSh2aWV3KSB7XHJcbiAgICB0aGlzLmFwcFN0YXRlID0gdmlldyArICcnO1xyXG4gICAgdGhpcy5vbkNsb3NlRHJhd2VyVGFwKCk7XHJcbiAgfVxyXG5cclxuQFZpZXdDaGlsZChSYWRTaWRlRHJhd2VyQ29tcG9uZW50KSBwdWJsaWMgZHJhd2VyQ29tcG9uZW50OiBSYWRTaWRlRHJhd2VyQ29tcG9uZW50O1xyXG4gICAgcHJpdmF0ZSBkcmF3ZXI6IFJhZFNpZGVEcmF3ZXI7XHJcblxyXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgICAgIC8qdGhpcy5kcmF3ZXIgPSB0aGlzLmRyYXdlckNvbXBvbmVudC5zaWRlRHJhd2VyO1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdGlvblJlZi5kZXRlY3RDaGFuZ2VzKCk7Ki9cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3BlbkRyYXdlcigpIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5zaG93RHJhd2VyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQ2xvc2VEcmF3ZXJUYXAoKSB7XHJcbiAgICAgICB0aGlzLmRyYXdlci5jbG9zZURyYXdlcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=