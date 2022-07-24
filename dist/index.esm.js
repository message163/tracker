var TrackerConfig;
(function (TrackerConfig) {
    TrackerConfig["version"] = "1.0.0";
})(TrackerConfig || (TrackerConfig = {}));

const createHistoryEvnent = (type) => {
    const origin = history[type];
    return function () {
        const res = origin.apply(this, arguments);
        var e = new Event(type);
        window.dispatchEvent(e);
        return res;
    };
};

const MouseEventList = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover'];
class Tracker {
    constructor(options) {
        this.data = Object.assign(this.initDef(), options);
        this.installInnerTrack();
    }
    initDef() {
        this.version = TrackerConfig.version;
        window.history['pushState'] = createHistoryEvnent("pushState");
        window.history['replaceState'] = createHistoryEvnent('replaceState');
        return {
            sdkVersion: this.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false
        };
    }
    setUserId(uuid) {
        this.data.uuid = uuid;
    }
    setExtra(extra) {
        this.data.extra = extra;
    }
    sendTracker(data) {
        this.reportTracker(data);
    }
    captureEvents(MouseEventList, targetKey, data) {
        MouseEventList.forEach(event => {
            window.addEventListener(event, () => {
                this.reportTracker(Object.assign(this.data, { event, targetKey, time: new Date().getTime(), data }));
            });
        });
    }
    installInnerTrack() {
        if (this.data.historyTracker) {
            this.captureEvents(['pushState'], 'history-pv');
            this.captureEvents(['replaceState'], 'history-pv');
            this.captureEvents(['popstate'], 'history-pv');
        }
        if (this.data.hashTracker) {
            this.captureEvents(['hashchange'], 'hash-pv');
        }
        if (this.data.domTracker) {
            this.targetKeyReport();
        }
        if (this.data.jsError) {
            this.jsError();
        }
    }
    targetKeyReport() {
        MouseEventList.forEach(event => {
            window.addEventListener(event, (e) => {
                const target = e.target;
                const targetValue = target.getAttribute('target-key');
                if (targetValue) {
                    this.sendTracker({
                        targetKey: targetValue,
                        event
                    });
                }
            });
        });
    }
    jsError() {
        this.errorEvent();
        this.promiseReject();
    }
    errorEvent() {
        window.addEventListener('error', (e) => {
            this.sendTracker({
                targetKey: 'message',
                event: 'error',
                message: e.message
            });
        });
    }
    promiseReject() {
        window.addEventListener('unhandledrejection', (event) => {
            event.promise.catch(error => {
                this.sendTracker({
                    targetKey: "reject",
                    event: "promise",
                    message: error
                });
            });
        });
    }
    reportTracker(data) {
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        let blob = new Blob([JSON.stringify(data)], headers);
        navigator.sendBeacon(this.data.requestUrl, blob);
    }
}

export { Tracker as default };
