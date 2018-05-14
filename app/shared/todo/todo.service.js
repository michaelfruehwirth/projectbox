"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
var config_1 = require("../config");
var application_settings_1 = require("application-settings");
var TodoService = (function () {
    function TodoService(http) {
        this.http = http;
        this.headers = new http_1.Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Authorization", "Bearer " + config_1.Config.token);
    }
    TodoService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error.json()));
        return Rx_1.Observable.throw(error);
    };
    TodoService.prototype.getTodos = function () {
        var _this = this;
        return this.http.get(config_1.Config.apiUrl + "v2/tasks", { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
            _this.saveTodos(data);
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService.prototype.createTodo = function (todo) {
        delete todo.id;
        delete todo.due_date_string;
        return this.http.post(config_1.Config.apiUrl + "v2/tasks", ("{\"task\": " + JSON.stringify(todo) + "}"), { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService.prototype.updateTodo = function (todo) {
        var id = todo.id + "";
        delete todo.id;
        delete todo.trackingsFull;
        delete todo.due_date_string;
        return this.http.put(config_1.Config.apiUrl + "v2/tasks/" + id, ("{\"task\": " + JSON.stringify(todo) + "}"), { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService.prototype.deleteTodo = function (id) {
        return this.http.delete(config_1.Config.apiUrl + "v2/tasks/" + id, { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService.prototype.fillTracking = function (tracking) {
        return this.http.get(config_1.Config.apiUrl + "v2/trackings/" + tracking, { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService.prototype.createComment = function (comment) {
        delete comment.userImage;
        delete comment.id;
        delete comment.task_id;
        delete comment.date;
        delete comment.userFName;
        delete comment.userLName;
        comment.created_at = null;
        comment.project = null;
        comment.user = null;
        delete comment.project_id;
        delete comment.updated_at;
        delete comment.user_id;
        return this.http.post(config_1.Config.apiUrl + "v2/comments", ("{\"comment\": " + JSON.stringify(comment) + "}"), { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService.prototype.deleteComment = function (comment_id) {
        return this.http.delete(config_1.Config.apiUrl + "v2/comments/" + comment_id, { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService.prototype.fillComments = function (todo_id) {
        return this.http.get(config_1.Config.apiUrl + "v2/tasks/" + todo_id, { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService.prototype.saveTodos = function (todosToSave) {
        application_settings_1.setString("todos", JSON.stringify(todosToSave));
    };
    TodoService.prototype.getSavedTodos = function () {
        return JSON.parse(application_settings_1.getString("todos"));
    };
    TodoService.prototype.createTracking = function (tracking) {
        delete tracking.id;
        delete tracking.task_id;
        delete tracking.user_id;
        delete tracking.created_at;
        delete tracking.updated_at;
        tracking.user = null;
        return this.http.post(config_1.Config.apiUrl + "v2/trackings", ("{\"tracking\": " + JSON.stringify(tracking) + "}"), { headers: this.headers })
            .map(function (response) {
            return response.json();
        })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService.prototype.deleteTracking = function (tracking_id) {
        return this.http.delete(config_1.Config.apiUrl + "v2/trackings/" + tracking_id, { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService.prototype.updateTracking = function (tracking) {
        var id = tracking.id + "";
        delete tracking.id;
        return this.http.put(config_1.Config.apiUrl + "v2/trackings/" + id, ("{\"tracking\": " + JSON.stringify(tracking) + "}"), { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService.prototype.getSingleTodo = function (todo_id) {
        return this.http.get(config_1.Config.apiUrl + "v2/tasks/" + todo_id, { headers: this.headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
        })
            .catch(this.handleErrors)
            .toPromise();
    };
    TodoService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], TodoService);
    return TodoService;
}());
exports.TodoService = TodoService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kby5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidG9kby5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBRTNDLHNDQUF3RDtBQUN4RCw4QkFBcUM7QUFDckMsZ0NBQThCO0FBQzlCLGlDQUErQjtBQUMvQixvQ0FBbUM7QUFDbkMsNkRBVThCO0FBRzlCO0lBSUUscUJBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRjlCLFlBQU8sR0FBWSxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBRy9CLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEdBQUUsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFHRCxrQ0FBWSxHQUFaLFVBQWEsS0FBZTtRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsZUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsOEJBQVEsR0FBUjtRQUFBLGlCQVdDO1FBVkMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUNsQixlQUFNLENBQUMsTUFBTSxHQUFHLFVBQVUsRUFDMUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUMxQjthQUNBLEdBQUcsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7YUFDaEMsRUFBRSxDQUFDLFVBQUEsSUFBSTtZQUNOLEtBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxD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LEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsRUFDcEQsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUMxQjthQUNBLEdBQUcsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7YUFDaEMsRUFBRSxDQUFDLFVBQUEsSUFBSTtRQUNSLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO2FBQ3hCLFNBQVMsRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVELG1DQUFhLEdBQWIsVUFBYyxPQUFlO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FDbEIsZUFBTSxDQUFDLE1BQU0sR0FBRyxXQUFXLEdBQUcsT0FBTyxFQUNyQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQzFCO2FBQ0EsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQzthQUNoQyxFQUFFLENBQUMsVUFBQSxJQUFJO1FBQ1IsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDeEIsU0FBUyxFQUFFLENBQUM7SUFDZixDQUFDO0lBeE1VLFdBQVc7UUFEdkIsaUJBQVUsRUFBRTt5Q0FLZSxXQUFJO09BSm5CLFdBQVcsQ0F5TXZCO0lBQUQsa0JBQUM7Q0FBQSxBQXpNRCxJQXlNQztBQXpNWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgVG9kbywgVHJhY2tpbmcsIENvbW1lbnQgfSBmcm9tICcuL3RvZG8nO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXNwb25zZSB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9SeFwiO1xyXG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9kb1wiO1xyXG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9tYXBcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xyXG5pbXBvcnQge1xyXG4gICAgZ2V0Qm9vbGVhbixcclxuICAgIHNldEJvb2xlYW4sXHJcbiAgICBnZXROdW1iZXIsXHJcbiAgICBzZXROdW1iZXIsXHJcbiAgICBnZXRTdHJpbmcsXHJcbiAgICBzZXRTdHJpbmcsXHJcbiAgICBoYXNLZXksXHJcbiAgICByZW1vdmUsXHJcbiAgICBjbGVhclxyXG59IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVG9kb1NlcnZpY2Uge1xyXG5cclxuICBoZWFkZXJzIDpIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XHJcbiAgICB0aGlzLmhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgIHRoaXMuaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiKyBDb25maWcudG9rZW4pO1xyXG4gIH1cclxuXHJcblxyXG4gIGhhbmRsZUVycm9ycyhlcnJvcjogUmVzcG9uc2UpIHtcclxuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGVycm9yLmpzb24oKSkpO1xyXG4gICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VG9kb3MoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChcclxuICAgICAgQ29uZmlnLmFwaVVybCArIFwidjIvdGFza3NcIixcclxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICAgIHRoaXMuc2F2ZVRvZG9zKGRhdGEpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycylcclxuICAgIC50b1Byb21pc2UoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVRvZG8odG9kbyA6VG9kbyl7XHJcbiAgICBkZWxldGUgdG9kby5pZDtcclxuICAgIGRlbGV0ZSB0b2RvLmR1ZV9kYXRlX3N0cmluZztcclxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcclxuICAgICAgQ29uZmlnLmFwaVVybCArIFwidjIvdGFza3NcIixcclxuICAgICAgKFwie1xcXCJ0YXNrXFxcIjogXCIgKyBKU09OLnN0cmluZ2lmeSh0b2RvKSArIFwifVwiKSxcclxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKVxyXG4gICAgLnRvUHJvbWlzZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlVG9kbyh0b2RvIDpUb2RvKXtcclxuICAgIGxldCBpZCA6c3RyaW5nID0gdG9kby5pZCArIFwiXCI7XHJcbiAgICBkZWxldGUgdG9kby5pZDtcclxuICAgIGRlbGV0ZSB0b2RvLnRyYWNraW5nc0Z1bGw7XHJcbiAgICBkZWxldGUgdG9kby5kdWVfZGF0ZV9zdHJpbmc7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnB1dChcclxuICAgICAgQ29uZmlnLmFwaVVybCArIFwidjIvdGFza3MvXCIgKyBpZCxcclxuICAgICAgKFwie1xcXCJ0YXNrXFxcIjogXCIgKyBKU09OLnN0cmluZ2lmeSh0b2RvKSArIFwifVwiKSxcclxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICAgIFxyXG4gICAgfSlcclxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycylcclxuICAgIC50b1Byb21pc2UoKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZVRvZG8oaWQgOnN0cmluZyl7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShcclxuICAgICAgQ29uZmlnLmFwaVVybCArIFwidjIvdGFza3MvXCIgKyBpZCxcclxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKVxyXG4gICAgLnRvUHJvbWlzZSgpO1xyXG4gIH1cclxuXHJcbiAgZmlsbFRyYWNraW5nKHRyYWNraW5nIDpzdHJpbmcpe1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoXHJcbiAgICAgICAgQ29uZmlnLmFwaVVybCArIFwidjIvdHJhY2tpbmdzL1wiICsgdHJhY2tpbmcsXHJcbiAgICAgICAgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfVxyXG4gICAgICApXHJcbiAgICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycylcclxuICAgICAgLnRvUHJvbWlzZSgpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ29tbWVudChjb21tZW50IDpDb21tZW50KXtcclxuICAgIGRlbGV0ZSBjb21tZW50LnVzZXJJbWFnZTtcclxuICAgIGRlbGV0ZSBjb21tZW50LmlkO1xyXG4gICAgZGVsZXRlIGNvbW1lbnQudGFza19pZDtcclxuICAgIGRlbGV0ZSBjb21tZW50LmRhdGU7XHJcbiAgICBkZWxldGUgY29tbWVudC51c2VyRk5hbWU7XHJcbiAgICBkZWxldGUgY29tbWVudC51c2VyTE5hbWU7XHJcbiAgICBjb21tZW50LmNyZWF0ZWRfYXQgPSBudWxsO1xyXG4gICAgY29tbWVudC5wcm9qZWN0ID0gbnVsbDtcclxuICAgIGNvbW1lbnQudXNlciA9IG51bGw7XHJcbiAgICBkZWxldGUgY29tbWVudC5wcm9qZWN0X2lkO1xyXG4gICAgZGVsZXRlIGNvbW1lbnQudXBkYXRlZF9hdDtcclxuICAgIGRlbGV0ZSBjb21tZW50LnVzZXJfaWQ7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXHJcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcInYyL2NvbW1lbnRzXCIsXHJcbiAgICAgIChcIntcXFwiY29tbWVudFxcXCI6IFwiICsgSlNPTi5zdHJpbmdpZnkoY29tbWVudCkgKyBcIn1cIiksXHJcbiAgICAgIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH1cclxuICAgIClcclxuICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgLmRvKGRhdGEgPT4ge1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycylcclxuICAgIC50b1Byb21pc2UoKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUNvbW1lbnQoY29tbWVudF9pZCA6c3RyaW5nKXtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKFxyXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJ2Mi9jb21tZW50cy9cIiArIGNvbW1lbnRfaWQsXHJcbiAgICAgIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH1cclxuICAgIClcclxuICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgLmRvKGRhdGEgPT4ge1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycylcclxuICAgIC50b1Byb21pc2UoKTtcclxuICB9XHJcblxyXG4gIGZpbGxDb21tZW50cyh0b2RvX2lkIDpzdHJpbmcpe1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoXHJcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcInYyL3Rhc2tzL1wiICsgdG9kb19pZCxcclxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKVxyXG4gICAgLnRvUHJvbWlzZSgpO1xyXG4gIH1cclxuXHJcbiAgc2F2ZVRvZG9zKHRvZG9zVG9TYXZlIDphbnkpe1xyXG4gICAgc2V0U3RyaW5nKFwidG9kb3NcIiwgSlNPTi5zdHJpbmdpZnkodG9kb3NUb1NhdmUpKTtcclxuICB9XHJcblxyXG4gIGdldFNhdmVkVG9kb3MgKCl7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShnZXRTdHJpbmcoXCJ0b2Rvc1wiKSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVUcmFja2luZyh0cmFja2luZyA6VHJhY2tpbmcpe1xyXG4gICAgZGVsZXRlIHRyYWNraW5nLmlkO1xyXG4gICAgZGVsZXRlIHRyYWNraW5nLnRhc2tfaWQ7XHJcbiAgICBkZWxldGUgdHJhY2tpbmcudXNlcl9pZDtcclxuICAgIGRlbGV0ZSB0cmFja2luZy5jcmVhdGVkX2F0O1xyXG4gICAgZGVsZXRlIHRyYWNraW5nLnVwZGF0ZWRfYXQ7XHJcbiAgICB0cmFja2luZy51c2VyID0gbnVsbDtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcclxuICAgICAgQ29uZmlnLmFwaVVybCArIFwidjIvdHJhY2tpbmdzXCIsXHJcbiAgICAgIChcIntcXFwidHJhY2tpbmdcXFwiOiBcIiArIEpTT04uc3RyaW5naWZ5KHRyYWNraW5nKSArIFwifVwiKSxcclxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfVxyXG4gICAgKVxyXG4gICAgLm1hcChyZXNwb25zZSA9PiB7XHJcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcclxuICAgIH0pXHJcbiAgICAuZG8oZGF0YSA9PiB7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKVxyXG4gICAgLnRvUHJvbWlzZSgpO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlVHJhY2tpbmcodHJhY2tpbmdfaWQgOnN0cmluZyl7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShcclxuICAgICAgQ29uZmlnLmFwaVVybCArIFwidjIvdHJhY2tpbmdzL1wiICsgdHJhY2tpbmdfaWQsXHJcbiAgICAgIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH1cclxuICAgIClcclxuICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgLmRvKGRhdGEgPT4ge1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycylcclxuICAgIC50b1Byb21pc2UoKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVRyYWNraW5nKHRyYWNraW5nIDpUcmFja2luZyl7XHJcbiAgICBsZXQgaWQgOnN0cmluZyA9IHRyYWNraW5nLmlkICsgXCJcIjtcclxuICAgIGRlbGV0ZSB0cmFja2luZy5pZDtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucHV0KFxyXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJ2Mi90cmFja2luZ3MvXCIgKyBpZCxcclxuICAgICAgKFwie1xcXCJ0cmFja2luZ1xcXCI6IFwiICsgSlNPTi5zdHJpbmdpZnkodHJhY2tpbmcpICsgXCJ9XCIpLFxyXG4gICAgICB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9XHJcbiAgICApXHJcbiAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgIC5kbyhkYXRhID0+IHtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpXHJcbiAgICAudG9Qcm9taXNlKCk7XHJcbiAgfVxyXG5cclxuICBnZXRTaW5nbGVUb2RvKHRvZG9faWQgOnN0cmluZyl7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChcclxuICAgICAgQ29uZmlnLmFwaVVybCArIFwidjIvdGFza3MvXCIgKyB0b2RvX2lkLFxyXG4gICAgICB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9XHJcbiAgICApXHJcbiAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgIC5kbyhkYXRhID0+IHtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpXHJcbiAgICAudG9Qcm9taXNlKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==