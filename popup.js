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
