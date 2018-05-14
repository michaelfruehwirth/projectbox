"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
var application_settings_1 = require("application-settings");
var config_1 = require("../config");
var UserService = (function () {
    function UserService(http) {
        this.http = http;
    }
    //Wahrscheinlicher Fall: wenn der Request nicht 200~ zurückgibt, wird automatisch ein Error geworfen und er springt sofort zum catch
    UserService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error.json) + " handleErrors");
        return Rx_1.Observable.throw(error);
    };
    UserService.prototype.login = function (user) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        return this.http.post(config_1.Config.apiUrl + "v2/token", JSON.stringify({
            username: user.email,
            password: user.password
        }), { headers: headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
            _this.setCurrentUser(data);
            config_1.Config.token = data.access_token;
            console.log(data.access_token);
        })
            .catch(function (err) {
            if (err.indexOf("403")) {
                return Rx_1.Observable.throw("403");
            }
            else {
                return Rx_1.Observable.throw(err);
            }
        });
    };
    UserService.prototype.setCurrentUser = function (usr) {
        var user = usr;
        application_settings_1.setString("curUser", JSON.stringify(user));
    };
    UserService.prototype.getCurrentUser = function () {
        return JSON.parse(application_settings_1.getString("curUser"));
    };
    UserService.prototype.getSingleProject = function (proj_id) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "v2/projects/" + proj_id, { headers: headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    UserService.prototype.getProjects = function () {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "v2/projects", { headers: headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    UserService.prototype.saveProjects = function (projectsToSave) {
        application_settings_1.setString("projects", JSON.stringify(projectsToSave));
    };
    UserService.prototype.getSavedProjects = function () {
        return JSON.parse(application_settings_1.getString("projects"));
    };
    UserService.prototype.getFiles = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "v2/files", { headers: headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
            _this.saveFiles(data);
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    UserService.prototype.getUser = function (user_id) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "v2/users/" + user_id, { headers: headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    UserService.prototype.saveFiles = function (filesToSave) {
        application_settings_1.setString("files", JSON.stringify(filesToSave));
    };
    UserService.prototype.getSavedFiles = function () {
        return JSON.parse(application_settings_1.getString("files"));
    };
    UserService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLHNDQUF3RDtBQUN4RCw4QkFBcUM7QUFDckMsZ0NBQThCO0FBQzlCLGlDQUErQjtBQUMvQix1Q0FBcUM7QUFDckMsNkRBVThCO0FBRzlCLG9DQUFtQztBQUtuQztJQUNFLHFCQUFvQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtJQUFHLENBQUM7SUFFbEMsb0lBQW9JO0lBQ3BJLGtDQUFZLEdBQVosVUFBYSxLQUFlO1FBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLGVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELDJCQUFLLEdBQUwsVUFBTSxJQUFlO1FBQXJCLGlCQXlCQztRQXhCQyxJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFFbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNuQixlQUFNLENBQUMsTUFBTSxHQUFHLFVBQVUsRUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNiLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSztZQUNwQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDeEIsQ0FBQyxFQUNGLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUNyQjthQUNBLEdBQUcsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7YUFDaEMsRUFBRSxDQUFDLFVBQUEsSUFBSTtZQUNOLEtB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QUFFLENBQUMsVUFBQSxJQUFJO1FBQ1IsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDeEIsU0FBUyxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQsK0JBQVMsR0FBVCxVQUFVLFdBQXlCO1FBQ2pDLGdDQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsbUNBQWEsR0FBYjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdDQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBdEhVLFdBQVc7UUFEdkIsaUJBQVUsRUFBRTt5Q0FFZSxXQUFJO09BRG5CLFdBQVcsQ0F3SHZCO0lBQUQsa0JBQUM7Q0FBQSxBQXhIRCxJQXdIQztBQXhIWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXNwb25zZSB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9SeFwiO1xyXG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9kb1wiO1xyXG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9tYXBcIjtcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci90b1Byb21pc2UnO1xyXG5pbXBvcnQge1xyXG4gIGdldEJvb2xlYW4sXHJcbiAgc2V0Qm9vbGVhbixcclxuICBnZXROdW1iZXIsXHJcbiAgc2V0TnVtYmVyLFxyXG4gIGdldFN0cmluZyxcclxuICBzZXRTdHJpbmcsXHJcbiAgaGFzS2V5LFxyXG4gIHJlbW92ZSxcclxuICBjbGVhclxyXG59IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBVc2VyTG9naW4gfSBmcm9tIFwiLi91c2VyTG9naW5cIjtcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuL3VzZXJcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBQcm9qZWN0LCBQaXZvdCB9IGZyb20gXCIuL3Byb2plY3RcIlxyXG5pbXBvcnQgeyBGaWxlT2JqZWN0IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91c2VyL2ZpbGVPYmplY3RcIjtcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHt9XHJcblxyXG4gIC8vV2FocnNjaGVpbmxpY2hlciBGYWxsOiB3ZW5uIGRlciBSZXF1ZXN0IG5pY2h0IDIwMH4genVyw7xja2dpYnQsIHdpcmQgYXV0b21hdGlzY2ggZWluIEVycm9yIGdld29yZmVuIHVuZCBlciBzcHJpbmd0IHNvZm9ydCB6dW0gY2F0Y2hcclxuICBoYW5kbGVFcnJvcnMoZXJyb3I6IFJlc3BvbnNlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShlcnJvci5qc29uKSArIFwiIGhhbmRsZUVycm9yc1wiKTtcclxuICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcclxuICB9XHJcblxyXG4gIGxvZ2luKHVzZXI6IFVzZXJMb2dpbikge1xyXG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gIFxyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxyXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJ2Mi90b2tlblwiLFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmRcclxuICAgICAgfSksXHJcbiAgICAgIHsgaGVhZGVyczogaGVhZGVycyB9XHJcbiAgICApXHJcbiAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgIC5kbyhkYXRhID0+IHtcclxuICAgICAgdGhpcy5zZXRDdXJyZW50VXNlcihkYXRhKTtcclxuICAgICAgQ29uZmlnLnRva2VuID0gZGF0YS5hY2Nlc3NfdG9rZW47XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEuYWNjZXNzX3Rva2VuKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goKGVycjogYW55KSA9PiB7XHJcbiAgICAgIGlmKGVyci5pbmRleE9mKFwiNDAzXCIpKXtcclxuICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhcIjQwM1wiKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRDdXJyZW50VXNlcih1c3IgOlVzZXIpe1xyXG4gICAgbGV0IHVzZXIgOlVzZXIgPSB1c3I7XHJcbiAgICBzZXRTdHJpbmcoXCJjdXJVc2VyXCIsIEpTT04uc3RyaW5naWZ5KHVzZXIpKTtcclxuICB9XHJcbiAgZ2V0Q3VycmVudFVzZXIoKSA6VXNlcntcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGdldFN0cmluZyhcImN1clVzZXJcIikpOyBcclxuICB9XHJcblxyXG4gIGdldFNpbmdsZVByb2plY3QocHJval9pZCA6c3RyaW5nKXtcclxuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIisgQ29uZmlnLnRva2VuKVxyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoXHJcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcInYyL3Byb2plY3RzL1wiICsgcHJval9pZCxcclxuICAgICAgeyBoZWFkZXJzOiBoZWFkZXJzIH1cclxuICAgIClcclxuICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgLmRvKGRhdGEgPT4ge1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycylcclxuICAgIC50b1Byb21pc2UoKTtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3RzKCl7XHJcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIrIENvbmZpZy50b2tlbilcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KFxyXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJ2Mi9wcm9qZWN0c1wiLFxyXG4gICAgICB7IGhlYWRlcnM6IGhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKVxyXG4gICAgLnRvUHJvbWlzZSgpO1xyXG4gIH1cclxuXHJcbiAgc2F2ZVByb2plY3RzKHByb2plY3RzVG9TYXZlIDpQcm9qZWN0W10pe1xyXG4gICAgc2V0U3RyaW5nKFwicHJvamVjdHNcIiwgSlNPTi5zdHJpbmdpZnkocHJvamVjdHNUb1NhdmUpKTtcclxuICB9XHJcblxyXG4gIGdldFNhdmVkUHJvamVjdHMgKCl7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShnZXRTdHJpbmcoXCJwcm9qZWN0c1wiKSk7XHJcbiAgfVxyXG4gIGdldEZpbGVzKCl7XHJcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIrIENvbmZpZy50b2tlbilcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KFxyXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJ2Mi9maWxlc1wiLFxyXG4gICAgICB7IGhlYWRlcnM6IGhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICAgIHRoaXMuc2F2ZUZpbGVzKGRhdGEpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycylcclxuICAgIC50b1Byb21pc2UoKTtcclxuICB9XHJcblxyXG4gIGdldFVzZXIodXNlcl9pZCA6c3RyaW5nKXtcclxuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIisgQ29uZmlnLnRva2VuKTtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KFxyXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJ2Mi91c2Vycy9cIiArIHVzZXJfaWQsXHJcbiAgICAgIHsgaGVhZGVyczogaGVhZGVycyB9XHJcbiAgICApXHJcbiAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgIC5kbyhkYXRhID0+IHtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpXHJcbiAgICAudG9Qcm9taXNlKCk7XHJcbiAgfVxyXG5cclxuICBzYXZlRmlsZXMoZmlsZXNUb1NhdmUgOkZpbGVPYmplY3RbXSl7XHJcbiAgICBzZXRTdHJpbmcoXCJmaWxlc1wiLCBKU09OLnN0cmluZ2lmeShmaWxlc1RvU2F2ZSkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2F2ZWRGaWxlcyAoKXtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGdldFN0cmluZyhcImZpbGVzXCIpKTtcclxuICB9XHJcblxyXG59Il19