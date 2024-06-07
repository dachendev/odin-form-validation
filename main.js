/**
 * Checks the validity of a form control.
 *
 * @param {HTMLFormControlElement} control - The control to check.
 * @return {Object} An object with two properties:
 *   - valid: A boolean indicating whether the control is valid.
 *   - invalidStates: An array of strings representing the invalid states.
 */
function checkValidity(control) {
  // Check the validity of the control.
  const valid = control.checkValidity();

  // Initialize an array to store the invalid states.
  const invalidStates = [];

  // Check each invalid state and add it to the array if it's true.
  if (!valid) {
    if (control.validity.badInput) {
      invalidStates.push("badInput"); // Invalid value.
    }

    if (control.validity.patternMismatch) {
      invalidStates.push("patternMismatch"); // Value doesn't match the pattern.
    }

    if (control.validity.rangeOverflow) {
      invalidStates.push("rangeOverflow"); // Value is above the maximum.
    }

    if (control.validity.rangeUnderflow) {
      invalidStates.push("rangeUnderflow"); // Value is below the minimum.
    }

    if (control.validity.stepMismatch) {
      invalidStates.push("stepMismatch"); // Value doesn't match the step.
    }

    if (control.validity.tooLong) {
      invalidStates.push("tooLong"); // Value is too long.
    }

    if (control.validity.tooShort) {
      invalidStates.push("tooShort"); // Value is too short.
    }

    if (control.validity.typeMismatch) {
      invalidStates.push("typeMismatch"); // Value is not of the right type.
    }

    if (control.validity.valueMissing) {
      invalidStates.push("valueMissing"); // Value is missing.
    }
  }

  // Return the validity and invalid states.
  return { valid, invalidStates };
}

/**
 * Retrieves the feedback element for a form control.
 * If it doesn't exist, creates a new one and appends it to the control's parent element.
 *
 * @param {HTMLElement} control - The form control to retrieve the feedback element for.
 * @return {HTMLElement} The feedback element.
 */
function getOrCreateFeedback(control) {
  // Try to find an existing feedback element.
  let feedback = control.parentElement.querySelector(".form-feedback");

  // If the feedback element doesn't exist, create a new one and append it to the control's parent element.
  if (!feedback) {
    feedback = document.createElement("div"); // Create a new div element.
    feedback.classList.add("form-feedback"); // Add the "form-feedback" class to the div element.
    control.parentElement.insertBefore(feedback, control.nextSibling); // Insert the div element before the next sibling of the control's parent element.
  }

  return feedback; // Return the feedback element.
}

/**
 * Validates a form control and updates its appearance and feedback message based on its validity.
 *
 * @param {HTMLElement} control - The form control to validate.
 * @param {Object} [options={}] - Additional options for validation.
 * @param {Object} [options.messages] - Custom messages for specific invalid states.
 * @param {string} [options.messages.valueMissing] - Custom message for value missing.
 * @param {string} [options.messages.typeMismatch] - Custom message for type mismatch.
 * @param {string} [options.messages.patternMismatch] - Custom message for pattern mismatch.
 * @param {string} [options.messages.tooLong] - Custom message for too long value.
 * @param {string} [options.messages.tooShort] - Custom message for too short value.
 * @param {string} [options.messages.valid] - Custom message for valid value.
 */
function validateControl(control, options = {}) {
  // Check the validity of the control.
  const { valid, invalidStates } = checkValidity(control);

  // Retrieve or create the feedback element for the control.
  const feedback = getOrCreateFeedback(control);

  // Remove the "invalid" and "valid" classes from the control.
  control.classList.remove("invalid", "valid");

  // Remove the "invalid-feedback" and "valid-feedback" classes from the feedback element.
  feedback.classList.remove("invalid-feedback", "valid-feedback");

  // Reset the feedback message.
  feedback.textContent = "";

  if (!valid) {
    // If the control is invalid, add the "invalid" class to the control and the feedback element.
    control.classList.add("invalid");
    feedback.classList.add("invalid-feedback");

    // Get the first invalid state.
    const firstInvalidState = invalidStates[0];

    // Set the feedback message based on the invalid state and the custom messages.
    feedback.textContent =
      options.messages && options.messages[firstInvalidState]
        ? options.messages[firstInvalidState]
        : control.validationMessage;
  } else {
    // If the control is valid, add the "valid" class to the control and the feedback element.
    control.classList.add("valid");
    feedback.classList.add("valid-feedback");

    // Set the feedback message based on the custom valid message, or a default message.
    feedback.textContent =
      options.messages && options.messages.valid
        ? options.messages.valid
        : "Looks good!";
  }
}

/**
 * Validates a form by iterating over all its controls and calling the validateControl function on each one.
 *
 * @param {HTMLFormElement} form - The form to validate.
 * @param {Object} [options={}] - Additional options for validation.
 * @param {Object} [options.controlName] - Custom messages for the control with the given name.
 * @param {string} [options.controlName.messages.valueMissing] - Custom message for value missing.
 * @param {string} [options.controlName.messages.typeMismatch] - Custom message for type mismatch.
 * @param {string} [options.controlName.messages.patternMismatch] - Custom message for pattern mismatch.
 * @param {string} [options.controlName.messages.tooLong] - Custom message for too long value.
 * @param {string} [options.controlName.messages.tooShort] - Custom message for too short value.
 * @param {string} [options.controlName.messages.valid] - Custom message for valid value.
 */
function validateForm(form, options = {}) {
  const controls = form.querySelectorAll(".form-control");

  // Iterate over all the controls in the form and validate each one.
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

  // Add an event listener to the confirm password input to check if the password and confirm password match
  confirmPassword.addEventListener("change", (event) => {
    // If the password and confirm password do not match
    if (password.value !== confirmPassword.value) {
      // Get or create the feedback element for the confirm password input
      const feedback = getOrCreateFeedback(confirmPassword);

      // Add the "invalid" class to the confirm password input and remove the "valid" class
      confirmPassword.classList.add("invalid");
      confirmPassword.classList.remove("valid");

      // Add the "invalid-feedback" class to the feedback element and remove the "valid-feedback" class
      feedback.classList.add("invalid-feedback");
      feedback.classList.remove("valid-feedback");

      // Set the feedback message
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
