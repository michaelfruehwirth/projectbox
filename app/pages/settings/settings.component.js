"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var application_settings_1 = require("application-settings");
var nav_component_1 = require("../nav/nav.component");
var SettingsComponent = (function () {
    function SettingsComponent(router, routerExtensions, activatedRoute, page, fonticon, _changeDetectionRef, navState) {
        this.router = router;
        this.routerExtensions = routerExtensions;
        this.activatedRoute = activatedRoute;
        this.page = page;
        this.fonticon = fonticon;
        this._changeDetectionRef = _changeDetectionRef;
        this.navState = navState;
        this.nav = navState;
    }
    SettingsComponent.prototype.ngOnInit = function () {
        this.offlineData = application_settings_1.getBoolean("enableOffline") ? true : false;
        this.actualOfflinesave = false;
        this.tutorial = application_settings_1.getBoolean("enableTutorial") ? true : false;
        this.actualsaveTutorial = false;
    };
    SettingsComponent.prototype.toggleOffline = function () {
        this.actualOfflinesave = !this.actualOfflinesave;
        application_settings_1.setBoolean("enableOffline", this.actualOfflinesave);
    };
    SettingsComponent.prototype.toggleTutorial = function () {
        this.actualsaveTutorial = !this.actualsaveTutorial;
        application_settings_1.setBoolean("enableTutorial", this.actualsaveTutorial);
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'pb-setting',
            templateUrl: 'pages/settings/settings.html'
        }),
        __metadata("design:paramtypes", [router_1.Router,
            router_2.RouterExtensions,
            router_1.ActivatedRoute,
            page_1.Page,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            core_1.ChangeDetectorRef,
            nav_component_1.NavComponent])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dGluZ3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQStGO0FBQy9GLDBDQUF5RDtBQUN6RCxzREFBK0Q7QUFDL0QsZ0NBQStCO0FBRS9CLHVFQUErRDtBQUMvRCw2REFBOEQ7QUFDOUQsc0RBQWtEO0FBTWxEO0lBT0csMkJBRVMsTUFBYyxFQUNkLGdCQUFrQyxFQUNsQyxjQUE4QixFQUM5QixJQUFVLEVBQ1YsUUFBNEIsRUFDNUIsbUJBQXNDLEVBQ3RDLFFBQXNCO1FBTnRCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1YsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFtQjtRQUN0QyxhQUFRLEdBQVIsUUFBUSxDQUFjO1FBRzlCLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxvQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxpQ0FBVSxDQUFDLGVBQWUsQ0FBQyxHQUFDLElBQUksR0FBQyxLQUFLLENBQUM7UUFDMUQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLGlDQUFVLENBQUMsZ0JBQWdCLENBQUMsR0FBQyxJQUFJLEdBQUMsS0FBSyxDQUFDO1FBQ3hELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFDbEMsQ0FBQztJQUVELHlDQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDakQsaUNBQVUsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELDBDQUFjLEdBQWQ7UUFDRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7UUFDbkQsaUNBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBcENVLGlCQUFpQjtRQUo3QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsV0FBVyxFQUFFLDhCQUE4QjtTQUM1QyxDQUFDO3lDQVVrQixlQUFNO1lBQ0kseUJBQWdCO1lBQ2xCLHVCQUFjO1lBQ3hCLFdBQUk7WUFDQSw4Q0FBa0I7WUFDUCx3QkFBaUI7WUFDNUIsNEJBQVk7T0FmckIsaUJBQWlCLENBc0M3QjtJQUFELHdCQUFDO0NBQUEsQUF0Q0QsSUFzQ0M7QUF0Q1ksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBWaWV3Q2hpbGQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0ICogYXMgRnJhbWVNb2R1bGUgZnJvbSBcInVpL2ZyYW1lXCI7XHJcbmltcG9ydCB7IFROU0ZvbnRJY29uU2VydmljZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5pbXBvcnQgeyBnZXRCb29sZWFuLCBzZXRCb29sZWFuIH0gZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCB7TmF2Q29tcG9uZW50fSBmcm9tIFwiLi4vbmF2L25hdi5jb21wb25lbnRcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAncGItc2V0dGluZycsXHJcbiAgdGVtcGxhdGVVcmw6ICdwYWdlcy9zZXR0aW5ncy9zZXR0aW5ncy5odG1sJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXR7XHJcbiAgb2ZmbGluZURhdGE6IGJvb2xlYW47XHJcbiAgYWN0dWFsT2ZmbGluZXNhdmUgOmJvb2xlYW47XHJcbiAgdHV0b3JpYWwgOmJvb2xlYW47XHJcbiAgYWN0dWFsc2F2ZVR1dG9yaWFsIDpib29sZWFuO1xyXG4gIG5hdiA6TmF2Q29tcG9uZW50O1xyXG5cclxuICAgY29uc3RydWN0b3JcclxuICAoXHJcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxyXG4gICAgcHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLFxyXG4gICAgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUsXHJcbiAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsXHJcbiAgICBwcml2YXRlIGZvbnRpY29uOiBUTlNGb250SWNvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3Rpb25SZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgcHJpdmF0ZSBuYXZTdGF0ZTogTmF2Q29tcG9uZW50XHJcbiAgICApXHJcbiAge1xyXG4gICAgdGhpcy5uYXYgPSBuYXZTdGF0ZTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCl7XHJcbiAgICB0aGlzLm9mZmxpbmVEYXRhID0gZ2V0Qm9vbGVhbihcImVuYWJsZU9mZmxpbmVcIik/dHJ1ZTpmYWxzZTtcclxuICAgIHRoaXMuYWN0dWFsT2ZmbGluZXNhdmUgPSBmYWxzZTtcclxuICAgIHRoaXMudHV0b3JpYWwgPSBnZXRCb29sZWFuKFwiZW5hYmxlVHV0b3JpYWxcIik/dHJ1ZTpmYWxzZTtcclxuICAgIHRoaXMuYWN0dWFsc2F2ZVR1dG9yaWFsID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVPZmZsaW5lKCl7XHJcbiAgICB0aGlzLmFjdHVhbE9mZmxpbmVzYXZlID0gIXRoaXMuYWN0dWFsT2ZmbGluZXNhdmU7XHJcbiAgICBzZXRCb29sZWFuKFwiZW5hYmxlT2ZmbGluZVwiLCB0aGlzLmFjdHVhbE9mZmxpbmVzYXZlKTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZVR1dG9yaWFsKCl7XHJcbiAgICB0aGlzLmFjdHVhbHNhdmVUdXRvcmlhbCA9ICF0aGlzLmFjdHVhbHNhdmVUdXRvcmlhbDtcclxuICAgIHNldEJvb2xlYW4oXCJlbmFibGVUdXRvcmlhbFwiLCB0aGlzLmFjdHVhbHNhdmVUdXRvcmlhbCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=