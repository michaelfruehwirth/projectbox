"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Todo = (function () {
    function Todo() {
        this.list = null;
        this.responsible = null;
        this.order = 999;
        this.duration = 0;
        this.priority = 2;
        this.progress = 0;
        this.due_date = new Date;
        this.planned = false;
        this.planned_at = new Date();
        this.completed = false;
        this.completed_at = new Date();
        this.start_date = new Date();
        this.estimate = 0;
        this.milestone = false;
        this.phase = null;
        this.planned_costs = 0;
        this.actual_costs = 0;
        this.future_costs = 0;
        this.cost_type = null;
        this.predecessor = null;
        this.rate = null;
        this.rate_internal = null;
        this.billable = false;
        this.userstory = null;
        this.state = null;
        this.has_predecessor = false;
        this.user = null;
        this.customer = null;
        this.parent = null;
        this.color = '#000';
    }
    return Todo;
}());
exports.Todo = Todo;
var Tracking = (function () {
    function Tracking() {
        this.trackedSeconds = 0;
    }
    return Tracking;
}());
exports.Tracking = Tracking;
var Comment = (function () {
    function Comment() {
    }
    return Comment;
}());
exports.Comment = Comment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvZG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtJQUFBO1FBSUUsU0FBSSxHQUFRLElBQUksQ0FBQztRQUVqQixnQkFBVyxHQUFRLElBQUksQ0FBQztRQUN4QixVQUFLLEdBQVcsR0FBRyxDQUFDO1FBR3BCLGFBQVEsR0FBUyxDQUFDLENBQUM7UUFDbkIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGFBQVEsR0FBUyxJQUFJLElBQUksQ0FBQztRQUUxQixZQUFPLEdBQVksS0FBSyxDQUFDO1FBQ3pCLGVBQVUsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQzlCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsaUJBQVksR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBR2hDLGVBQVUsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQzlCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUszQixVQUFLLEdBQVcsSUFBSSxDQUFDO1FBR3JCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBQ3pCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBQ3pCLGNBQVMsR0FBUyxJQUFJLENBQUM7UUFHdkIsZ0JBQVcsR0FBUSxJQUFJLENBQUM7UUFDeEIsU0FBSSxHQUFXLElBQUksQ0FBQztRQUNwQixrQkFBYSxHQUFXLElBQUksQ0FBQztRQUM3QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBRTFCLGNBQVMsR0FBUSxJQUFJLENBQUM7UUFFdEIsVUFBSyxHQUFXLElBQUksQ0FBQztRQUNyQixvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUNqQyxTQUFJLEdBQVcsSUFBSSxDQUFDO1FBS3BCLGFBQVEsR0FBUSxJQUFJLENBQUM7UUFDckIsV0FBTSxHQUFRLElBQUksQ0FBQztRQUNuQixVQUFLLEdBQVcsTUFBTSxDQUFDO0lBRXpCLENBQUM7SUFBRCxXQUFDO0FBQUQsQ0FBQyxBQXZERCxJQXVEQztBQXZEWSxvQkFBSTtBQXlEakI7SUFBQTtRQVlFLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO0lBSzdCLENBQUM7SUFBRCxlQUFDO0FBQUQsQ0FBQyxBQWpCRCxJQWlCQztBQWpCWSw0QkFBUTtBQW1CckI7SUFBQTtJQWVBLENBQUM7SUFBRCxjQUFDO0FBQUQsQ0FBQyxBQWZELElBZUM7QUFmWSwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBUb2RvIHtcclxuICBpZDogc3RyaW5nO1xyXG4gIHVzZXJfaWQ6IHN0cmluZztcclxuICB0YXNrbGlzdF9pZD86IGFueTtcclxuICBsaXN0OiBhbnkgPSBudWxsO1xyXG4gIHJlc3BvbnNpYmxlX2lkOiBzdHJpbmc7XHJcbiAgcmVzcG9uc2libGU6IGFueSA9IG51bGw7XHJcbiAgb3JkZXI6IG51bWJlciA9IDk5OTtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgZGVzY3JpcHRpb24/OiBhbnk7XHJcbiAgZHVyYXRpb24/OiBhbnkgPSAwO1xyXG4gIHByaW9yaXR5OiBudW1iZXIgPSAyO1xyXG4gIHByb2dyZXNzOiBudW1iZXIgPSAwO1xyXG4gIGR1ZV9kYXRlOiBEYXRlID0gbmV3IERhdGU7XHJcbiAgZHVlX2RhdGVfc3RyaW5nOiBzdHJpbmc7XHJcbiAgcGxhbm5lZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHBsYW5uZWRfYXQ6IERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIGNvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGNvbXBsZXRlZF9hdDogRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgY3JlYXRlZF9hdDogRGF0ZTtcclxuICB1cGRhdGVkX2F0OiBEYXRlO1xyXG4gIHN0YXJ0X2RhdGU6IERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIGVzdGltYXRlOiBudW1iZXIgPSAwO1xyXG4gIG1pbGVzdG9uZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIG1pbGVzdG9uZV9kZXNjcmlwdGlvbj86IHN0cmluZztcclxuICBudW1iZXI6IHN0cmluZztcclxuICBwcm9qZWN0X2lkOiBzdHJpbmc7XHJcbiAgcGhhc2VfaWQ6IHN0cmluZztcclxuICBwaGFzZTogc3RyaW5nID0gbnVsbDtcclxuICBkZWxpdmVyYWJsZXM/OiBhbnk7XHJcbiAgdGVhbV90ZXh0PzogYW55O1xyXG4gIHBsYW5uZWRfY29zdHM6IG51bWJlciA9IDA7XHJcbiAgYWN0dWFsX2Nvc3RzOiBudW1iZXIgPSAwO1xyXG4gIGZ1dHVyZV9jb3N0czogbnVtYmVyID0gMDtcclxuICBjb3N0X3R5cGU/OiBhbnkgPSBudWxsO1xyXG4gIHR5cGVfaWQ6IG51bWJlcjtcclxuICBwcmVkZWNlc3Nvcl9pZD86IGFueTtcclxuICBwcmVkZWNlc3NvcjogYW55ID0gbnVsbDtcclxuICByYXRlOiBudW1iZXIgPSBudWxsO1xyXG4gIHJhdGVfaW50ZXJuYWw6IG51bWJlciA9IG51bGw7XHJcbiAgYmlsbGFibGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICB1c2Vyc3RvcnlfaWQ/OiBhbnk7XHJcbiAgdXNlcnN0b3J5OiBhbnkgPSBudWxsOyBcclxuICBpbnNlcnRlZF9hdD86IGFueTtcclxuICBzdGF0ZTogc3RyaW5nID0gbnVsbDtcclxuICBoYXNfcHJlZGVjZXNzb3I6IGJvb2xlYW4gPSBmYWxzZTtcclxuICB1c2VyOiBzdHJpbmcgPSBudWxsO1xyXG4gIHByb2plY3Q6IHN0cmluZztcclxuICB0cmFja2luZ3M/OiBzdHJpbmdbXTtcclxuICB0cmFja2luZ3NGdWxsPzogVHJhY2tpbmdbXTtcclxuICBjb21tZW50cz86IENvbW1lbnRbXTtcclxuICBjdXN0b21lcjogYW55ID0gbnVsbDtcclxuICBwYXJlbnQ6IGFueSA9IG51bGw7XHJcbiAgY29sb3I6IHN0cmluZyA9ICcjMDAwJztcclxuICBwaW5uZWQgOmJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFja2luZyB7XHJcbiAgaWQ6IHN0cmluZztcclxuICB1c2VyX2lkOiBzdHJpbmc7XHJcbiAgdGFza19pZDogc3RyaW5nO1xyXG4gIHN0YXJ0ZWRfYXQ6IERhdGU7XHJcbiAgZmluaXNoZWQ6IGJvb2xlYW47XHJcbiAgZmluaXNoZWRfYXQ6IERhdGU7XHJcbiAgY3JlYXRlZF9hdDogRGF0ZTtcclxuICB1cGRhdGVkX2F0OiBEYXRlO1xyXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgdGFzazogc3RyaW5nO1xyXG4gIHVzZXI6IHN0cmluZztcclxuICB0cmFja2VkU2Vjb25kcyA6bnVtYmVyID0gMDtcclxuICB0aW1lclN0cmluZyA6c3RyaW5nO1xyXG4gIHN0YXJ0RGF0ZVN0cmluZyA6c3RyaW5nO1xyXG4gIHN0YXJ0VGltZVN0cmluZyA6c3RyaW5nO1xyXG4gIGVuZFRpbWVTdHJpbmcgOnN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnQge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgcHJvamVjdF9pZD86IGFueTtcclxuICB0YXNrX2lkOiBzdHJpbmc7XHJcbiAgdXNlcl9pZDogc3RyaW5nO1xyXG4gIG1lc3NhZ2U6IHN0cmluZztcclxuICBkYXRlOiBzdHJpbmc7XHJcbiAgY3JlYXRlZF9hdDogYW55O1xyXG4gIHVwZGF0ZWRfYXQ6IERhdGU7XHJcbiAgdXNlcjogc3RyaW5nO1xyXG4gIHByb2plY3Q/OiBhbnk7XHJcbiAgdGFzazogc3RyaW5nO1xyXG4gIHVzZXJJbWFnZT8gOnN0cmluZztcclxuICB1c2VyRk5hbWU/IDpzdHJpbmc7XHJcbiAgdXNlckxOYW1lPyA6c3RyaW5nO1xyXG59Il19