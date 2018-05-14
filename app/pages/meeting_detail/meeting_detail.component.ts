import { Component, OnInit } from "@angular/core";
import { UserService } from "../../shared/user/user.service";
import { Router} from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import {ActivatedRoute} from "@angular/router";
import {
  GestureEventData,
  GestureTypes,
  PanGestureEventData,
  PinchGestureEventData,
  RotationGestureEventData,
  SwipeGestureEventData,
  TouchGestureEventData} from "ui/gestures";
import { Meeting, AgendaPoint } from "../../shared/meeting/meeting"
import { MeetingService } from "../../shared/meeting/meeting.service"
import * as camera from "nativescript-camera";
let imagepicker = require("nativescript-imagepicker");
import * as imageSourceModule from "image-source";
import { Image } from "ui/image";
import { ImageAsset } from "tns-core-modules/image-asset";
var fs = require("file-system");
import * as imageSource from "tns-core-modules/image-source";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-pro-ui/sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-pro-ui/sidedrawer';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as tabViewModule from "tns-core-modules/ui/tab-view";
import { FileObject } from "../../shared/user/fileObject";
import { Page } from "ui/page";
import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import * as dialogs from "ui/dialogs";

/* date picker */
import { ModalDatetimepicker, PickerOptions } from 'nativescript-modal-datetimepicker';
import {StatusService} from "../../shared/status/status.service";
import { Config } from "../../shared/config";

var PhotoViewer = require("nativescript-photoviewer");

var bghttp = require("nativescript-background-http"); //file upload

@Component({
  selector: "pb-meeting_detail",
  templateUrl: "pages/meeting_detail/meeting_detail.html",
  providers: [UserService, MeetingService, StatusService],
  styleUrls: ["pages/meeting_detail/meeting_detail-common.css", "pages/meeting_detail/meeting_detail.css"]
})
export class Meeting_detailComponent implements OnInit{
  selectedProjectIndex: number;
  public selectedDate;
  public date: string;
  public time: string;
  private modalDatetimepicker: ModalDatetimepicker;
  photoViewer = new PhotoViewer();
  meeting :Meeting;
  public picture :ImageAsset;
  userFiles :FileObject[];
  imageFiles :string[] = new Array<string>();
  meeting_tabs: String;
  public projectNames: string[] = new Array<string>();
  projectIds :string[] = new Array<string>();
  attendeesString :string = "";
  agenda :AgendaPoint[];


  constructor(private route :ActivatedRoute, private router: Router, private routerExtensions: RouterExtensions, private page: Page, private meetingService: MeetingService, private userService: UserService) {

    this.route.params.subscribe((params) => {
      this.getMeeting(params["id"]);
    });

      this.modalDatetimepicker = new ModalDatetimepicker();
  }

  ngOnInit(){
    this.userService.getFiles().then(
      (data) => this.displayFiles(data),
      (error) => this.displayFiles(false)
    )
    .then(() => {
      
      this.userFiles.forEach(file => {
        if(file.meeting_id != this.meeting.id){
          this.userFiles.splice(this.userFiles.indexOf(file), 1);
        }
      });
      
    })
    .then(() => {
      this.userFiles.forEach(file => {
        if(file.mime.split("/")[0] === "image"){
          file.imagesrc = (Config.apiUrl + "v2/preview/file/" + file.id + "?access_token=" + Config.token)
        }
      });
    });

      this.page.css = "Page { background-color: #ffffff; } .page { padding-left: 0; padding:20; background-color: #ffffff;}";

      this.meeting_tabs = 'agenda';
  }

  getMeeting(meeting_id :number){
    this.meetingService.getMeetings().then(
      (data) => this.getMeetingById(data.meetings, meeting_id),
      (error) => this.getMeetingById(null, meeting_id)
    );
  }

  cancel() {
    this.routerExtensions.backToPreviousPage();
  }

  displayFiles(data :any){
    if(data){
      this.userFiles = data.files;
    }else{
      data = this.userService.getSavedFiles();
      this.userFiles = data.files;
    }
  }

  getMeetingById(data :any, meeting_id :number){
    if(!data){
      data = this.meetingService.getSavedMeetings();
    }
    data.forEach(meeting => {
      if(meeting.id === meeting_id){
        this.meeting = meeting;
        console.dir(meeting);
        let date = new Date(meeting.date);
        date.setMonth(date.getMonth()+1);
        this.date = (date.getDate() < 10? '0'+date.getDate() : date.getDate()) + "." + (date.getMonth() < 10? '0'+date.getMonth() : date.getMonth()) + "." + date.getFullYear().toString();
        this.time = date.getHours() + ":" + date.getMinutes();
        JSON.parse(this.meeting.attendees).forEach((attendee) => {this.attendeesString += attendee.name + ", "});
        this.attendeesString = this.attendeesString.substring(0, this.attendeesString.length-2);
        this.agenda = JSON.parse(this.meeting.agenda);
        this.userService.getProjects()
          .then((data) => {
        data.projects.forEach((project) => {
          this.projectIds[this.projectNames.push(project.name)-1] = project.id;
          if(project.id == this.meeting.project){
            this.selectedProjectIndex = this.projectNames.length-1;
          }
        });
      });
      }
    });
  }

  updateMeeting(){
    this.meetingService.update(this.meeting);
    this.cancel();
  }

  uploadImage(){
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
    var params = [{name: "meeting", value: this.meeting.id}, {name:"file", filename: this.picture , mimeType: 'image/png'}];

    let task = session.multipartUpload(params, request);
 
    task.on("progress", this.logEvent);
    task.on("error", this.logEvent);
    task.on("complete", this.logEvent);
  }
 
  logEvent(e) {
    console.log(e.eventName);
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
                that.picture = path;
                that.uploadImage();
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
          that.picture = path;
          that.uploadImage();
        })
      });
    }).catch(function (e) {
        // process error
    });
  }

  state(id) {
      this.meeting_tabs = id;
  }

  showImage(src :string){
    this.imageFiles = new Array<string>();
    this.userFiles.forEach((file) => {
      this.imageFiles.push(file.imagesrc);
    });
    this.photoViewer.showViewer(this.imageFiles);
  }

  /* drop down */
    public selectedIndex = 1;
    public items: Array<string>;


    public onchange(args: SelectedIndexChangedEventData) {
    }

    public onopen() {
    }

    public onclose() {
    }

    /* date pciker */
    selectDate() {
        this.modalDatetimepicker.pickDate(<PickerOptions>{
            title: "Datum auswählen",
            theme: "dark",
            startingDate: new Date(),
            maxDate: new Date('2030-12-31'),
            minDate: new Date()
        }).then((result:any) => {
            if (result) {
                this.date = result.day + "." + result.month+1 + "." + result.year;
                this.selectedDate = new Date(result.day, result.month, result.year);
            }
        })
            .catch((error) => {
                console.log("Error: " + error);
            });
    };

    /* time picker */
    selectTime() {
        this.modalDatetimepicker.pickTime(<PickerOptions>{
            theme: "dark",
            is24HourView: true
        }).then((result:any) => {
            if (result) {
                this.meeting.date = new Date(this.meeting.date.getFullYear(), this.meeting.date.getMonth(), this.meeting.date.getDate(), result.hour, result.minute, 0);
                this.time = result.hour + ":" + result.minute;
            }
        })
            .catch((error) => {
                console.log("Error: " + error);
            });
    };

    reloadFiles(){
      console.log("reloadFiles");
      this.userService.getFiles().then(
        (data) => this.displayFiles(data),
        (error) => this.displayFiles(false)
      )
      .then(() => {
        
        this.userFiles.forEach(file => {
          if(file.meeting_id != this.meeting.id){
            this.userFiles.splice(this.userFiles.indexOf(file), 1);
          }
        });
        
      })
      .then(() => {
        this.userFiles.forEach(file => {
          if(file.mime.split("/")[0] === "image"){
            file.imagesrc = (Config.apiUrl + "v2/preview/file/" + file.id + "?access_token=" + Config.token)
          }
        });
      });
    }
}
