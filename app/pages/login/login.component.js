"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var userLogin_1 = require("../../shared/user/userLogin");
var user_service_1 = require("../../shared/user/user.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var application_settings_1 = require("application-settings");
var status_service_1 = require("../../shared/status/status.service");
var enums_1 = require("ui/enums");
var nativescript_ng_shadow_1 = require("nativescript-ng-shadow");
var utilityModule = require("utils/utils");
var LoginComponent = (function () {
    function LoginComponent(router, routerExtensions, activatedRoute, userService, statusService, page) {
        this.router = router;
        this.routerExtensions = routerExtensions;
        this.activatedRoute = activatedRoute;
        this.userService = userService;
        this.statusService = statusService;
        this.page = page;
        this.wrongcredentials = false;
        this.boxIsUp = false;
        this.fabShadowA = {
            elevation: nativescript_ng_shadow_1.Elevation.CARD_PICKED_UP,
        };
        this.fabShadowI = {
            elevation: nativescript_ng_shadow_1.Elevation.CARD_PICKED_UP,
        };
        this.user = new userLogin_1.UserLogin();
        //this.user.email = "rommelt.pineda@htl.rennweg.at";
        //this.user.password = "rommelt.pineda";
        //this.user.email = "michael.fruehwirth@htl.rennweg.at";
        //this.user.password = "michael1234";
        this.user.email = "manuel.gafoz@htl.rennweg.at";
        this.user.password = "manuel1999";
        page.actionBarHidden = true;
        // instantiate the plugin
        //let appShortcuts = new AppShortcuts();
        /*
            appShortcuts.available().then(available => {
            if (available) {
                console.log("This device supports app shortcuts");
            } else {
                //console.log("No app shortcuts capability, ask the user to upgrade :)");
            }
            });
        
            appShortcuts.configureQuickActions([
                {
                    type: "dashboard",
                    title: "Dashboard",
                    //subtitle: "Gelange zum Dashboard", // iOS only
                    iconTemplate: "dashboard" // ignored by iOS, if iconType is set as well
                },
                {
                    type: "task",
                    title: "Tasks",
                    //subtitle: "Übersicht aller Tasks", // iOS only
                    iconTemplate: "task" // ignored by iOS, if iconType is set as well
                },
                {
                    type: "meeting",
                    title: "Meetings",
                    //subtitle: "Übersicht aller Meetings", // iOS only
                    iconTemplate: "meeting" // ignored by iOS, if iconType is set as well
                },
                {
                    type: "ticket",
                    title: "Tickets",
                    //subtitle: "Liste der Tickets", // iOS only
                    iconTemplate: "bug"
                },
                {
                    type: "seeting",
                    title: "Einstellungen",
                    //subtitle: "Ändere dein Profil", // iOS only
                    iconTemplate: "setting"
                },
                ]).then(() => {
                    alert("Added 2 actions, close the app and apply pressure to the app icon to check it out!");
                }, (errorMessage) => {
                    alert(errorMessage);
                });
        
        */
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.box = this.grid.nativeElement;
        this.box.animate({
            translate: { x: 0, y: 0 },
            duration: 0,
        });
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.userService.login(this.user)
            .subscribe(function (data) { return _this.loginProceed(); }, function (error) { return _this.offlineLogin(error); });
    };
    LoginComponent.prototype.offlineLogin = function (valid) {
        if (valid === "403") {
            this.wrongcredentials = true;
            alert("E-Mail-Addresse oder Passwort falsch");
        }
        else {
            if (this.statusService.getWasLoggedIn()) {
                if (application_settings_1.getBoolean("enableOffline")) {
                    this.statusService.setOfflineMode(true);
                    this.keyboardOff();
                    this.wrongcredentials = false;
                    //this.navigatetonav();
                    this.checkSettings();
                }
                else {
                    this.keyboardOff();
                    alert("Internetverbindung nicht vorhanden oder Offline-Verfügbarkeit einstellen");
                }
            }
            else {
                alert("Der erste Login benötigt eine aktive Internetverbindung");
            }
        }
    };
    /*navigatetonav() {
        this.routerExtensions.navigate(["/nav"], {
            transition: {
                name: "slide",
                curve: "easeOut"
            }
        })
    }*/
    LoginComponent.prototype.loginProceed = function () {
        this.keyboardOff();
        this.wrongcredentials = false;
        this.statusService.loggedIn();
        this.statusService.setOfflineMode(false);
        this.checkSettings();
        //this.navigatetonav();
        /*this.routerExtensions.navigate(["/nav"], {
          transition: {
              name: "slide",
              curve: "easeOut"
          }
        })*/
    };
    LoginComponent.prototype.keyboardOn = function () {
        this.box = this.grid.nativeElement;
        this.box.animate({
            translate: { x: 0, y: -300 },
            duration: 750,
            curve: enums_1.AnimationCurve.easeOut
        });
    };
    LoginComponent.prototype.keyboardOff = function () {
        var usrTF = this.userNameTextField.nativeElement;
        var pswTF = this.passWordTextField.nativeElement;
        usrTF.dismissSoftInput();
        pswTF.dismissSoftInput();
        this.box = this.grid.nativeElement;
        this.box.animate({
            translate: { x: 0, y: 0 },
            duration: 0,
        });
    };
    LoginComponent.prototype.forgotPW = function () {
        utilityModule.openUrl("https://secure.projectbox.eu/#/email");
    };
    LoginComponent.prototype.checkSettings = function () {
        if (application_settings_1.getBoolean("enableTutorial")) {
            this.routerExtensions.navigate(["/tutorial"], {
                transition: {
                    name: "slide",
                    curve: "easeOut"
                }
            });
        }
        else {
            this.routerExtensions.navigate(["/nav"], {
                transition: {
                    name: "slide",
                    curve: "easeOut"
                }
            });
        }
    };
    __decorate([
        core_1.ViewChild("box"),
        __metadata("design:type", core_1.ElementRef)
    ], LoginComponent.prototype, "grid", void 0);
    __decorate([
        core_1.ViewChild("usrn"),
        __metadata("design:type", core_1.ElementRef)
    ], LoginComponent.prototype, "userNameTextField", void 0);
    __decorate([
        core_1.ViewChild("pass"),
        __metadata("design:type", core_1.ElementRef)
    ], LoginComponent.prototype, "passWordTextField", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            selector: "pb-login",
            providers: [user_service_1.UserService, status_service_1.StatusService],
            templateUrl: "pages/login/login.html",
            styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            router_2.RouterExtensions,
            router_1.ActivatedRoute,
            user_service_1.UserService,
            status_service_1.StatusService,
            page_1.Page])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWlFO0FBQ2pFLHlEQUF3RDtBQUN4RCwrREFBNkQ7QUFDN0QsMENBQXlEO0FBQ3pELHNEQUErRDtBQUMvRCxnQ0FBK0I7QUFDL0IsNkRBQThEO0FBSTlELHFFQUFrRTtBQUNsRSxrQ0FBd0M7QUFLeEMsaUVBQXlFO0FBQ3pFLDJDQUE4QztBQVM5QztJQWdCRSx3QkFFVSxNQUFjLEVBQ2QsZ0JBQWtDLEVBQ2xDLGNBQThCLEVBQzlCLFdBQXdCLEVBQ3hCLGFBQTRCLEVBQzVCLElBQVU7UUFMVixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQWpCcEIscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBRWxDLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFDekIsZUFBVSxHQUFnQjtZQUN4QixTQUFTLEVBQUUsa0NBQVMsQ0FBQyxjQUFjO1NBQ3BDLENBQUM7UUFDRixlQUFVLEdBQVk7WUFDcEIsU0FBUyxFQUFFLGtDQUFTLENBQUMsY0FBYztTQUNwQyxDQUFDO1FBWUEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztRQUM1QixvREFBb0Q7UUFDcEQsd0NBQXdDO1FBQ3hDLHdEQUF3RDtRQUN4RCxxQ0FBcUM7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsNkJBQTZCLENBQUM7UUFDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBRTVCLHlCQUF5QjtRQUN6Qix3Q0FBd0M7UUFDNUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUE4Q0U7SUFDQSxDQUFDO0lBRUQsaUNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDZixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUM7WUFDckIsUUFBUSxFQUFFLENBQUM7U0FDWixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsOEJBQUssR0FBTDtRQUFBLGlCQU1DO1FBTEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUM5QixTQUFTLENBQ1YsVUFBQyxJQUFJLElBQUssT0FBQSxLQUFJLENBQUMsWUFBWSxFQUFFLEVBQW5CLENBQW1CLEVBQzdCLFVBQUMsS0FBSyxJQUFLLE9BQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBeEIsQ0FBd0IsQ0FDbEMsQ0FBQztJQUNOLENBQUM7SUFFRCxxQ0FBWSxHQUFaLFVBQWEsS0FBVTtRQUVyQixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUEsQ0FBQztZQUNuQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQzdCLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFBQSxJQUFJLENBQUEsQ0FBQztZQUVKLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQSxDQUFDO2dCQUN0QyxFQUFFLENBQUEsQ0FBQyxpQ0FBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUEsQ0FBQztvQkFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3hDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztvQkFDOUIsdUJBQXVCO29CQUN2QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBQUEsSUFBSSxDQUFBLENBQUM7b0JBQ0osSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUNuQixLQUFLLENBQUMsMEVBQTBFLENBQUMsQ0FBQTtnQkFDbkYsQ0FBQztZQUNILENBQUM7WUFBQSxJQUFJLENBQUEsQ0FBQztnQkFDSixLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztZQUNuRSxDQUFDO1FBQ0gsQ0FBQztJQUVILENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBRUgscUNBQVksR0FBWjtRQUVFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQzlCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLHVCQUF1QjtRQUN2Qjs7Ozs7WUFLSTtJQUNOLENBQUM7SUFFRCxtQ0FBVSxHQUFWO1FBQ0UsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUNmLFNBQVMsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsR0FBRyxFQUFDO1lBQ3hCLFFBQVEsRUFBRSxHQUFHO1lBQ2IsS0FBSyxFQUFFLHNCQUFjLENBQUMsT0FBTztTQUM5QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsb0NBQVcsR0FBWDtRQUNFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUM7UUFDakQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQztRQUNqRCxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QixLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQ2YsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDO1lBQ3JCLFFBQVEsRUFBRSxDQUFDO1NBQ1osQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGlDQUFRLEdBQVI7UUFDRSxhQUFhLENBQUMsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELHNDQUFhLEdBQWI7UUFDSSxFQUFFLENBQUEsQ0FBQyxpQ0FBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDMUMsVUFBVSxFQUFFO29CQUNSLElBQUksRUFBRSxPQUFPO29CQUNiLEtBQUssRUFBRSxTQUFTO2lCQUNuQjthQUNKLENBQUMsQ0FBQTtRQUNOLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDckMsVUFBVSxFQUFFO29CQUNSLElBQUksRUFBRSxPQUFPO29CQUNiLEtBQUssRUFBRSxTQUFTO2lCQUNuQjthQUNKLENBQUMsQ0FBQTtRQUNOLENBQUM7SUFDTCxDQUFDO0lBaE1pQjtRQUFqQixnQkFBUyxDQUFDLEtBQUssQ0FBQztrQ0FBTyxpQkFBVTtnREFBQztJQUNoQjtRQUFsQixnQkFBUyxDQUFDLE1BQU0sQ0FBQztrQ0FBb0IsaUJBQVU7NkRBQUM7SUFDOUI7UUFBbEIsZ0JBQVMsQ0FBQyxNQUFNLENBQUM7a0NBQW9CLGlCQUFVOzZEQUFDO0lBSHRDLGNBQWM7UUFOMUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxDQUFDLDBCQUFXLEVBQUUsOEJBQWEsQ0FBQztZQUN2QyxXQUFXLEVBQUUsd0JBQXdCO1lBQ3JDLFNBQVMsRUFBRSxDQUFDLDhCQUE4QixFQUFFLHVCQUF1QixDQUFDO1NBQ3JFLENBQUM7eUNBbUJrQixlQUFNO1lBQ0kseUJBQWdCO1lBQ2xCLHVCQUFjO1lBQ2pCLDBCQUFXO1lBQ1QsOEJBQWE7WUFDdEIsV0FBSTtPQXZCVCxjQUFjLENBbU0xQjtJQUFELHFCQUFDO0NBQUEsQUFuTUQsSUFtTUM7QUFuTVksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFVzZXJMb2dpbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXNlci91c2VyTG9naW5cIjtcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlci5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IFJvdXRlciwgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBnZXRCb29sZWFuLCBzZXRCb29sZWFuIH0gZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbi8vaW1wb3J0IHsgQXBwU2hvcnRjdXRzIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hcHAtc2hvcnRjdXRzXCI7IC8vM0QgLSBUb3VjaCBvbiBpT1NcclxuaW1wb3J0IHsgaXNJT1MgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xyXG5pbXBvcnQgeyBpc0FuZHJvaWQgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xyXG5pbXBvcnQgeyBTdGF0dXNTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zdGF0dXMvc3RhdHVzLnNlcnZpY2VcIlxyXG5pbXBvcnQge0FuaW1hdGlvbkN1cnZlfSBmcm9tIFwidWkvZW51bXNcIjtcclxuaW1wb3J0IG9ic2VydmFibGUgPSByZXF1aXJlKFwiZGF0YS9vYnNlcnZhYmxlXCIpO1xyXG5pbXBvcnQgdmlldyA9IHJlcXVpcmUoXCJ1aS9jb3JlL3ZpZXdcIik7XHJcbmltcG9ydCB7IFRleHRGaWVsZCB9IGZyb20gXCJ1aS90ZXh0LWZpZWxkXCI7XHJcbmltcG9ydCB7IEdyaWRMYXlvdXQgfSBmcm9tIFwidWkvbGF5b3V0cy9ncmlkLWxheW91dFwiO1xyXG5pbXBvcnQgeyBBbmRyb2lkRGF0YSwgSU9TRGF0YSwgRWxldmF0aW9uIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5nLXNoYWRvdyc7XHJcbmltcG9ydCB1dGlsaXR5TW9kdWxlID0gcmVxdWlyZShcInV0aWxzL3V0aWxzXCIpO1xyXG5pbXBvcnQgeyBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZS9zcmMvbWV0YWRhdGEvbGlmZWN5Y2xlX2hvb2tzXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJwYi1sb2dpblwiLFxyXG4gIHByb3ZpZGVyczogW1VzZXJTZXJ2aWNlLCBTdGF0dXNTZXJ2aWNlXSxcclxuICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9sb2dpbi9sb2dpbi5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCJwYWdlcy9sb2dpbi9sb2dpbi1jb21tb24uY3NzXCIsIFwicGFnZXMvbG9naW4vbG9naW4uY3NzXCJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMb2dpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdHtcclxuICBAVmlld0NoaWxkKFwiYm94XCIpIGdyaWQ6IEVsZW1lbnRSZWY7Ly9lbGVtZW50ZSBhdXMgZGVtIHZpZXcgc2VsZWN0aWVyZW4sIGRpZW50IHp1ciBhbmltYXRpb24gZGVyIGJveFxyXG4gIEBWaWV3Q2hpbGQoXCJ1c3JuXCIpIHVzZXJOYW1lVGV4dEZpZWxkOiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoXCJwYXNzXCIpIHBhc3NXb3JkVGV4dEZpZWxkOiBFbGVtZW50UmVmO1xyXG5cclxuICB1c2VyOiBVc2VyTG9naW47XHJcbiAgd3JvbmdjcmVkZW50aWFscyA6Ym9vbGVhbiA9IGZhbHNlO1xyXG4gIGJveCA6R3JpZExheW91dDtcclxuICBib3hJc1VwIDpib29sZWFuID0gZmFsc2U7XHJcbiAgZmFiU2hhZG93QTogQW5kcm9pZERhdGEgPSB7XHJcbiAgICBlbGV2YXRpb246IEVsZXZhdGlvbi5DQVJEX1BJQ0tFRF9VUCxcclxuICB9O1xyXG4gIGZhYlNoYWRvd0k6IElPU0RhdGEgPSB7XHJcbiAgICBlbGV2YXRpb246IEVsZXZhdGlvbi5DQVJEX1BJQ0tFRF9VUCxcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3RvclxyXG4gIChcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXHJcbiAgICBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsXHJcbiAgICBwcml2YXRlIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcclxuICAgIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBzdGF0dXNTZXJ2aWNlIDpTdGF0dXNTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG4gIClcclxuICB7XHJcbiAgICB0aGlzLnVzZXIgPSBuZXcgVXNlckxvZ2luKCk7XHJcbiAgICAvL3RoaXMudXNlci5lbWFpbCA9IFwicm9tbWVsdC5waW5lZGFAaHRsLnJlbm53ZWcuYXRcIjtcclxuICAgIC8vdGhpcy51c2VyLnBhc3N3b3JkID0gXCJyb21tZWx0LnBpbmVkYVwiO1xyXG4gICAgLy90aGlzLnVzZXIuZW1haWwgPSBcIm1pY2hhZWwuZnJ1ZWh3aXJ0aEBodGwucmVubndlZy5hdFwiO1xyXG4gICAgLy90aGlzLnVzZXIucGFzc3dvcmQgPSBcIm1pY2hhZWwxMjM0XCI7XHJcbiAgICB0aGlzLnVzZXIuZW1haWwgPSBcIm1hbnVlbC5nYWZvekBodGwucmVubndlZy5hdFwiO1xyXG4gICAgdGhpcy51c2VyLnBhc3N3b3JkID0gXCJtYW51ZWwxOTk5XCI7XHJcbiAgICBwYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XHJcblxyXG4gICAgLy8gaW5zdGFudGlhdGUgdGhlIHBsdWdpblxyXG4gICAgLy9sZXQgYXBwU2hvcnRjdXRzID0gbmV3IEFwcFNob3J0Y3V0cygpO1xyXG4vKlxyXG4gICAgYXBwU2hvcnRjdXRzLmF2YWlsYWJsZSgpLnRoZW4oYXZhaWxhYmxlID0+IHtcclxuICAgIGlmIChhdmFpbGFibGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRoaXMgZGV2aWNlIHN1cHBvcnRzIGFwcCBzaG9ydGN1dHNcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJObyBhcHAgc2hvcnRjdXRzIGNhcGFiaWxpdHksIGFzayB0aGUgdXNlciB0byB1cGdyYWRlIDopXCIpO1xyXG4gICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIFx0YXBwU2hvcnRjdXRzLmNvbmZpZ3VyZVF1aWNrQWN0aW9ucyhbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBcImRhc2hib2FyZFwiLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJEYXNoYm9hcmRcIixcclxuICAgICAgICAgICAgLy9zdWJ0aXRsZTogXCJHZWxhbmdlIHp1bSBEYXNoYm9hcmRcIiwgLy8gaU9TIG9ubHlcclxuICAgICAgICAgICAgaWNvblRlbXBsYXRlOiBcImRhc2hib2FyZFwiIC8vIGlnbm9yZWQgYnkgaU9TLCBpZiBpY29uVHlwZSBpcyBzZXQgYXMgd2VsbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBcInRhc2tcIixcclxuICAgICAgICAgICAgdGl0bGU6IFwiVGFza3NcIixcclxuICAgICAgICAgICAgLy9zdWJ0aXRsZTogXCLDnGJlcnNpY2h0IGFsbGVyIFRhc2tzXCIsIC8vIGlPUyBvbmx5XHJcbiAgICAgICAgICAgIGljb25UZW1wbGF0ZTogXCJ0YXNrXCIgLy8gaWdub3JlZCBieSBpT1MsIGlmIGljb25UeXBlIGlzIHNldCBhcyB3ZWxsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwibWVldGluZ1wiLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJNZWV0aW5nc1wiLFxyXG4gICAgICAgICAgICAvL3N1YnRpdGxlOiBcIsOcYmVyc2ljaHQgYWxsZXIgTWVldGluZ3NcIiwgLy8gaU9TIG9ubHlcclxuICAgICAgICAgICAgaWNvblRlbXBsYXRlOiBcIm1lZXRpbmdcIiAvLyBpZ25vcmVkIGJ5IGlPUywgaWYgaWNvblR5cGUgaXMgc2V0IGFzIHdlbGxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogXCJ0aWNrZXRcIixcclxuICAgICAgICAgICAgdGl0bGU6IFwiVGlja2V0c1wiLFxyXG4gICAgICAgICAgICAvL3N1YnRpdGxlOiBcIkxpc3RlIGRlciBUaWNrZXRzXCIsIC8vIGlPUyBvbmx5XHJcbiAgICAgICAgICAgIGljb25UZW1wbGF0ZTogXCJidWdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBcInNlZXRpbmdcIixcclxuICAgICAgICAgICAgdGl0bGU6IFwiRWluc3RlbGx1bmdlblwiLFxyXG4gICAgICAgICAgICAvL3N1YnRpdGxlOiBcIsOEbmRlcmUgZGVpbiBQcm9maWxcIiwgLy8gaU9TIG9ubHlcclxuICAgICAgICAgICAgaWNvblRlbXBsYXRlOiBcInNldHRpbmdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiQWRkZWQgMiBhY3Rpb25zLCBjbG9zZSB0aGUgYXBwIGFuZCBhcHBseSBwcmVzc3VyZSB0byB0aGUgYXBwIGljb24gdG8gY2hlY2sgaXQgb3V0IVwiKTtcclxuICAgICAgICB9LCAoZXJyb3JNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgICAgIGFsZXJ0KGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4qL1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmJveCA9IHRoaXMuZ3JpZC5uYXRpdmVFbGVtZW50O1xyXG4gICAgdGhpcy5ib3guYW5pbWF0ZSh7XHJcbiAgICAgIHRyYW5zbGF0ZToge3g6MCwgeTowfSxcclxuICAgICAgZHVyYXRpb246IDAsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxvZ2luKCkge1xyXG4gICAgdGhpcy51c2VyU2VydmljZS5sb2dpbih0aGlzLnVzZXIpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgIChkYXRhKSA9PiB0aGlzLmxvZ2luUHJvY2VlZCgpLFxyXG4gICAgICAoZXJyb3IpID0+IHRoaXMub2ZmbGluZUxvZ2luKGVycm9yKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgb2ZmbGluZUxvZ2luKHZhbGlkIDphbnkpe1xyXG5cclxuICAgIGlmICh2YWxpZCA9PT0gXCI0MDNcIil7XHJcbiAgICAgIHRoaXMud3JvbmdjcmVkZW50aWFscyA9IHRydWU7XHJcbiAgICAgIGFsZXJ0KFwiRS1NYWlsLUFkZHJlc3NlIG9kZXIgUGFzc3dvcnQgZmFsc2NoXCIpO1xyXG4gICAgfWVsc2V7XHJcblxyXG4gICAgICBpZih0aGlzLnN0YXR1c1NlcnZpY2UuZ2V0V2FzTG9nZ2VkSW4oKSl7XHJcbiAgICAgICAgaWYoZ2V0Qm9vbGVhbihcImVuYWJsZU9mZmxpbmVcIikpe1xyXG4gICAgICAgICAgdGhpcy5zdGF0dXNTZXJ2aWNlLnNldE9mZmxpbmVNb2RlKHRydWUpO1xyXG4gICAgICAgICAgdGhpcy5rZXlib2FyZE9mZigpO1xyXG4gICAgICAgICAgdGhpcy53cm9uZ2NyZWRlbnRpYWxzID0gZmFsc2U7XHJcbiAgICAgICAgICAvL3RoaXMubmF2aWdhdGV0b25hdigpO1xyXG4gICAgICAgICAgdGhpcy5jaGVja1NldHRpbmdzKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICB0aGlzLmtleWJvYXJkT2ZmKCk7XHJcbiAgICAgICAgICBhbGVydChcIkludGVybmV0dmVyYmluZHVuZyBuaWNodCB2b3JoYW5kZW4gb2RlciBPZmZsaW5lLVZlcmbDvGdiYXJrZWl0IGVpbnN0ZWxsZW5cIilcclxuICAgICAgICB9XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIGFsZXJ0KFwiRGVyIGVyc3RlIExvZ2luIGJlbsO2dGlndCBlaW5lIGFrdGl2ZSBJbnRlcm5ldHZlcmJpbmR1bmdcIik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvKm5hdmlnYXRldG9uYXYoKSB7XHJcbiAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCIvbmF2XCJdLCB7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgIGN1cnZlOiBcImVhc2VPdXRcIlxyXG4gICAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gIH0qL1xyXG5cclxuICBsb2dpblByb2NlZWQoKXtcclxuXHJcbiAgICB0aGlzLmtleWJvYXJkT2ZmKCk7XHJcbiAgICB0aGlzLndyb25nY3JlZGVudGlhbHMgPSBmYWxzZTtcclxuICAgIHRoaXMuc3RhdHVzU2VydmljZS5sb2dnZWRJbigpO1xyXG4gICAgdGhpcy5zdGF0dXNTZXJ2aWNlLnNldE9mZmxpbmVNb2RlKGZhbHNlKTtcclxuICAgIHRoaXMuY2hlY2tTZXR0aW5ncygpO1xyXG4gICAgLy90aGlzLm5hdmlnYXRldG9uYXYoKTtcclxuICAgIC8qdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIi9uYXZcIl0sIHtcclxuICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgY3VydmU6IFwiZWFzZU91dFwiXHJcbiAgICAgIH1cclxuICAgIH0pKi9cclxuICB9XHJcbiAgXHJcbiAga2V5Ym9hcmRPbigpe1xyXG4gICAgdGhpcy5ib3ggPSB0aGlzLmdyaWQubmF0aXZlRWxlbWVudDtcclxuICAgIHRoaXMuYm94LmFuaW1hdGUoe1xyXG4gICAgICB0cmFuc2xhdGU6IHt4OjAsIHk6LTMwMH0sXHJcbiAgICAgIGR1cmF0aW9uOiA3NTAsXHJcbiAgICAgIGN1cnZlOiBBbmltYXRpb25DdXJ2ZS5lYXNlT3V0XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGtleWJvYXJkT2ZmKCl7XHJcbiAgICBsZXQgdXNyVEYgPSB0aGlzLnVzZXJOYW1lVGV4dEZpZWxkLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBsZXQgcHN3VEYgPSB0aGlzLnBhc3NXb3JkVGV4dEZpZWxkLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICB1c3JURi5kaXNtaXNzU29mdElucHV0KCk7XHJcbiAgICBwc3dURi5kaXNtaXNzU29mdElucHV0KCk7XHJcbiAgICB0aGlzLmJveCA9IHRoaXMuZ3JpZC5uYXRpdmVFbGVtZW50O1xyXG4gICAgdGhpcy5ib3guYW5pbWF0ZSh7XHJcbiAgICAgIHRyYW5zbGF0ZToge3g6MCwgeTowfSxcclxuICAgICAgZHVyYXRpb246IDAsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZvcmdvdFBXKCl7XHJcbiAgICB1dGlsaXR5TW9kdWxlLm9wZW5VcmwoXCJodHRwczovL3NlY3VyZS5wcm9qZWN0Ym94LmV1LyMvZW1haWxcIik7XHJcbiAgfVxyXG5cclxuICBjaGVja1NldHRpbmdzKCkge1xyXG4gICAgICBpZihnZXRCb29sZWFuKFwiZW5hYmxlVHV0b3JpYWxcIikpIHtcclxuICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCIvdHV0b3JpYWxcIl0sIHtcclxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgY3VydmU6IFwiZWFzZU91dFwiXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCIvbmF2XCJdLCB7XHJcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImVhc2VPdXRcIlxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgIH1cclxuICB9XHJcbiAgXHJcbn1cclxuIl19