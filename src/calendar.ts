function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function createHollidaysAllDayEvent(calendarId: string, username: string, startDate: Date, endDate: Date): void {
  const startStr = Utilities.formatDate(startDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
  const endStr = Utilities.formatDate(endDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
  Calendar.Events!.insert({
    summary: username + " 休み",
    start: { date: startStr },
    end: { date: endStr },
    transparency: "opaque"
  }, calendarId);
}

function createHollidayAllDayEvent(calendarId: string, username: string, date: Date): void {
  const startStr = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
  
  const nextDate = new Date(date.getTime());
  nextDate.setDate(nextDate.getDate() + 1);
  const endStr = Utilities.formatDate(nextDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

  Calendar.Events!.insert({
    summary: username + " 休み",
    start: { date: startStr },
    end: { date: endStr },
    transparency: "opaque"
  }, calendarId);
}

function createWorkingHoursEvent(username: string, startDateString: string, endDateString: string): void {
  const startDate = parseLocalDate(startDateString);
  const endDate = parseLocalDate(endDateString);
  const calendarId = "primary";

  for (let d = new Date(startDate.getTime()); d <= endDate; d.setDate(d.getDate() + 1)) {
    const startDateTime = new Date(d.getTime());
    startDateTime.setHours(10, 0, 0, 0);
    const endDateTime = new Date(d.getTime());
    endDateTime.setHours(19, 0, 0, 0);

    const startStr = Utilities.formatDate(startDateTime, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ssXXX");
    const endStr = Utilities.formatDate(endDateTime, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ssXXX");

    Calendar.Events!.insert({
      summary: username + " 休み",
      start: { dateTime: startStr },
      end: { dateTime: endStr },
      transparency: "opaque"
    }, calendarId);
  }
}

function createHollidayEvent(username: string, startDateString: string, endDateString: string): void {
  setUsername(username);
  createWorkingHoursEvent(username, startDateString, endDateString);

  // 終日の予定を登録するカレンダーのリスト（primary + 共有カレンダー）
  const calendarIds = ["primary", ...getUserCalendars().map(c => c.id)];

  calendarIds.forEach((calendarId) => {
    if (startDateString === endDateString) {
      const d = parseLocalDate(startDateString);
      createHollidayAllDayEvent(calendarId, username, d);
    } else {
      const startDate = parseLocalDate(startDateString);
      const endDate = parseLocalDate(endDateString);
      endDate.setDate(endDate.getDate() + 1);
      createHollidaysAllDayEvent(calendarId, username, startDate, endDate);
    }
  });
}

function parseDateTimeToRFC3339(dateString: string, timeString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function createTimeOffEvent(username: string, dateString: string, startTimeString: string, endTimeString: string): void {
  setUsername(username);
  
  const startStr = parseDateTimeToRFC3339(dateString, startTimeString);
  const endStr = parseDateTimeToRFC3339(dateString, endTimeString);
  
  // デフォルトカレンダー (primary) に登録
  Calendar.Events!.insert({
    summary: username + " 休み",
    start: { dateTime: startStr },
    end: { dateTime: endStr },
    transparency: "opaque"
  }, "primary");

  // 登録済みカレンダーにも登録
  getUserCalendars().forEach((calendarData) => {
    Calendar.Events!.insert({
      summary: username + " 休み",
      start: { dateTime: startStr },
      end: { dateTime: endStr },
      transparency: "opaque"
    }, calendarData.id);
  });
}


