let reminderTime = null; // No default time
let showNotification = true; // Default notification setting

// Load settings on background startup
chrome.storage.sync.get(["reminderTime", "showNotification"], (data) => {
  if (data.reminderTime) {
    reminderTime = data.reminderTime;
    console.log("Loaded reminder time:", reminderTime);
    scheduleAlarm(reminderTime);
  } else {
    console.log("No reminder time set yet.");
  }
  
  if (data.showNotification !== undefined) {
    showNotification = data.showNotification;
  }
  
  console.log("Show notification:", showNotification);
});

// Listen for changes in settings
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") {
    if (changes.reminderTime) {
      reminderTime = changes.reminderTime.newValue;
      console.log("Updated reminder time:", reminderTime);
      scheduleAlarm(reminderTime); // Re-schedule alarm
    }
    
    if (changes.showNotification) {
      showNotification = changes.showNotification.newValue;
      console.log("Updated notification setting:", showNotification);
    }
  }
});

// Schedule the alarm
function scheduleAlarm(timeStr) {
  if (!timeStr) {
    console.log("Cannot schedule alarm: No time provided");
    return;
  }

  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  const alarmTime = new Date();

  alarmTime.setHours(hours);
  alarmTime.setMinutes(minutes);
  alarmTime.setSeconds(0);

  // If the time has already passed today, schedule for tomorrow
  if (alarmTime <= now) {
    alarmTime.setDate(alarmTime.getDate() + 1);
  }

  const delayInMinutes = (alarmTime - now) / 60000;

  chrome.alarms.clear("leetcodeAlarm", () => {
    chrome.alarms.create("leetcodeAlarm", {
      delayInMinutes,
      periodInMinutes: 1440 // Repeat every 24 hours
    });
    
    console.log(`Alarm scheduled for ${timeStr}, in ${Math.round(delayInMinutes)} minutes`);
  });
}

// Handle alarm trigger
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "leetcodeAlarm") {
    // Open LeetCode
    chrome.tabs.create({ url: "https://leetcode.com" });
    
    // Show notification if enabled
    if (showNotification) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon.png",
        title: "LeetCode Reminder",
        message: "Time to practice your coding skills!"
            });
    }
  }
});