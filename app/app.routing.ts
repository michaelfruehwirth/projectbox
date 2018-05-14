import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { LoginComponent } from "./pages/login/login.component";
import { Meeting_detailComponent } from "./pages/meeting_detail/meeting_detail.component";
import { TodoComponent } from "./pages/todo/todo.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { TicketComponent } from "./pages/ticket/ticket.component";
import { Ticket_detailComponent } from "./pages/ticket_detail/ticket_detail.component";
import { NavComponent } from "./pages/nav/nav.component";
import { MeetingComponent } from "./pages/meeting/meeting.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { Todo_detailComponent } from "./pages/todo_detail/todo_detail.component";
import { TutorialComponent } from "./pages/tutorial/tutorial.component";

export const routes = [
  { path: "", component: LoginComponent },
  { path: "nav", component: NavComponent,
    children: [
      { path: "dashboard", component: DashboardComponent, outlet: 'dashboardoutlet' },
      { path: "ticket", component: TicketComponent, outlet: 'ticketoutlet' },
      { path: "todo", component: TodoComponent , outlet: 'todooutlet'},
      { path: "meeting", component: MeetingComponent, outlet: 'meetingoutlet'},
      { path: "settings", component: SettingsComponent, outlet: 'settingsoutlet' }
    ]
  },
  { path: "meeting_detail/:id", component: Meeting_detailComponent },
  { path: "todo_detail/:id", component: Todo_detailComponent },
  { path: "ticket_detail/:id", component: Ticket_detailComponent },
  { path: "login", component: LoginComponent },
  { path: "tutorial", component: TutorialComponent }
    
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})

export class AppRoutingModule { }