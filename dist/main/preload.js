var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};

// node_modules/electron-transparency-mouse-fix/src/electron-transparency-mouse-fix.js
var require_electron_transparency_mouse_fix = __commonJS((exports2, module2) => {
  "use strict";
  var electron = require("electron");
  var consoleTag = [
    "%celectron-transparency-mouse-fix",
    `margin-right: .25em;padding: .1em .4em;border-radius: .25em;background-color: #3eabdc;color: white;font-weight: bold;`
  ];
  var TransparencyMouseFix = class {
    constructor({
      electronWindow = electron.remote.getCurrentWindow(),
      htmlWindow = window,
      fixPointerEvents = "auto",
      log = false
    } = {}) {
      this.electronWindow = electronWindow;
      this.htmlWindow = htmlWindow;
      this._ignoringMouse = true;
      this.altCheckHover._instanceCount = 0;
      this._scopedOnMouseEvent = (event) => this.onMouseEvent(event);
      this._scopedAltCheckHover = () => this.altCheckHover();
      this.log = log;
      this.fixPointerEvents = fixPointerEvents;
      this.registerWindow();
      this.htmlWindow.addEventListener("beforeunload", function() {
        sessionStorage.setItem("etmf-reloaded", "true");
      });
    }
    get log() {
      return this._log;
    }
    set log(fn) {
      if (typeof fn === "function") {
        this._log = fn;
      } else if (fn) {
        this._log = function(level, ...msg) {
          console[level](...consoleTag, ...msg);
        };
      } else {
        this._log = false;
      }
    }
    get fixPointerEvents() {
      return this._fixPointerEvents;
    }
    set fixPointerEvents(condition) {
      condition = condition ? typeof condition === "string" ? condition.toLowerCase() : true : false;
      switch (condition) {
        case false:
        case "off":
          this._fixPointerEvents = false;
          break;
        case "force":
          this._fixPointerEvents = true;
          break;
        case "linux":
          this._fixPointerEvents = process.platform !== "win32" && process.platform !== "darwin";
          break;
        case "auto":
        default:
          this._fixPointerEvents = false;
          if (process.platform === "win32") {
            if (sessionStorage.getItem("etmf-reloaded") === "true")
              this._fixPointerEvents = true;
          } else if (process.platform !== "darwin") {
            this._fixPointerEvents = true;
          }
          break;
      }
      if (this._fixPointerEvents)
        this.altCheckHover(true);
    }
    registerWindow() {
      this.htmlWindow.addEventListener("mousemove", this._scopedOnMouseEvent);
      this.htmlWindow.addEventListener("dragover", this._scopedOnMouseEvent);
      let styleSheet = this.htmlWindow.document.createElement("style");
      styleSheet.classList.add("etmf-css");
      styleSheet.innerHTML = `
      html {pointer-events: none}
      body {position: relative}
    `;
      this.htmlWindow.addEventListener("beforeunload", () => this.unregisterWindow(this.htmlWindow));
      this.log && this.log("info", "Registered event listener");
    }
    unregisterWindow() {
      this.htmlWindow.removeEventListener("mousemove", this._scopedOnMouseEvent);
      this.htmlWindow.removeEventListener("dragover", this._scopedOnMouseEvent);
      this.electronWindow.setIgnoreMouseEvents(false);
      this.log && this.log("info", "Removed event listener");
    }
    onMouseEvent(event) {
      this.log && this.log("debug", event);
      let sinkHole = event.target.classList.contains("etmf-void");
      if (event.type === "dragover") {
        event.preventDefault();
        if (!sinkHole)
          return;
      }
      let reachedBottom = event.target === this.htmlWindow.document.documentElement;
      let ignoreEvents = sinkHole || reachedBottom;
      if (ignoreEvents) {
        if (this._ignoringMouse)
          return;
        this._ignoringMouse = true;
        if (this.fixPointerEvents) {
          this.electronWindow.setIgnoreMouseEvents(true, {forward: false});
          this.altCheckHover(true);
          this.log && this.log("info", "mouse off (polling)");
        } else {
          this.electronWindow.setIgnoreMouseEvents(true, {forward: true});
          this.log && this.log("info", "mouse off (listening)");
        }
      } else {
        if (!this._ignoringMouse)
          return;
        this._ignoringMouse = false;
        this.electronWindow.setIgnoreMouseEvents(false);
        this.log && this.log("info", "mouse on (listening)");
      }
    }
    altCheckHover(first = false) {
      if (first) {
        this.altCheckHover._instanceCount++;
      }
      if (this.altCheckHover._instanceCount > 1) {
        this.log && this.log("warn", "aborting", this.altCheckHover._instanceCount, "parallel altCheckHover polls");
        this.altCheckHover._instanceCount--;
        return null;
      }
      let {x, y} = electron.screen.getCursorScreenPoint();
      let {x: left, y: top, width, height} = this.electronWindow.getContentBounds();
      this.log && this.log("debug", {mouse: {x, y}, window: {left, top, width, height}});
      if (x >= left && x < left + width && y >= top && y < top + height) {
        let tgt = document.elementFromPoint(x - left, y - top);
        if (tgt && !tgt.classList.contains("etmf-void") && tgt !== this.htmlWindow.document.documentElement) {
          this.onMouseEvent({target: tgt});
          this.altCheckHover._instanceCount--;
          return true;
        }
      }
      requestAnimationFrame(this._scopedAltCheckHover);
      return false;
    }
  };
  module2.exports = TransparencyMouseFix;
});

// src/main/preload.ts
var win = require("electron").remote.getCurrentWindow();
var TMF = require_electron_transparency_mouse_fix();
new TMF({fixPointerEvents: "auto", electronWindow: win});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXRyYW5zcGFyZW5jeS1tb3VzZS1maXgvc3JjL2VsZWN0cm9uLXRyYW5zcGFyZW5jeS1tb3VzZS1maXguanMiLCAiLi4vLi4vc3JjL21haW4vcHJlbG9hZC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogQG1vZHVsZSBUcmFuc3BhcmVuY3lNb3VzZUZpeFxuICovXG5cbi8vIFRPRE86IExpbnV4OiBjYW4ndCBkcm9wIGZpbGVzIG91dCBvZiBlbGVjdHJvbj9cbi8vIFRPRE86IFdpbmRvd3M6IGNhbid0IGRyYWcgZmlsZXMgb3ZlciB2b2lkc1xuXG4gLy8gTm8gZXh0ZXJuYWwgZGVwZW5kZW5jaWVzIVxuY29uc3QgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5cbi8vIFN0eWxlIGZvciB0aGUgZGVmYXVsdCBjb25zb2xlIGxvZ2dpbmcgdGFnXG5jb25zdCBjb25zb2xlVGFnID0gWyBcbiAgJyVjZWxlY3Ryb24tdHJhbnNwYXJlbmN5LW1vdXNlLWZpeCcsXG4gIGBtYXJnaW4tcmlnaHQ6IC4yNWVtO3BhZGRpbmc6IC4xZW0gLjRlbTtib3JkZXItcmFkaXVzOiAuMjVlbTtiYWNrZ3JvdW5kLWNvbG9yOiAjM2VhYmRjO2NvbG9yOiB3aGl0ZTtmb250LXdlaWdodDogYm9sZDtgXG5dXG5cbi8qKiBQcm92aWRlIGNsaWNrLXRocm91Z2ggc3VwcG9ydCBmb3IgRWxlY3Ryb24gQnJvd3NlcldpbmRvd3MgKi9cbmNsYXNzIFRyYW5zcGFyZW5jeU1vdXNlRml4IHtcbiAgXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFRyYW5zcGFyZW5jeU1vdXNlRml4XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7ZWxlY3Ryb24uQnJvd3NlcldpbmRvd30gb3B0aW9ucy5lbGVjdHJvbldpbmRvd1xuICAgKiBAcGFyYW0ge1dpbmRvd30gb3B0aW9ucy5odG1sV2luZG93XG4gICAqIEBwYXJhbSB7KGJvb2xlYW58c3RyaW5nKX0gb3B0aW9ucy5maXhQb2ludGVyRXZlbnRzXG4gICAqIEBwYXJhbSB7KGJvb2xlYW58c3RyaW5nKX0gb3B0aW9ucy5maXhQb2ludGVyRXZlbnRzXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoe1xuICAgICAgZWxlY3Ryb25XaW5kb3c9IGVsZWN0cm9uLnJlbW90ZS5nZXRDdXJyZW50V2luZG93KCksXG4gICAgICBodG1sV2luZG93PSB3aW5kb3csXG4gICAgICBmaXhQb2ludGVyRXZlbnRzPSAnYXV0bycsXG4gICAgICBsb2c9IGZhbHNlXG4gIH09e30pIHtcbiAgICAvLyBTZXQgbG9jYWwgdmFyaWFibGVzXG4gICAgLy8gPiBjb25zdGFudFxuICAgIC8vID4gcHVibGljXG4gICAgLyoqXG4gICAgICogVGhlIHdpbmRvdyB0byByZWNlaXZlIG1vdXNlZXZlbnRzXG4gICAgICogQHR5cGUge2VsZWN0cm9uLkJyb3dzZXJXaW5kb3d9XG4gICAgICovXG4gICAgdGhpcy5lbGVjdHJvbldpbmRvdyA9IGVsZWN0cm9uV2luZG93XG4gICAgLyoqXG4gICAgICogVGhlIHJlbmRlcmVycyB3aW5kb3cvZ2xvYmFsIHZhcmlhYmxlXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmh0bWxXaW5kb3cgPSBodG1sV2luZG93XG4gICAgLy8gPiBwcml2YXRlXG4gICAgLyoqXG4gICAgICogTGF0Y2hlcyB0aGUgc3RhdGUgb2Ygc2V0SWdub3JlTW91c2VFdmVudHNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2lnbm9yaW5nTW91c2UgPSB0cnVlXG4gICAgLyoqXG4gICAgICogQ291bnRzIHRoZSBhbW91bnQgb2YgcGFyYWxsZWwgZ2V0QW5pbWF0aW9uRnJhbWUgbG9vcHMgKG1heGVkIHRvIDEpXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmFsdENoZWNrSG92ZXIuX2luc3RhbmNlQ291bnQgPSAwXG4gICAgLyoqXG4gICAgICogRXZlbnQgbGlzdGVuZXIgY2FsbGJhY2sgdGllZCB0byAnVHJhbnNwYXJlbmN5TW91c2VGaXgnIHNjb3BlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9zY29wZWRPbk1vdXNlRXZlbnQgPSBldmVudCA9PiB0aGlzLm9uTW91c2VFdmVudChldmVudClcbiAgICAvKipcbiAgICAgKiBFdmVudCBsaXN0ZW5lciBjYWxsYmFjayB0aWVkIHRvICdUcmFuc3BhcmVuY3lNb3VzZUZpeCcgc2NvcGVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3Njb3BlZEFsdENoZWNrSG92ZXIgPSAoKSA9PiB0aGlzLmFsdENoZWNrSG92ZXIoKVxuICAgIHRoaXMubG9nID0gbG9nXG4gICAgdGhpcy5maXhQb2ludGVyRXZlbnRzID0gZml4UG9pbnRlckV2ZW50c1xuXG4gICAgLy8gUmVnaXN0ZXIgZXZlbnQgbGlzdGVuZXJzXG4gICAgdGhpcy5yZWdpc3RlcldpbmRvdygpXG5cbiAgICAvLyBXb3JrYXJvdW5kIGZvcjpcbiAgICAvLyAgIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi9lbGVjdHJvbi9pc3N1ZXMvMTUzNzZcbiAgICAvLyAgIHNldElnbm9yZU1vdXNlRXZlbnRzKHtmb3J3YXJkOiB0cnVlfSkgc3RvcHMgZm9yd2FyZGluZ1xuICAgIC8vICAgICBhZnRlciBhIHBhZ2UgcmVsb2FkICBcbiAgICB0aGlzLmh0bWxXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZXRtZi1yZWxvYWRlZCcsJ3RydWUnKVxuICAgIH0pXG4gIH1cbiAgXG4gIFxuICBnZXQgbG9nICgpIHtyZXR1cm4gdGhpcy5fbG9nfVxuICAvKipcbiAgICogRW5hYmxlIG9yIGRpc2FibGUgbG9nZ2luZyB3aXRoIGFuIG9wdGlvbmFsIGZ1bmN0aW9uIGZvciBzdHlsaW5nIHRoZSBjb25zb2xlIG91dHB1dC5cbiAgICogQGFjY2VzcyBwdWJsaWNcbiAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgKiBAcGFyYW0gIHsoYm9vbGVhbnxmdW5jdGlvbil9IGZuIHRydWUgfCBmYWxzZSB8IGZ1bmN0aW9uIChsb2dMZXZlbCwuLi5tc2cpIHs8Li4+fVxuICAgKi9cbiAgc2V0IGxvZyAoIGZuICkge1xuICAgIGlmICh0eXBlb2YoZm4pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl9sb2cgPSBmblxuICAgIH0gZWxzZSBpZiAoZm4pIHtcbiAgICAgIHRoaXMuX2xvZyA9IGZ1bmN0aW9uICggbGV2ZWwsIC4uLm1zZyApIHtcbiAgICAgICAgY29uc29sZVtsZXZlbF0oLi4uY29uc29sZVRhZywgLi4ubXNnKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9sb2cgPSBmYWxzZVxuICAgIH1cbiAgfVxuICBcbiAgZ2V0IGZpeFBvaW50ZXJFdmVudHMgKCkge3JldHVybiB0aGlzLl9maXhQb2ludGVyRXZlbnRzfVxuICAvKiogXG4gICAqIEVtdWxhdGlvbiBmb3IgQnJvd3NlcldpbmRvdy5zZXRJZ25vcmVNb3VzZUV2ZW50cyh0cnVlLCB7Zm9yd2FyZDogdHJ1ZX0pXG4gICAqIDxsaT5MaW51eDogaGFzIG5vIHN1cHBvcnQgPT4gZnVsbHkgcmVwbGFjZWQ8YnI+XG4gICAqIDxsaT5XaW5kb3dzOiAoQlVHKSBvbmx5IGFmdGVyIGEgcmVsb2FkIChzZWUgZWxlY3Ryb24vZWxlY3Ryb24jMTUzNzYpXG4gICAqIEBhY2Nlc3MgcHVibGljXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAcGFyYW0geyhib29sZWFufHN0cmluZyl9IGNvbmRpdGlvbiAnYXV0byc9dHJ1ZSB8IG9mZic9ZmFsc2UgfCAnZm9yY2UnIHwgJ2xpbnV4J1xuICAgKi9cbiAgc2V0IGZpeFBvaW50ZXJFdmVudHMgKCBjb25kaXRpb24gKSB7XG4gICAgY29uZGl0aW9uID0gY29uZGl0aW9uID8gdHlwZW9mIGNvbmRpdGlvbiA9PT0gJ3N0cmluZycgPyBcbiAgICAgICAgY29uZGl0aW9uLnRvTG93ZXJDYXNlKCkgOiB0cnVlIDogZmFsc2VcblxuICAgIHN3aXRjaCAoY29uZGl0aW9uKSB7XG4gICAgICBjYXNlIGZhbHNlOlxuICAgICAgY2FzZSAnb2ZmJzpcbiAgICAgICAgdGhpcy5fZml4UG9pbnRlckV2ZW50cyA9IGZhbHNlXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdmb3JjZSc6XG4gICAgICAgIHRoaXMuX2ZpeFBvaW50ZXJFdmVudHMgPSB0cnVlXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdsaW51eCc6XG4gICAgICAgIHRoaXMuX2ZpeFBvaW50ZXJFdmVudHMgPSBcbiAgICAgICAgICBwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInIFxuICAgICAgICAgICYmIHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdhdXRvJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX2ZpeFBvaW50ZXJFdmVudHMgPSBmYWxzZVxuICAgICAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdldG1mLXJlbG9hZGVkJykgPT09ICd0cnVlJylcbiAgICAgICAgICAgIHRoaXMuX2ZpeFBvaW50ZXJFdmVudHMgPSB0cnVlXG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcbiAgICAgICAgICB0aGlzLl9maXhQb2ludGVyRXZlbnRzID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgLy8gU3RhcnQgcG9sbGluZyBoZXJlIHNvIHlvdSBjYW4gbWFudWFsbHkgY2hhbmdlIHRoZSBtb2RlLlxuICAgIC8vIFRoZSBmdW5jdGlvbiBpcyBhZGp1c3RlZCBzbyB5b3UgY2FuJ3QgaGF2ZSAyIHBhcmFsbGVsIHBvbGxpbmcgbG9vcHNcbiAgICBpZiAodGhpcy5fZml4UG9pbnRlckV2ZW50cylcbiAgICAgIHRoaXMuYWx0Q2hlY2tIb3Zlcih0cnVlKVxuICB9XG5cbiAgXG4gIC8qKlxuICAgKiBSZWdpc3RlciBtb3VzZSBtb3ZlbWVudCBldmVudCBsaXN0ZW5lcnMgYW5kIHByZXBhcmUgc3R5bGluZy5cbiAgICogQGFjY2VzcyBwdWJsaWNcbiAgICovXG4gIHJlZ2lzdGVyV2luZG93ICgpIHtcbiAgICB0aGlzLmh0bWxXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fc2NvcGVkT25Nb3VzZUV2ZW50KVxuICAgIHRoaXMuaHRtbFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMuX3Njb3BlZE9uTW91c2VFdmVudClcbiAgICBsZXQgc3R5bGVTaGVldCA9IHRoaXMuaHRtbFdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gICAgc3R5bGVTaGVldC5jbGFzc0xpc3QuYWRkKCdldG1mLWNzcycpXG4gICAgc3R5bGVTaGVldC5pbm5lckhUTUwgPSBgXG4gICAgICBodG1sIHtwb2ludGVyLWV2ZW50czogbm9uZX1cbiAgICAgIGJvZHkge3Bvc2l0aW9uOiByZWxhdGl2ZX1cbiAgICBgXG4gICAgdGhpcy5odG1sV2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsICgpPT50aGlzLnVucmVnaXN0ZXJXaW5kb3codGhpcy5odG1sV2luZG93KSlcbiAgICB0aGlzLmxvZyAmJiB0aGlzLmxvZygnaW5mbycsICdSZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVyJylcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWNjZXNzIHB1YmxpY1xuICAgKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXJzLlxuICAgKi9cblxuICB1bnJlZ2lzdGVyV2luZG93ICgpIHsgLy8ga2VlcCBmb3IgbWFudWFsIHVzZVxuICAgIHRoaXMuaHRtbFdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9zY29wZWRPbk1vdXNlRXZlbnQpXG4gICAgdGhpcy5odG1sV2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgdGhpcy5fc2NvcGVkT25Nb3VzZUV2ZW50KVxuICAgIHRoaXMuZWxlY3Ryb25XaW5kb3cuc2V0SWdub3JlTW91c2VFdmVudHMoZmFsc2UpXG4gICAgdGhpcy5sb2cgJiYgdGhpcy5sb2coJ2luZm8nLCAnUmVtb3ZlZCBldmVudCBsaXN0ZW5lcicpXG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyBldmVudHMgbGlrZSBtb3VzZW1vdmUsIGRyYWdvdmVyLCAuLlxuICAgKiBAcGFyYW0geyhNb3VzZUV2ZW50fERyYWdFdmVudHxPYmplY3QuPHN0cmluZywgSFRNTEVsZW1lbnQ+KX0gZXZlbnQgXG4gICAqL1xuICBvbk1vdXNlRXZlbnQgKCBldmVudCApIHtcbiAgICB0aGlzLmxvZyAmJiB0aGlzLmxvZygnZGVidWcnLCBldmVudClcblxuICAgIGxldCBzaW5rSG9sZSA9IGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2V0bWYtdm9pZCcpXG5cbiAgICAvLyBIYW5kbGUgZHJhZ2dpbmcgZXZlbnRzXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdkcmFnb3ZlcicpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCkgLy8gZml4ZXMgZHJvcHBpbmcgZmlsZXMgaW5zaWRlIGVsZWN0cm9uXG4gICAgICBpZiAoIXNpbmtIb2xlKVxuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBJcyB0aGUgcG9pbnRlciBpcyBob3ZlcmluZyBhbiBlbGVtZW50IHRoYXQgcmVjZWl2ZXMgZXZlbnRzP1xuICAgIGxldCByZWFjaGVkQm90dG9tID0gZXZlbnQudGFyZ2V0ID09PSB0aGlzLmh0bWxXaW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgbGV0IGlnbm9yZUV2ZW50cyA9IHNpbmtIb2xlIHx8IHJlYWNoZWRCb3R0b21cbiAgICBpZiAoaWdub3JlRXZlbnRzKSB7XG4gICAgICAvLyBMYXRjaGVkIHN0YXRlXG4gICAgICBpZiAodGhpcy5faWdub3JpbmdNb3VzZSkgcmV0dXJuXG4gICAgICB0aGlzLl9pZ25vcmluZ01vdXNlID0gdHJ1ZVxuICAgICAgXG4gICAgICAvLyBBcHBseSBwYXNzLXRocm91Z2gtd2luZG93IG9uIHBvaW50ZXIgZXZlbnRzXG4gICAgICBpZiAodGhpcy5maXhQb2ludGVyRXZlbnRzKSAgeyBcbiAgICAgICAgLy8gQ2lyY3VtdmVudCBmb3J3YXJkaW5nIG9mIGlnbm9yZWQgbW91c2UgZXZlbnRzXG4gICAgICAgIC8vIFRPRE86IHBhdXNlIG9uIG1pbmltaXplL2hpZGUvLi4gXG4gICAgICAgIHRoaXMuZWxlY3Ryb25XaW5kb3cuc2V0SWdub3JlTW91c2VFdmVudHModHJ1ZSwge2ZvcndhcmQ6IGZhbHNlfSlcbiAgICAgICAgdGhpcy5hbHRDaGVja0hvdmVyKHRydWUpXG4gICAgICAgIHRoaXMubG9nICYmIHRoaXMubG9nKCdpbmZvJywgJ21vdXNlIG9mZiAocG9sbGluZyknKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWdub3JlIG1vdXNlIGV2ZW50cyB3aXRoIGJ1aWx0LWluIGZvcndhcmRpbmdcbiAgICAgICAgdGhpcy5lbGVjdHJvbldpbmRvdy5zZXRJZ25vcmVNb3VzZUV2ZW50cyh0cnVlLCB7Zm9yd2FyZDogdHJ1ZX0pXG4gICAgICAgIHRoaXMubG9nICYmIHRoaXMubG9nKCdpbmZvJywgJ21vdXNlIG9mZiAobGlzdGVuaW5nKScpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExhdGNoZWQgc3RhdGVcbiAgICAgIGlmICghdGhpcy5faWdub3JpbmdNb3VzZSkgcmV0dXJuXG4gICAgICB0aGlzLl9pZ25vcmluZ01vdXNlID0gZmFsc2VcblxuICAgICAgLy8gQ2F0Y2ggYWxsIG1vdXNlIGV2ZW50c1xuICAgICAgdGhpcy5lbGVjdHJvbldpbmRvdy5zZXRJZ25vcmVNb3VzZUV2ZW50cyhmYWxzZSlcbiAgICAgIHRoaXMubG9nICYmIHRoaXMubG9nKCdpbmZvJywgJ21vdXNlIG9uIChsaXN0ZW5pbmcpJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2lyY3VtdmVudCB0aGUgbGFjayBvZiBmb3J3YXJkZWQgbW91c2UgZXZlbnRzIGJ5IHBvbGxpbmcgbW91c2UgcG9zaXRpb24gd2l0aCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBvbmNlIERvbid0IHJlcXVlc3QgYSBuZXh0IGFuaW1hdGlvbkZyYW1lXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIGEgZWxlbWVudCBpcyBmb3VuZCBiZXNpZGVzIHNpbmtob2xlcyBvciB0aGUgbWFpbiA8aHRtbD4gZWxlbWVudFxuICAgKi9cbiAgYWx0Q2hlY2tIb3ZlciAoIGZpcnN0PWZhbHNlICkge1xuICAgIC8vIEhJTlQ6IHlvdSBjYW4gbWFudWFsbHkgc3RvcCB0aGUgbG9vcCBieSBpbmNyZW1lbnRpbmcgX2luc3RhbmNlQ291bnRcbiAgICBpZiAoZmlyc3QpIHtcbiAgICAgIHRoaXMuYWx0Q2hlY2tIb3Zlci5faW5zdGFuY2VDb3VudCsrXG4gICAgfVxuICAgIGlmICh0aGlzLmFsdENoZWNrSG92ZXIuX2luc3RhbmNlQ291bnQgPiAxKSB7XG4gICAgICB0aGlzLmxvZyAmJiB0aGlzLmxvZygnd2FybicsICdhYm9ydGluZycsIHRoaXMuYWx0Q2hlY2tIb3Zlci5faW5zdGFuY2VDb3VudCwgJ3BhcmFsbGVsIGFsdENoZWNrSG92ZXIgcG9sbHMnKVxuICAgICAgdGhpcy5hbHRDaGVja0hvdmVyLl9pbnN0YW5jZUNvdW50LS1cbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGN1cnNvciBpcyB3aXRoaW4gY29udGVudCBib3VuZHMsIGNoZWNrIHRoZSBlbGVtZW50IGl0J3MgaG92ZXJpbmcsXG4gICAgLy8gICBlbXVsYXRlIGEgTW91c2VNb3ZlIGV2ZW50IHdpdGggdGhlIGVsZW1lbnQgYXMgdGFyZ2V0XG4gICAgbGV0e3gseX0gPSBlbGVjdHJvbi5zY3JlZW4uZ2V0Q3Vyc29yU2NyZWVuUG9pbnQoKVxuICAgIGxldCB7eDpsZWZ0LCB5OnRvcCwgd2lkdGgsIGhlaWdodH0gPSB0aGlzLmVsZWN0cm9uV2luZG93LmdldENvbnRlbnRCb3VuZHMoKVxuICAgIHRoaXMubG9nICYmIHRoaXMubG9nKCdkZWJ1ZycsIHttb3VzZToge3gseX0sIHdpbmRvdzoge2xlZnQsdG9wLHdpZHRoLGhlaWdodH19KVxuICAgIGlmICh4ID49IGxlZnQgJiYgeCA8IGxlZnQrd2lkdGggJiYgeSA+PSB0b3AgJiYgeSA8IHRvcCtoZWlnaHQpIHtcbiAgICAgIGxldCB0Z3QgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHgtbGVmdCwgeS10b3ApXG4gICAgICAvLyBISU5UOiB1cGRhdGUgY2xhc3NMaXN0IGNoZWNrcyB3aGVuIGV4cGFuZGluZyBjb2RlXG4gICAgICBpZiAodGd0ICYmICF0Z3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdldG1mLXZvaWQnKSAmJiB0Z3QgIT09IHRoaXMuaHRtbFdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5vbk1vdXNlRXZlbnQoe3RhcmdldDogdGd0fSlcbiAgICAgICAgdGhpcy5hbHRDaGVja0hvdmVyLl9pbnN0YW5jZUNvdW50LS1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fc2NvcGVkQWx0Q2hlY2tIb3ZlcilcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zcGFyZW5jeU1vdXNlRml4IiwgImxldCB3aW4gPSByZXF1aXJlKCdlbGVjdHJvbicpLnJlbW90ZS5nZXRDdXJyZW50V2luZG93KClcbmxldCBUTUYgPSByZXF1aXJlKCdlbGVjdHJvbi10cmFuc3BhcmVuY3ktbW91c2UtZml4JylcblxubmV3IFRNRih7IGZpeFBvaW50ZXJFdmVudHM6ICdhdXRvJywgZWxlY3Ryb25XaW5kb3c6IHdpbiB9KVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7O0FBQUE7QUFBQTtBQVVBLE1BQU0sV0FBbUI7QUFHekIsTUFBTSxhQUFhO0FBQUEsSUFDakI7QUFBQSxJQUNBO0FBQUE7QUFmRjtBQUFBLElBNkJFLFlBQWE7QUFBQSxNQUNULGlCQUFnQixTQUFTLE9BQU87QUFBQSxNQUNoQyxhQUFZO0FBQUEsTUFDWixtQkFBa0I7QUFBQSxNQUNsQixNQUFLO0FBQUEsUUFDUDtBQVFBLFdBQUssaUJBQWlCO0FBS3RCLFdBQUssYUFBYTtBQU1sQixXQUFLLGlCQUFpQjtBQUt0QixXQUFLLGNBQWMsaUJBQWlCO0FBS3BDLFdBQUssc0JBQXNCLFdBQVMsS0FBSyxhQUFhO0FBS3RELFdBQUssdUJBQXVCLE1BQU0sS0FBSztBQUN2QyxXQUFLLE1BQU07QUFDWCxXQUFLLG1CQUFtQjtBQUd4QixXQUFLO0FBTUwsV0FBSyxXQUFXLGlCQUFpQixnQkFBZ0I7QUFDL0MsdUJBQWUsUUFBUSxpQkFBZ0I7QUFBQTtBQUFBO0FBQUEsUUFLdkM7QUFBUSxhQUFPLEtBQUs7QUFBQTtBQUFBLFFBT3BCLElBQU07QUFDUixVQUFJLE9BQU8sT0FBUTtBQUNqQixhQUFLLE9BQU87QUFBQSxpQkFDSDtBQUNULGFBQUssT0FBTyxTQUFXLFVBQVU7QUFDL0Isa0JBQVEsT0FBTyxHQUFHLFlBQVksR0FBRztBQUFBO0FBQUE7QUFHbkMsYUFBSyxPQUFPO0FBQUE7QUFBQTtBQUFBLFFBSVo7QUFBcUIsYUFBTyxLQUFLO0FBQUE7QUFBQSxRQVNqQyxpQkFBbUI7QUFDckIsa0JBQVksWUFBWSxPQUFPLGNBQWMsV0FDekMsVUFBVSxnQkFBZ0IsT0FBTztBQUVyQyxjQUFRO0FBQUEsYUFDRDtBQUFBLGFBQ0E7QUFDSCxlQUFLLG9CQUFvQjtBQUN6QjtBQUFBLGFBQ0c7QUFDSCxlQUFLLG9CQUFvQjtBQUN6QjtBQUFBLGFBQ0c7QUFDSCxlQUFLLG9CQUNILFFBQVEsYUFBYSxXQUNsQixRQUFRLGFBQWE7QUFDMUI7QUFBQSxhQUNHO0FBQUE7QUFFSCxlQUFLLG9CQUFvQjtBQUN6QixjQUFJLFFBQVEsYUFBYTtBQUN2QixnQkFBSSxlQUFlLFFBQVEscUJBQXFCO0FBQzlDLG1CQUFLLG9CQUFvQjtBQUFBLHFCQUNsQixRQUFRLGFBQWE7QUFDOUIsaUJBQUssb0JBQW9CO0FBQUE7QUFFM0I7QUFBQTtBQUtKLFVBQUksS0FBSztBQUNQLGFBQUssY0FBYztBQUFBO0FBQUEsSUFRdkI7QUFDRSxXQUFLLFdBQVcsaUJBQWlCLGFBQWEsS0FBSztBQUNuRCxXQUFLLFdBQVcsaUJBQWlCLFlBQVksS0FBSztBQUNsRCxVQUFJLGFBQWEsS0FBSyxXQUFXLFNBQVMsY0FBYztBQUN4RCxpQkFBVyxVQUFVLElBQUk7QUFDekIsaUJBQVcsWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUl2QixXQUFLLFdBQVcsaUJBQWlCLGdCQUFnQixNQUFJLEtBQUssaUJBQWlCLEtBQUs7QUFDaEYsV0FBSyxPQUFPLEtBQUssSUFBSSxRQUFRO0FBQUE7QUFBQSxJQVEvQjtBQUNFLFdBQUssV0FBVyxvQkFBb0IsYUFBYSxLQUFLO0FBQ3RELFdBQUssV0FBVyxvQkFBb0IsWUFBWSxLQUFLO0FBQ3JELFdBQUssZUFBZSxxQkFBcUI7QUFDekMsV0FBSyxPQUFPLEtBQUssSUFBSSxRQUFRO0FBQUE7QUFBQSxJQU8vQixhQUFlO0FBQ2IsV0FBSyxPQUFPLEtBQUssSUFBSSxTQUFTO0FBRTlCLFVBQUksV0FBVyxNQUFNLE9BQU8sVUFBVSxTQUFTO0FBRy9DLFVBQUksTUFBTSxTQUFTO0FBQ2pCLGNBQU07QUFDTixZQUFJLENBQUM7QUFDSDtBQUFBO0FBSUosVUFBSSxnQkFBZ0IsTUFBTSxXQUFXLEtBQUssV0FBVyxTQUFTO0FBQzlELFVBQUksZUFBZSxZQUFZO0FBQy9CLFVBQUk7QUFFRixZQUFJLEtBQUs7QUFBZ0I7QUFDekIsYUFBSyxpQkFBaUI7QUFHdEIsWUFBSSxLQUFLO0FBR1AsZUFBSyxlQUFlLHFCQUFxQixNQUFNLENBQUMsU0FBUztBQUN6RCxlQUFLLGNBQWM7QUFDbkIsZUFBSyxPQUFPLEtBQUssSUFBSSxRQUFRO0FBQUE7QUFHN0IsZUFBSyxlQUFlLHFCQUFxQixNQUFNLENBQUMsU0FBUztBQUN6RCxlQUFLLE9BQU8sS0FBSyxJQUFJLFFBQVE7QUFBQTtBQUFBO0FBSS9CLFlBQUksQ0FBQyxLQUFLO0FBQWdCO0FBQzFCLGFBQUssaUJBQWlCO0FBR3RCLGFBQUssZUFBZSxxQkFBcUI7QUFDekMsYUFBSyxPQUFPLEtBQUssSUFBSSxRQUFRO0FBQUE7QUFBQTtBQUFBLElBU2pDLGNBQWdCLFFBQU07QUFFcEIsVUFBSTtBQUNGLGFBQUssY0FBYztBQUFBO0FBRXJCLFVBQUksS0FBSyxjQUFjLGlCQUFpQjtBQUN0QyxhQUFLLE9BQU8sS0FBSyxJQUFJLFFBQVEsWUFBWSxLQUFLLGNBQWMsZ0JBQWdCO0FBQzVFLGFBQUssY0FBYztBQUNuQixlQUFPO0FBQUE7QUFLVCxVQUFHLENBQUMsR0FBRSxLQUFLLFNBQVMsT0FBTztBQUMzQixVQUFJLENBQUMsR0FBRSxNQUFNLEdBQUUsS0FBSyxPQUFPLFVBQVUsS0FBSyxlQUFlO0FBQ3pELFdBQUssT0FBTyxLQUFLLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFFLElBQUksUUFBUSxDQUFDLE1BQUssS0FBSSxPQUFNO0FBQ3JFLFVBQUksS0FBSyxRQUFRLElBQUksT0FBSyxTQUFTLEtBQUssT0FBTyxJQUFJLE1BQUk7QUFDckQsWUFBSSxNQUFNLFNBQVMsaUJBQWlCLElBQUUsTUFBTSxJQUFFO0FBRTlDLFlBQUksT0FBTyxDQUFDLElBQUksVUFBVSxTQUFTLGdCQUFnQixRQUFRLEtBQUssV0FBVyxTQUFTO0FBQ2xGLGVBQUssYUFBYSxDQUFDLFFBQVE7QUFDM0IsZUFBSyxjQUFjO0FBQ25CLGlCQUFPO0FBQUE7QUFBQTtBQUlYLDRCQUFzQixLQUFLO0FBQzNCLGFBQU87QUFBQTtBQUFBO0FBSVgsVUFBTyxVQUFVO0FBQUE7OztBQ3JRakIsSUFBSSxNQUFNLEFBQVEsb0JBQVksT0FBTztBQUNyQyxJQUFJLE1BQWM7QUFFbEIsSUFBSSxJQUFJLENBQUUsa0JBQWtCLFFBQVEsZ0JBQWdCOyIsCiAgIm5hbWVzIjogW10KfQo=
