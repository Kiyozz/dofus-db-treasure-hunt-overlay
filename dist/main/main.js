var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// src/main/main.ts
var import_electron = __toModule(require("electron"));
var import_path = __toModule(require("path"));
var Application = class {
  constructor() {
    this.win = null;
  }
  start() {
    this.createWindow();
  }
  createWindow() {
    this.create();
    this.load();
    this.inject();
    this.onClose();
  }
  create() {
    this.win = new import_electron.BrowserWindow({
      width: 323,
      height: 530,
      webPreferences: {
        nodeIntegration: false,
        devTools: true,
        contextIsolation: true,
        enableRemoteModule: true,
        preload: this.preload()
      },
      alwaysOnTop: true,
      frame: false,
      transparent: true,
      acceptFirstMouse: true,
      x: 0,
      y: 90
    });
    this.win.setIgnoreMouseEvents(true, {forward: true});
  }
  load() {
    this.win.loadURL("https://dofus-map.com/hunt");
  }
  onClose() {
    this.win.on("closed", () => {
      this.win = null;
    });
  }
  inject() {
    this.win.webContents.on("did-finish-load", () => {
      this.win.webContents.insertCSS(this.css());
    });
  }
  css() {
    return `
      #menu {
        -webkit-user-select: none;
        -webkit-app-region: drag;
      }

      #menu a {
        -webkit-app-region: no-drag;
      }

      body, #menu {
        background: transparent !important;
      }

      #donateBox + h1, #donateBox + h1 + p, #bottomBox, #closeBottomBox, #startingPosition > h2, #forgottenHint, #misplacedHint, #hint h2, #semiColon {
        display: none;
      }

      #semiColon + button {
        margin-left: 10px;
      }

      #startingPosition {
        padding-top: 15px;
      }

      #left, #right, #bottom, #top {
        background: white !important;
      }

      .nightMode #left, .nightMode #right, .nightMode #bottom, .nightMode #top {
        background: #2f2f2f !important;
      }

      body {
        pointer-events: none;
      }

      #directions, #menu, #startingPosition button, #startingPosition input, #hintName, #worldSelection span {
        pointer-events: all;
      }

      #result #firstLine svg {
        width: 24px !important;
      }

      #result #firstLine span {
        font-size: 44px !important;
      }
    `;
  }
  preload() {
    console.log(import_electron.app.getAppPath());
    return import_path.default.join(import_electron.app.getAppPath(), "preload.js");
  }
};
var app = new Application();
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron.app.quit();
  }
});
import_electron.app.allowRendererProcessReuse = true;
import_electron.app.on("ready", () => app.start());
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL21haW4vbWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQnJvd3NlcldpbmRvdywgYXBwIGFzIGVsZWN0cm9uQXBwIH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5jbGFzcyBBcHBsaWNhdGlvbiB7XG4gIHdpbjogQnJvd3NlcldpbmRvdyB8IG51bGwgPSBudWxsXG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5jcmVhdGVXaW5kb3coKVxuICB9XG5cbiAgY3JlYXRlV2luZG93KCkge1xuICAgIHRoaXMuY3JlYXRlKClcbiAgICB0aGlzLmxvYWQoKVxuICAgIHRoaXMuaW5qZWN0KClcbiAgICB0aGlzLm9uQ2xvc2UoKVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGUoKSB7XG4gICAgdGhpcy53aW4gPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICB3aWR0aDogMzIzLFxuICAgICAgaGVpZ2h0OiA1MzAsXG4gICAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgICBub2RlSW50ZWdyYXRpb246IGZhbHNlLFxuICAgICAgICBkZXZUb29sczogdHJ1ZSxcbiAgICAgICAgY29udGV4dElzb2xhdGlvbjogdHJ1ZSxcbiAgICAgICAgZW5hYmxlUmVtb3RlTW9kdWxlOiB0cnVlLFxuICAgICAgICBwcmVsb2FkOiB0aGlzLnByZWxvYWQoKVxuICAgICAgfSxcbiAgICAgIGFsd2F5c09uVG9wOiB0cnVlLFxuICAgICAgZnJhbWU6IGZhbHNlLFxuICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICBhY2NlcHRGaXJzdE1vdXNlOiB0cnVlLFxuICAgICAgeDogMCxcbiAgICAgIHk6IDkwXG4gICAgfSlcblxuICAgIHRoaXMud2luLnNldElnbm9yZU1vdXNlRXZlbnRzKHRydWUsIHsgZm9yd2FyZDogdHJ1ZSB9KVxuICB9XG5cbiAgcHJpdmF0ZSBsb2FkKCkge1xuICAgIHRoaXMud2luIS5sb2FkVVJMKCdodHRwczovL2RvZnVzLW1hcC5jb20vaHVudCcpXG4gIH1cblxuICBwcml2YXRlIG9uQ2xvc2UoKSB7XG4gICAgdGhpcy53aW4hLm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLndpbiA9IG51bGxcbiAgICB9KVxuICB9XG5cbiAgcHJpdmF0ZSBpbmplY3QoKSB7XG4gICAgdGhpcy53aW4hLndlYkNvbnRlbnRzLm9uKCdkaWQtZmluaXNoLWxvYWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLndpbiEud2ViQ29udGVudHMuaW5zZXJ0Q1NTKHRoaXMuY3NzKCkpXG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgY3NzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBcbiAgICAgICNtZW51IHtcbiAgICAgICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgICAgLXdlYmtpdC1hcHAtcmVnaW9uOiBkcmFnO1xuICAgICAgfVxuXG4gICAgICAjbWVudSBhIHtcbiAgICAgICAgLXdlYmtpdC1hcHAtcmVnaW9uOiBuby1kcmFnO1xuICAgICAgfVxuXG4gICAgICBib2R5LCAjbWVudSB7XG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICB9XG5cbiAgICAgICNkb25hdGVCb3ggKyBoMSwgI2RvbmF0ZUJveCArIGgxICsgcCwgI2JvdHRvbUJveCwgI2Nsb3NlQm90dG9tQm94LCAjc3RhcnRpbmdQb3NpdGlvbiA+IGgyLCAjZm9yZ290dGVuSGludCwgI21pc3BsYWNlZEhpbnQsICNoaW50IGgyLCAjc2VtaUNvbG9uIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIH1cblxuICAgICAgI3NlbWlDb2xvbiArIGJ1dHRvbiB7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xuICAgICAgfVxuXG4gICAgICAjc3RhcnRpbmdQb3NpdGlvbiB7XG4gICAgICAgIHBhZGRpbmctdG9wOiAxNXB4O1xuICAgICAgfVxuXG4gICAgICAjbGVmdCwgI3JpZ2h0LCAjYm90dG9tLCAjdG9wIHtcbiAgICAgICAgYmFja2dyb3VuZDogd2hpdGUgIWltcG9ydGFudDtcbiAgICAgIH1cblxuICAgICAgLm5pZ2h0TW9kZSAjbGVmdCwgLm5pZ2h0TW9kZSAjcmlnaHQsIC5uaWdodE1vZGUgI2JvdHRvbSwgLm5pZ2h0TW9kZSAjdG9wIHtcbiAgICAgICAgYmFja2dyb3VuZDogIzJmMmYyZiAhaW1wb3J0YW50O1xuICAgICAgfVxuXG4gICAgICBib2R5IHtcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICB9XG5cbiAgICAgICNkaXJlY3Rpb25zLCAjbWVudSwgI3N0YXJ0aW5nUG9zaXRpb24gYnV0dG9uLCAjc3RhcnRpbmdQb3NpdGlvbiBpbnB1dCwgI2hpbnROYW1lLCAjd29ybGRTZWxlY3Rpb24gc3BhbiB7XG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBhbGw7XG4gICAgICB9XG5cbiAgICAgICNyZXN1bHQgI2ZpcnN0TGluZSBzdmcge1xuICAgICAgICB3aWR0aDogMjRweCAhaW1wb3J0YW50O1xuICAgICAgfVxuXG4gICAgICAjcmVzdWx0ICNmaXJzdExpbmUgc3BhbiB7XG4gICAgICAgIGZvbnQtc2l6ZTogNDRweCAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgIGBcbiAgfVxuXG4gIHByaXZhdGUgcHJlbG9hZCgpOiBzdHJpbmcge1xuICAgIGNvbnNvbGUubG9nKGVsZWN0cm9uQXBwLmdldEFwcFBhdGgoKSlcbiAgICByZXR1cm4gcGF0aC5qb2luKGVsZWN0cm9uQXBwLmdldEFwcFBhdGgoKSwgJ3ByZWxvYWQuanMnKVxuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbigpXG5cbmVsZWN0cm9uQXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgZWxlY3Ryb25BcHAucXVpdCgpXG4gIH1cbn0pXG5cbmVsZWN0cm9uQXBwLmFsbG93UmVuZGVyZXJQcm9jZXNzUmV1c2UgPSB0cnVlXG5cbmVsZWN0cm9uQXBwLm9uKCdyZWFkeScsICgpID0+IGFwcC5zdGFydCgpKVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQkFBa0Q7QUFDbEQsa0JBQWlCO0FBRGpCO0FBQUE7QUFJRSxlQUE0QjtBQUFBO0FBQUEsRUFFNUI7QUFDRSxTQUFLO0FBQUE7QUFBQSxFQUdQO0FBQ0UsU0FBSztBQUNMLFNBQUs7QUFDTCxTQUFLO0FBQ0wsU0FBSztBQUFBO0FBQUEsRUFHQztBQUNOLFNBQUssTUFBTSxJQUFJLDhCQUFjO0FBQUEsTUFDM0IsT0FBTztBQUFBLE1BQ1AsUUFBUTtBQUFBLE1BQ1IsZ0JBQWdCO0FBQUEsUUFDZCxpQkFBaUI7QUFBQSxRQUNqQixVQUFVO0FBQUEsUUFDVixrQkFBa0I7QUFBQSxRQUNsQixvQkFBb0I7QUFBQSxRQUNwQixTQUFTLEtBQUs7QUFBQTtBQUFBLE1BRWhCLGFBQWE7QUFBQSxNQUNiLE9BQU87QUFBQSxNQUNQLGFBQWE7QUFBQSxNQUNiLGtCQUFrQjtBQUFBLE1BQ2xCLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQTtBQUdMLFNBQUssSUFBSSxxQkFBcUIsTUFBTSxDQUFFLFNBQVM7QUFBQTtBQUFBLEVBR3pDO0FBQ04sU0FBSyxJQUFLLFFBQVE7QUFBQTtBQUFBLEVBR1o7QUFDTixTQUFLLElBQUssR0FBRyxVQUFVO0FBQ3JCLFdBQUssTUFBTTtBQUFBO0FBQUE7QUFBQSxFQUlQO0FBQ04sU0FBSyxJQUFLLFlBQVksR0FBRyxtQkFBbUI7QUFDMUMsV0FBSyxJQUFLLFlBQVksVUFBVSxLQUFLO0FBQUE7QUFBQTtBQUFBLEVBSWpDO0FBQ04sV0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQW9ERDtBQUNOLFlBQVEsSUFBSSxvQkFBWTtBQUN4QixXQUFPLG9CQUFLLEtBQUssb0JBQVksY0FBYztBQUFBO0FBQUE7QUFJL0MsSUFBTSxNQUFNLElBQUk7QUFFaEIsb0JBQVksR0FBRyxxQkFBcUI7QUFDbEMsTUFBSSxRQUFRLGFBQWE7QUFDdkIsd0JBQVk7QUFBQTtBQUFBO0FBSWhCLG9CQUFZLDRCQUE0QjtBQUV4QyxvQkFBWSxHQUFHLFNBQVMsTUFBTSxJQUFJOyIsCiAgIm5hbWVzIjogW10KfQo=
