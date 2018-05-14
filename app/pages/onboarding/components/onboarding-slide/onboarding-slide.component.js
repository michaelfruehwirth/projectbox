"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("tns-core-modules/ui/page/page");
var color_1 = require("tns-core-modules/color/color");
var platform = require("tns-core-modules/platform");
var app = require("tns-core-modules/application");
var OnboardingSlideComponent = (function () {
    function OnboardingSlideComponent(page) {
        this.page = page;
        this.backgroundColor = '#8A63B3';
        this.visible = true;
        this.translateY = 0;
        this.translateX = 0;
        this.interactive = true;
        this.hasNext = false;
        this.onSkip = new core_1.EventEmitter();
        this.onContinue = new core_1.EventEmitter();
        page.actionBarHidden = true;
    }
    OnboardingSlideComponent.prototype.ngAfterViewInit = function () {
        if (platform.isAndroid) {
            this.animateBtn(this.continueBtn.nativeElement);
            if (this.skipBtn) {
                this.animateBtn(this.skipBtn.nativeElement);
            }
        }
    };
    OnboardingSlideComponent.prototype.ngOnChanges = function (changes) {
        var visibility = changes.visible;
        if (visibility && visibility.currentValue === true) {
            this.setPageBackground();
        }
    };
    Object.defineProperty(OnboardingSlideComponent.prototype, "navBarHeight", {
        get: function () {
            if (app.android) {
                var result = 0;
                var resourceId = app.android.currentContext
                    .getResources()
                    .getIdentifier('navigation_bar_height', 'dimen', 'android');
                if (resourceId > 0) {
                    result = app.android.currentContext
                        .getResources()
                        .getDimensionPixelSize(resourceId);
                    result =
                        result /
                            app.android.currentContext.getResources().getDisplayMetrics().density;
                }
                return result;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    OnboardingSlideComponent.prototype.animateBtn = function (el) {
        el.on('tap', function (args) {
            el.animate({
                opacity: 0.5,
                duration: 200
            }).then(function () { return el.animate({ opacity: 1, duration: 200 }); });
        });
    };
    OnboardingSlideComponent.prototype.setPageBackground = function () {
        this.page.backgroundColor = new color_1.Color(this.backgroundColor);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], OnboardingSlideComponent.prototype, "okButtonText", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], OnboardingSlideComponent.prototype, "skipButtonText", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], OnboardingSlideComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], OnboardingSlideComponent.prototype, "description", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], OnboardingSlideComponent.prototype, "imageUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OnboardingSlideComponent.prototype, "backgroundColor", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OnboardingSlideComponent.prototype, "visible", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OnboardingSlideComponent.prototype, "translateY", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OnboardingSlideComponent.prototype, "translateX", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OnboardingSlideComponent.prototype, "interactive", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OnboardingSlideComponent.prototype, "hasNext", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], OnboardingSlideComponent.prototype, "onSkip", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], OnboardingSlideComponent.prototype, "onContinue", void 0);
    __decorate([
        core_1.ViewChild('slide'),
        __metadata("design:type", core_1.ElementRef)
    ], OnboardingSlideComponent.prototype, "slideEl", void 0);
    __decorate([
        core_1.ViewChild('continueBtn'),
        __metadata("design:type", core_1.ElementRef)
    ], OnboardingSlideComponent.prototype, "continueBtn", void 0);
    __decorate([
        core_1.ViewChild('skipBtn'),
        __metadata("design:type", core_1.ElementRef)
    ], OnboardingSlideComponent.prototype, "skipBtn", void 0);
    OnboardingSlideComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ns-onboarding-slide',
            templateUrl: './onboarding-slide.component.html',
            styleUrls: ['./onboarding-slide.component.css']
        }),
        __metadata("design:paramtypes", [page_1.Page])
    ], OnboardingSlideComponent);
    return OnboardingSlideComponent;
}());
exports.OnboardingSlideComponent = OnboardingSlideComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25ib2FyZGluZy1zbGlkZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvbmJvYXJkaW5nLXNsaWRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF1STtBQUN2SSxzREFBcUQ7QUFDckQsc0RBQXFEO0FBRXJELG9EQUFzRDtBQUN0RCxrREFBb0Q7QUFRcEQ7SUF3Qkksa0NBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBZnJCLG9CQUFlLEdBQUcsU0FBUyxDQUFDO1FBQzVCLFlBQU8sR0FBRyxJQUFJLENBQUM7UUFFZixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFFZixXQUFNLEdBQXNCLElBQUksbUJBQVksRUFBRSxDQUFDO1FBQy9DLGVBQVUsR0FBc0IsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFPekQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7SUFDaEMsQ0FBQztJQUVELGtEQUFlLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2hELENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVELDhDQUFXLEdBQVgsVUFBWSxPQUFzQjtRQUM5QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxVQUFV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NUVELElBNEVDO0FBNUVZLDREQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy91aS9wYWdlL3BhZ2UnO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvY29sb3IvY29sb3InO1xyXG5pbXBvcnQgKiBhcyBnZXN0dXJlcyBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL2dlc3R1cmVzJztcclxuaW1wb3J0ICogYXMgcGxhdGZvcm0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybSc7XHJcbmltcG9ydCAqIGFzIGFwcCBmcm9tICd0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICAgIHNlbGVjdG9yOiAnbnMtb25ib2FyZGluZy1zbGlkZScsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vb25ib2FyZGluZy1zbGlkZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9vbmJvYXJkaW5nLXNsaWRlLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgT25ib2FyZGluZ1NsaWRlQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcclxuXHJcbiAgICBASW5wdXQoKSBva0J1dHRvblRleHQ6IHN0cmluZztcclxuICAgIEBJbnB1dCgpIHNraXBCdXR0b25UZXh0OiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KCkgdGl0bGU6IHN0cmluZztcclxuICAgIEBJbnB1dCgpIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBpbWFnZVVybDogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIGJhY2tncm91bmRDb2xvciA9ICcjOEE2M0IzJztcclxuICAgIEBJbnB1dCgpIHZpc2libGUgPSB0cnVlO1xyXG5cclxuICAgIEBJbnB1dCgpIHRyYW5zbGF0ZVkgPSAwO1xyXG4gICAgQElucHV0KCkgdHJhbnNsYXRlWCA9IDA7XHJcbiAgICBASW5wdXQoKSBpbnRlcmFjdGl2ZSA9IHRydWU7XHJcbiAgICBASW5wdXQoKSBoYXNOZXh0ID0gZmFsc2U7XHJcblxyXG4gICAgQE91dHB1dCgpIG9uU2tpcDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBAT3V0cHV0KCkgb25Db250aW51ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQFZpZXdDaGlsZCgnc2xpZGUnKSBzbGlkZUVsOiBFbGVtZW50UmVmO1xyXG4gICAgQFZpZXdDaGlsZCgnY29udGludWVCdG4nKSBjb250aW51ZUJ0bjogRWxlbWVudFJlZjtcclxuICAgIEBWaWV3Q2hpbGQoJ3NraXBCdG4nKSBza2lwQnRuOiBFbGVtZW50UmVmO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSkge1xyXG4gICAgICAgIHBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICAgICAgaWYgKHBsYXRmb3JtLmlzQW5kcm9pZCkge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGVCdG4odGhpcy5jb250aW51ZUJ0bi5uYXRpdmVFbGVtZW50KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2tpcEJ0bikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlQnRuKHRoaXMuc2tpcEJ0bi5uYXRpdmVFbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICAgICAgY29uc3QgdmlzaWJpbGl0eSA9IGNoYW5nZXMudmlzaWJsZTtcclxuICAgICAgICBpZiAodmlzaWJpbGl0eSAmJiB2aXNpYmlsaXR5LmN1cnJlbnRWYWx1ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFBhZ2VCYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBuYXZCYXJIZWlnaHQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAoYXBwLmFuZHJvaWQpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc291cmNlSWQgPSBhcHAuYW5kcm9pZC5jdXJyZW50Q29udGV4dFxyXG4gICAgICAgICAgICAgICAgLmdldFJlc291cmNlcygpXHJcbiAgICAgICAgICAgICAgICAuZ2V0SWRlbnRpZmllcignbmF2aWdhdGlvbl9iYXJfaGVpZ2h0JywgJ2RpbWVuJywgJ2FuZHJvaWQnKTtcclxuICAgICAgICAgICAgaWYgKHJlc291cmNlSWQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhcHAuYW5kcm9pZC5jdXJyZW50Q29udGV4dFxyXG4gICAgICAgICAgICAgICAgICAgIC5nZXRSZXNvdXJjZXMoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5nZXREaW1lbnNpb25QaXhlbFNpemUocmVzb3VyY2VJZCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCAvXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwLmFuZHJvaWQuY3VycmVudENvbnRleHQuZ2V0UmVzb3VyY2VzKCkuZ2V0RGlzcGxheU1ldHJpY3MoKS5kZW5zaXR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYW5pbWF0ZUJ0bihlbDogYW55KSB7XHJcbiAgICAgICAgZWwub24oJ3RhcCcsIChhcmdzOiBnZXN0dXJlcy5HZXN0dXJlRXZlbnREYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGVsLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC41LFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMFxyXG4gICAgICAgICAgICB9KS50aGVuKCgpID0+IGVsLmFuaW1hdGUoeyBvcGFjaXR5OiAxLCBkdXJhdGlvbjogMjAwIH0pKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFBhZ2VCYWNrZ3JvdW5kKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSBuZXcgQ29sb3IodGhpcy5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=