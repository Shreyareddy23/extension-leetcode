// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("status");
  
  // Load saved settings
  chrome.storage.sync.get(["reminderTime", "showNotification"], (data) => {
    if (data.reminderTime) {
      document.getElementById("timeInput").value = data.reminderTime;
    } else {
      // Prompt user to set time on first use
      statusEl.textContent = "Please set a reminder time to get started.";
      statusEl.className = "status-message notice";
    }
    
    if (data.showNotification !== undefined) {
      document.getElementById("notificationToggle").checked = data.showNotification;
    }
  });

  // Handle saving settings
  document.getElementById("saveBtn").addEventListener("click", () => {
    const time = document.getElementById("timeInput").value;
    const showNotification = document.getElementById("notificationToggle").checked;
    const statusEl = document.getElementById("status");
    
    if (time) {
      chrome.storage.sync.set({ 
        reminderTime: time,
        showNotification: showNotification
      }, () => {
        statusEl.textContent = `Settings saved! Reminder set for ${time}`;
        statusEl.className = "status-message success";
        
        // Clear the status message after 3 seconds
        setTimeout(() => {
          statusEl.textContent = "";
          statusEl.className = "status-message";
        }, 3000);
      });
    } else {
      statusEl.textContent = "Please enter a valid time.";
      statusEl.className = "status-message error";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const themeSelect = document.getElementById("themeSelect");

  // Load saved theme
  chrome.storage.sync.get(["theme"], (data) => {
    const theme = data.theme || "cottonCandy";
    document.body.classList.add(theme);
    themeSelect.value = theme;
  });

  // Listen for theme changes
  themeSelect.addEventListener("change", () => {
    const selectedTheme = themeSelect.value;

    // Remove all known themes
    document.body.classList.remove("cottonCandy", "mintMarshmallow", "lavenderSky");
    document.body.classList.add(selectedTheme);

    // Save selected theme
    chrome.storage.sync.set({ theme: selectedTheme });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const timeInput = document.getElementById("timeInput");
  const notificationToggle = document.getElementById("notificationToggle");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");
  const themeSelect = document.getElementById("themeSelect");

  const buddyStage = document.getElementById("buddyStage");
  const buddyMessage = document.getElementById("buddyMessage");

  // 🎉 Increment login count
  chrome.storage.sync.get(["loginCount"], (data) => {
    let count = data.loginCount || 0;
    count += 1;

    chrome.storage.sync.set({ loginCount: count });

    // 🌱 Show plant stage
    if (count <0) {
      buddyStage.textContent = "🌱";
      buddyMessage.textContent = "Keep showing up to grow your buddy!";
    } else if (count < 5) {
      buddyStage.textContent = "🌿";
      buddyMessage.textContent = "A sprout appears!";
    } else if (count < 20) {
      buddyStage.textContent = "🌷";
      buddyMessage.textContent = "Your flower is blooming!";
    } else {
      buddyStage.textContent = "🌸";
      buddyMessage.textContent = "Your buddy loves your dedication!";
    }
  });

  // 🧁 Load saved theme and settings
  chrome.storage.sync.get(["reminderTime", "showNotification", "theme"], (data) => {
    if (data.reminderTime) timeInput.value = data.reminderTime;
    if (data.showNotification !== undefined) notificationToggle.checked = data.showNotification;
    if (data.theme) {
      themeSelect.value = data.theme;
      document.body.className = data.theme;
    }
  });

  // Save settings
  saveBtn.addEventListener("click", () => {
    const reminderTime = timeInput.value;
    const showNotification = notificationToggle.checked;
    const selectedTheme = themeSelect.value;

    chrome.storage.sync.set({ reminderTime, showNotification, theme: selectedTheme }, () => {
      status.textContent = "Settings saved!";
      status.className = "status-message success";
      setTimeout(() => status.textContent = "", 2000);
      document.body.className = selectedTheme;
    });
  });
});
