import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service";
import { Router, ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { StatusService } from "../../shared/status/status.service";
import { Ticket } from "../../shared/ticket/ticket";
import { TicketService } from "../../shared/ticket/ticket.service";
import "rxjs/add/operator/switchMap";
import { ListViewEventData, RadListView } from "nativescript-pro-ui/listview";
import * as FrameModule from "ui/frame";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-pro-ui/sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-pro-ui/sidedrawer';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as dialogs from "ui/dialogs";
import { NavComponent } from "../nav/nav.component";
import {Tracking} from "../../shared/todo/todo";
import {SelectedIndexChangedEventData} from "nativescript-drop-down";


@Component({
  selector: "pb-ticket",
  providers: [TicketService, StatusService, UserService],
  templateUrl: "pages/ticket/ticket.html",
  styleUrls: ["pages/ticket/ticket-common.css", "pages/ticket/ticket.css"]
})

export class TicketComponent implements OnInit {

  tickets :Ticket[];
  ticketForDetail :Boolean[];
  create: boolean;
  curUser :User = new User;
  public newTicket :Ticket = new Ticket();
  nav: NavComponent;
  public projectSelection :string[] = new Array<string>();
  public userSelection :string[] = new Array<string>();
  public projectList: string[] = new Array<string>();
  projectIds :string[] = new Array<string>();
  userIds :string[] = new Array<string>();

  constructor
  (
    private router: Router,
    private routerExtensions: RouterExtensions,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private statusService :StatusService,
    private ticketService :TicketService,
    private _changeDetectionRef: ChangeDetectorRef,
    private page: Page,
    private fonticon: TNSFontIconService,
    private navState: NavComponent
    )
  {
    this.nav = navState;
    this.curUser = this.userService.getCurrentUser();
  }

  ngOnInit(): void {
    this.ticketService.getTickets().then(
      (data) => this.displayTickets(data), 
      (error) => this.displayTickets(false)
    ).then(() => {
      this.ticketForDetail = new Array<Boolean>(this.tickets.length);
      this.tickets.forEach((element) => {
        this.ticketForDetail[element.id] = false;
      });
    });

      this.userService.getProjects()
          .then((data) => {
              this.projectList = new Array<string>();
              data.projects.forEach((project) => {
                  console.log(project.name);
                  this.projectIds[this.projectList.push(project.name)-1] = project.id;
              });
          });
      this.page.css = "Page { background-color: #ECEDEE; } .page { padding-left: 20; background-color: #ECEDEE;}";
  }

  expand(id :string){
    this.ticketForDetail[id] = !this.ticketForDetail[id];
  }


  displayTickets(data :any){

    if(data){
      this.ticketService.saveTickets(data);
      this.tickets = data.tickets;

    }else{

      data = this.ticketService.getSavedTickets()
      this.tickets = data.tickets;
      
    }
    this.tickets.forEach((ticket) => {
      if(ticket.completed){
          this.tickets.splice(this.tickets.indexOf(ticket), 1)
      }else {
          this.userService.getSingleProject(ticket.project)
              .then((data) => {
                  ticket.project = data.projects[0].name;
                  ticket.color = data.projects[0].color;
              })
      }
    });
    this.tickets.sort((a, b) => a.priority-b.priority);
  }

  cr_ticket() {
    this.create = true;
        this.page.css = "Page { background-color: #ffffff; } .page { padding-left: 0; padding:20; background-color: #ffffff;}";
  }

  cancel() {
    this.create = false;
    this.page.css = "Page { background-color: #ECEDEE; } .page { padding-left: 10; background-color: #ECEDEE;}";
  }

  createTicket() {
      this.ticketService.createTicket(this.newTicket)
          .then((data) => {this.newTicket.id = data.ticket.id;this.ticketService.updateTicket(this.newTicket).then((data) => {this.ngOnInit()})})
      alert("Ticket erstellt");
      this.create = false;
  }

    getUsers(args: SelectedIndexChangedEventData){
        this.newTicket.project = this.projectIds[args.newIndex];
        this.userService.getSingleProject(this.newTicket.project)
            .then(
                (data) => {
                    this.userSelection = new Array<string>();
                    data.users.forEach((user) => {
                        console.log(user.first_name);
                        this.userIds[this.userSelection.push(user.first_name + " " + user.last_name)-1] = user.id;
                    });
                },
                (error) => {})
    }

    selectUser(args: SelectedIndexChangedEventData){
        this.newTicket.responsible = this.userIds[args.newIndex];
    }

    deleteTicket(t_id :string){
      this.ticketService.deleteTicket(t_id).then(() => {alert("Ticket erfolgreich gelöscht!");this.ngOnInit()});
    }

    finished(t :Ticket){
        t.completed = true;
        this.ticketService.updateTicket(t).then((data) => {this.ngOnInit();alert("Ticket erfolgreich abgeschlossen!")});
    }

    goToDetail(t_id :string){
        this.routerExtensions.navigate(["ticket_detail/" + t_id], {
            transition: {
                name: "slideTop",
                curve: "easeOut"
            }
        });
    }
}
