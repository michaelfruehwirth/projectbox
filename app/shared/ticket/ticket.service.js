"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
var config_1 = require("../config");
var application_settings_1 = require("application-settings");
var TicketService = (function () {
    function TicketService(http) {
        this.http = http;
        this.headers = new http_1.Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Authorization", "Bearer " + config_1.Config.token);
    }
    TicketService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error.json()));
        return Rx_1.Observable.throw(error);
    };
    TicketService.prototype.getTickets = function () {
        return this.http.get(config_1.Config.apiUrl + "v2/tickets", { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TicketService.prototype.getSingleTicket = function (ticket_id) {
        return this.http.get(config_1.Config.apiUrl + "v2/tickets/" + ticket_id, { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TicketService.prototype.saveTickets = function (ticketsToSave) {
        application_settings_1.setString("tickets", JSON.stringify(ticketsToSave));
    };
    TicketService.prototype.getSavedTickets = function () {
        return JSON.parse(application_settings_1.getString("tickets"));
    };
    TicketService.prototype.createTicket = function (ticket) {
        delete ticket.id;
        return this.http.post(config_1.Config.apiUrl + "v2/tickets", ("{\"ticket\": " + JSON.stringify(ticket) + "}"), { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
            console.dir(data);
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TicketService.prototype.updateTicket = function (ticket) {
        var id = ticket.id + "";
        delete ticket.id;
        return this.http.put(config_1.Config.apiUrl + "v2/tickets/" + id, ("{\"ticket\": " + JSON.stringify(ticket) + "}"), { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
            console.dir(data);
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TicketService.prototype.deleteTicket = function (id) {
        return this.http.delete(config_1.Config.apiUrl + "v2/tickets/" + id, { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TicketService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], TicketService);
    return TicketService;
}());
exports.TicketService = TicketService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlja2V0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0aWNrZXQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUUzQyxzQ0FBd0Q7QUFDeEQsOEJBQXFDO0FBQ3JDLGdDQUE4QjtBQUM5QixpQ0FBK0I7QUFDL0Isb0NBQW1DO0FBQ25DLDZEQVU4QjtBQUc5QjtJQUlFLHVCQUFvQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUY5QixZQUFPLEdBQVksSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUcvQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsU0FBUyxHQUFFLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBR0Qsb0NBQVksR0FBWixVQUFhLEtBQWU7UUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLGVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELGtDQUFVLEdBQVY7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQ2xCLGVBQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxFQUM1QixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQzFCO2FBQ0EsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQzthQUNoQyxFQUFFLENBQUMsVUFBQSxJQUFJO1FBQ1IsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDeEIsU0FB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O2FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDeEIsU0FBUyxFQUFFLENBQUM7SUFDZixDQUFDO0lBeEZVLGFBQWE7UUFEekIsaUJBQVUsRUFBRTt5Q0FLZSxXQUFJO09BSm5CLGFBQWEsQ0F5RnpCO0lBQUQsb0JBQUM7Q0FBQSxBQXpGRCxJQXlGQztBQXpGWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgVGlja2V0IH0gZnJvbSAnLi90aWNrZXQnO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXNwb25zZSB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9SeFwiO1xyXG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9kb1wiO1xyXG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9tYXBcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xyXG5pbXBvcnQge1xyXG4gICAgZ2V0Qm9vbGVhbixcclxuICAgIHNldEJvb2xlYW4sXHJcbiAgICBnZXROdW1iZXIsXHJcbiAgICBzZXROdW1iZXIsXHJcbiAgICBnZXRTdHJpbmcsXHJcbiAgICBzZXRTdHJpbmcsXHJcbiAgICBoYXNLZXksXHJcbiAgICByZW1vdmUsXHJcbiAgICBjbGVhclxyXG59IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGlja2V0U2VydmljZSB7XHJcblxyXG4gIGhlYWRlcnMgOkhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcclxuICAgIHRoaXMuaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgdGhpcy5oZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIrIENvbmZpZy50b2tlbik7XHJcbiAgfVxyXG5cclxuXHJcbiAgaGFuZGxlRXJyb3JzKGVycm9yOiBSZXNwb25zZSkge1xyXG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXJyb3IuanNvbigpKSk7XHJcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBnZXRUaWNrZXRzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoXHJcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcInYyL3RpY2tldHNcIixcclxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKVxyXG4gICAgLnRvUHJvbWlzZSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2luZ2xlVGlja2V0KHRpY2tldF9pZCA6c3RyaW5nKXtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KFxyXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJ2Mi90aWNrZXRzL1wiICsgdGlja2V0X2lkLFxyXG4gICAgICB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9XHJcbiAgICApXHJcbiAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgIC5kbyhkYXRhID0+IHtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpXHJcbiAgICAudG9Qcm9taXNlKCk7XHJcbiAgfVxyXG5cclxuICBzYXZlVGlja2V0cyh0aWNrZXRzVG9TYXZlIDphbnkpe1xyXG4gICAgc2V0U3RyaW5nKFwidGlja2V0c1wiLCBKU09OLnN0cmluZ2lmeSh0aWNrZXRzVG9TYXZlKSk7XHJcbiAgfVxyXG5cclxuICBnZXRTYXZlZFRpY2tldHMgKCl7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShnZXRTdHJpbmcoXCJ0aWNrZXRzXCIpKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVRpY2tldCh0aWNrZXQgOlRpY2tldCl7XHJcbiAgICBkZWxldGUgdGlja2V0LmlkO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxyXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJ2Mi90aWNrZXRzXCIsXHJcbiAgICAgIChcIntcXFwidGlja2V0XFxcIjogXCIgKyBKU09OLnN0cmluZ2lmeSh0aWNrZXQpICsgXCJ9XCIpLFxyXG4gICAgICB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9XHJcbiAgICApXHJcbiAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgIC5kbyhkYXRhID0+IHtcclxuICAgICAgY29uc29sZS5kaXIoZGF0YSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKVxyXG4gICAgLnRvUHJvbWlzZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlVGlja2V0KHRpY2tldCA6VGlja2V0KXtcclxuICAgIGxldCBpZCA6c3RyaW5nID0gdGlja2V0LmlkICsgXCJcIjtcclxuICAgIGRlbGV0ZSB0aWNrZXQuaWQ7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnB1dChcclxuICAgICAgQ29uZmlnLmFwaVVybCArIFwidjIvdGlja2V0cy9cIiArIGlkLFxyXG4gICAgICAoXCJ7XFxcInRpY2tldFxcXCI6IFwiICsgSlNPTi5zdHJpbmdpZnkodGlja2V0KSArIFwifVwiKSxcclxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICAgIGNvbnNvbGUuZGlyKGRhdGEpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycylcclxuICAgIC50b1Byb21pc2UoKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZVRpY2tldChpZCA6c3RyaW5nKXtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKFxyXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJ2Mi90aWNrZXRzL1wiICsgaWQsXHJcbiAgICAgIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH1cclxuICAgIClcclxuICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgLmRvKGRhdGEgPT4ge1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycylcclxuICAgIC50b1Byb21pc2UoKTtcclxuICB9XHJcbn1cclxuIl19