const test = require("node:test");
const assert = require("node:assert/strict");
const { bindForm } = require("./settings.js");

function createDocument(values) {
  const store = {};

  function addInput(id, value) {
    store[id] = {
      id: id,
      value: value,
      attributes: {},
      focused: false,
      setAttribute: function (name, attributeValue) {
        this.attributes[name] = String(attributeValue);
      },
      removeAttribute: function (name) {
        delete this.attributes[name];
      },
      focus: function () {
        this.focused = true;
      }
    };
  }

  function addText(id) {
    store[id] = { id: id, textContent: "" };
  }

  addInput("full-name", values.fullName);
  addInput("work-email", values.workEmail);
  addInput("department", values.department);
  addText("full-name-error");
  addText("work-email-error");
  addText("department-error");
  addText("confirmation");

  const form = {
    id: "employee-settings-form",
    handler: null,
    addEventListener: function (type, handler) {
      if (type === "submit") {
        this.handler = handler;
      }
    }
  };
  store["employee-settings-form"] = form;

  return {
    getElementById: function (id) {
      return store[id];
    },
    submit: function () {
      const event = {
        defaultPrevented: false,
        preventDefault: function () {
          this.defaultPrevented = true;
        }
      };
      form.handler(event);
      return event;
    }
  };
}

test("empty required fields show errors beside each field and are not saved", function () {
  const doc = createDocument({
    fullName: "   ",
    workEmail: "",
    department: ""
  });

  bindForm(doc);
  const event = doc.submit();

  assert.equal(event.defaultPrevented, true);
  assert.equal(doc.getElementById("full-name-error").textContent, "Full name is required.");
  assert.equal(doc.getElementById("work-email-error").textContent, "Work email is required.");
  assert.equal(doc.getElementById("department-error").textContent, "Department is required.");
  assert.equal(doc.getElementById("full-name").attributes["aria-invalid"], "true");
  assert.equal(doc.getElementById("confirmation").textContent, "");
  assert.equal(doc.getElementById("full-name").focused, true);
});

test("invalid email shows an error beside the email field and is not saved", function () {
  const doc = createDocument({
    fullName: "Iman",
    workEmail: "iman-at-company",
    department: "IT"
  });

  bindForm(doc);
  doc.submit();

  assert.equal(doc.getElementById("full-name-error").textContent, "");
  assert.equal(
    doc.getElementById("work-email-error").textContent,
    "Enter a valid work email, like name@company.com."
  );
  assert.equal(doc.getElementById("department-error").textContent, "");
  assert.equal(doc.getElementById("work-email").attributes["aria-invalid"], "true");
  assert.equal(doc.getElementById("full-name").attributes["aria-invalid"], undefined);
  assert.equal(doc.getElementById("confirmation").textContent, "");
  assert.equal(doc.getElementById("work-email").focused, true);
});

test("valid submission shows a frontend-only confirmation", function () {
  const doc = createDocument({
    fullName: " Iman ",
    workEmail: "iman@company.com",
    department: "HR"
  });

  bindForm(doc);
  const event = doc.submit();

  assert.equal(event.defaultPrevented, true);
  assert.equal(doc.getElementById("full-name-error").textContent, "");
  assert.equal(doc.getElementById("work-email-error").textContent, "");
  assert.equal(doc.getElementById("department-error").textContent, "");
  assert.equal(doc.getElementById("full-name").attributes["aria-invalid"], undefined);
  assert.equal(
    doc.getElementById("confirmation").textContent,
    "Settings checked for Iman. This is a frontend demonstration only. Employee data was not stored in a database."
  );
});
