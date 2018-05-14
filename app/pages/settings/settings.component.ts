import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import * as FrameModule from "ui/frame";
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { getBoolean, setBoolean } from "application-settings";
import {NavComponent} from "../nav/nav.component";

@Component({
  selector: 'pb-setting',
  templateUrl: 'pages/settings/settings.html'
})
export class SettingsComponent implements OnInit{
  offlineData: boolean;
  actualOfflinesave :boolean;
  tutorial :boolean;
  actualsaveTutorial :boolean;
  nav :NavComponent;

   constructor
  (
    private router: Router,
    private routerExtensions: RouterExtensions,
    private activatedRoute: ActivatedRoute,
    private page: Page,
    private fonticon: TNSFontIconService,
    private _changeDetectionRef: ChangeDetectorRef,
    private navState: NavComponent
    )
  {
    this.nav = navState;
  }

  ngOnInit(){
    this.offlineData = getBoolean("enableOffline")?true:false;
    this.actualOfflinesave = false;
    this.tutorial = getBoolean("enableTutorial")?true:false;
    this.actualsaveTutorial = false;
  }

  toggleOffline(){
    this.actualOfflinesave = !this.actualOfflinesave;
    setBoolean("enableOffline", this.actualOfflinesave);
  }

  toggleTutorial(){
    this.actualsaveTutorial = !this.actualsaveTutorial;
    setBoolean("enableTutorial", this.actualsaveTutorial);
  }

}
