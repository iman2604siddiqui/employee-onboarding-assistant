(function (root, factory) {
  var api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.EmployeeSettings = api;

  if (root.document) {
    var start = function () {
      api.bindForm(root.document);
    };

    if (root.document.readyState === "loading") {
      root.document.addEventListener("DOMContentLoaded", start);
    } else {
      start();
    }
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var DEPARTMENTS = ["HR", "IT", "Marketing", "Finance"];
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var FIELDS = [
    { key: "fullName", id: "full-name" },
    { key: "workEmail", id: "work-email" },
    { key: "department", id: "department" }
  ];

  function clean(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function validateEmployeeSettings(input) {
    var fullName = clean(input && input.fullName);
    var workEmail = clean(input && input.workEmail);
    var department = clean(input && input.department);
    var errors = {};

    if (!fullName) {
      errors.fullName = "Full name is required.";
    }

    if (!workEmail) {
      errors.workEmail = "Work email is required.";
    } else if (!EMAIL_PATTERN.test(workEmail)) {
      errors.workEmail = "Enter a valid work email, like name@company.com.";
    }

    if (!department) {
      errors.department = "Department is required.";
    } else if (DEPARTMENTS.indexOf(department) === -1) {
      errors.department = "Choose HR, IT, Marketing, or Finance.";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors,
      values: {
        fullName: fullName,
        workEmail: workEmail,
        department: department
      }
    };
  }

  function handleSettingsSubmit(input) {
    var validation = validateEmployeeSettings(input);

    if (!validation.valid) {
      return {
        accepted: false,
        message: "",
        errors: validation.errors
      };
    }

    return {
      accepted: true,
      message:
        "Settings checked for " +
        validation.values.fullName +
        ". This is a frontend demonstration only. Employee data was not stored in a database.",
      errors: {},
      employee: validation.values
    };
  }

  function showResult(doc, result) {
    var firstInvalid = null;

    FIELDS.forEach(function (field) {
      var message = result.errors[field.key] || "";
      var input = doc.getElementById(field.id);
      doc.getElementById(field.id + "-error").textContent = message;

      if (message) {
        input.setAttribute("aria-invalid", "true");
        if (!firstInvalid) {
          firstInvalid = input;
        }
      } else {
        input.removeAttribute("aria-invalid");
      }
    });

    doc.getElementById("confirmation").textContent = result.accepted ? result.message : "";

    if (firstInvalid) {
      firstInvalid.focus();
    }
  }

  function bindForm(doc) {
    var form = doc.getElementById("employee-settings-form");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var result = handleSettingsSubmit({
        fullName: doc.getElementById("full-name").value,
        workEmail: doc.getElementById("work-email").value,
        department: doc.getElementById("department").value
      });

      showResult(doc, result);
    });
  }

  return {
    DEPARTMENTS: DEPARTMENTS,
    validateEmployeeSettings: validateEmployeeSettings,
    handleSettingsSubmit: handleSettingsSubmit,
    bindForm: bindForm
  };
});
