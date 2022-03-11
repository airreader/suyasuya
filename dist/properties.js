// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
function getUserCalnedars() {
    var userProperties = PropertiesService.getUserProperties();
    var calnedarsString = userProperties.getProperty("calendars");
    if (!calnedarsString) {
        return [];
    }
    var calendarsJSON = JSON.parse(calnedarsString);
    return calendarsJSON;
}
function getUsername() {
    var userProperties = PropertiesService.getUserProperties();
    return userProperties.getProperty("username");
}
function setUsername(username) {
    var userProperties = PropertiesService.getUserProperties();
    return userProperties.setProperty("username", username);
}
function addUserCalendar(name, calendarId, color) {
    var usersCalendars = getUserCalnedars();
    if (usersCalendars.some(function (data) {
        return data.id === calendarId;
    })) {
        return usersCalendars;
    }
    else {
        usersCalendars.push({ id: calendarId, name: name, color: color });
    }
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty("calendars", JSON.stringify(usersCalendars));
    return usersCalendars;
}
function deleteUserCalendar(calendarId) {
    var usersCalendars = getUserCalnedars();
    usersCalendars = usersCalendars.filter(function (data) {
        return data.id !== calendarId;
    });
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty("calendars", JSON.stringify(usersCalendars));
    return usersCalendars;
}
function getAllCalendarsData() {
    var calendars = CalendarApp.getAllCalendars();
    var usersCalendars = getUserCalnedars();
    return calendars.filter(function (calendar) {
        return !calendar.isMyPrimaryCalendar();
    }).map(function (calendar) {
        return {
            id: calendar.getId(),
            name: calendar.getName(),
            color: calendar.getColor(),
            isAdded: usersCalendars.some(function (data) { return data.id === calendar.getId(); })
        };
    });
}
