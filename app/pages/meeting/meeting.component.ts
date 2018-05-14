import {Component, OnInit} from "@angular/core";
import {UserService} from "../../shared/user/user.service";
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {ActivatedRoute} from "@angular/router";
import {
    GestureEventData,
    GestureTypes,
    PanGestureEventData,
    PinchGestureEventData,
    RotationGestureEventData,
    SwipeGestureEventData,
    TouchGestureEventData
} from "ui/gestures";
import {Meeting, Attendee, AgendaPoint} from "../../shared/meeting/meeting"
import {MeetingService} from "../../shared/meeting/meeting.service"
import * as camera from "nativescript-camera";

let imagepicker = require("nativescript-imagepicker");
import * as imageSourceModule from "image-source";
import {Image} from "ui/image";
import {ImageAsset} from "tns-core-modules/image-asset";

var fs = require("file-system");
import * as imageSource from "tns-core-modules/image-source";
import {RadSideDrawerComponent, SideDrawerType} from "nativescript-pro-ui/sidedrawer/angular";
import {RadSideDrawer} from 'nativescript-pro-ui/sidedrawer';
import {TNSFontIconService} from 'nativescript-ngx-fonticon';
import * as tabViewModule from "tns-core-modules/ui/tab-view";
import {DropDown, ValueList, SelectedIndexChangedEventData} from "nativescript-drop-down";
import {
    Calendar,
    SELECTION_MODE, // Multiple or single
    DISPLAY_MODE, // Week or month
    CalendarEvent, // little dots
    Appearance, // style customisation
    SCROLL_ORIENTATION, // scroll orientation for iOS
    CalendarSubtitle, // subtitles for iOS
    Settings // Settings interface
} from 'nativescript-fancy-calendar';
import {registerElement} from "nativescript-angular/element-registry";
import {Page} from "ui/page";
import { NavComponent } from "../nav/nav.component";
import {ModalDatetimepicker, PickerOptions} from "nativescript-modal-datetimepicker";
import * as dialogs from "ui/dialogs";
import { Config } from "../../shared/config";
var bghttp = require("nativescript-background-http"); //file upload

registerElement('Calendar', () => Calendar);

@Component({
    selector: "pb-meeting",
    templateUrl: "pages/meeting/meeting.html",
    providers: [UserService, MeetingService],
    styleUrls: ["pages/meeting/meeting-common.css"]
})
export class MeetingComponent implements OnInit {

    showanything :boolean = true;
    meetings: Meeting[];
    displayedMeetings: Meeting[];
    public picture: any;
    create: boolean = true;
    meetingdata: any;
    meetingsText: string;
    meeting_tabs: String;
    meeting: Meeting;
    nav: NavComponent;
    public projectSelection :string[] = new Array<string>();
    direction: number;
    newMeeting :Meeting = new Meeting;

    settings: any;
    subtitles: CalendarSubtitle[];
    events :CalendarEvent[] = new Array<CalendarEvent>();
    public appearance: Appearance;
    appearanceOptions: Array<Appearance>;
    private _calendar: Calendar;

    selectedDate :any;
    selectedTime :any;

    projectIds :string[] = new Array<string>();
    public projectList: string[] = new Array<string>();

    uploadQueue :any[] = new Array<any>();

    /* date picker */
    public date: string;
    public time: string;
    private modalDatetimepicker: ModalDatetimepicker;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private routerExtensions: RouterExtensions,
        private meetingService: MeetingService,
        private navState: NavComponent,
        private page: Page,
        private fonticon: TNSFontIconService,
        private userService :UserService
    ) {
        this.nav = navState;
        this.modalDatetimepicker = new ModalDatetimepicker();
        this.meeting_tabs = 'teilnehmer';
    }

    ngOnInit() {
        this.meetingService.getMeetings().then(
            (data) => this.displayMeetings(data),
            (error) => this.displayMeetings(false)
        );
        this.create = false;
        this.page.css = "Page { background-color: #ECEDEE; } .page { padding-left: 0; padding:20; background-color: #ECEDEE;} #meetinglist { padding-left: 20; }";
        this.userService.getProjects()
        .then((data) => {
            this.projectList = new Array<string>();
            data.projects.forEach((project) => {
                this.projectIds[this.projectList.push(project.name)-1] = project.id;
            });
        });
    }

    cr_meeting() {
        this.create = true;
        this.page.css = "Page { background-color: #ffffff; } .form-taskticket { padding-left: 0; padding:20; background-color: #ffffff;}";
    }

    cancel() {
        this.create = false;
        this.page.css = "Page { background-color: #ECEDEE;} .page { padding: 0; padding-left:20; background-color: #ECEDEE;}  #meetinglist { padding-left: 20; } ";
    }

    displayMeetings(data: any) {
        this.showanything = false;
        setTimeout(() => {
            this.showanything = true;
        }, 1)
        

        if (data) {
            data.meetings.forEach(meeting => {
                this.events.push(new CalendarEvent(new Date(meeting.date)));
                var curDate = new Date();
                var date = new Date(meeting.date);
                if (curDate.getDate() == date.getDate() && curDate.getMonth() == date.getMonth() && curDate.getFullYear() == date.getFullYear()) {
                    meeting.dateFormatted = "HEUTE";
                } else {
                    date.setMonth(date.getMonth()+1);
                    meeting.dateFormatted = (date.getDate() < 10? '0'+date.getDate() : date.getDate()) + "." + (date.getMonth() < 10? '0'+date.getMonth() : date.getMonth()) + "." + date.getFullYear().toString().substring(2,4);
                }
            });
            this.meetingService.saveMeetings(data);
        } else {
            data = this.meetingService.getSavedMeetings()
            data.meetings.forEach(meeting => {
                this.events.push(new CalendarEvent(new Date(meeting.date)));
                this.userService.getSingleProject(meeting.project)
                    .then(
                    (data) => {
                        meeting.project_color = data.projects[0].color;
                    },
                    (error) => {console.log("ALARM")}
                    );
                var curDate = new Date();
                var date = new Date(meeting.date);
                if (curDate.getDate() == date.getDate() && curDate.getMonth() == date.getMonth() && curDate.getFullYear() == date.getFullYear()) {
                    meeting.dateFormatted = "HEUTE";
                } else {
                    meeting.dateFormatted = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
                }
            });
            this.meetings = data.meetings;
        }
        data.meetings.forEach(meeting => {
            this.userService.getSingleProject(meeting.project)
                .then(
                (data) => {
                    meeting.project_color = data.projects[0].color
                },
                (error) => {}
                );
            var curDate = new Date();
            var date = new Date(meeting.date);
            if (curDate.getDate() == date.getDate() && curDate.getMonth() == date.getMonth() && curDate.getFullYear() == date.getFullYear()) {
                meeting.dateFormatted = "HEUTE";
            } else {
                date.setMonth(date.getMonth()+1);
                meeting.dateFormatted = (date.getDate() < 10? '0'+date.getDate() : date.getDate()) + "." + (date.getMonth() < 10? '0'+date.getMonth() : date.getMonth()) + "." + date.getFullYear().toString().substring(2,4);
            }
        });
        this.meetings = data.meetings;
        this.displayedMeetings = data.meetings;
    }

    createMeeting() {
        if(this.newMeeting.attendees){
            if(this.newMeeting.attendees[0]){
                this.newMeeting.attendees.forEach((attendee, index) => {attendee.order = index+1});
            }else{
                this.newMeeting.attendees = null;
            }
        }else{
            this.newMeeting.attendees = null;
        }
        if(this.newMeeting.agenda){
            if(this.newMeeting.agenda[0]){
                this.newMeeting.agenda.forEach((agendaPoint, index) => {agendaPoint.order = index+1});
            }else{
                this.newMeeting.agenda = null
            }
        }else{
            this.newMeeting.agenda = null;
        }
        this.newMeeting.attendees = (JSON.stringify(this.newMeeting.attendees));
        this.newMeeting.agenda = (JSON.stringify(this.newMeeting.agenda));
        this.newMeeting.date = new Date(this.selectedDate.year, this.selectedDate.month-1, this.selectedDate.day, this.selectedTime.hour, this.selectedTime.minute);
        console.dir(this.newMeeting);
        this.meetingService.createMeeting(this.newMeeting)
            .then((data) => {
                this.newMeeting.id = data.meeting.id;
                this.meetingService.update(this.newMeeting)
                    .then((data) => {
                        this.cancel();
                        this.ngOnInit();
                    });

                /* this.uploadQueue.forEach((path) => {
                    this.uploadImage(path, data.meeting.id)
                }); */
            });
    }

    showDetail(id: number) {

        this.routerExtensions.navigate(["/meeting_detail/" + id], {

            transition: {
                name: "slide",
                curve: "easeOut"
            }
        });
    }

    addAttendee() {
        if(!this.newMeeting.attendees){
            this.newMeeting.attendees = new Array<Attendee>();
        }
        let newAttendee = new Attendee();
        newAttendee.id = this.generateGuid();
        this.newMeeting.attendees.push(newAttendee);
    }

    removeAttendee(index :number) {
        this.newMeeting.attendees.splice(index, 1);
    }

    addPoint() {
        if(!this.newMeeting.agenda){
            this.newMeeting.agenda = new Array<AgendaPoint>();
        }
        let newPoint = new AgendaPoint();
        newPoint.id = this.generateGuid();
        this.newMeeting.agenda.push(newPoint);
    }

    removePoint(index :number) {
        console.dir(this.newMeeting.agenda);
        this.newMeeting.agenda.splice(index, 1);
    }
    
    /* calendar */

    public calendarLoaded(event) {
        this.settings = <Settings>{
            displayMode: DISPLAY_MODE.MONTH,
            scrollOrientation: SCROLL_ORIENTATION.HORIZONTAL,
            selectionMode: SELECTION_MODE.SINGLE,
            firstWeekday: 2, // SUN: O, MON: 1, TUES: 2 etc..
        };
        this.appearance = <Appearance>{
            weekdayTextColor: "#000000", //color of Tue, Wed, Thur.. (only iOS)
                headerTitleColor: "#000000", //color of the current Month (only iOS)
                eventColor: "#22313F", // color of dots
                selectionColor: "#29A699", // color of the circle when a date is clicked
                todayColor: "#BDC3C7", // the color of the current day
                hasBorder: true, // remove border (only iOS)
                todaySelectionColor: "#29A699", // today color when seleted (only iOS)
                borderRadius: 40 // border radius of the selection marker
        },{
            weekdayTextColor: "#000000", //color of Tue, Wed, Thur.. (only iOS)
            headerTitleColor: "#000000", //color of the current Month (only iOS)
            eventColor: "#22313F", // color of dots
            selectionColor: "#29A699", // color of the circle when a date is clicked
            todayColor: "#BDC3C7", // the color of the current day
            hasBorder: true, // remove border (only iOS)
            todaySelectionColor: "#29A699", // today color when seleted (only iOS)
            borderRadius: 40 // border radius of the selection marker
        };
    }

    state(id) {
        this.meeting_tabs = id;
    }

    public dateSelected(event) {
        this.filterByDate(event.data.date);
    }

    filterByDate(date: Date) {
        this.displayedMeetings = new Array<Meeting>();
        this.meetings.forEach(meeting => {
            let meetingDate = new Date(meeting.date);
            if (meetingDate.getFullYear() === date.getFullYear() && meetingDate.getMonth() === date.getMonth() && meetingDate.getDate() === date.getDate()) {
                this.displayedMeetings.push(meeting);
                this.events.push(new CalendarEvent(meetingDate));
            }
        });
    }


    public monthChanged(event) {
        //console.log('month selected');
    }

    /* gesten */
    onSwipe(args: SwipeGestureEventData) {
        this.direction = args.direction;
        /* nach rechts */
        if (this.direction == 2) {
            this.nav.state('todo');
        }

        /* nach links */
        if (this.direction == 1) {
            this.nav.state('meeting');
        }

        /* nach unten */
        if (this.direction == 4) {
            this.nav.state('ticket');
        }
    }

    /* date picker */
    selectDate() {
        this.modalDatetimepicker.pickDate(<PickerOptions>{
            title: "Datum auswählen",
            theme: "dark",
            startingDate: new Date(),
            maxDate: new Date('2030-01-01'), /* hier maxDate setzen */
            minDate: new Date()
        }).then((result:any) => {
            if (result) {
                this.date = result.day + "." + result.month + "." + result.year;
                this.selectedDate = result;
                this.newMeeting.date = new Date(result.year, result.month, result.day);
            }
        })
            .catch((error) => {
                console.log("Error: " + error);
            });
    };

    selectTime() {
        this.modalDatetimepicker.pickTime(<PickerOptions>{
            theme: "dark",
            is24HourView: true
        }).then((result:any) => {
            if (result) {
                this.time = result.hour + ":" + (result.minute>9?result.minute:"0"+result.minute);
                this.selectedTime = result;
            }
        })
            .catch((error) => {
                console.log("Error: " + error);
            });
    };

    selectProject(args: SelectedIndexChangedEventData){
        this.newMeeting.project = this.projectIds[args.newIndex];
    }

    generateGuid(){
        function s4(){
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return(s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4());
    }

    openCamera(){
        var milliseconds = new Date().getTime();
        var that = this;
        camera.requestPermissions();
        camera.takePicture()
            .then((imageAsset) => {
                console.log("Result is an image asset instance");
                let source = new imageSource.ImageSource();
                source.fromAsset(imageAsset).then((source) => {
                    let folder = fs.knownFolders.documents();
                    let fileName = "test.png"
                    let path = fs.path.join(folder.path, milliseconds + ".png");
                    let saved = source.saveToFile(path, "png");
                    if(saved){
                        console.log("saved image")
                    }
                    that.uploadQueue.push(path);
                })
            }).catch((err) => {
            console.log("Error -> " + err.message);
        });
    }
    
      sourcepic() {
          dialogs.action({
              message: "Quelle des Bildes",
              cancelButtonText: "Abbrechen",
              actions: ["Kamera", "Gallerie"]
          }).then(result => {
              if(result == "Kamera"){
                  this.openCamera();
              }else if(result == "Gallerie"){
                  this.openGallery();
              }
          });
      }
    
      openGallery(){
    
        var milliseconds = new Date().getTime();
        var that = this;
        let context = imagepicker.create({
          mode: "single" //use "multiple" for multiple selection
        });
    
        context
        .authorize()
        .then(() => context.present())
        .then((selection) => {
          selection.forEach(selected => {
            selected.getImage().then(function(imagesource){
              let folder = fs.knownFolders.documents();
              var path = fs.path.join(folder.path, milliseconds + ".png");
              var saved = imagesource.saveToFile(path, "png");
              that.uploadQueue.push(path);
            })
          });
        }).catch(function (e) {
            // process error
        });
      }

      uploadImage(path, meeting_id){
        console.log("uploading...");
        var session = bghttp.session("image-upload");
     
        var request = {
            url: Config.apiUrl + "v2/upload/files",
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": "mobile_upload.png",
                "Authorization": "Bearer " + Config.token
            },
            description: "{ 'uploading': 'mobile_upload.png' }" //wie body bei normalem post
        };
        var params = [{name: "meeting", value: meeting_id}, {name:"file", filename: path , mimeType: 'image/png'}];
    
        let task = session.multipartUpload(params, request);
     
        task.on("progress", this.logEvent);
        task.on("error", this.logEvent);
        task.on("complete", this.logEvent);
      }
     
      logEvent(e) {
        console.log(e.eventName);
      }
}