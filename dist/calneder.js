// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
function createHollidaysAllDayEvent(calendarId, username, startDate, endDate) {
    var calendar = CalendarApp.getCalendarById(calendarId);
    calendar.createAllDayEvent(username + " 休み", startDate, endDate);
}
function createHollidayAllDayEvent(calendarId, username, date) {
    var calendar = CalendarApp.getCalendarById(calendarId);
    calendar.createAllDayEvent(username + " 休み", date);
}
function createWorkingHoursEvent(username, startDateString, endDateString) {
    var startDate = new Date(startDateString);
    var endDate = new Date(endDateString);
    endDate.setDate(endDate.getDate() + 1);
    var calendar = CalendarApp.getDefaultCalendar();
    for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        var endTime = new Date(d.getTime());
        d.setHours(10);
        endTime.setHours(19);
        calendar.createEvent(username + " 休み", d, endTime);
    }
}
function createHollidayEvent(username, startDateString, endDateString) {
    setUsername(username);
    createWorkingHoursEvent(username, startDateString, endDateString);
    getUserCalnedars().forEach(function (calendarData) {
        if (startDateString === endDateString) {
            var d = new Date(startDateString);
            //タイムゾーン周りがめんどくさすぎるので適当に1日戻す
            createHollidayAllDayEvent(calendarData.id, username, d);
        }
        else {
            var startDate = new Date(startDateString);
            var endDate = new Date(endDateString);
            endDate.setDate(endDate.getDate() + 1);
            createHollidaysAllDayEvent(calendarData.id, username, startDate, endDate);
        }
    });
}
