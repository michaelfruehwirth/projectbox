"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var application_settings_1 = require("application-settings");
var StatusService = (function () {
    function StatusService() {
    }
    StatusService.prototype.setOfflineMode = function (isOffline) {
        application_settings_1.setBoolean("offlineMode", isOffline);
        this.offlineMode = isOffline;
    };
    StatusService.prototype.getOfflineMode = function () {
        return application_settings_1.getBoolean("offlineMode");
    };
    StatusService.prototype.loggedIn = function () {
        application_settings_1.setBoolean("wasLoggedIn", true);
    };
    StatusService.prototype.getWasLoggedIn = function () {
        if (application_settings_1.getBoolean("wasLoggedIn")) {
            return true;
        }
        else {
            return false;
        }
    };
    StatusService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], StatusService);
    return StatusService;
}());
exports.StatusService = StatusService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0dXMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUkzQyw2REFVOEI7QUFJOUI7SUFLRTtJQUFlLENBQUM7SUFFaEIsc0NBQWMsR0FBZCxVQUFlLFNBQWtCO1FBQzdCLGlDQUFVLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxzQ0FBYyxHQUFkO1FBQ0ksTUFBTSxDQUFDLGlDQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELGdDQUFRLEdBQVI7UUFDSSxpQ0FBVSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNuQyxDQUFDO0lBRUQsc0NBQWMsR0FBZDtRQUNJLEVBQUUsQ0FBQSxDQUFDLGlDQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUFBLElBQUksQ0FBQSxDQUFDO1lBQ0YsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO0lBQ0wsQ0FBQztJQXpCVSxhQUFhO1FBRHpCLGlCQUFVLEVBQUU7O09BQ0EsYUFBYSxDQTJCekI7SUFBRCxvQkFBQztDQUFBLEFBM0JELElBMkJDO0FBM0JZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzL1J4XCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWdcIjtcclxuaW1wb3J0IHtcclxuICAgIGdldEJvb2xlYW4sXHJcbiAgICBzZXRCb29sZWFuLFxyXG4gICAgZ2V0TnVtYmVyLFxyXG4gICAgc2V0TnVtYmVyLFxyXG4gICAgZ2V0U3RyaW5nLFxyXG4gICAgc2V0U3RyaW5nLFxyXG4gICAgaGFzS2V5LFxyXG4gICAgcmVtb3ZlLFxyXG4gICAgY2xlYXJcclxufSBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTdGF0dXNTZXJ2aWNlIHtcclxuXHJcbiAgICBvZmZsaW5lTW9kZSA6Ym9vbGVhbjsgXHJcbiAgICBjdXJyZW50VXNlciA6c3RyaW5nOyAgICAvL25vY2ggc3RyaW5nLCBUT0RPOiB1c2VyIEludGVyZmFjZSBhbmxlZ2VuXHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgc2V0T2ZmbGluZU1vZGUoaXNPZmZsaW5lIDpib29sZWFuKXtcclxuICAgICAgc2V0Qm9vbGVhbihcIm9mZmxpbmVNb2RlXCIsIGlzT2ZmbGluZSk7XHJcbiAgICAgIHRoaXMub2ZmbGluZU1vZGUgPSBpc09mZmxpbmU7XHJcbiAgfVxyXG4gIGdldE9mZmxpbmVNb2RlKCl7XHJcbiAgICAgIHJldHVybiBnZXRCb29sZWFuKFwib2ZmbGluZU1vZGVcIik7XHJcbiAgfVxyXG5cclxuICBsb2dnZWRJbigpe1xyXG4gICAgICBzZXRCb29sZWFuKFwid2FzTG9nZ2VkSW5cIiwgdHJ1ZSlcclxuICB9XHJcblxyXG4gIGdldFdhc0xvZ2dlZEluKCl7XHJcbiAgICAgIGlmKGdldEJvb2xlYW4oXCJ3YXNMb2dnZWRJblwiKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=