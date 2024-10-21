const NodeHelper = require("node_helper");
const cheerio = require("cheerio");
const axios = require("axios");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_RUNNING_FORECAST") {
            this.getRunningForecast(payload);
        }
    },

    breakIntoLines: function(text, maxLength) {
        let result = "";
        while (text.length > 0) {
            if (text.length > maxLength) {
                let splitIndex = text.lastIndexOf(" ", maxLength);
                if (splitIndex === -1) splitIndex = maxLength;
                result += text.substring(0, splitIndex) + "<br>";
                text = text.substring(splitIndex).trim();
            } else {
                result += text;
                break;
            }
        }
        return result;
    },

    getRunningForecast: function(url) {
        var self = this;
        axios.get(url)
            .then(response => {
                const $ = cheerio.load(response.data);
                let runningForecast = ""; // Extract necessary data from the webpage
                // Adjust this selector based on the structure of the page
                $("p.ActivitiesHubForecastBarGraph--subHeading--pib24").each((i, element) => {
                    let text = $(element).text();
                    runningForecast += "<div class='running-forecast-item'>" + self.breakIntoLines(text, 30) + "</div><br/>";
                });
                self.sendSocketNotification("RUNNING_FORECAST_DATA", runningForecast);
            })
            .catch(error => {
                console.error("Error fetching running forecast: ", error);
            });
    }
});
