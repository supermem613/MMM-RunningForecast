Module.register("MMM-RunningForecast", {
    defaults: {
        updateInterval: 3600000, // Update every hour
        url: "https://weather.com/activity-hub/running/ff7365bc39d17586e7712568d30f5fc13663ab9db4b676b3f2eb80eeb3cad4c1",
        title: "Running Forecast" // Add a title for the module
    },

    start: function() {
        this.getData();
        this.scheduleUpdate();
    },

    getData: function() {
        this.sendSocketNotification("GET_RUNNING_FORECAST", this.config.url);
    },

    scheduleUpdate: function() {
        var self = this;
        setInterval(function() {
            self.getData();
        }, this.config.updateInterval);
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        // Create the title element
        var title = document.createElement("header");
        title.className = "module-header";
        title.innerHTML = this.config.title;
        wrapper.appendChild(title);

        // Add the running forecast
        var forecastContent = document.createElement("div");
        forecastContent.innerHTML = this.runningForecast || "Loading...";
        wrapper.appendChild(forecastContent);

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "RUNNING_FORECAST_DATA") {
            this.runningForecast = payload;
            this.updateDom();
        }
    }
});
