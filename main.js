function checkValidity(control) {
  const valid = control.checkValidity();
  const invalidStates = [];

  if (!valid) {
    if (control.validity.badInput) {
      invalidStates.push("badInput");
    }

    if (control.validity.patternMismatch) {
      invalidStates.push("patternMismatch");
    }

    if (control.validity.rangeOverflow) {
      invalidStates.push("rangeOverflow");
    }

    if (control.validity.rangeUnderflow) {
      invalidStates.push("rangeUnderflow");
    }

    if (control.validity.stepMismatch) {
      invalidStates.push("stepMismatch");
    }

    if (control.validity.tooLong) {
      invalidStates.push("tooLong");
    }

    if (control.validity.tooShort) {
      invalidStates.push("tooShort");
    }

    if (control.validity.typeMismatch) {
      invalidStates.push("typeMismatch");
    }

    if (control.validity.valueMissing) {
      invalidStates.push("valueMissing");
    }
  }

  return { valid, invalidStates };
}

function getOrCreateFeedback(control) {
  let feedback = control.parentElement.querySelector(".form-feedback");

  if (!feedback) {
    feedback = document.createElement("div");
    feedback.classList.add("form-feedback");
    control.parentElement.insertBefore(feedback, control.nextSibling);
  }

  return feedback;
}

function validateControl(control, options = {}) {
  const { valid, invalidStates } = checkValidity(control);
  const feedback = getOrCreateFeedback(control);

  control.classList.remove("invalid", "valid");

  feedback.classList.remove("invalid-feedback", "valid-feedback");
  feedback.textContent = "";

  if (!valid) {
    control.classList.add("invalid");
    feedback.classList.add("invalid-feedback");

    const firstInvalidState = invalidStates[0];

    if (options.messages && options.messages[firstInvalidState]) {
      feedback.textContent = options.messages[firstInvalidState];
    } else {
      feedback.textContent = control.validationMessage;
    }
  } else {
    control.classList.add("valid");
    feedback.classList.add("valid-feedback");

    if (options.messages && options.messages.valid) {
      feedback.textContent = options.messages.valid;
    } else {
      feedback.textContent = "Looks good!";
    }
  }
}

function validateForm(form, options = {}) {
  const controls = form.querySelectorAll(".form-control");

  controls.forEach((control) => {
    validateControl(control, options[control.name]);
  });
}

function domLoaded() {
  const form = document.querySelector("form");
  const controls = document.querySelectorAll(".form-control");
  const password = document.querySelector('[name="password"]');
  const confirmPassword = document.querySelector('[name="confirm-password"]');

  const options = {
    email: {
      messages: {
        valueMissing: "Email is required.",
        typeMismatch: "Email must be valid.",
        patternMismatch: "Email must be valid.",
      },
    },
    country: {
      messages: {
        valueMissing: "Country is required.",
        patternMismatch: "Country must be 2 characters.",
      },
    },
    zipcode: {
      messages: {
        valueMissing: "Zip code is required.",
        patternMismatch: "Zip code must be 5 digits.",
      },
    },
    password: {
      messages: {
        valueMissing: "Password is required.",
        tooShort: "Password must be at least 8 characters.",
        patternMismatch:
          "Password must be at least 8 characters and contain at least one uppercase, one lowercase, and one number.",
      },
    },
    "confirm-password": {
      messages: {
        valueMissing: "Password confirmation is required.",
      },
    },
  };

  controls.forEach((control) => {
    control.addEventListener("change", (event) => {
      validateControl(control, options[control.name]);
    });
  });

  confirmPassword.addEventListener("change", (event) => {
    if (password.value !== confirmPassword.value) {
      const feedback = getOrCreateFeedback(confirmPassword);

      confirmPassword.classList.add("invalid");
      confirmPassword.classList.remove("valid");

      feedback.classList.add("invalid-feedback");
      feedback.classList.remove("valid-feedback");
      feedback.textContent = "Passwords do not match.";
    }
  });

  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      validateForm(form, options);
    }

    form.classList.add("was-validated");
  });
}

document.addEventListener("DOMContentLoaded", domLoaded);
