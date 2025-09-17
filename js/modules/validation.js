/**
 * Validation Module
 * Galls-style validation functions for checkout forms
 */

/**
 * Saves checkout form data via AJAX and performs server-side validation
 */
export function saveCheckoutForm(action, inputObj) {
  console.log(`Saving checkout form - Action: ${action}`);

  // Clear existing errors for the field being validated
  if (inputObj && inputObj.id) {
    const field = document.getElementById(inputObj.id);
    if (field) {
      field.classList.remove("p-chk-form__input-error");
      const errorElement = document.getElementById("error_" + inputObj.id);
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  // For progressive checkout, perform client-side validation
  let isValid = true;

  if (action === "CONTACT") {
    isValid = validateContactInformation();
  } else if (action === "DELIVERY") {
    isValid = validateDeliveryAddress();
  } else if (action === "PRECHECK") {
    // Comprehensive validation before order submission
    isValid = validateContactInformation() && validateDeliveryAddress();
  }

  // In a real implementation, this would make an AJAX call to the server
  // For now, we'll simulate with client-side validation
  if (!isValid) {
    console.log("Validation failed for action:", action);
    return false;
  }

  console.log("Validation passed for action:", action);
  return true;
}

/**
 * Displays error messages for form fields with visual styling
 */
export function errMsg(id, msg) {
  const field = document.getElementById(id);
  if (!field) return;

  // Add error class to field
  field.classList.add("p-chk-form__input-error");

  // Remove existing error message
  const existingError = document.getElementById("error_" + id);
  if (existingError) {
    existingError.remove();
  }

  // Create and insert new error message
  const errorElement = document.createElement("p");
  errorElement.className = "p-chk-form__error-message";
  errorElement.id = "error_" + id;
  errorElement.textContent = msg;

  // Insert after the field's closest container div
  const container = field.closest("div");
  if (container) {
    container.insertAdjacentElement("afterend", errorElement);
  }
}

/**
 * Shows all validation errors stored in hidden field on page load
 */
export function showErrors2() {
  const errorField = document.getElementById("SIERR2");
  if (!errorField || !errorField.value) return;

  try {
    const errorArray = JSON.parse(decodeURIComponent(errorField.value));
    for (let i = 0; i < errorArray.length; i++) {
      const error = errorArray[i];
      if (i === 0) {
        // Focus on first error field
        const firstErrorField = document.getElementById(error.id);
        if (firstErrorField) {
          firstErrorField.focus();
        }
      }
      errMsg(error.id, error.errmsg);
    }
  } catch (e) {
    console.error("Error parsing validation errors:", e);
  }
}

/**
 * Handles form submission with comprehensive validation
 */
export function submitOrder() {
  console.log("Submitting order with comprehensive validation");

  // Perform comprehensive validation
  if (!saveCheckoutForm("PRECHECK")) {
    console.log("Order submission blocked - validation failed");
    return false;
  }

  // Check for required craft/profession selection (similar to Galls)
  const craftField = document.querySelector('select[title="Craft"]');
  if (craftField && !craftField.value) {
    errMsg(
      craftField.id || "craft-select",
      "Profession/Craft selection is required"
    );

    // Scroll to the field
    craftField.scrollIntoView({ behavior: "smooth", block: "center" });
    craftField.focus();
    return false;
  }

  console.log("All validations passed - ready to process order");
  return true;
}

/**
 * Validates contact information section
 */
function validateContactInformation() {
  let isValid = true;
  
  // Get contact form elements
  const emailField = document.querySelector('input[type="email"]');
  const craftField = document.querySelector('select[title="Craft"]');
  
  // Validate email
  if (emailField && !emailField.value.trim()) {
    errMsg(emailField.id || "email", "Email address is required");
    isValid = false;
  } else if (emailField && !isValidEmail(emailField.value.trim())) {
    errMsg(emailField.id || "email", "Please enter a valid email address");
    isValid = false;
  }
  
  // Validate craft selection
  if (craftField && !craftField.value) {
    errMsg(craftField.id || "craft", "Please select your profession/craft");
    isValid = false;
  }
  
  return isValid;
}

/**
 * Validates delivery address section
 */
function validateDeliveryAddress() {
  let isValid = true;
  
  // Get delivery form elements
  const deliverySection = document.querySelector('[data-editable-section="delivery"]');
  if (!deliverySection) return true;
  
  const inputFields = deliverySection.querySelectorAll('input[type="text"]');
  const stateSelect = deliverySection.querySelector("select");
  
  if (inputFields.length >= 5) {
    const nameField = inputFields[0];
    const streetField = inputFields[1];
    const cityField = inputFields[3];
    const zipField = inputFields[4];
    
    // Validate required fields
    if (!nameField.value.trim()) {
      errMsg(nameField.id || "fullname", "Full name is required");
      isValid = false;
    }
    
    if (!streetField.value.trim()) {
      errMsg(streetField.id || "street", "Street address is required");
      isValid = false;
    }
    
    if (!cityField.value.trim()) {
      errMsg(cityField.id || "city", "City is required");
      isValid = false;
    }
    
    if (!zipField.value.trim()) {
      errMsg(zipField.id || "zip", "ZIP code is required");
      isValid = false;
    }
  }
  
  if (stateSelect && !stateSelect.value) {
    errMsg(stateSelect.id || "state", "State selection is required");
    isValid = false;
  }
  
  return isValid;
}

/**
 * Applies geographic formatting for city/state/zip based on input
 */
export function geoFmt(city, sta, cnty, geo, zip) {
  // Find the focused ZIP field to determine which address section to update
  const focusedElement = document.activeElement;

  if (
    focusedElement &&
    focusedElement.placeholder &&
    focusedElement.placeholder.includes("ZIP")
  ) {
    // Find the section this ZIP field belongs to
    const section = focusedElement.closest("[data-editable-section]");
    if (section) {
      const sectionType = section.getAttribute("data-editable-section");

      // Update the corresponding city, state, and ZIP fields in this section
      const cityField = section.querySelector('input[placeholder*="City"]');
      const stateField = section.querySelector('select');
      const zipField = section.querySelector('input[placeholder*="ZIP"]');

      if (cityField && city) cityField.value = city;
      if (stateField && sta) stateField.value = sta;
      if (zipField && zip) zipField.value = zip;
    }
  }
}

/**
 * Handle Enter key press on form elements
 */
export function clickOnEnter(buttonElement, event) {
  if (event.key === "Enter") {
    buttonElement.click();
  }
}

/**
 * Simple email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}