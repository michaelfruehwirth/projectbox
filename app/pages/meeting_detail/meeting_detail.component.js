"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_service_1 = require("../../shared/user/user.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var router_3 = require("@angular/router");
var meeting_service_1 = require("../../shared/meeting/meeting.service");
var camera = require("nativescript-camera");
var imagepicker = require("nativescript-imagepicker");
var fs = require("file-system");
var imageSource = require("tns-core-modules/image-source");
var page_1 = require("ui/page");
var dialogs = require("ui/dialogs");
/* date picker */
var nativescript_modal_datetimepicker_1 = require("nativescript-modal-datetimepicker");
var status_service_1 = require("../../shared/status/status.service");
var config_1 = require("../../shared/config");
var PhotoViewer = require("nativescript-photoviewer");
var bghttp = require("nativescript-background-http"); //file upload
var Meeting_detailComponent = (function () {
    function Meeting_detailComponent(route, router, routerExtensions, page, meetingService, userService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.routerExtensions = routerExtensions;
        this.page = page;
        this.meetingService = meetingService;
        this.userService = userService;
        this.photoViewer = new PhotoViewer();
        this.imageFiles = new Array();
        this.projectNames = new Array();
        this.projectIds = new Array();
        this.attendeesString = "";
        /* drop down */
        this.selectedIndex = 1;
        this.route.params.subscribe(function (params) {
            _this.getMeeting(params["id"]);
        });
        this.modalDatetimepicker = new nativescript_modal_datetimepicker_1.ModalDatetimepicker();
    }
    Meeting_detailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getFiles().then(function (data) { return _this.displayFiles(data); }, function (error) { return _this.displayFiles(false); })
            .then(function () {
            _this.userFiles.forEach(function (file) {
                if (file.meeting_id != _this.meeting.id) {
                    _this.userFiles.splice(_this.userFiles.indexOf(file), 1);
                }
            });
        })
            .then(function () {
            _this.userFiles.forEach(function (file) {
                if (file.mime.split("/")[0] === "image") {
                    file.imagesrc = (config_1.Config.apiUrl + "v2/preview/file/" + file.id + "?access_token=" + config_1.Config.token);
                }
            });
        });
        this.page.css = "Page { background-color: #ffffff; } .page { padding-left: 0; padding:20; background-color: #ffffff;}";
        this.meeting_tabs = 'agenda';
    };
    Meeting_detailComponent.prototype.getMeeting = function (meeting_id) {
        var _this = this;
        this.meetingService.getMeetings().then(function (data) { return _this.getMeetingById(data.meetings, meeting_id); }, function (error) { return _this.getMeetingById(null, meeting_id); });
    };
    Meeting_detailComponent.prototype.cancel = function () {
        this.routerExtensions.backToPreviousPage();
    };
    Meeting_detailComponent.prototype.displayFiles = function (data) {
        if (data) {
            this.userFiles = data.files;
        }
        else {
            data = this.userService.getSavedFiles();
            this.userFiles = data.files;
        }
    };
    Meeting_detailComponent.prototype.getMeetingById = function (data, meeting_id) {
        var _this = this;
        if (!data) {
            data = this.meetingService.getSavedMeetings();
        }
        data.forEach(function (meeting) {
            if (meeting.id === meeting_id) {
                _this.meeting = meeting;
                console.dir(meeting);
                var date = new Date(meeting.date);
                date.setMonth(date.getMonth() + 1);
                _this.date = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + "." + (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()) + "." + date.getFullYear().toString();
                _this.time = date.getHours() + ":" + date.getMinutes();
                JSON.parse(_this.meeting.attendees).forEach(function (attendee) { _this.attendeesString += attendee.name + ", "; });
                _this.attendeesString = _this.attendeesString.substring(0, _this.attendeesString.length - 2);
                _this.agenda = JSON.parse(_this.meeting.agenda);
                _this.userService.getProjects()
                    .then(function (data) {
                    data.projects.forEach(function (project) {
                        _this.projectIds[_this.projectNames.push(project.name) - 1] = project.id;
                        if (project.id == _this.meeting.project) {
                            _this.selectedProjectIndex = _this.projectNames.length - 1;
                        }
                    });
                });
            }
        });
    };
    Meeting_detailComponent.prototype.updateMeeting = function () {
        this.meetingService.update(this.meeting);
        this.cancel();
    };
    Meeting_detailComponent.prototype.uploadImage = function () {
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
        var params = [{ name: "meeting", value: this.meeting.id }, { name: "file", filename: this.picture, mimeType: 'image/png' }];
        var task = session.multipartUpload(params, request);
        task.on("progress", this.logEvent);
        task.on("error", this.logEvent);
        task.on("complete", this.logEvent);
    };
    Meeting_detailComponent.prototype.logEvent = function (e) {
        console.log(e.eventName);
    };
    Meeting_detailComponent.prototype.openCamera = function () {
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
                that.picture = path;
                that.uploadImage();
            });
        }).catch(function (err) {
            console.log("Error -> " + err.message);
        });
    };
    Meeting_detailComponent.prototype.sourcepic = function () {
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
    Meeting_detailComponent.prototype.openGallery = function () {
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
                    that.picture = path;
                    that.uploadImage();
                });
            });
        }).catch(function (e) {
            // process error
        });
    };
    Meeting_detailComponent.prototype.state = function (id) {
        this.meeting_tabs = id;
    };
    Meeting_detailComponent.prototype.showImage = function (src) {
        var _this = this;
        this.imageFiles = new Array();
        this.userFiles.forEach(function (file) {
            _this.imageFiles.push(file.imagesrc);
        });
        this.photoViewer.showViewer(this.imageFiles);
    };
    Meeting_detailComponent.prototype.onchange = function (args) {
    };
    Meeting_detailComponent.prototype.onopen = function () {
    };
    Meeting_detailComponent.prototype.onclose = function () {
    };
    /* date pciker */
    Meeting_detailComponent.prototype.selectDate = function () {
        var _this = this;
        this.modalDatetimepicker.pickDate({
            title: "Datum auswählen",
            theme: "dark",
            startingDate: new Date(),
            maxDate: new Date('2030-12-31'),
            minDate: new Date()
        }).then(function (result) {
            if (result) {
                _this.date = result.day + "." + result.month + 1 + "." + result.year;
                _this.selectedDate = new Date(result.day, result.month, result.year);
            }
        })
            .catch(function (error) {
            console.log("Error: " + error);
        });
    };
    ;
    /* time picker */
    Meeting_detailComponent.prototype.selectTime = function () {
        var _this = this;
        this.modalDatetimepicker.pickTime({
            theme: "dark",
            is24HourView: true
        }).then(function (result) {
            if (result) {
                _this.meeting.date = new Date(_this.meeting.date.getFullYear(), _this.meeting.date.getMonth(), _this.meeting.date.getDate(), result.hour, result.minute, 0);
                _this.time = result.hour + ":" + result.minute;
            }
        })
            .catch(function (error) {
            console.log("Error: " + error);
        });
    };
    ;
    Meeting_detailComponent.prototype.reloadFiles = function () {
        var _this = this;
        console.log("reloadFiles");
        this.userService.getFiles().then(function (data) { return _this.displayFiles(data); }, function (error) { return _this.displayFiles(false); })
            .then(function () {
            _this.userFiles.forEach(function (file) {
                if (file.meeting_id != _this.meeting.id) {
                    _this.userFiles.splice(_this.userFiles.indexOf(file), 1);
                }
            });
        })
            .then(function () {
            _this.userFiles.forEach(function (file) {
                if (file.mime.split("/")[0] === "image") {
                    file.imagesrc = (config_1.Config.apiUrl + "v2/preview/file/" + file.id + "?access_token=" + config_1.Config.token);
                }
            });
        });
    };
    Meeting_detailComponent = __decorate([
        core_1.Component({
            selector: "pb-meeting_detail",
            templateUrl: "pages/meeting_detail/meeting_detail.html",
            providers: [user_service_1.UserService, meeting_service_1.MeetingService, status_service_1.StatusService],
            styleUrls: ["pages/meeting_detail/meeting_detail-common.css", "pages/meeting_detail/meeting_detail.css"]
        }),
        __metadata("design:paramtypes", [router_3.ActivatedRoute, router_1.Router, router_2.RouterExtensions, page_1.Page, meeting_service_1.MeetingService, user_service_1.UserService])
    ], Meeting_detailComponent);
    return Meeting_detailComponent;
}());
exports.Meeting_detailComponent = Meeting_detailComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVldGluZ19kZXRhaWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWVldGluZ19kZXRhaWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELCtEQUE2RDtBQUM3RCwwQ0FBd0M7QUFDeEMsc0RBQStEO0FBQy9ELDBDQUErQztBQVUvQyx3RUFBcUU7QUFDckUsNENBQThDO0FBQzlDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBSXRELElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNoQywyREFBNkQ7QUFNN0QsZ0NBQStCO0FBRS9CLG9DQUFzQztBQUV0QyxpQkFBaUI7QUFDakIsdUZBQXVGO0FBQ3ZGLHFFQUFpRTtBQUNqRSw4Q0FBNkM7QUFFN0MsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFFdEQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxhQUFhO0FBUW5FO0lBa0JFLGlDQUFvQixLQUFxQixFQUFVLE1BQWMsRUFBVSxnQkFBa0MsRUFBVSxJQUFVLEVBQVUsY0FBOEIsRUFBVSxXQUF3QjtRQUEzTSxpQkFPQztRQVBtQixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBWjNNLGdCQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUloQyxlQUFVLEdBQWEsSUFBSSxLQUFLLEVBQVUsQ0FBQztRQUVwQyxpQkFBWSxHQUFhLElBQUksS0FBSyxFQUFVLENBQUM7UUFDcEQsZUFBVSxHQUFhLElBQUksS0FB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SyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFBLENBQUM7b0JBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxlQUFNLENBQUMsTUFBTSxHQUFHLGtCQUFrQixHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsZ0JBQWdCLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNsRyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUF6UlEsdUJBQXVCO1FBTm5DLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFdBQVcsRUFBRSwwQ0FBMEM7WUFDdkQsU0FBUyxFQUFFLENBQUMsMEJBQVcsRUFBRSxnQ0FBYyxFQUFFLDhCQUFhLENBQUM7WUFDdkQsU0FBUyxFQUFFLENBQUMsZ0RBQWdELEVBQUUseUNBQXlDLENBQUM7U0FDekcsQ0FBQzt5Q0FtQjJCLHVCQUFjLEVBQWtCLGVBQU0sRUFBNEIseUJBQWdCLEVBQWdCLFdBQUksRUFBMEIsZ0NBQWMsRUFBdUIsMEJBQVc7T0FsQmhNLHVCQUF1QixDQTBSbkM7SUFBRCw4QkFBQztDQUFBLEFBMVJELElBMFJDO0FBMVJZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlci5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IFJvdXRlcn0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQge0FjdGl2YXRlZFJvdXRlfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7XHJcbiAgR2VzdHVyZUV2ZW50RGF0YSxcclxuICBHZXN0dXJlVHlwZXMsXHJcbiAgUGFuR2VzdHVyZUV2ZW50RGF0YSxcclxuICBQaW5jaEdlc3R1cmVFdmVudERhdGEsXHJcbiAgUm90YXRpb25HZXN0dXJlRXZlbnREYXRhLFxyXG4gIFN3aXBlR2VzdHVyZUV2ZW50RGF0YSxcclxuICBUb3VjaEdlc3R1cmVFdmVudERhdGF9IGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xyXG5pbXBvcnQgeyBNZWV0aW5nLCBBZ2VuZGFQb2ludCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbWVldGluZy9tZWV0aW5nXCJcclxuaW1wb3J0IHsgTWVldGluZ1NlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL21lZXRpbmcvbWVldGluZy5zZXJ2aWNlXCJcclxuaW1wb3J0ICogYXMgY2FtZXJhIGZyb20gXCJuYXRpdmVzY3JpcHQtY2FtZXJhXCI7XHJcbmxldCBpbWFnZXBpY2tlciA9IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtaW1hZ2VwaWNrZXJcIik7XHJcbmltcG9ydCAqIGFzIGltYWdlU291cmNlTW9kdWxlIGZyb20gXCJpbWFnZS1zb3VyY2VcIjtcclxuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwidWkvaW1hZ2VcIjtcclxuaW1wb3J0IHsgSW1hZ2VBc3NldCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2ltYWdlLWFzc2V0XCI7XHJcbnZhciBmcyA9IHJlcXVpcmUoXCJmaWxlLXN5c3RlbVwiKTtcclxuaW1wb3J0ICogYXMgaW1hZ2VTb3VyY2UgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvaW1hZ2Utc291cmNlXCI7XHJcbmltcG9ydCB7IFJhZFNpZGVEcmF3ZXJDb21wb25lbnQsIFNpZGVEcmF3ZXJUeXBlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvc2lkZWRyYXdlci9hbmd1bGFyXCI7XHJcbmltcG9ydCB7IFJhZFNpZGVEcmF3ZXIgfSBmcm9tICduYXRpdmVzY3JpcHQtcHJvLXVpL3NpZGVkcmF3ZXInO1xyXG5pbXBvcnQgeyBUTlNGb250SWNvblNlcnZpY2UgfSBmcm9tICduYXRpdmVzY3JpcHQtbmd4LWZvbnRpY29uJztcclxuaW1wb3J0ICogYXMgdGFiVmlld01vZHVsZSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS90YWItdmlld1wiO1xyXG5pbXBvcnQgeyBGaWxlT2JqZWN0IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91c2VyL2ZpbGVPYmplY3RcIjtcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7IFNlbGVjdGVkSW5kZXhDaGFuZ2VkRXZlbnREYXRhIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1kcm9wLWRvd25cIjtcclxuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiO1xyXG5cclxuLyogZGF0ZSBwaWNrZXIgKi9cclxuaW1wb3J0IHsgTW9kYWxEYXRldGltZXBpY2tlciwgUGlja2VyT3B0aW9ucyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1tb2RhbC1kYXRldGltZXBpY2tlcic7XHJcbmltcG9ydCB7U3RhdHVzU2VydmljZX0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zdGF0dXMvc3RhdHVzLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWdcIjtcclxuXHJcbnZhciBQaG90b1ZpZXdlciA9IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtcGhvdG92aWV3ZXJcIik7XHJcblxyXG52YXIgYmdodHRwID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1iYWNrZ3JvdW5kLWh0dHBcIik7IC8vZmlsZSB1cGxvYWRcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcInBiLW1lZXRpbmdfZGV0YWlsXCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvbWVldGluZ19kZXRhaWwvbWVldGluZ19kZXRhaWwuaHRtbFwiLFxyXG4gIHByb3ZpZGVyczogW1VzZXJTZXJ2aWNlLCBNZWV0aW5nU2VydmljZSwgU3RhdHVzU2VydmljZV0sXHJcbiAgc3R5bGVVcmxzOiBbXCJwYWdlcy9tZWV0aW5nX2RldGFpbC9tZWV0aW5nX2RldGFpbC1jb21tb24uY3NzXCIsIFwicGFnZXMvbWVldGluZ19kZXRhaWwvbWVldGluZ19kZXRhaWwuY3NzXCJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNZWV0aW5nX2RldGFpbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdHtcclxuICBzZWxlY3RlZFByb2plY3RJbmRleDogbnVtYmVyO1xyXG4gIHB1YmxpYyBzZWxlY3RlZERhdGU7XHJcbiAgcHVibGljIGRhdGU6IHN0cmluZztcclxuICBwdWJsaWMgdGltZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgbW9kYWxEYXRldGltZXBpY2tlcjogTW9kYWxEYXRldGltZXBpY2tlcjtcclxuICBwaG90b1ZpZXdlciA9IG5ldyBQaG90b1ZpZXdlcigpO1xyXG4gIG1lZXRpbmcgOk1lZXRpbmc7XHJcbiAgcHVibGljIHBpY3R1cmUgOkltYWdlQXNzZXQ7XHJcbiAgdXNlckZpbGVzIDpGaWxlT2JqZWN0W107XHJcbiAgaW1hZ2VGaWxlcyA6c3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gIG1lZXRpbmdfdGFiczogU3RyaW5nO1xyXG4gIHB1YmxpYyBwcm9qZWN0TmFtZXM6IHN0cmluZ1tdID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICBwcm9qZWN0SWRzIDpzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgYXR0ZW5kZWVzU3RyaW5nIDpzdHJpbmcgPSBcIlwiO1xyXG4gIGFnZW5kYSA6QWdlbmRhUG9pbnRbXTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGUgOkFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsIHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSBtZWV0aW5nU2VydmljZTogTWVldGluZ1NlcnZpY2UsIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlKSB7XHJcblxyXG4gICAgdGhpcy5yb3V0ZS5wYXJhbXMuc3Vic2NyaWJlKChwYXJhbXMpID0+IHtcclxuICAgICAgdGhpcy5nZXRNZWV0aW5nKHBhcmFtc1tcImlkXCJdKTtcclxuICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5tb2RhbERhdGV0aW1lcGlja2VyID0gbmV3IE1vZGFsRGF0ZXRpbWVwaWNrZXIoKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCl7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlLmdldEZpbGVzKCkudGhlbihcclxuICAgICAgKGRhdGEpID0+IHRoaXMuZGlzcGxheUZpbGVzKGRhdGEpLFxyXG4gICAgICAoZXJyb3IpID0+IHRoaXMuZGlzcGxheUZpbGVzKGZhbHNlKVxyXG4gICAgKVxyXG4gICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICBcclxuICAgICAgdGhpcy51c2VyRmlsZXMuZm9yRWFjaChmaWxlID0+IHtcclxuICAgICAgICBpZihmaWxlLm1lZXRpbmdfaWQgIT0gdGhpcy5tZWV0aW5nLmlkKXtcclxuICAgICAgICAgIHRoaXMudXNlckZpbGVzLnNwbGljZSh0aGlzLnVzZXJGaWxlcy5pbmRleE9mKGZpbGUpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgIH0pXHJcbiAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgIHRoaXMudXNlckZpbGVzLmZvckVhY2goZmlsZSA9PiB7XHJcbiAgICAgICAgaWYoZmlsZS5taW1lLnNwbGl0KFwiL1wiKVswXSA9PT0gXCJpbWFnZVwiKXtcclxuICAgICAgICAgIGZpbGUuaW1hZ2VzcmMgPSAoQ29uZmlnLmFwaVVybCArIFwidjIvcHJldmlldy9maWxlL1wiICsgZmlsZS5pZCArIFwiP2FjY2Vzc190b2tlbj1cIiArIENvbmZpZy50b2tlbilcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnBhZ2UuY3NzID0gXCJQYWdlIHsgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjsgfSAucGFnZSB7IHBhZGRpbmctbGVmdDogMDsgcGFkZGluZzoyMDsgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjt9XCI7XHJcblxyXG4gICAgICB0aGlzLm1lZXRpbmdfdGFicyA9ICdhZ2VuZGEnO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWVldGluZyhtZWV0aW5nX2lkIDpudW1iZXIpe1xyXG4gICAgdGhpcy5tZWV0aW5nU2VydmljZS5nZXRNZWV0aW5ncygpLnRoZW4oXHJcbiAgICAgIChkYXRhKSA9PiB0aGlzLmdldE1lZXRpbmdCeUlkKGRhdGEubWVldGluZ3MsIG1lZXRpbmdfaWQpLFxyXG4gICAgICAoZXJyb3IpID0+IHRoaXMuZ2V0TWVldGluZ0J5SWQobnVsbCwgbWVldGluZ19pZClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjYW5jZWwoKSB7XHJcbiAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMuYmFja1RvUHJldmlvdXNQYWdlKCk7XHJcbiAgfVxyXG5cclxuICBkaXNwbGF5RmlsZXMoZGF0YSA6YW55KXtcclxuICAgIGlmKGRhdGEpe1xyXG4gICAgICB0aGlzLnVzZXJGaWxlcyA9IGRhdGEuZmlsZXM7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgZGF0YSA9IHRoaXMudXNlclNlcnZpY2UuZ2V0U2F2ZWRGaWxlcygpO1xyXG4gICAgICB0aGlzLnVzZXJGaWxlcyA9IGRhdGEuZmlsZXM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRNZWV0aW5nQnlJZChkYXRhIDphbnksIG1lZXRpbmdfaWQgOm51bWJlcil7XHJcbiAgICBpZighZGF0YSl7XHJcbiAgICAgIGRhdGEgPSB0aGlzLm1lZXRpbmdTZXJ2aWNlLmdldFNhdmVkTWVldGluZ3MoKTtcclxuICAgIH1cclxuICAgIGRhdGEuZm9yRWFjaChtZWV0aW5nID0+IHtcclxuICAgICAgaWYobWVldGluZy5pZCA9PT0gbWVldGluZ19pZCl7XHJcbiAgICAgICAgdGhpcy5tZWV0aW5nID0gbWVldGluZztcclxuICAgICAgICBjb25zb2xlLmRpcihtZWV0aW5nKTtcclxuICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKG1lZXRpbmcuZGF0ZSk7XHJcbiAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkrMSk7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gKGRhdGUuZ2V0RGF0ZSgpIDwgMTA/ICcwJytkYXRlLmdldERhdGUoKSA6IGRhdGUuZ2V0RGF0ZSgpKSArIFwiLlwiICsgKGRhdGUuZ2V0TW9udGgoKSA8IDEwPyAnMCcrZGF0ZS5nZXRNb250aCgpIDogZGF0ZS5nZXRNb250aCgpKSArIFwiLlwiICsgZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy50aW1lID0gZGF0ZS5nZXRIb3VycygpICsgXCI6XCIgKyBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgICAgICBKU09OLnBhcnNlKHRoaXMubWVldGluZy5hdHRlbmRlZXMpLmZvckVhY2goKGF0dGVuZGVlKSA9PiB7dGhpcy5hdHRlbmRlZXNTdHJpbmcgKz0gYXR0ZW5kZWUubmFtZSArIFwiLCBcIn0pO1xyXG4gICAgICAgIHRoaXMuYXR0ZW5kZWVzU3RyaW5nID0gdGhpcy5hdHRlbmRlZXNTdHJpbmcuc3Vic3RyaW5nKDAsIHRoaXMuYXR0ZW5kZWVzU3RyaW5nLmxlbmd0aC0yKTtcclxuICAgICAgICB0aGlzLmFnZW5kYSA9IEpTT04ucGFyc2UodGhpcy5tZWV0aW5nLmFnZW5kYSk7XHJcbiAgICAgICAgdGhpcy51c2VyU2VydmljZS5nZXRQcm9qZWN0cygpXHJcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgIGRhdGEucHJvamVjdHMuZm9yRWFjaCgocHJvamVjdCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9qZWN0SWRzW3RoaXMucHJvamVjdE5hbWVzLnB1c2gocHJvamVjdC5uYW1lKS0xXSA9IHByb2plY3QuaWQ7XHJcbiAgICAgICAgICBpZihwcm9qZWN0LmlkID09IHRoaXMubWVldGluZy5wcm9qZWN0KXtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFByb2plY3RJbmRleCA9IHRoaXMucHJvamVjdE5hbWVzLmxlbmd0aC0xO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVNZWV0aW5nKCl7XHJcbiAgICB0aGlzLm1lZXRpbmdTZXJ2aWNlLnVwZGF0ZSh0aGlzLm1lZXRpbmcpO1xyXG4gICAgdGhpcy5jYW5jZWwoKTtcclxuICB9XHJcblxyXG4gIHVwbG9hZEltYWdlKCl7XHJcbiAgICBjb25zb2xlLmxvZyhcInVwbG9hZGluZy4uLlwiKTtcclxuICAgIHZhciBzZXNzaW9uID0gYmdodHRwLnNlc3Npb24oXCJpbWFnZS11cGxvYWRcIik7XHJcbiBcclxuICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgIHVybDogQ29uZmlnLmFwaVVybCArIFwidjIvdXBsb2FkL2ZpbGVzXCIsXHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIsXHJcbiAgICAgICAgICAgIFwiRmlsZS1OYW1lXCI6IFwibW9iaWxlX3VwbG9hZC5wbmdcIixcclxuICAgICAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJ7ICd1cGxvYWRpbmcnOiAnbW9iaWxlX3VwbG9hZC5wbmcnIH1cIiAvL3dpZSBib2R5IGJlaSBub3JtYWxlbSBwb3N0XHJcbiAgICB9O1xyXG4gICAgdmFyIHBhcmFtcyA9IFt7bmFtZTogXCJtZWV0aW5nXCIsIHZhbHVlOiB0aGlzLm1lZXRpbmcuaWR9LCB7bmFtZTpcImZpbGVcIiwgZmlsZW5hbWU6IHRoaXMucGljdHVyZSAsIG1pbWVUeXBlOiAnaW1hZ2UvcG5nJ31dO1xyXG5cclxuICAgIGxldCB0YXNrID0gc2Vzc2lvbi5tdWx0aXBhcnRVcGxvYWQocGFyYW1zLCByZXF1ZXN0KTtcclxuIFxyXG4gICAgdGFzay5vbihcInByb2dyZXNzXCIsIHRoaXMubG9nRXZlbnQpO1xyXG4gICAgdGFzay5vbihcImVycm9yXCIsIHRoaXMubG9nRXZlbnQpO1xyXG4gICAgdGFzay5vbihcImNvbXBsZXRlXCIsIHRoaXMubG9nRXZlbnQpO1xyXG4gIH1cclxuIFxyXG4gIGxvZ0V2ZW50KGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUuZXZlbnROYW1lKTtcclxuICB9XHJcblxyXG4gIG9wZW5DYW1lcmEoKXtcclxuICAgIHZhciBtaWxsaXNlY29uZHMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIGNhbWVyYS5yZXF1ZXN0UGVybWlzc2lvbnMoKTtcclxuICAgIGNhbWVyYS50YWtlUGljdHVyZSgpXHJcbiAgICAgICAgLnRoZW4oKGltYWdlQXNzZXQpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXN1bHQgaXMgYW4gaW1hZ2UgYXNzZXQgaW5zdGFuY2VcIik7XHJcbiAgICAgICAgICAgIGxldCBzb3VyY2UgPSBuZXcgaW1hZ2VTb3VyY2UuSW1hZ2VTb3VyY2UoKTtcclxuICAgICAgICAgICAgc291cmNlLmZyb21Bc3NldChpbWFnZUFzc2V0KS50aGVuKChzb3VyY2UpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBmb2xkZXIgPSBmcy5rbm93bkZvbGRlcnMuZG9jdW1lbnRzKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmlsZU5hbWUgPSBcInRlc3QucG5nXCJcclxuICAgICAgICAgICAgICAgIGxldCBwYXRoID0gZnMucGF0aC5qb2luKGZvbGRlci5wYXRoLCBtaWxsaXNlY29uZHMgKyBcIi5wbmdcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2F2ZWQgPSBzb3VyY2Uuc2F2ZVRvRmlsZShwYXRoLCBcInBuZ1wiKTtcclxuICAgICAgICAgICAgICAgIGlmKHNhdmVkKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVkIGltYWdlXCIpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGF0LnBpY3R1cmUgPSBwYXRoO1xyXG4gICAgICAgICAgICAgICAgdGhhdC51cGxvYWRJbWFnZSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIC0+IFwiICsgZXJyLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbiAgc291cmNlcGljKCkge1xyXG4gICAgICBkaWFsb2dzLmFjdGlvbih7XHJcbiAgICAgICAgICBtZXNzYWdlOiBcIlF1ZWxsZSBkZXMgQmlsZGVzXCIsXHJcbiAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkFiYnJlY2hlblwiLFxyXG4gICAgICAgICAgYWN0aW9uczogW1wiS2FtZXJhXCIsIFwiR2FsbGVyaWVcIl1cclxuICAgICAgfSkudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgaWYocmVzdWx0ID09IFwiS2FtZXJhXCIpe1xyXG4gICAgICAgICAgICAgIHRoaXMub3BlbkNhbWVyYSgpO1xyXG4gICAgICAgICAgfWVsc2UgaWYocmVzdWx0ID09IFwiR2FsbGVyaWVcIil7XHJcbiAgICAgICAgICAgICAgdGhpcy5vcGVuR2FsbGVyeSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG9wZW5HYWxsZXJ5KCl7XHJcblxyXG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgbGV0IGNvbnRleHQgPSBpbWFnZXBpY2tlci5jcmVhdGUoe1xyXG4gICAgICBtb2RlOiBcInNpbmdsZVwiIC8vdXNlIFwibXVsdGlwbGVcIiBmb3IgbXVsdGlwbGUgc2VsZWN0aW9uXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250ZXh0XHJcbiAgICAuYXV0aG9yaXplKClcclxuICAgIC50aGVuKCgpID0+IGNvbnRleHQucHJlc2VudCgpKVxyXG4gICAgLnRoZW4oKHNlbGVjdGlvbikgPT4ge1xyXG4gICAgICBzZWxlY3Rpb24uZm9yRWFjaChzZWxlY3RlZCA9PiB7XHJcbiAgICAgICAgc2VsZWN0ZWQuZ2V0SW1hZ2UoKS50aGVuKGZ1bmN0aW9uKGltYWdlc291cmNlKXtcclxuICAgICAgICAgIGxldCBmb2xkZXIgPSBmcy5rbm93bkZvbGRlcnMuZG9jdW1lbnRzKCk7XHJcbiAgICAgICAgICB2YXIgcGF0aCA9IGZzLnBhdGguam9pbihmb2xkZXIucGF0aCwgbWlsbGlzZWNvbmRzICsgXCIucG5nXCIpO1xyXG4gICAgICAgICAgdmFyIHNhdmVkID0gaW1hZ2Vzb3VyY2Uuc2F2ZVRvRmlsZShwYXRoLCBcInBuZ1wiKTtcclxuICAgICAgICAgIHRoYXQucGljdHVyZSA9IHBhdGg7XHJcbiAgICAgICAgICB0aGF0LnVwbG9hZEltYWdlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vIHByb2Nlc3MgZXJyb3JcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RhdGUoaWQpIHtcclxuICAgICAgdGhpcy5tZWV0aW5nX3RhYnMgPSBpZDtcclxuICB9XHJcblxyXG4gIHNob3dJbWFnZShzcmMgOnN0cmluZyl7XHJcbiAgICB0aGlzLmltYWdlRmlsZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgdGhpcy51c2VyRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xyXG4gICAgICB0aGlzLmltYWdlRmlsZXMucHVzaChmaWxlLmltYWdlc3JjKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5waG90b1ZpZXdlci5zaG93Vmlld2VyKHRoaXMuaW1hZ2VGaWxlcyk7XHJcbiAgfVxyXG5cclxuICAvKiBkcm9wIGRvd24gKi9cclxuICAgIHB1YmxpYyBzZWxlY3RlZEluZGV4ID0gMTtcclxuICAgIHB1YmxpYyBpdGVtczogQXJyYXk8c3RyaW5nPjtcclxuXHJcblxyXG4gICAgcHVibGljIG9uY2hhbmdlKGFyZ3M6IFNlbGVjdGVkSW5kZXhDaGFuZ2VkRXZlbnREYXRhKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9ub3BlbigpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25jbG9zZSgpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKiBkYXRlIHBjaWtlciAqL1xyXG4gICAgc2VsZWN0RGF0ZSgpIHtcclxuICAgICAgICB0aGlzLm1vZGFsRGF0ZXRpbWVwaWNrZXIucGlja0RhdGUoPFBpY2tlck9wdGlvbnM+e1xyXG4gICAgICAgICAgICB0aXRsZTogXCJEYXR1bSBhdXN3w6RobGVuXCIsXHJcbiAgICAgICAgICAgIHRoZW1lOiBcImRhcmtcIixcclxuICAgICAgICAgICAgc3RhcnRpbmdEYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICBtYXhEYXRlOiBuZXcgRGF0ZSgnMjAzMC0xMi0zMScpLFxyXG4gICAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpXHJcbiAgICAgICAgfSkudGhlbigocmVzdWx0OmFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGUgPSByZXN1bHQuZGF5ICsgXCIuXCIgKyByZXN1bHQubW9udGgrMSArIFwiLlwiICsgcmVzdWx0LnllYXI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IG5ldyBEYXRlKHJlc3VsdC5kYXksIHJlc3VsdC5tb250aCwgcmVzdWx0LnllYXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiB0aW1lIHBpY2tlciAqL1xyXG4gICAgc2VsZWN0VGltZSgpIHtcclxuICAgICAgICB0aGlzLm1vZGFsRGF0ZXRpbWVwaWNrZXIucGlja1RpbWUoPFBpY2tlck9wdGlvbnM+e1xyXG4gICAgICAgICAgICB0aGVtZTogXCJkYXJrXCIsXHJcbiAgICAgICAgICAgIGlzMjRIb3VyVmlldzogdHJ1ZVxyXG4gICAgICAgIH0pLnRoZW4oKHJlc3VsdDphbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZWV0aW5nLmRhdGUgPSBuZXcgRGF0ZSh0aGlzLm1lZXRpbmcuZGF0ZS5nZXRGdWxsWWVhcigpLCB0aGlzLm1lZXRpbmcuZGF0ZS5nZXRNb250aCgpLCB0aGlzLm1lZXRpbmcuZGF0ZS5nZXREYXRlKCksIHJlc3VsdC5ob3VyLCByZXN1bHQubWludXRlLCAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZSA9IHJlc3VsdC5ob3VyICsgXCI6XCIgKyByZXN1bHQubWludXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZWxvYWRGaWxlcygpe1xyXG4gICAgICBjb25zb2xlLmxvZyhcInJlbG9hZEZpbGVzXCIpO1xyXG4gICAgICB0aGlzLnVzZXJTZXJ2aWNlLmdldEZpbGVzKCkudGhlbihcclxuICAgICAgICAoZGF0YSkgPT4gdGhpcy5kaXNwbGF5RmlsZXMoZGF0YSksXHJcbiAgICAgICAgKGVycm9yKSA9PiB0aGlzLmRpc3BsYXlGaWxlcyhmYWxzZSlcclxuICAgICAgKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51c2VyRmlsZXMuZm9yRWFjaChmaWxlID0+IHtcclxuICAgICAgICAgIGlmKGZpbGUubWVldGluZ19pZCAhPSB0aGlzLm1lZXRpbmcuaWQpe1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJGaWxlcy5zcGxpY2UodGhpcy51c2VyRmlsZXMuaW5kZXhPZihmaWxlKSwgMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLnVzZXJGaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xyXG4gICAgICAgICAgaWYoZmlsZS5taW1lLnNwbGl0KFwiL1wiKVswXSA9PT0gXCJpbWFnZVwiKXtcclxuICAgICAgICAgICAgZmlsZS5pbWFnZXNyYyA9IChDb25maWcuYXBpVXJsICsgXCJ2Mi9wcmV2aWV3L2ZpbGUvXCIgKyBmaWxlLmlkICsgXCI/YWNjZXNzX3Rva2VuPVwiICsgQ29uZmlnLnRva2VuKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=