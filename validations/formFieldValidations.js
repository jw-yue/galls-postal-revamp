// **GALLS CHECKOUT VALIDATION FUNCTIONS**
// Functions extracted from Galls checkout for reuse in postal checkout

// Saves checkout form data via AJAX and performs server-side validation
function saveCheckoutForm(action, inputObj) {}

// Displays error messages for form fields with visual styling
function errMsg(id, msg) {
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

// Handles form submission with comprehensive validation
function submitOrder() {
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

// Applies geographic formatting for city/state/zip based on input
function geoFmt(city, sta, cnty, geo, zip) {
  // Find the focused ZIP field to determine which address section to update
  const focusedElement = document.activeElement;

  if (
    focusedElement &&
    focusedElement.placeholder &&
    focusedElement.placeholder.includes("ZIP")
  ) {
    // Find the section this ZIP field belongs to
    const section = focusedElement.closest("[data-chk-editable-section]");
    if (section) {
      const sectionType = section.getAttribute("data-chk-editable-section");

      // Update the corresponding city, state, and ZIP fields in this section
      const cityField = section.querySelector('input[placeholder*="City"]');
      const stateField = section.querySelector(
        'select[title*="State"], input[placeholder*="State"]'
      );
      const zipField = section.querySelector('input[placeholder*="ZIP"]');

      if (cityField) cityField.value = city;
      if (stateField) stateField.value = sta;
      if (zipField) zipField.value = zip;

      // Trigger validation for the updated section
      if (sectionType === "delivery") {
        validateDeliveryAddress();
      }

      console.log(
        `Auto-filled address for ${sectionType}: ${city}, ${sta} ${zip}`
      );
    }
  }
}

function clickOnEnter(buttonElement, event) {}
