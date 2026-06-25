interface CalendarData {
  id: string;
  name: string;
  color: string;
  isAdded?: boolean;
}

interface AllCalendarData extends CalendarData {
  isAdded: boolean;
}

function getUserCalendars(): CalendarData[] {
  const userProperties = PropertiesService.getUserProperties();
  const calendarsString = userProperties.getProperty("calendars");
  if (!calendarsString) {
    return [];
  }
  try {
    const calendarsJSON = JSON.parse(calendarsString) as CalendarData[];
    return calendarsJSON;
  } catch (e) {
    return [];
  }
}

function getUsername(): string {
  const userProperties = PropertiesService.getUserProperties();
  return userProperties.getProperty("username") || "";
}

function setUsername(username: string): void {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("username", username);
}

function addUserCalendar(name: string, calendarId: string, color: string): CalendarData[] {
  const usersCalendars = getUserCalendars();
  if (usersCalendars.some((data) => data.id === calendarId)) {
    return usersCalendars;
  } else {
    usersCalendars.push({ id: calendarId, name: name, color: color });
  }
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("calendars", JSON.stringify(usersCalendars));
  return usersCalendars;
}

function deleteUserCalendar(calendarId: string): CalendarData[] {
  let usersCalendars = getUserCalendars();
  usersCalendars = usersCalendars.filter((data) => data.id !== calendarId);
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("calendars", JSON.stringify(usersCalendars));
  return usersCalendars;
}

function getAllCalendarsData(): AllCalendarData[] {
  const calendars = CalendarApp.getAllCalendars();
  const usersCalendars = getUserCalendars();
  
  return calendars
    .filter((calendar) => !calendar.isMyPrimaryCalendar())
    .map((calendar) => {
      return {
        id: calendar.getId(),
        name: calendar.getName(),
        color: calendar.getColor(),
        isAdded: usersCalendars.some((data) => data.id === calendar.getId())
      };
    });
}
