const STORAGE_KEY = "employeeSettings";

const form = document.getElementById("settings-form");
const statusEl = document.getElementById("status");
const timezoneSelect = document.getElementById("timezone");

const fields = {
  preferredName: document.getElementById("preferred-name"),
  fullName: document.getElementById("full-name"),
  workEmail: document.getElementById("work-email"),
  phone: document.getElementById("phone"),
  jobTitle: document.getElementById("job-title"),
  department: document.getElementById("department"),
  startDate: document.getElementById("start-date"),
  managerEmail: document.getElementById("manager-email"),
  timezone: timezoneSelect,
  emailReminders: document.getElementById("email-reminders"),
  weeklySummary: document.getElementById("weekly-summary"),
};

function fillTimezones() {
  const zones = typeof Intl.supportedValuesOf === "function"
    ? Intl.supportedValuesOf("timeZone")
    : ["UTC"];
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  zones.forEach((zone) => {
    const option = document.createElement("option");
    option.value = zone;
    option.textContent = zone.replaceAll("_", " ");
    timezoneSelect.append(option);
  });

  if (zones.includes(localZone)) {
    timezoneSelect.value = localZone;
  }
}

function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function applySettings(settings) {
  if (!settings) {
    return;
  }

  Object.entries(fields).forEach(([key, input]) => {
    if (!(key in settings)) {
      return;
    }
    if (input.type === "checkbox") {
      input.checked = Boolean(settings[key]);
    } else {
      input.value = settings[key];
    }
  });
}

function collectSettings() {
  return {
    preferredName: fields.preferredName.value.trim(),
    fullName: fields.fullName.value.trim(),
    workEmail: fields.workEmail.value.trim(),
    phone: fields.phone.value.trim(),
    jobTitle: fields.jobTitle.value.trim(),
    department: fields.department.value,
    startDate: fields.startDate.value,
    managerEmail: fields.managerEmail.value.trim(),
    timezone: fields.timezone.value,
    emailReminders: fields.emailReminders.checked,
    weeklySummary: fields.weeklySummary.checked,
  };
}

function setError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  input.setAttribute("aria-invalid", "true");
  if (error) {
    error.hidden = false;
    error.textContent = message;
  }
}

function clearErrors() {
  form.querySelectorAll("[aria-invalid]").forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
  form.querySelectorAll(".error").forEach((error) => {
    error.hidden = true;
    error.textContent = "";
  });
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(settings) {
  clearErrors();
  let firstInvalid = null;

  function fail(input, message) {
    setError(input, message);
    if (!firstInvalid) {
      firstInvalid = input;
    }
  }

  if (!settings.preferredName) {
    fail(fields.preferredName, "Enter the name you want the assistant to use.");
  }
  if (!settings.fullName) {
    fail(fields.fullName, "Enter your full name.");
  }
  if (!settings.workEmail) {
    fail(fields.workEmail, "Enter your work email.");
  } else if (!isEmail(settings.workEmail)) {
    fail(fields.workEmail, "Enter a valid email address.");
  }
  if (settings.phone && !/^[0-9+().\-\s]{7,30}$/.test(settings.phone)) {
    fail(fields.phone, "Enter a phone number using digits, spaces, or + ( ) - .");
  }
  if (!settings.jobTitle) {
    fail(fields.jobTitle, "Enter your job title.");
  }
  if (!settings.department) {
    fail(fields.department, "Select your department.");
  }
  if (!settings.startDate) {
    fail(fields.startDate, "Enter your start date.");
  }
  if (settings.managerEmail && !isEmail(settings.managerEmail)) {
    fail(fields.managerEmail, "Enter a valid email address.");
  }
  if (!settings.timezone) {
    fail(fields.timezone, "Select your time zone.");
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }
  return true;
}

function showStatus(message, isOk) {
  statusEl.textContent = message;
  statusEl.classList.toggle("ok", isOk);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const settings = collectSettings();
  if (!validate(settings)) {
    showStatus("Fix the highlighted fields before saving.", false);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  showStatus("Settings saved on this device.", true);
});

document.getElementById("reset-button").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  clearErrors();
  if (timezoneSelect.querySelector(`option[value="${Intl.DateTimeFormat().resolvedOptions().timeZone}"]`)) {
    timezoneSelect.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  showStatus("Settings cleared.", true);
});

fillTimezones();
applySettings(readSaved());
