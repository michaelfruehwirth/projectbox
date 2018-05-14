import { Component, ViewChild, ElementRef } from "@angular/core";
import { UserLogin } from "../../shared/user/userLogin";
import { UserService } from "../../shared/user/user.service";
import { Router, ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { getBoolean, setBoolean } from "application-settings";
//import { AppShortcuts } from "nativescript-app-shortcuts"; //3D - Touch on iOS
import { isIOS } from "tns-core-modules/platform";
import { isAndroid } from "tns-core-modules/platform";
import { StatusService } from "../../shared/status/status.service"
import {AnimationCurve} from "ui/enums";
import observable = require("data/observable");
import view = require("ui/core/view");
import { TextField } from "ui/text-field";
import { GridLayout } from "ui/layouts/grid-layout";
import { AndroidData, IOSData, Elevation } from 'nativescript-ng-shadow';
import utilityModule = require("utils/utils");
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";

@Component({
  selector: "pb-login",
  providers: [UserService, StatusService],
  templateUrl: "pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class LoginComponent implements OnInit{
  @ViewChild("box") grid: ElementRef;//elemente aus dem view selectieren, dient zur animation der box
  @ViewChild("usrn") userNameTextField: ElementRef;
  @ViewChild("pass") passWordTextField: ElementRef;

  user: UserLogin;
  wrongcredentials :boolean = false;
  box :GridLayout;
  boxIsUp :boolean = false;
  fabShadowA: AndroidData = {
    elevation: Elevation.CARD_PICKED_UP,
  };
  fabShadowI: IOSData = {
    elevation: Elevation.CARD_PICKED_UP,
  };

  constructor
  (
    private router: Router,
    private routerExtensions: RouterExtensions,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private statusService :StatusService,
    private page: Page,
  )
  {
    this.user = new UserLogin();
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

  ngOnInit(): void {
    this.box = this.grid.nativeElement;
    this.box.animate({
      translate: {x:0, y:0},
      duration: 0,
    });
  }

  login() {
    this.userService.login(this.user)
      .subscribe(
      (data) => this.loginProceed(),
      (error) => this.offlineLogin(error)
      );
  }

  offlineLogin(valid :any){

    if (valid === "403"){
      this.wrongcredentials = true;
      alert("E-Mail-Addresse oder Passwort falsch");
    }else{

      if(this.statusService.getWasLoggedIn()){
        if(getBoolean("enableOffline")){
          this.statusService.setOfflineMode(true);
          this.keyboardOff();
          this.wrongcredentials = false;
          //this.navigatetonav();
          this.checkSettings();
        }else{
          this.keyboardOff();
          alert("Internetverbindung nicht vorhanden oder Offline-Verfügbarkeit einstellen")
        }
      }else{
        alert("Der erste Login benötigt eine aktive Internetverbindung");
      }
    }

  }

  /*navigatetonav() {
      this.routerExtensions.navigate(["/nav"], {
          transition: {
              name: "slide",
              curve: "easeOut"
          }
      })
  }*/

  loginProceed(){

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
  }
  
  keyboardOn(){
    this.box = this.grid.nativeElement;
    this.box.animate({
      translate: {x:0, y:-300},
      duration: 750,
      curve: AnimationCurve.easeOut
    });
  }

  keyboardOff(){
    let usrTF = this.userNameTextField.nativeElement;
    let pswTF = this.passWordTextField.nativeElement;
    usrTF.dismissSoftInput();
    pswTF.dismissSoftInput();
    this.box = this.grid.nativeElement;
    this.box.animate({
      translate: {x:0, y:0},
      duration: 0,
    });
  }

  forgotPW(){
    utilityModule.openUrl("https://secure.projectbox.eu/#/email");
  }

  checkSettings() {
      if(getBoolean("enableTutorial")) {
          this.routerExtensions.navigate(["/tutorial"], {
              transition: {
                  name: "slide",
                  curve: "easeOut"
              }
          })
      } else {
          this.routerExtensions.navigate(["/nav"], {
              transition: {
                  name: "slide",
                  curve: "easeOut"
              }
          })
      }
  }
  
}
