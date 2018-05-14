"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
var config_1 = require("../config");
var application_settings_1 = require("application-settings");
var MeetingService = (function () {
    function MeetingService(http) {
        this.http = http;
        this.headers = new http_1.Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Authorization", "Bearer " + config_1.Config.token);
    }
    MeetingService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error.json()));
        return Rx_1.Observable.throw(error);
    };
    MeetingService.prototype.saveMeetings = function (meetingsToSave) {
        application_settings_1.setString("meetings", JSON.stringify(meetingsToSave));
    };
    MeetingService.prototype.getSavedMeetings = function () {
        return JSON.parse(application_settings_1.getString("meetings"));
    };
    MeetingService.prototype.getMeetings = function () {
        return this.http.get(config_1.Config.apiUrl + "v2/meetings", { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    MeetingService.prototype.createMeeting = function (meeting) {
        delete meeting.id;
        return this.http.post(config_1.Config.apiUrl + "v2/meetings", ("{\"meeting\": " + JSON.stringify(meeting) + "}"), { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    MeetingService.prototype.update = function (meeting) {
        var id = meeting.id + "";
        delete meeting.id;
        return this.http.put(config_1.Config.apiUrl + "v2/meetings/" + id, ("{\"meeting\": " + JSON.stringify(meeting) + "}"), { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
            console.dir(data);
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    MeetingService.prototype.delete = function (id) {
        return this.http.delete(config_1.Config.apiUrl + "v2/meetings/" + id, { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    MeetingService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], MeetingService);
    return MeetingService;
}());
exports.MeetingService = MeetingService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVldGluZy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWVldGluZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBRzNDLHNDQUF3RDtBQUN4RCw4QkFBcUM7QUFDckMsZ0NBQThCO0FBQzlCLGlDQUErQjtBQUMvQix1Q0FBcUM7QUFDckMsb0NBQW1DO0FBQ25DLDZEQVU4QjtBQUc5QjtJQUlFLHdCQUFvQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUY5QixZQUFPLEdBQVksSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUcvQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsU0FBUyxHQUFFLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQscUNBQVksR0FBWixVQUFhLEtBQWU7UUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLGVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELHFDQUFZLEdBQVosVUFBYSxjQUFtQjtRQUM5QixnQ0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELHlDQUFnQixHQUFoQjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdDQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBR0Qsb0NBQVcsR0FBWDtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FDbEIsZUFBTSxDQUFDLE1BQU0sR0FBRyxhQUFhLEVBQzdCLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FDMUI7YUFDQSxHQUFHLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQWYsQ0FBZSxDQUFDO2FBQ2hDLEVBQUUsQ0FBQyxVQUFBLElBQUk7UUFDUixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQzthQUN4QixTQUFTLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFRCxzQ0FBYSxHQUFiLFVBQWMsT0FBZ0I7UUFDNUIsT0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDbkIsZUFBTSxDQUFDLE1BQU0sR0FBRyxhQUFhLEVBQzdCLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsRUFDbEQsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUMxQjthQUNBLEdBQUcsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7YUFDaEMsRUFBRSxDQUFDLFVBQUEsSUFBSTtRQUNSLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO2FBQ3hCLFNBQVMsRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVELCtCQUFNLEdBQU4sVUFBTyxPQUFnQjtRQUNyQixJQUFJLEVBQUUsR0FBVyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNqQyxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUNsQixlQUFNLENBQUMsTUFBTSxHQUFHLGNBQWMsR0FBRyxFQUFFLEVBQ25DLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsRUFDbEQsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUMxQjthQUNBLEdBQUcsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7YUFDaEMsRUFBRSxDQUFDLFVBQUEsSUFBSTtZQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDeEIsU0FBUyxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQsK0JBQU0sR0FBTixVQUFPLEVBQVU7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3JCLGVBQU0sQ0FBQyxNQUFNLEdBQUcsY0FBYyxHQUFHLEVBQUUsRUFDbkMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUMxQjthQUNBLEdBQUcsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7YUFDaEMsRUFBRSxDQUFDLFVBQUEsSUFBSTtRQUNSLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO2FBQ3hCLFNBQVMsRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQTNFVSxjQUFjO1FBRDFCLGlCQUFVLEVBQUU7eUNBS2UsV0FBSTtPQUpuQixjQUFjLENBNkUxQjtJQUFELHFCQUFDO0NBQUEsQUE3RUQsSUE2RUM7QUE3RVksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBNZWV0aW5nIH0gZnJvbSAnLi9tZWV0aW5nJztcclxuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anMvUnhcIjtcclxuaW1wb3J0IFwicnhqcy9hZGQvb3BlcmF0b3IvZG9cIjtcclxuaW1wb3J0IFwicnhqcy9hZGQvb3BlcmF0b3IvbWFwXCI7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvdG9Qcm9taXNlJztcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xyXG5pbXBvcnQge1xyXG4gICAgZ2V0Qm9vbGVhbixcclxuICAgIHNldEJvb2xlYW4sXHJcbiAgICBnZXROdW1iZXIsXHJcbiAgICBzZXROdW1iZXIsXHJcbiAgICBnZXRTdHJpbmcsXHJcbiAgICBzZXRTdHJpbmcsXHJcbiAgICBoYXNLZXksXHJcbiAgICByZW1vdmUsXHJcbiAgICBjbGVhclxyXG59IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTWVldGluZ1NlcnZpY2Uge1xyXG5cclxuICBoZWFkZXJzIDpIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XHJcbiAgICB0aGlzLmhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgIHRoaXMuaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiKyBDb25maWcudG9rZW4pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlRXJyb3JzKGVycm9yOiBSZXNwb25zZSkge1xyXG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXJyb3IuanNvbigpKSk7XHJcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBzYXZlTWVldGluZ3MobWVldGluZ3NUb1NhdmUgOmFueSl7XHJcbiAgICBzZXRTdHJpbmcoXCJtZWV0aW5nc1wiLCBKU09OLnN0cmluZ2lmeShtZWV0aW5nc1RvU2F2ZSkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2F2ZWRNZWV0aW5ncyAoKXtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGdldFN0cmluZyhcIm1lZXRpbmdzXCIpKTtcclxuICB9XHJcbiAgXHJcblxyXG4gIGdldE1lZXRpbmdzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoXHJcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcInYyL21lZXRpbmdzXCIsXHJcbiAgICAgIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH1cclxuICAgIClcclxuICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgLmRvKGRhdGEgPT4ge1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycylcclxuICAgIC50b1Byb21pc2UoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZU1lZXRpbmcobWVldGluZyA6TWVldGluZyl7XHJcbiAgICBkZWxldGUgbWVldGluZy5pZDtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcclxuICAgICAgQ29uZmlnLmFwaVVybCArIFwidjIvbWVldGluZ3NcIixcclxuICAgICAgKFwie1xcXCJtZWV0aW5nXFxcIjogXCIgKyBKU09OLnN0cmluZ2lmeShtZWV0aW5nKSArIFwifVwiKSxcclxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKVxyXG4gICAgLnRvUHJvbWlzZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKG1lZXRpbmcgOk1lZXRpbmcpe1xyXG4gICAgbGV0IGlkIDpzdHJpbmcgPSBtZWV0aW5nLmlkICsgXCJcIjtcclxuICAgIGRlbGV0ZSBtZWV0aW5nLmlkO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoXHJcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcInYyL21lZXRpbmdzL1wiICsgaWQsXHJcbiAgICAgIChcIntcXFwibWVldGluZ1xcXCI6IFwiICsgSlNPTi5zdHJpbmdpZnkobWVldGluZykgKyBcIn1cIiksXHJcbiAgICAgIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH1cclxuICAgIClcclxuICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgLmRvKGRhdGEgPT4ge1xyXG4gICAgICBjb25zb2xlLmRpcihkYXRhKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpXHJcbiAgICAudG9Qcm9taXNlKCk7XHJcbiAgfVxyXG5cclxuICBkZWxldGUoaWQgOnN0cmluZyl7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShcclxuICAgICAgQ29uZmlnLmFwaVVybCArIFwidjIvbWVldGluZ3MvXCIgKyBpZCxcclxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKVxyXG4gICAgLnRvUHJvbWlzZSgpO1xyXG4gIH1cclxuXHJcbn0iXX0=