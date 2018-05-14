"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_service_1 = require("../../shared/user/user.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var router_3 = require("@angular/router");
var meeting_1 = require("../../shared/meeting/meeting");
var meeting_service_1 = require("../../shared/meeting/meeting.service");
var camera = require("nativescript-camera");
var imagepicker = require("nativescript-imagepicker");
var fs = require("file-system");
var imageSource = require("tns-core-modules/image-source");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var nativescript_fancy_calendar_1 = require("nativescript-fancy-calendar");
var element_registry_1 = require("nativescript-angular/element-registry");
var page_1 = require("ui/page");
var nav_component_1 = require("../nav/nav.component");
var nativescript_modal_datetimepicker_1 = require("nativescript-modal-datetimepicker");
var dialogs = require("ui/dialogs");
var config_1 = require("../../shared/config");
var bghttp = require("nativescript-background-http"); //file upload
element_registry_1.registerElement('Calendar', function () { return nativescript_fancy_calendar_1.Calendar; });
var MeetingComponent = (function () {
    function MeetingComponent(route, router, routerExtensions, meetingService, navState, page, fonticon, userService) {
        this.route = route;
        this.router = router;
        this.routerExtensions = routerExtensions;
        this.meetingService = meetingService;
        this.navState = navState;
        this.page = page;
        this.fonticon = fonticon;
        this.userService = userService;
        this.showanything = true;
        this.create = true;
        this.projectSelection = new Array();
        this.newMeeting = new meeting_1.Meeting;
        this.events = new Array();
        this.projectIds = new Array();
        this.projectList = new Array();
        this.uploadQueue = new Array();
        this.nav = navState;
        this.modalDatetimepicker = new nativescript_modal_datetimepicker_1.ModalDatetimepicker();
        this.meeting_tabs = 'teilnehmer';
    }
    MeetingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.meetingService.getMeetings().then(function (data) { return _this.displayMeetings(data); }, function (error) { return _this.displayMeetings(false); });
        this.create = false;
        this.page.css = "Page { background-color: #ECEDEE; } .page { padding-left: 0; padding:20; background-color: #ECEDEE;} #meetinglist { padding-left: 20; }";
        this.userService.getProjects()
            .then(function (data) {
            _this.projectList = new Array();
            data.projects.forEach(function (project) {
                _this.projectIds[_this.projectList.push(project.name) - 1] = project.id;
            });
        });
    };
    MeetingComponent.prototype.cr_meeting = function () {
        this.create = true;
        this.page.css = "Page { background-color: #ffffff; } .form-taskticket { padding-left: 0; padding:20; background-color: #ffffff;}";
    };
    MeetingComponent.prototype.cancel = function () {
        this.create = false;
        this.page.css = "Page { background-color: #ECEDEE;} .page { padding: 0; padding-left:20; background-color: #ECEDEE;}  #meetinglist { padding-left: 20; } ";
    };
    MeetingComponent.prototype.displayMeetings = function (data) {
        var _this = this;
        this.showanything = false;
        setTimeout(function () {
            _this.showanything = true;
        }, 1);
        if (data) {
            data.meetings.forEach(function (meeting) {
                _this.events.push(new nativescript_fancy_calendar_1.CalendarEvent(new Date(meeting.date)));
                var curDate = new Date();
                var date = new Date(meeting.date);
                if (curDate.getDate() == date.getDate() && curDate.getMonth() == date.getMonth() && curDate.getFullYear() == date.getFullYear()) {
                    meeting.dateFormatted = "HEUTE";
                }
                else {
                    date.setMonth(date.getMonth() + 1);
                    meeting.dateFormatted = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + "." + (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()) + "." + date.getFullYear().toString().substring(2, 4);
                }
            });
            this.meetingService.saveMeetings(data);
        }
        else {
            data = this.meetingService.getSavedMeetings();
            data.meetings.forEach(function (meeting) {
                _this.events.push(new nativescript_fancy_calendar_1.CalendarEvent(new Date(meeting.date)));
                _this.userService.getSingleProject(meeting.project)
                    .then(function (data) {
                    meeting.project_color = data.projects[0].color;
                }, function (error) { console.log("ALARM"); });
                var curDate = new Date();
                var date = new Date(meeting.date);
                if (curDate.getDate() == date.getDate() && curDate.getMonth() == date.getMonth() && curDate.getFullYear() == date.getFullYear()) {
                    meeting.dateFormatted = "HEUTE";
                }
                else {
                    meeting.dateFormatted = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
                }
            });
            this.meetings = data.meetings;
        }
        data.meetings.forEach(function (meeting) {
            _this.userService.getSingleProject(meeting.project)
                .then(function (data) {
                meeting.project_color = data.projects[0].color;
            }, function (error) { });
            var curDate = new Date();
            var date = new Date(meeting.date);
            if (curDate.getDate() == date.getDate() && curDate.getMonth() == date.getMonth() && curDate.getFullYear() == date.getFullYear()) {
                meeting.dateFormatted = "HEUTE";
            }
            else {
                date.setMonth(date.getMonth() + 1);
                meeting.dateFormatted = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + "." + (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()) + "." + date.getFullYear().toString().substring(2, 4);
            }
        });
        this.meetings = data.meetings;
        this.displayedMeetings = data.meetings;
    };
    MeetingComponent.prototype.createMeeting = function () {
        var _this = this;
        if (this.newMeeting.attendees) {
            if (this.newMeeting.attendees[0]) {
                this.newMeeting.attendees.forEach(function (attendee, index) { attendee.order = index + 1; });
            }
            else {
                this.newMeeting.attendees = null;
            }
        }
        else {
            this.newMeeting.attendees = null;
        }
        if (this.newMeeting.agenda) {
            if (this.newMeeting.agenda[0]) {
                this.newMeeting.agenda.forEach(function (agendaPoint, index) { agendaPoint.order = index + 1; });
            }
            else {
                this.newMeeting.agenda = null;
            }
        }
        else {
            this.newMeeting.agenda = null;
        }
        this.newMeeting.attendees = (JSON.stringify(this.newMeeting.attendees));
        this.newMeeting.agenda = (JSON.stringify(this.newMeeting.agenda));
        this.newMeeting.date = new Date(this.selectedDate.year, this.selectedDate.month - 1, this.selectedDate.day, this.selectedTime.hour, this.selectedTime.minute);
        console.dir(this.newMeeting);
        this.meetingService.createMeeting(this.newMeeting)
            .then(function (data) {
            _this.newMeeting.id = data.meeting.id;
            _this.meetingService.update(_this.newMeeting)
                .then(function (data) {
                _this.cancel();
                _this.ngOnInit();
            });
            /* this.uploadQueue.forEach((path) => {
                this.uploadImage(path, data.meeting.id)
            }); */
        });
    };
    MeetingComponent.prototype.showDetail = function (id) {
        this.routerExtensions.navigate(["/meeting_detail/" + id], {
            transition: {
                name: "slide",
                curve: "easeOut"
            }
        });
    };
    MeetingComponent.prototype.addAttendee = function () {
        if (!this.newMeeting.attendees) {
            this.newMeeting.attendees = new Array();
        }
        var newAttendee = new meeting_1.Attendee();
        newAttendee.id = this.generateGuid();
        this.newMeeting.attendees.push(newAttendee);
    };
    MeetingComponent.prototype.removeAttendee = function (index) {
        this.newMeeting.attendees.splice(index, 1);
    };
    MeetingComponent.prototype.addPoint = function () {
        if (!this.newMeeting.agenda) {
            this.newMeeting.agenda = new Array();
        }
        var newPoint = new meeting_1.AgendaPoint();
        newPoint.id = this.generateGuid();
        this.newMeeting.agenda.push(newPoint);
    };
    MeetingComponent.prototype.removePoint = function (index) {
        console.dir(this.newMeeting.agenda);
        this.newMeeting.agenda.splice(index, 1);
    };
    /* calendar */
    MeetingComponent.prototype.calendarLoaded = function (event) {
        this.settings = {
            displayMode: nativescript_fancy_calendar_1.DISPLAY_MODE.MONTH,
            scrollOrientation: nativescript_fancy_calendar_1.SCROLL_ORIENTATION.HORIZONTAL,
            selectionMode: nativescript_fancy_calendar_1.SELECTION_MODE.SINGLE,
            firstWeekday: 2,
        };
        this.appearance = {
            weekdayTextColor: "#000000",
            headerTitleColor: "#000000",
            eventColor: "#22313F",
            selectionColor: "#29A699",
            todayColor: "#BDC3C7",
            hasBorder: true,
            todaySelectionColor: "#29A699",
            borderRadius: 40 // border radius of the selection marker
        }, {
            weekdayTextColor: "#000000",
            headerTitleColor: "#000000",
            eventColor: "#22313F",
            selectionColor: "#29A699",
            todayColor: "#BDC3C7",
            hasBorder: true,
            todaySelectionColor: "#29A699",
            borderRadius: 40 // border radius of the selection marker
        };
    };
    MeetingComponent.prototype.state = function (id) {
        this.meeting_tabs = id;
    };
    MeetingComponent.prototype.dateSelected = function (event) {
        this.filterByDate(event.data.date);
    };
    MeetingComponent.prototype.filterByDate = function (date) {
        var _this = this;
        this.displayedMeetings = new Array();
        this.meetings.forEach(function (meeting) {
            var meetingDate = new Date(meeting.date);
            if (meetingDate.getFullYear() === date.getFullYear() && meetingDate.getMonth() === date.getMonth() && meetingDate.getDate() === date.getDate()) {
                _this.displayedMeetings.push(meeting);
                _this.events.push(new nativescript_fancy_calendar_1.CalendarEvent(meetingDate));
            }
        });
    };
    MeetingComponent.prototype.monthChanged = function (event) {
        //console.log('month selected');
    };
    /* gesten */
    MeetingComponent.prototype.onSwipe = function (args) {
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
    };
    /* date picker */
    MeetingComponent.prototype.selectDate = function () {
        var _this = this;
        this.modalDatetimepicker.pickDate({
            title: "Datum auswählen",
            theme: "dark",
            startingDate: new Date(),
            maxDate: new Date('2030-01-01'),
            minDate: new Date()
        }).then(function (result) {
            if (result) {
                _this.date = result.day + "." + result.month + "." + result.year;
                _this.selectedDate = result;
                _this.newMeeting.date = new Date(result.year, result.month, result.day);
            }
        })
            .catch(function (error) {
            console.log("Error: " + error);
        });
    };
    ;
    MeetingComponent.prototype.selectTime = function () {
        var _this = this;
        this.modalDatetimepicker.pickTime({
            theme: "dark",
            is24HourView: true
        }).then(function (result) {
            if (result) {
                _this.time = result.hour + ":" + (result.minute > 9 ? result.minute : "0" + result.minute);
                _this.selectedTime = result;
            }
        })
            .catch(function (error) {
            console.log("Error: " + error);
        });
    };
    ;
    MeetingComponent.prototype.selectProject = function (args) {
        this.newMeeting.project = this.projectIds[args.newIndex];
    };
    MeetingComponent.prototype.generateGuid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4());
    };
    MeetingComponent.prototype.openCamera = function () {
        var milliseconds = new Date().getTime();
        var that = this;
        camera.requestPermissions();
        camera.takePicture()
            .then(function (imageAsset) {
            console.log("Result is an image asset instance");
            var source = new imageSource.ImageSource();
            source.fromAsset(imageAsset).then(function (source) {
                var folder = fs.knownFolders.documents();
                var fileName = "test.png";
                var path = fs.path.join(folder.path, milliseconds + ".png");
                var saved = source.saveToFile(path, "png");
                if (saved) {
                    console.log("saved image");
                }
                that.uploadQueue.push(path);
            });
        }).catch(function (err) {
            console.log("Error -> " + err.message);
        });
    };
    MeetingComponent.prototype.sourcepic = function () {
        var _this = this;
        dialogs.action({
            message: "Quelle des Bildes",
            cancelButtonText: "Abbrechen",
            actions: ["Kamera", "Gallerie"]
        }).then(function (result) {
            if (result == "Kamera") {
                _this.openCamera();
            }
            else if (result == "Gallerie") {
                _this.openGallery();
            }
        });
    };
    MeetingComponent.prototype.openGallery = function () {
        var milliseconds = new Date().getTime();
        var that = this;
        var context = imagepicker.create({
            mode: "single" //use "multiple" for multiple selection
        });
        context
            .authorize()
            .then(function () { return context.present(); })
            .then(function (selection) {
            selection.forEach(function (selected) {
                selected.getImage().then(function (imagesource) {
                    var folder = fs.knownFolders.documents();
                    var path = fs.path.join(folder.path, milliseconds + ".png");
                    var saved = imagesource.saveToFile(path, "png");
                    that.uploadQueue.push(path);
                });
            });
        }).catch(function (e) {
            // process error
        });
    };
    MeetingComponent.prototype.uploadImage = function (path, meeting_id) {
        console.log("uploading...");
        var session = bghttp.session("image-upload");
        var request = {
            url: config_1.Config.apiUrl + "v2/upload/files",
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": "mobile_upload.png",
                "Authorization": "Bearer " + config_1.Config.token
            },
            description: "{ 'uploading': 'mobile_upload.png' }" //wie body bei normalem post
        };
        var params = [{ name: "meeting", value: meeting_id }, { name: "file", filename: path, mimeType: 'image/png' }];
        var task = session.multipartUpload(params, request);
        task.on("progress", this.logEvent);
        task.on("error", this.logEvent);
        task.on("complete", this.logEvent);
    };
    MeetingComponent.prototype.logEvent = function (e) {
        console.log(e.eventName);
    };
    MeetingComponent = __decorate([
        core_1.Component({
            selector: "pb-meeting",
            templateUrl: "pages/meeting/meeting.html",
            providers: [user_service_1.UserService, meeting_service_1.MeetingService],
            styleUrls: ["pages/meeting/meeting-common.css"]
        }),
        __metadata("design:paramtypes", [router_3.ActivatedRoute,
            router_1.Router,
            router_2.RouterExtensions,
            meeting_service_1.MeetingService,
            nav_component_1.NavComponent,
            page_1.Page,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            user_service_1.UserService])
    ], MeetingComponent);
    return MeetingComponent;
}());
exports.MeetingComponent = MeetingComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVldGluZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZWV0aW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFnRDtBQUNoRCwrREFBMkQ7QUFDM0QsMENBQXVDO0FBQ3ZDLHNEQUE2RDtBQUM3RCwwQ0FBK0M7QUFVL0Msd0RBQTJFO0FBQzNFLHdFQUFtRTtBQUNuRSw0Q0FBOEM7QUFFOUMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFLdEQsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2hDLDJEQUE2RDtBQUc3RCx1RUFBNkQ7QUFHN0QsMkVBU3FDO0FBQ3JDLDBFQUFzRTtBQUN0RSxnQ0FBNkI7QUFDN0Isc0RBQW9EO0FBQ3BELHVGQUFxRjtBQUNyRixvQ0FBc0M7QUFDdEMsOENBQTZDO0FBQzdDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsYUFBYTtBQUVuRSxrQ0FBZSxDQUFDLFVBQVUsRUFBRSxjQUFNLE9BQUEsc0NBQVEsRUFBUixDQUFRLENBQUMsQ0FBQztBQVE1QztJQW9DSSwwQkFBb0IsS0FBcUIsRUFDN0IsTUFBYyxFQUNkLGdCQUFrQyxFQUNsQyxjQUE4QixFQUM5QixRQUFzQixFQUN0QixJQUFVLEVBQ1YsUUFBNEIsRUFDNUIsV0FBd0I7UUFQaEIsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDN0IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLGFBQVEsR0FBUixRQUFRLENBQWM7UUFDdEIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNWLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBekNwQyxpQkFBWSxHQUFZLElBQUks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LEVBQUUsVUFBVSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUcsUUFBUSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7UUFFM0csSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFcEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELG1DQUFRLEdBQVIsVUFBUyxDQUFDO1FBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQXRhTSxnQkFBZ0I7UUFONUIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFdBQVcsRUFBRSw0QkFBNEI7WUFDekMsU0FBUyxFQUFFLENBQUMsMEJBQVcsRUFBRSxnQ0FBYyxDQUFDO1lBQ3hDLFNBQVMsRUFBRSxDQUFDLGtDQUFrQyxDQUFDO1NBQ2xELENBQUM7eUNBcUM2Qix1QkFBYztZQUNyQixlQUFNO1lBQ0kseUJBQWdCO1lBQ2xCLGdDQUFjO1lBQ3BCLDRCQUFZO1lBQ2hCLFdBQUk7WUFDQSw4Q0FBa0I7WUFDZiwwQkFBVztPQTNDM0IsZ0JBQWdCLENBdWE1QjtJQUFELHVCQUFDO0NBQUEsQUF2YUQsSUF1YUM7QUF2YVksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHtVc2VyU2VydmljZX0gZnJvbSBcIi4uLy4uL3NoYXJlZC91c2VyL3VzZXIuc2VydmljZVwiO1xyXG5pbXBvcnQge1JvdXRlcn0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQge1JvdXRlckV4dGVuc2lvbnN9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZX0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgR2VzdHVyZUV2ZW50RGF0YSxcclxuICAgIEdlc3R1cmVUeXBlcyxcclxuICAgIFBhbkdlc3R1cmVFdmVudERhdGEsXHJcbiAgICBQaW5jaEdlc3R1cmVFdmVudERhdGEsXHJcbiAgICBSb3RhdGlvbkdlc3R1cmVFdmVudERhdGEsXHJcbiAgICBTd2lwZUdlc3R1cmVFdmVudERhdGEsXHJcbiAgICBUb3VjaEdlc3R1cmVFdmVudERhdGFcclxufSBmcm9tIFwidWkvZ2VzdHVyZXNcIjtcclxuaW1wb3J0IHtNZWV0aW5nLCBBdHRlbmRlZSwgQWdlbmRhUG9pbnR9IGZyb20gXCIuLi8uLi9zaGFyZWQvbWVldGluZy9tZWV0aW5nXCJcclxuaW1wb3J0IHtNZWV0aW5nU2VydmljZX0gZnJvbSBcIi4uLy4uL3NoYXJlZC9tZWV0aW5nL21lZXRpbmcuc2VydmljZVwiXHJcbmltcG9ydCAqIGFzIGNhbWVyYSBmcm9tIFwibmF0aXZlc2NyaXB0LWNhbWVyYVwiO1xyXG5cclxubGV0IGltYWdlcGlja2VyID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1pbWFnZXBpY2tlclwiKTtcclxuaW1wb3J0ICogYXMgaW1hZ2VTb3VyY2VNb2R1bGUgZnJvbSBcImltYWdlLXNvdXJjZVwiO1xyXG5pbXBvcnQge0ltYWdlfSBmcm9tIFwidWkvaW1hZ2VcIjtcclxuaW1wb3J0IHtJbWFnZUFzc2V0fSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9pbWFnZS1hc3NldFwiO1xyXG5cclxudmFyIGZzID0gcmVxdWlyZShcImZpbGUtc3lzdGVtXCIpO1xyXG5pbXBvcnQgKiBhcyBpbWFnZVNvdXJjZSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9pbWFnZS1zb3VyY2VcIjtcclxuaW1wb3J0IHtSYWRTaWRlRHJhd2VyQ29tcG9uZW50LCBTaWRlRHJhd2VyVHlwZX0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvc2lkZWRyYXdlci9hbmd1bGFyXCI7XHJcbmltcG9ydCB7UmFkU2lkZURyYXdlcn0gZnJvbSAnbmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyJztcclxuaW1wb3J0IHtUTlNGb250SWNvblNlcnZpY2V9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5pbXBvcnQgKiBhcyB0YWJWaWV3TW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL3RhYi12aWV3XCI7XHJcbmltcG9ydCB7RHJvcERvd24sIFZhbHVlTGlzdCwgU2VsZWN0ZWRJbmRleENoYW5nZWRFdmVudERhdGF9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duXCI7XHJcbmltcG9ydCB7XHJcbiAgICBDYWxlbmRhcixcclxuICAgIFNFTEVDVElPTl9NT0RFLCAvLyBNdWx0aXBsZSBvciBzaW5nbGVcclxuICAgIERJU1BMQVlfTU9ERSwgLy8gV2VlayBvciBtb250aFxyXG4gICAgQ2FsZW5kYXJFdmVudCwgLy8gbGl0dGxlIGRvdHNcclxuICAgIEFwcGVhcmFuY2UsIC8vIHN0eWxlIGN1c3RvbWlzYXRpb25cclxuICAgIFNDUk9MTF9PUklFTlRBVElPTiwgLy8gc2Nyb2xsIG9yaWVudGF0aW9uIGZvciBpT1NcclxuICAgIENhbGVuZGFyU3VidGl0bGUsIC8vIHN1YnRpdGxlcyBmb3IgaU9TXHJcbiAgICBTZXR0aW5ncyAvLyBTZXR0aW5ncyBpbnRlcmZhY2VcclxufSBmcm9tICduYXRpdmVzY3JpcHQtZmFuY3ktY2FsZW5kYXInO1xyXG5pbXBvcnQge3JlZ2lzdGVyRWxlbWVudH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnlcIjtcclxuaW1wb3J0IHtQYWdlfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBOYXZDb21wb25lbnQgfSBmcm9tIFwiLi4vbmF2L25hdi5jb21wb25lbnRcIjtcclxuaW1wb3J0IHtNb2RhbERhdGV0aW1lcGlja2VyLCBQaWNrZXJPcHRpb25zfSBmcm9tIFwibmF0aXZlc2NyaXB0LW1vZGFsLWRhdGV0aW1lcGlja2VyXCI7XHJcbmltcG9ydCAqIGFzIGRpYWxvZ3MgZnJvbSBcInVpL2RpYWxvZ3NcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWdcIjtcclxudmFyIGJnaHR0cCA9IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtYmFja2dyb3VuZC1odHRwXCIpOyAvL2ZpbGUgdXBsb2FkXHJcblxyXG5yZWdpc3RlckVsZW1lbnQoJ0NhbGVuZGFyJywgKCkgPT4gQ2FsZW5kYXIpO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogXCJwYi1tZWV0aW5nXCIsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9tZWV0aW5nL21lZXRpbmcuaHRtbFwiLFxyXG4gICAgcHJvdmlkZXJzOiBbVXNlclNlcnZpY2UsIE1lZXRpbmdTZXJ2aWNlXSxcclxuICAgIHN0eWxlVXJsczogW1wicGFnZXMvbWVldGluZy9tZWV0aW5nLWNvbW1vbi5jc3NcIl1cclxufSlcclxuZXhwb3J0IGNsYXNzIE1lZXRpbmdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICAgIHNob3dhbnl0aGluZyA6Ym9vbGVhbiA9IHRydWU7XHJcbiAgICBtZWV0aW5nczogTWVldGluZ1tdO1xyXG4gICAgZGlzcGxheWVkTWVldGluZ3M6IE1lZXRpbmdbXTtcclxuICAgIHB1YmxpYyBwaWN0dXJlOiBhbnk7XHJcbiAgICBjcmVhdGU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgbWVldGluZ2RhdGE6IGFueTtcclxuICAgIG1lZXRpbmdzVGV4dDogc3RyaW5nO1xyXG4gICAgbWVldGluZ190YWJzOiBTdHJpbmc7XHJcbiAgICBtZWV0aW5nOiBNZWV0aW5nO1xyXG4gICAgbmF2OiBOYXZDb21wb25lbnQ7XHJcbiAgICBwdWJsaWMgcHJvamVjdFNlbGVjdGlvbiA6c3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgZGlyZWN0aW9uOiBudW1iZXI7XHJcbiAgICBuZXdNZWV0aW5nIDpNZWV0aW5nID0gbmV3IE1lZXRpbmc7XHJcblxyXG4gICAgc2V0dGluZ3M6IGFueTtcclxuICAgIHN1YnRpdGxlczogQ2FsZW5kYXJTdWJ0aXRsZVtdO1xyXG4gICAgZXZlbnRzIDpDYWxlbmRhckV2ZW50W10gPSBuZXcgQXJyYXk8Q2FsZW5kYXJFdmVudD4oKTtcclxuICAgIHB1YmxpYyBhcHBlYXJhbmNlOiBBcHBlYXJhbmNlO1xyXG4gICAgYXBwZWFyYW5jZU9wdGlvbnM6IEFycmF5PEFwcGVhcmFuY2U+O1xyXG4gICAgcHJpdmF0ZSBfY2FsZW5kYXI6IENhbGVuZGFyO1xyXG5cclxuICAgIHNlbGVjdGVkRGF0ZSA6YW55O1xyXG4gICAgc2VsZWN0ZWRUaW1lIDphbnk7XHJcblxyXG4gICAgcHJvamVjdElkcyA6c3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgcHVibGljIHByb2plY3RMaXN0OiBzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcblxyXG4gICAgdXBsb2FkUXVldWUgOmFueVtdID0gbmV3IEFycmF5PGFueT4oKTtcclxuXHJcbiAgICAvKiBkYXRlIHBpY2tlciAqL1xyXG4gICAgcHVibGljIGRhdGU6IHN0cmluZztcclxuICAgIHB1YmxpYyB0aW1lOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIG1vZGFsRGF0ZXRpbWVwaWNrZXI6IE1vZGFsRGF0ZXRpbWVwaWNrZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcclxuICAgICAgICBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsXHJcbiAgICAgICAgcHJpdmF0ZSBtZWV0aW5nU2VydmljZTogTWVldGluZ1NlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSBuYXZTdGF0ZTogTmF2Q29tcG9uZW50LFxyXG4gICAgICAgIHByaXZhdGUgcGFnZTogUGFnZSxcclxuICAgICAgICBwcml2YXRlIGZvbnRpY29uOiBUTlNGb250SWNvblNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSB1c2VyU2VydmljZSA6VXNlclNlcnZpY2VcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMubmF2ID0gbmF2U3RhdGU7XHJcbiAgICAgICAgdGhpcy5tb2RhbERhdGV0aW1lcGlja2VyID0gbmV3IE1vZGFsRGF0ZXRpbWVwaWNrZXIoKTtcclxuICAgICAgICB0aGlzLm1lZXRpbmdfdGFicyA9ICd0ZWlsbmVobWVyJztcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLm1lZXRpbmdTZXJ2aWNlLmdldE1lZXRpbmdzKCkudGhlbihcclxuICAgICAgICAgICAgKGRhdGEpID0+IHRoaXMuZGlzcGxheU1lZXRpbmdzKGRhdGEpLFxyXG4gICAgICAgICAgICAoZXJyb3IpID0+IHRoaXMuZGlzcGxheU1lZXRpbmdzKGZhbHNlKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnBhZ2UuY3NzID0gXCJQYWdlIHsgYmFja2dyb3VuZC1jb2xvcjogI0VDRURFRTsgfSAucGFnZSB7IHBhZGRpbmctbGVmdDogMDsgcGFkZGluZzoyMDsgYmFja2dyb3VuZC1jb2xvcjogI0VDRURFRTt9ICNtZWV0aW5nbGlzdCB7IHBhZGRpbmctbGVmdDogMjA7IH1cIjtcclxuICAgICAgICB0aGlzLnVzZXJTZXJ2aWNlLmdldFByb2plY3RzKClcclxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RMaXN0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgZGF0YS5wcm9qZWN0cy5mb3JFYWNoKChwcm9qZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3RJZHNbdGhpcy5wcm9qZWN0TGlzdC5wdXNoKHByb2plY3QubmFtZSktMV0gPSBwcm9qZWN0LmlkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjcl9tZWV0aW5nKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnBhZ2UuY3NzID0gXCJQYWdlIHsgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjsgfSAuZm9ybS10YXNrdGlja2V0IHsgcGFkZGluZy1sZWZ0OiAwOyBwYWRkaW5nOjIwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO31cIjtcclxuICAgIH1cclxuXHJcbiAgICBjYW5jZWwoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnBhZ2UuY3NzID0gXCJQYWdlIHsgYmFja2dyb3VuZC1jb2xvcjogI0VDRURFRTt9IC5wYWdlIHsgcGFkZGluZzogMDsgcGFkZGluZy1sZWZ0OjIwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjRUNFREVFO30gICNtZWV0aW5nbGlzdCB7IHBhZGRpbmctbGVmdDogMjA7IH0gXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGxheU1lZXRpbmdzKGRhdGE6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2hvd2FueXRoaW5nID0gZmFsc2U7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd2FueXRoaW5nID0gdHJ1ZTtcclxuICAgICAgICB9LCAxKVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBkYXRhLm1lZXRpbmdzLmZvckVhY2gobWVldGluZyA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKG5ldyBDYWxlbmRhckV2ZW50KG5ldyBEYXRlKG1lZXRpbmcuZGF0ZSkpKTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUobWVldGluZy5kYXRlKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJEYXRlLmdldERhdGUoKSA9PSBkYXRlLmdldERhdGUoKSAmJiBjdXJEYXRlLmdldE1vbnRoKCkgPT0gZGF0ZS5nZXRNb250aCgpICYmIGN1ckRhdGUuZ2V0RnVsbFllYXIoKSA9PSBkYXRlLmdldEZ1bGxZZWFyKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZWV0aW5nLmRhdGVGb3JtYXR0ZWQgPSBcIkhFVVRFXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpKzEpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lZXRpbmcuZGF0ZUZvcm1hdHRlZCA9IChkYXRlLmdldERhdGUoKSA8IDEwPyAnMCcrZGF0ZS5nZXREYXRlKCkgOiBkYXRlLmdldERhdGUoKSkgKyBcIi5cIiArIChkYXRlLmdldE1vbnRoKCkgPCAxMD8gJzAnK2RhdGUuZ2V0TW9udGgoKSA6IGRhdGUuZ2V0TW9udGgoKSkgKyBcIi5cIiArIGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpLnN1YnN0cmluZygyLDQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5tZWV0aW5nU2VydmljZS5zYXZlTWVldGluZ3MoZGF0YSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGF0YSA9IHRoaXMubWVldGluZ1NlcnZpY2UuZ2V0U2F2ZWRNZWV0aW5ncygpXHJcbiAgICAgICAgICAgIGRhdGEubWVldGluZ3MuZm9yRWFjaChtZWV0aW5nID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnB1c2gobmV3IENhbGVuZGFyRXZlbnQobmV3IERhdGUobWVldGluZy5kYXRlKSkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VyU2VydmljZS5nZXRTaW5nbGVQcm9qZWN0KG1lZXRpbmcucHJvamVjdClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZWV0aW5nLnByb2plY3RfY29sb3IgPSBkYXRhLnByb2plY3RzWzBdLmNvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7Y29uc29sZS5sb2coXCJBTEFSTVwiKX1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1ckRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShtZWV0aW5nLmRhdGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1ckRhdGUuZ2V0RGF0ZSgpID09IGRhdGUuZ2V0RGF0ZSgpICYmIGN1ckRhdGUuZ2V0TW9udGgoKSA9PSBkYXRlLmdldE1vbnRoKCkgJiYgY3VyRGF0ZS5nZXRGdWxsWWVhcigpID09IGRhdGUuZ2V0RnVsbFllYXIoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lZXRpbmcuZGF0ZUZvcm1hdHRlZCA9IFwiSEVVVEVcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVldGluZy5kYXRlRm9ybWF0dGVkID0gZGF0ZS5nZXREYXRlKCkgKyBcIi5cIiArIGRhdGUuZ2V0TW9udGgoKSArIFwiLlwiICsgZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5tZWV0aW5ncyA9IGRhdGEubWVldGluZ3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRhdGEubWVldGluZ3MuZm9yRWFjaChtZWV0aW5nID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VyU2VydmljZS5nZXRTaW5nbGVQcm9qZWN0KG1lZXRpbmcucHJvamVjdClcclxuICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBtZWV0aW5nLnByb2plY3RfY29sb3IgPSBkYXRhLnByb2plY3RzWzBdLmNvbG9yXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7fVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdmFyIGN1ckRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKG1lZXRpbmcuZGF0ZSk7XHJcbiAgICAgICAgICAgIGlmIChjdXJEYXRlLmdldERhdGUoKSA9PSBkYXRlLmdldERhdGUoKSAmJiBjdXJEYXRlLmdldE1vbnRoKCkgPT0gZGF0ZS5nZXRNb250aCgpICYmIGN1ckRhdGUuZ2V0RnVsbFllYXIoKSA9PSBkYXRlLmdldEZ1bGxZZWFyKCkpIHtcclxuICAgICAgICAgICAgICAgIG1lZXRpbmcuZGF0ZUZvcm1hdHRlZCA9IFwiSEVVVEVcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpKzEpO1xyXG4gICAgICAgICAgICAgICAgbWVldGluZy5kYXRlRm9ybWF0dGVkID0gKGRhdGUuZ2V0RGF0ZSgpIDwgMTA/ICcwJytkYXRlLmdldERhdGUoKSA6IGRhdGUuZ2V0RGF0ZSgpKSArIFwiLlwiICsgKGRhdGUuZ2V0TW9udGgoKSA8IDEwPyAnMCcrZGF0ZS5nZXRNb250aCgpIDogZGF0ZS5nZXRNb250aCgpKSArIFwiLlwiICsgZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDIsNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm1lZXRpbmdzID0gZGF0YS5tZWV0aW5ncztcclxuICAgICAgICB0aGlzLmRpc3BsYXllZE1lZXRpbmdzID0gZGF0YS5tZWV0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVNZWV0aW5nKCkge1xyXG4gICAgICAgIGlmKHRoaXMubmV3TWVldGluZy5hdHRlbmRlZXMpe1xyXG4gICAgICAgICAgICBpZih0aGlzLm5ld01lZXRpbmcuYXR0ZW5kZWVzWzBdKXtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3TWVldGluZy5hdHRlbmRlZXMuZm9yRWFjaCgoYXR0ZW5kZWUsIGluZGV4KSA9PiB7YXR0ZW5kZWUub3JkZXIgPSBpbmRleCsxfSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdNZWV0aW5nLmF0dGVuZGVlcyA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5uZXdNZWV0aW5nLmF0dGVuZGVlcyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMubmV3TWVldGluZy5hZ2VuZGEpe1xyXG4gICAgICAgICAgICBpZih0aGlzLm5ld01lZXRpbmcuYWdlbmRhWzBdKXtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3TWVldGluZy5hZ2VuZGEuZm9yRWFjaCgoYWdlbmRhUG9pbnQsIGluZGV4KSA9PiB7YWdlbmRhUG9pbnQub3JkZXIgPSBpbmRleCsxfSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdNZWV0aW5nLmFnZW5kYSA9IG51bGxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLm5ld01lZXRpbmcuYWdlbmRhID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uZXdNZWV0aW5nLmF0dGVuZGVlcyA9IChKU09OLnN0cmluZ2lmeSh0aGlzLm5ld01lZXRpbmcuYXR0ZW5kZWVzKSk7XHJcbiAgICAgICAgdGhpcy5uZXdNZWV0aW5nLmFnZW5kYSA9IChKU09OLnN0cmluZ2lmeSh0aGlzLm5ld01lZXRpbmcuYWdlbmRhKSk7XHJcbiAgICAgICAgdGhpcy5uZXdNZWV0aW5nLmRhdGUgPSBuZXcgRGF0ZSh0aGlzLnNlbGVjdGVkRGF0ZS55ZWFyLCB0aGlzLnNlbGVjdGVkRGF0ZS5tb250aC0xLCB0aGlzLnNlbGVjdGVkRGF0ZS5kYXksIHRoaXMuc2VsZWN0ZWRUaW1lLmhvdXIsIHRoaXMuc2VsZWN0ZWRUaW1lLm1pbnV0ZSk7XHJcbiAgICAgICAgY29uc29sZS5kaXIodGhpcy5uZXdNZWV0aW5nKTtcclxuICAgICAgICB0aGlzLm1lZXRpbmdTZXJ2aWNlLmNyZWF0ZU1lZXRpbmcodGhpcy5uZXdNZWV0aW5nKVxyXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdNZWV0aW5nLmlkID0gZGF0YS5tZWV0aW5nLmlkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZWV0aW5nU2VydmljZS51cGRhdGUodGhpcy5uZXdNZWV0aW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmdPbkluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiB0aGlzLnVwbG9hZFF1ZXVlLmZvckVhY2goKHBhdGgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZEltYWdlKHBhdGgsIGRhdGEubWVldGluZy5pZClcclxuICAgICAgICAgICAgICAgIH0pOyAqL1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93RGV0YWlsKGlkOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIi9tZWV0aW5nX2RldGFpbC9cIiArIGlkXSwge1xyXG5cclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwiZWFzZU91dFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRBdHRlbmRlZSgpIHtcclxuICAgICAgICBpZighdGhpcy5uZXdNZWV0aW5nLmF0dGVuZGVlcyl7XHJcbiAgICAgICAgICAgIHRoaXMubmV3TWVldGluZy5hdHRlbmRlZXMgPSBuZXcgQXJyYXk8QXR0ZW5kZWU+KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuZXdBdHRlbmRlZSA9IG5ldyBBdHRlbmRlZSgpO1xyXG4gICAgICAgIG5ld0F0dGVuZGVlLmlkID0gdGhpcy5nZW5lcmF0ZUd1aWQoKTtcclxuICAgICAgICB0aGlzLm5ld01lZXRpbmcuYXR0ZW5kZWVzLnB1c2gobmV3QXR0ZW5kZWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUF0dGVuZGVlKGluZGV4IDpudW1iZXIpIHtcclxuICAgICAgICB0aGlzLm5ld01lZXRpbmcuYXR0ZW5kZWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUG9pbnQoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMubmV3TWVldGluZy5hZ2VuZGEpe1xyXG4gICAgICAgICAgICB0aGlzLm5ld01lZXRpbmcuYWdlbmRhID0gbmV3IEFycmF5PEFnZW5kYVBvaW50PigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbmV3UG9pbnQgPSBuZXcgQWdlbmRhUG9pbnQoKTtcclxuICAgICAgICBuZXdQb2ludC5pZCA9IHRoaXMuZ2VuZXJhdGVHdWlkKCk7XHJcbiAgICAgICAgdGhpcy5uZXdNZWV0aW5nLmFnZW5kYS5wdXNoKG5ld1BvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVQb2ludChpbmRleCA6bnVtYmVyKSB7XHJcbiAgICAgICAgY29uc29sZS5kaXIodGhpcy5uZXdNZWV0aW5nLmFnZW5kYSk7XHJcbiAgICAgICAgdGhpcy5uZXdNZWV0aW5nLmFnZW5kYS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiBjYWxlbmRhciAqL1xyXG5cclxuICAgIHB1YmxpYyBjYWxlbmRhckxvYWRlZChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSA8U2V0dGluZ3M+e1xyXG4gICAgICAgICAgICBkaXNwbGF5TW9kZTogRElTUExBWV9NT0RFLk1PTlRILFxyXG4gICAgICAgICAgICBzY3JvbGxPcmllbnRhdGlvbjogU0NST0xMX09SSUVOVEFUSU9OLkhPUklaT05UQUwsXHJcbiAgICAgICAgICAgIHNlbGVjdGlvbk1vZGU6IFNFTEVDVElPTl9NT0RFLlNJTkdMRSxcclxuICAgICAgICAgICAgZmlyc3RXZWVrZGF5OiAyLCAvLyBTVU46IE8sIE1PTjogMSwgVFVFUzogMiBldGMuLlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hcHBlYXJhbmNlID0gPEFwcGVhcmFuY2U+e1xyXG4gICAgICAgICAgICB3ZWVrZGF5VGV4dENvbG9yOiBcIiMwMDAwMDBcIiwgLy9jb2xvciBvZiBUdWUsIFdlZCwgVGh1ci4uIChvbmx5IGlPUylcclxuICAgICAgICAgICAgICAgIGhlYWRlclRpdGxlQ29sb3I6IFwiIzAwMDAwMFwiLCAvL2NvbG9yIG9mIHRoZSBjdXJyZW50IE1vbnRoIChvbmx5IGlPUylcclxuICAgICAgICAgICAgICAgIGV2ZW50Q29sb3I6IFwiIzIyMzEzRlwiLCAvLyBjb2xvciBvZiBkb3RzXHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25Db2xvcjogXCIjMjlBNjk5XCIsIC8vIGNvbG9yIG9mIHRoZSBjaXJjbGUgd2hlbiBhIGRhdGUgaXMgY2xpY2tlZFxyXG4gICAgICAgICAgICAgICAgdG9kYXlDb2xvcjogXCIjQkRDM0M3XCIsIC8vIHRoZSBjb2xvciBvZiB0aGUgY3VycmVudCBkYXlcclxuICAgICAgICAgICAgICAgIGhhc0JvcmRlcjogdHJ1ZSwgLy8gcmVtb3ZlIGJvcmRlciAob25seSBpT1MpXHJcbiAgICAgICAgICAgICAgICB0b2RheVNlbGVjdGlvbkNvbG9yOiBcIiMyOUE2OTlcIiwgLy8gdG9kYXkgY29sb3Igd2hlbiBzZWxldGVkIChvbmx5IGlPUylcclxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNDAgLy8gYm9yZGVyIHJhZGl1cyBvZiB0aGUgc2VsZWN0aW9uIG1hcmtlclxyXG4gICAgICAgIH0se1xyXG4gICAgICAgICAgICB3ZWVrZGF5VGV4dENvbG9yOiBcIiMwMDAwMDBcIiwgLy9jb2xvciBvZiBUdWUsIFdlZCwgVGh1ci4uIChvbmx5IGlPUylcclxuICAgICAgICAgICAgaGVhZGVyVGl0bGVDb2xvcjogXCIjMDAwMDAwXCIsIC8vY29sb3Igb2YgdGhlIGN1cnJlbnQgTW9udGggKG9ubHkgaU9TKVxyXG4gICAgICAgICAgICBldmVudENvbG9yOiBcIiMyMjMxM0ZcIiwgLy8gY29sb3Igb2YgZG90c1xyXG4gICAgICAgICAgICBzZWxlY3Rpb25Db2xvcjogXCIjMjlBNjk5XCIsIC8vIGNvbG9yIG9mIHRoZSBjaXJjbGUgd2hlbiBhIGRhdGUgaXMgY2xpY2tlZFxyXG4gICAgICAgICAgICB0b2RheUNvbG9yOiBcIiNCREMzQzdcIiwgLy8gdGhlIGNvbG9yIG9mIHRoZSBjdXJyZW50IGRheVxyXG4gICAgICAgICAgICBoYXNCb3JkZXI6IHRydWUsIC8vIHJlbW92ZSBib3JkZXIgKG9ubHkgaU9TKVxyXG4gICAgICAgICAgICB0b2RheVNlbGVjdGlvbkNvbG9yOiBcIiMyOUE2OTlcIiwgLy8gdG9kYXkgY29sb3Igd2hlbiBzZWxldGVkIChvbmx5IGlPUylcclxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA0MCAvLyBib3JkZXIgcmFkaXVzIG9mIHRoZSBzZWxlY3Rpb24gbWFya2VyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0ZShpZCkge1xyXG4gICAgICAgIHRoaXMubWVldGluZ190YWJzID0gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRhdGVTZWxlY3RlZChldmVudCkge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyQnlEYXRlKGV2ZW50LmRhdGEuZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyQnlEYXRlKGRhdGU6IERhdGUpIHtcclxuICAgICAgICB0aGlzLmRpc3BsYXllZE1lZXRpbmdzID0gbmV3IEFycmF5PE1lZXRpbmc+KCk7XHJcbiAgICAgICAgdGhpcy5tZWV0aW5ncy5mb3JFYWNoKG1lZXRpbmcgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbWVldGluZ0RhdGUgPSBuZXcgRGF0ZShtZWV0aW5nLmRhdGUpO1xyXG4gICAgICAgICAgICBpZiAobWVldGluZ0RhdGUuZ2V0RnVsbFllYXIoKSA9PT0gZGF0ZS5nZXRGdWxsWWVhcigpICYmIG1lZXRpbmdEYXRlLmdldE1vbnRoKCkgPT09IGRhdGUuZ2V0TW9udGgoKSAmJiBtZWV0aW5nRGF0ZS5nZXREYXRlKCkgPT09IGRhdGUuZ2V0RGF0ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXllZE1lZXRpbmdzLnB1c2gobWVldGluZyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKG5ldyBDYWxlbmRhckV2ZW50KG1lZXRpbmdEYXRlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIG1vbnRoQ2hhbmdlZChldmVudCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ21vbnRoIHNlbGVjdGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogZ2VzdGVuICovXHJcbiAgICBvblN3aXBlKGFyZ3M6IFN3aXBlR2VzdHVyZUV2ZW50RGF0YSkge1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gYXJncy5kaXJlY3Rpb247XHJcbiAgICAgICAgLyogbmFjaCByZWNodHMgKi9cclxuICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLm5hdi5zdGF0ZSgndG9kbycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogbmFjaCBsaW5rcyAqL1xyXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmF2LnN0YXRlKCdtZWV0aW5nJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBuYWNoIHVudGVuICovXHJcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09IDQpIHtcclxuICAgICAgICAgICAgdGhpcy5uYXYuc3RhdGUoJ3RpY2tldCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiBkYXRlIHBpY2tlciAqL1xyXG4gICAgc2VsZWN0RGF0ZSgpIHtcclxuICAgICAgICB0aGlzLm1vZGFsRGF0ZXRpbWVwaWNrZXIucGlja0RhdGUoPFBpY2tlck9wdGlvbnM+e1xyXG4gICAgICAgICAgICB0aXRsZTogXCJEYXR1bSBhdXN3w6RobGVuXCIsXHJcbiAgICAgICAgICAgIHRoZW1lOiBcImRhcmtcIixcclxuICAgICAgICAgICAgc3RhcnRpbmdEYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICBtYXhEYXRlOiBuZXcgRGF0ZSgnMjAzMC0wMS0wMScpLCAvKiBoaWVyIG1heERhdGUgc2V0emVuICovXHJcbiAgICAgICAgICAgIG1pbkRhdGU6IG5ldyBEYXRlKClcclxuICAgICAgICB9KS50aGVuKChyZXN1bHQ6YW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZSA9IHJlc3VsdC5kYXkgKyBcIi5cIiArIHJlc3VsdC5tb250aCArIFwiLlwiICsgcmVzdWx0LnllYXI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3TWVldGluZy5kYXRlID0gbmV3IERhdGUocmVzdWx0LnllYXIsIHJlc3VsdC5tb250aCwgcmVzdWx0LmRheSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGVjdFRpbWUoKSB7XHJcbiAgICAgICAgdGhpcy5tb2RhbERhdGV0aW1lcGlja2VyLnBpY2tUaW1lKDxQaWNrZXJPcHRpb25zPntcclxuICAgICAgICAgICAgdGhlbWU6IFwiZGFya1wiLFxyXG4gICAgICAgICAgICBpczI0SG91clZpZXc6IHRydWVcclxuICAgICAgICB9KS50aGVuKChyZXN1bHQ6YW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZSA9IHJlc3VsdC5ob3VyICsgXCI6XCIgKyAocmVzdWx0Lm1pbnV0ZT45P3Jlc3VsdC5taW51dGU6XCIwXCIrcmVzdWx0Lm1pbnV0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVGltZSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiICsgZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZWN0UHJvamVjdChhcmdzOiBTZWxlY3RlZEluZGV4Q2hhbmdlZEV2ZW50RGF0YSl7XHJcbiAgICAgICAgdGhpcy5uZXdNZWV0aW5nLnByb2plY3QgPSB0aGlzLnByb2plY3RJZHNbYXJncy5uZXdJbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVHdWlkKCl7XHJcbiAgICAgICAgZnVuY3Rpb24gczQoKXtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXHJcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4oczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wZW5DYW1lcmEoKXtcclxuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGNhbWVyYS5yZXF1ZXN0UGVybWlzc2lvbnMoKTtcclxuICAgICAgICBjYW1lcmEudGFrZVBpY3R1cmUoKVxyXG4gICAgICAgICAgICAudGhlbigoaW1hZ2VBc3NldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXN1bHQgaXMgYW4gaW1hZ2UgYXNzZXQgaW5zdGFuY2VcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gbmV3IGltYWdlU291cmNlLkltYWdlU291cmNlKCk7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2UuZnJvbUFzc2V0KGltYWdlQXNzZXQpLnRoZW4oKHNvdXJjZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmb2xkZXIgPSBmcy5rbm93bkZvbGRlcnMuZG9jdW1lbnRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lID0gXCJ0ZXN0LnBuZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGggPSBmcy5wYXRoLmpvaW4oZm9sZGVyLnBhdGgsIG1pbGxpc2Vjb25kcyArIFwiLnBuZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2F2ZWQgPSBzb3VyY2Uuc2F2ZVRvRmlsZShwYXRoLCBcInBuZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihzYXZlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZWQgaW1hZ2VcIilcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC51cGxvYWRRdWV1ZS5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIC0+IFwiICsgZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAgIHNvdXJjZXBpYygpIHtcclxuICAgICAgICAgIGRpYWxvZ3MuYWN0aW9uKHtcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBcIlF1ZWxsZSBkZXMgQmlsZGVzXCIsXHJcbiAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJBYmJyZWNoZW5cIixcclxuICAgICAgICAgICAgICBhY3Rpb25zOiBbXCJLYW1lcmFcIiwgXCJHYWxsZXJpZVwiXVxyXG4gICAgICAgICAgfSkudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgIGlmKHJlc3VsdCA9PSBcIkthbWVyYVwiKXtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuQ2FtZXJhKCk7XHJcbiAgICAgICAgICAgICAgfWVsc2UgaWYocmVzdWx0ID09IFwiR2FsbGVyaWVcIil7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkdhbGxlcnkoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgXHJcbiAgICAgIG9wZW5HYWxsZXJ5KCl7XHJcbiAgICBcclxuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGxldCBjb250ZXh0ID0gaW1hZ2VwaWNrZXIuY3JlYXRlKHtcclxuICAgICAgICAgIG1vZGU6IFwic2luZ2xlXCIgLy91c2UgXCJtdWx0aXBsZVwiIGZvciBtdWx0aXBsZSBzZWxlY3Rpb25cclxuICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgIGNvbnRleHRcclxuICAgICAgICAuYXV0aG9yaXplKClcclxuICAgICAgICAudGhlbigoKSA9PiBjb250ZXh0LnByZXNlbnQoKSlcclxuICAgICAgICAudGhlbigoc2VsZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgICBzZWxlY3Rpb24uZm9yRWFjaChzZWxlY3RlZCA9PiB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkLmdldEltYWdlKCkudGhlbihmdW5jdGlvbihpbWFnZXNvdXJjZSl7XHJcbiAgICAgICAgICAgICAgbGV0IGZvbGRlciA9IGZzLmtub3duRm9sZGVycy5kb2N1bWVudHMoKTtcclxuICAgICAgICAgICAgICB2YXIgcGF0aCA9IGZzLnBhdGguam9pbihmb2xkZXIucGF0aCwgbWlsbGlzZWNvbmRzICsgXCIucG5nXCIpO1xyXG4gICAgICAgICAgICAgIHZhciBzYXZlZCA9IGltYWdlc291cmNlLnNhdmVUb0ZpbGUocGF0aCwgXCJwbmdcIik7XHJcbiAgICAgICAgICAgICAgdGhhdC51cGxvYWRRdWV1ZS5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgLy8gcHJvY2VzcyBlcnJvclxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB1cGxvYWRJbWFnZShwYXRoLCBtZWV0aW5nX2lkKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInVwbG9hZGluZy4uLlwiKTtcclxuICAgICAgICB2YXIgc2Vzc2lvbiA9IGJnaHR0cC5zZXNzaW9uKFwiaW1hZ2UtdXBsb2FkXCIpO1xyXG4gICAgIFxyXG4gICAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICB1cmw6IENvbmZpZy5hcGlVcmwgKyBcInYyL3VwbG9hZC9maWxlc1wiLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxyXG4gICAgICAgICAgICAgICAgXCJGaWxlLU5hbWVcIjogXCJtb2JpbGVfdXBsb2FkLnBuZ1wiLFxyXG4gICAgICAgICAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcInsgJ3VwbG9hZGluZyc6ICdtb2JpbGVfdXBsb2FkLnBuZycgfVwiIC8vd2llIGJvZHkgYmVpIG5vcm1hbGVtIHBvc3RcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBwYXJhbXMgPSBbe25hbWU6IFwibWVldGluZ1wiLCB2YWx1ZTogbWVldGluZ19pZH0sIHtuYW1lOlwiZmlsZVwiLCBmaWxlbmFtZTogcGF0aCAsIG1pbWVUeXBlOiAnaW1hZ2UvcG5nJ31dO1xyXG4gICAgXHJcbiAgICAgICAgbGV0IHRhc2sgPSBzZXNzaW9uLm11bHRpcGFydFVwbG9hZChwYXJhbXMsIHJlcXVlc3QpO1xyXG4gICAgIFxyXG4gICAgICAgIHRhc2sub24oXCJwcm9ncmVzc1wiLCB0aGlzLmxvZ0V2ZW50KTtcclxuICAgICAgICB0YXNrLm9uKFwiZXJyb3JcIiwgdGhpcy5sb2dFdmVudCk7XHJcbiAgICAgICAgdGFzay5vbihcImNvbXBsZXRlXCIsIHRoaXMubG9nRXZlbnQpO1xyXG4gICAgICB9XHJcbiAgICAgXHJcbiAgICAgIGxvZ0V2ZW50KGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlLmV2ZW50TmFtZSk7XHJcbiAgICAgIH1cclxufSJdfQ==