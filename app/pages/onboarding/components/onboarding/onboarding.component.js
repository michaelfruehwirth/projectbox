"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform = require("tns-core-modules/platform");
var page_1 = require("tns-core-modules/ui/page/page");
var OnboardingComponent = (function () {
    function OnboardingComponent(page) {
        this.page = page;
        this.currentIndex = 0;
        this.animating = false;
        this.disableStatusBar = true;
        this.onFinish = new core_1.EventEmitter();
        this.onContinue = new core_1.EventEmitter();
        this.onSkip = new core_1.EventEmitter();
    }
    OnboardingComponent.prototype.ngOnInit = function () {
        if (this.disableStatusBar) {
            this.page.backgroundSpanUnderStatusBar = true;
        }
    };
    /**
     * Continues to the next slide (or emits the finished event)
     * Animates the slide if configured
     */
    OnboardingComponent.prototype.continue = function () {
        var _this = this;
        this.animateSlides.then(function () {
            _this.incrementSlide();
            _this.onContinue.next(_this.currentSlide);
        })
            .catch(function () {
            _this.onFinish.next(false);
        });
    };
    /**
     * Skips the remaining slides
     * Emits the onSkip event and onFinish event hooks
     */
    OnboardingComponent.prototype.skip = function () {
        this.onSkip.next(this.currentSlide);
        this.onFinish.next(true);
    };
    OnboardingComponent.prototype.translateY = function (index) {
        var prev = this.getPreviousAnimation(index);
        if (index === 0 || (index === this.currentIndex && prev !== this.currentSlide.animation)) {
            return 0;
        }
        if (this.currentSlide && this.currentSlide.animation) {
            var animation = this.currentSlide.animation;
            if (animation === 'slide_up' || animation === 'stack_under') {
                return platform.screen.mainScreen.heightDIPs;
            }
            else if (animation === 'slide_down' || animation === 'stack_over') {
                return (-1 * platform.screen.mainScreen.heightDIPs);
            }
        }
        return 0;
    };
    OnboardingComponent.prototype.translateX = function (index) {
        var prev = this.getPreviousAnimation(index);
        if (index === 0 || (index === this.currentIndex && prev !== this.currentSlide.animation)) {
            return 0;
        }
        if (this.currentSlide && this.currentSlide.animation) {
            var animation = this.currentSlide.animation;
            if (animation === 'slide_right') {
                return (-1 * platform.screen.mainScreen.widthDIPs);
            }
            else if (animation === 'slide_left') {
                return platform.screen.mainScreen.widthDIPs;
            }
        }
        return 0;
    };
    OnboardingComponent.prototype.getPreviousAnimation = function (index) {
        return index - 1 > 0 ? this.slides[index - 1].animation : null;
    };
    Object.defineProperty(OnboardingComponent.prototype, "currentSlide", {
        /**
         * Returns the current slide value to emit through the event chain
         */
        get: function () {
            if (this.slides.length > 0) {
                if (this.slides.length > this.currentIndex) {
                    return this.slides[this.currentIndex];
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OnboardingComponent.prototype, "animateSlides", {
        /**
         * Handles animation of the slide (page) transitions
         */
        get: function () {
            if (this.currentIndex + 1 < this.slides.length) {
                var slides = this.slidesEl.nativeElement;
                var current = slides.getChildAt(this.currentIndex + 1).getChildAt(0);
                var next = slides.getChildAt(this.currentIndex + 2).getChildAt(0);
                if (this.currentSlide.animation) {
                    this.animating = true;
                    switch (this.currentSlide.animation) {
                        case 'slide_up':
                        case 'stack_over':
                            return this.animateSlideVertical(current, next, true);
                        case 'slide_down':
                        case 'stack_under':
                            return this.animateSlideVertical(current, next, false);
                        case 'slide_right':
                            return this.animateSlideHorizontal(current, next, false);
                        case 'slide_left':
                            return this.animateSlideHorizontal(current, next, true);
                    }
                }
                return Promise.resolve();
            }
            return Promise.reject('slide_end');
        },
        enumerable: true,
        configurable: true
    });
    OnboardingComponent.prototype.animateSlideVertical = function (current, next, upwards) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            next.animate({
                translate: {
                    x: 0,
                    y: 0
                },
                delay: 100,
                duration: 300
            });
            current.animate({
                translate: {
                    x: 0,
                    y: (upwards ? -1 : 1) * platform.screen.mainScreen.heightDIPs
                },
                duration: 300,
                delay: 100
            }).then(function () {
                _this.animating = false;
                resolve(true);
            });
        });
    };
    OnboardingComponent.prototype.animateSlideHorizontal = function (current, next, left) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            next.animate({
                translate: {
                    x: 0,
                    y: 0
                },
                delay: 100,
                duration: 300
            });
            current.animate({
                translate: {
                    x: (left ? -1 : 1) * platform.screen.mainScreen.widthDIPs,
                    y: 0
                },
                duration: 300,
                delay: 100
            }).then(function () {
                _this.animating = false;
                resolve(true);
            });
        });
    };
    /**
     * Increments the current slide if there is a next slide
     * Emits the finished event if at the end of the stack
     */
    OnboardingComponent.prototype.incrementSlide = function () {
        if (this.hasNext) {
            this.currentIndex++;
        }
        else {
            this.onFinish.next(true);
        }
    };
    Object.defineProperty(OnboardingComponent.prototype, "hasNext", {
        /**
         * {true} if there is another slide in the stack, {false} if at the end
         */
        get: function () {
            return this.currentIndex < this.slides.length;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], OnboardingComponent.prototype, "slides", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OnboardingComponent.prototype, "disableStatusBar", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], OnboardingComponent.prototype, "onFinish", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], OnboardingComponent.prototype, "onContinue", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], OnboardingComponent.prototype, "onSkip", void 0);
    __decorate([
        core_1.ViewChild('slide'),
        __metadata("design:type", core_1.ElementRef)
    ], OnboardingComponent.prototype, "slidesEl", void 0);
    OnboardingComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ns-onboarding',
            templateUrl: './onboarding.component.html'
        }),
        __metadata("design:paramtypes", [page_1.Page])
    ], OnboardingComponent);
    return OnboardingComponent;
}());
exports.OnboardingComponent = OnboardingComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25ib2FyZGluZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvbmJvYXJkaW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzRztBQUd0RyxvREFBc0Q7QUFDdEQsc0RBQXFEO0FBT3JEO0lBZUksNkJBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBYjlCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBRWpCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFHVCxxQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFFdkIsYUFBUSxHQUFzQixJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUNqRCxlQUFVLEdBQXNCLElBQUksbUJBQVksRUFBRSxDQUFDO1FBQ25ELFdBQU0sR0FBc0IsSUFBSSxtQkFBWSxFQUFFLENBQUM7SUFJdkIsQ0FBQztJQUVuQyxzQ0FBUSxHQUFSO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUE0QixHQUFHLElBQUksQ0FBQztRQUNsRCxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNILHNDQUFRLEdBQVI7UUFBQSxpQkFVQztRQVRHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNuQjtZQUNJLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUNOO1lBQ0ksS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsa0NBQUksR0FBSjtRQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUks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Q0wsQ0FBQztJQUtELHNCQUFZLHdDQUFPO1FBSG5COztXQUVHO2FBQ0g7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsRCxDQUFDOzs7T0FBQTtJQTNMUTtRQUFSLFlBQUssRUFBRTs7dURBQTJCO0lBQzFCO1FBQVIsWUFBSyxFQUFFOztpRUFBeUI7SUFFdkI7UUFBVCxhQUFNLEVBQUU7a0NBQVcsbUJBQVk7eURBQTJCO0lBQ2pEO1FBQVQsYUFBTSxFQUFFO2tDQUFhLG1CQUFZOzJEQUEyQjtJQUNuRDtRQUFULGFBQU0sRUFBRTtrQ0FBUyxtQkFBWTt1REFBMkI7SUFFckM7UUFBbkIsZ0JBQVMsQ0FBQyxPQUFPLENBQUM7a0NBQVcsaUJBQVU7eURBQUM7SUFiaEMsbUJBQW1CO1FBTC9CLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLGVBQWU7WUFDekIsV0FBVyxFQUFFLDZCQUE2QjtTQUM3QyxDQUFDO3lDQWdCNEIsV0FBSTtPQWZyQixtQkFBbUIsQ0FtTS9CO0lBQUQsMEJBQUM7Q0FBQSxBQW5NRCxJQW1NQztBQW5NWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT25ib2FyZGluZ1NsaWRlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9PbmJvYXJkaW5nU2xpZGUnO1xyXG5pbXBvcnQgeyBPbmJvYXJkaW5nU2xpZGVDb21wb25lbnQgfSBmcm9tICcuLi9vbmJvYXJkaW5nLXNsaWRlL29uYm9hcmRpbmctc2xpZGUuY29tcG9uZW50JztcclxuaW1wb3J0ICogYXMgcGxhdGZvcm0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybSc7XHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL3BhZ2UvcGFnZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICBzZWxlY3RvcjogJ25zLW9uYm9hcmRpbmcnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL29uYm9hcmRpbmcuY29tcG9uZW50Lmh0bWwnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBPbmJvYXJkaW5nQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBjdXJyZW50SW5kZXggPSAwO1xyXG5cclxuICAgIGFuaW1hdGluZyA9IGZhbHNlO1xyXG5cclxuICAgIEBJbnB1dCgpIHNsaWRlczogT25ib2FyZGluZ1NsaWRlW107XHJcbiAgICBASW5wdXQoKSBkaXNhYmxlU3RhdHVzQmFyID0gdHJ1ZTtcclxuXHJcbiAgICBAT3V0cHV0KCkgb25GaW5pc2g6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgpIG9uQ29udGludWU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgpIG9uU2tpcDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQFZpZXdDaGlsZCgnc2xpZGUnKSBzbGlkZXNFbDogRWxlbWVudFJlZjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UpIHsgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVTdGF0dXNCYXIpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlLmJhY2tncm91bmRTcGFuVW5kZXJTdGF0dXNCYXIgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnRpbnVlcyB0byB0aGUgbmV4dCBzbGlkZSAob3IgZW1pdHMgdGhlIGZpbmlzaGVkIGV2ZW50KVxyXG4gICAgICogQW5pbWF0ZXMgdGhlIHNsaWRlIGlmIGNvbmZpZ3VyZWRcclxuICAgICAqL1xyXG4gICAgY29udGludWUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRlU2xpZGVzLnRoZW4oXHJcbiAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50U2xpZGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25Db250aW51ZS5uZXh0KHRoaXMuY3VycmVudFNsaWRlKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKFxyXG4gICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRmluaXNoLm5leHQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNraXBzIHRoZSByZW1haW5pbmcgc2xpZGVzXHJcbiAgICAgKiBFbWl0cyB0aGUgb25Ta2lwIGV2ZW50IGFuZCBvbkZpbmlzaCBldmVudCBob29rc1xyXG4gICAgICovXHJcbiAgICBza2lwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMub25Ta2lwLm5leHQodGhpcy5jdXJyZW50U2xpZGUpO1xyXG4gICAgICAgIHRoaXMub25GaW5pc2gubmV4dCh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGVZKGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmdldFByZXZpb3VzQW5pbWF0aW9uKGluZGV4KTtcclxuICAgICAgICBpZiAoaW5kZXggPT09IDAgfHwgKGluZGV4ID09PSB0aGlzLmN1cnJlbnRJbmRleCAmJiBwcmV2ICE9PSB0aGlzLmN1cnJlbnRTbGlkZS5hbmltYXRpb24pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U2xpZGUgJiYgdGhpcy5jdXJyZW50U2xpZGUuYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuaW1hdGlvbiA9IHRoaXMuY3VycmVudFNsaWRlLmFuaW1hdGlvbjtcclxuICAgICAgICAgICAgaWYgKGFuaW1hdGlvbiA9PT0gJ3NsaWRlX3VwJyB8fCBhbmltYXRpb24gPT09ICdzdGFja191bmRlcicpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRESVBzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGFuaW1hdGlvbiA9PT0gJ3NsaWRlX2Rvd24nIHx8IGFuaW1hdGlvbiA9PT0gJ3N0YWNrX292ZXInKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKC0xICogcGxhdGZvcm0uc2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0RElQcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRlWChpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBwcmV2ID0gdGhpcy5nZXRQcmV2aW91c0FuaW1hdGlvbihpbmRleCk7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAwIHx8IChpbmRleCA9PT0gdGhpcy5jdXJyZW50SW5kZXggJiYgcHJldiAhPT0gdGhpcy5jdXJyZW50U2xpZGUuYW5pbWF0aW9uKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNsaWRlICYmIHRoaXMuY3VycmVudFNsaWRlLmFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBhbmltYXRpb24gPSB0aGlzLmN1cnJlbnRTbGlkZS5hbmltYXRpb247XHJcbiAgICAgICAgICAgIGlmIChhbmltYXRpb24gPT09ICdzbGlkZV9yaWdodCcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoLTEgKiBwbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi53aWR0aERJUHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGFuaW1hdGlvbiA9PT0gJ3NsaWRlX2xlZnQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxhdGZvcm0uc2NyZWVuLm1haW5TY3JlZW4ud2lkdGhESVBzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UHJldmlvdXNBbmltYXRpb24oaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBpbmRleCAtIDEgPiAwID8gdGhpcy5zbGlkZXNbaW5kZXggLSAxXS5hbmltYXRpb24gOiBudWxsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGN1cnJlbnQgc2xpZGUgdmFsdWUgdG8gZW1pdCB0aHJvdWdoIHRoZSBldmVudCBjaGFpblxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldCBjdXJyZW50U2xpZGUoKTogT25ib2FyZGluZ1NsaWRlIHtcclxuICAgICAgICBpZiAodGhpcy5zbGlkZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zbGlkZXMubGVuZ3RoID4gdGhpcy5jdXJyZW50SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNsaWRlc1t0aGlzLmN1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGVzIGFuaW1hdGlvbiBvZiB0aGUgc2xpZGUgKHBhZ2UpIHRyYW5zaXRpb25zXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0IGFuaW1hdGVTbGlkZXMoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50SW5kZXggKyAxIDwgdGhpcy5zbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNsaWRlcyA9IHRoaXMuc2xpZGVzRWwubmF0aXZlRWxlbWVudDtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IHNsaWRlcy5nZXRDaGlsZEF0KHRoaXMuY3VycmVudEluZGV4ICsgMSkuZ2V0Q2hpbGRBdCgwKTtcclxuICAgICAgICAgICAgY29uc3QgbmV4dCA9IHNsaWRlcy5nZXRDaGlsZEF0KHRoaXMuY3VycmVudEluZGV4ICsgMikuZ2V0Q2hpbGRBdCgwKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFNsaWRlLmFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmN1cnJlbnRTbGlkZS5hbmltYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzbGlkZV91cCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3RhY2tfb3Zlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGVTbGlkZVZlcnRpY2FsKGN1cnJlbnQsIG5leHQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NsaWRlX2Rvd24nOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3N0YWNrX3VuZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0ZVNsaWRlVmVydGljYWwoY3VycmVudCwgbmV4dCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NsaWRlX3JpZ2h0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0ZVNsaWRlSG9yaXpvbnRhbChjdXJyZW50LCBuZXh0LCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2xpZGVfbGVmdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGVTbGlkZUhvcml6b250YWwoY3VycmVudCwgbmV4dCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ3NsaWRlX2VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYW5pbWF0ZVNsaWRlVmVydGljYWwoY3VycmVudDogYW55LCBuZXh0OiBhbnksIHVwd2FyZHM6IGJvb2xlYW4pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIG5leHQuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IDBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkZWxheTogMTAwLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDMwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY3VycmVudC5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogKHVwd2FyZHMgPyAtMSA6IDEpICogcGxhdGZvcm0uc2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0RElQc1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAzMDAsXHJcbiAgICAgICAgICAgICAgICBkZWxheTogMTAwXHJcbiAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYW5pbWF0ZVNsaWRlSG9yaXpvbnRhbChjdXJyZW50OiBhbnksIG5leHQ6IGFueSwgbGVmdDogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbmV4dC5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogMFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRlbGF5OiAxMDAsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMzAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjdXJyZW50LmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogKGxlZnQgPyAtMSA6IDEpICogcGxhdGZvcm0uc2NyZWVuLm1haW5TY3JlZW4ud2lkdGhESVBzLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IDBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMzAwLFxyXG4gICAgICAgICAgICAgICAgZGVsYXk6IDEwMFxyXG4gICAgICAgICAgICB9KS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluY3JlbWVudHMgdGhlIGN1cnJlbnQgc2xpZGUgaWYgdGhlcmUgaXMgYSBuZXh0IHNsaWRlXHJcbiAgICAgKiBFbWl0cyB0aGUgZmluaXNoZWQgZXZlbnQgaWYgYXQgdGhlIGVuZCBvZiB0aGUgc3RhY2tcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbmNyZW1lbnRTbGlkZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5oYXNOZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEluZGV4Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uRmluaXNoLm5leHQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICoge3RydWV9IGlmIHRoZXJlIGlzIGFub3RoZXIgc2xpZGUgaW4gdGhlIHN0YWNrLCB7ZmFsc2V9IGlmIGF0IHRoZSBlbmRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXQgaGFzTmV4dCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50SW5kZXggPCB0aGlzLnNsaWRlcy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==