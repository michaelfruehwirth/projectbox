import {Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef} from "@angular/core";
import { User } from "../../shared/user/user";
import { Router, ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { StatusService } from "../../shared/status/status.service";
import { Ticket } from "../../shared/ticket/ticket";
import { TicketService } from "../../shared/ticket/ticket.service";
import "rxjs/add/operator/switchMap";
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { UserService } from "../../shared/user/user.service";
import {Config} from "../../shared/config";
import { SelectedIndexChangedEventData } from "nativescript-drop-down";


@Component({
  selector: "pb-ticket_detail",
  providers: [TicketService, StatusService, UserService],
  templateUrl: "pages/ticket_detail/ticket_detail.html",
  styleUrls: ["pages/ticket_detail/ticket_detail-common.css", "pages/ticket_detail/ticket_detail.css"]
})

export class Ticket_detailComponent implements OnInit{
    selectedUserIndex: number;
    selectedProjectIndex: any;
    projectList: string[] = new Array<string>();
    userIds: string[] = new Array<string>();
    userSelection: string[] = new Array<string>();
    projectIds: string[] = new Array<string>();
    ticket :Ticket;

    constructor
    (
        private router: Router,
        private routerExtensions: RouterExtensions,
        private route: ActivatedRoute,
        private statusService :StatusService,
        private ticketService :TicketService,
        private page: Page,
        private _changeDetectionRef: ChangeDetectorRef,
        private fonticon: TNSFontIconService,
        private userService: UserService,
    )
    {
        this.route.params.subscribe((params) => {
            this.getTicket(params["id"]);
        });

        this.page.css = "Page { background-color: #ffffff; } .page { padding-left: 0; padding:20; background-color: #ffffff;}";
    }

    ngOnInit(): void {
    }

    getTicket(ticket_id){
        this.ticketService.getSingleTicket(ticket_id)
            .then((data) => {
                this.ticket = data.ticket;
                this.userService.getProjects()
                    .then((data) => {
                        data.projects.forEach((project) => {
                            this.projectIds[this.projectList.push(project.name)-1] = project.id;
                            if(this.ticket.project == project.id){
                                this.selectedProjectIndex = this.projectList.length-1;
                                this.fillDropDown(project.id);
                            }
                        });
                    });
            })
    }

    navigateto(pagename: string) {
        this.routerExtensions.navigate([pagename], {
            transition: {
                name: "slide",
                curve: "easeOut"
            }
        });
    }



    selectUser(args: SelectedIndexChangedEventData){
        this.ticket.responsible = this.userIds[args.newIndex];
    }

    fillDropDown(project_id){
        this.userService.getSingleProject(project_id)
            .then((data) => {
                this.userSelection = new Array<string>();

                data.users.forEach((user) => {
                    this.userIds[this.userSelection.push(user.first_name + " " + user.last_name)-1] = user.id;
                    if(this.ticket.responsible == user.id){
                        this.selectedUserIndex = this.userSelection.length-1
                    }
                });
            });
    }

    getUsers(args: SelectedIndexChangedEventData){
        this.ticket.project = this.projectIds[args.newIndex];
        this.userService.getSingleProject(this.ticket.project)
            .then(
                (data) => {
                    this.userSelection = new Array<string>();
                    data.users.forEach((user) => {
                        this.userIds[this.userSelection.push(user.first_name + " " + user.last_name)-1] = user.id;
                    });
                },
                (error) => {})
    }

    cancel() {
        this.routerExtensions.backToPreviousPage();
    }

    saveTicket() {
        this.ticketService.updateTicket(this.ticket)
            .then(() => {this.cancel()});
    }


}
