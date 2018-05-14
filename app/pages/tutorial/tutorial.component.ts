import { Component, OnInit } from '@angular/core';
import {Page} from "ui/page";
import { Router, ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
  selector: 'pb-tutorial',
  templateUrl: 'pages/tutorial/tutorial.html',
})
export class TutorialComponent implements OnInit {

    constructor(private router: Router,
                private routerExtensions: RouterExtensions,
                private activatedRoute: ActivatedRoute,
                private page: Page) {
        page.actionBarHidden = true;
    }

    finishTutorial() {
        this.routerExtensions.navigate(["/nav"], {
            transition: {
                name: "slide",
                curve: "easeOut"
            }
        });
    }

  ngOnInit() { }

}
