/**
 * Delivery Component Module
 * Handles delivery section functionality
 */

import { updateEditButtonText } from "./sectionManager.js";

/**
 * Populate delivery section with mock data
 */
export function populateDeliveryData(deliveryData) {
  const deliverySection = document.querySelector(
    '[data-editable-section="delivery"]'
  );
  if (!deliverySection) return;

  // Update form inputs
  const inputFields = deliverySection.querySelectorAll('input[type="text"]');
  const stateSelect = deliverySection.querySelector("select");

  if (inputFields.length >= 5) {
    inputFields[0].value = deliveryData.fullName || ""; // Full Name
    inputFields[1].value = deliveryData.streetAddress || ""; // Street Address
    inputFields[2].value = deliveryData.apartment || ""; // Apartment/Suite
    inputFields[3].value = deliveryData.city || ""; // City
    inputFields[4].value = deliveryData.zip || ""; // ZIP Code
  }

  if (stateSelect && deliveryData.state) {
    stateSelect.value = deliveryData.state;
  }

  // Update display content
  updateDeliveryDisplayFromData(deliveryData);

  // Update button text based on content - check for ANY filled data
  const hasContent =
    (deliveryData.fullName && deliveryData.fullName.trim()) ||
    (deliveryData.streetAddress && deliveryData.streetAddress.trim()) ||
    (deliveryData.apartment && deliveryData.apartment.trim()) ||
    (deliveryData.city && deliveryData.city.trim()) ||
    (deliveryData.state && deliveryData.state.trim()) ||
    (deliveryData.zip && deliveryData.zip.trim());
  updateEditButtonText("delivery", hasContent);
}

/**
 * Update delivery display from form data
 */
export function updateDeliveryDisplay(sectionType) {
  console.log("updateDeliveryDisplay called with:", sectionType);
  if (sectionType !== "delivery") return;

  const editForm = document.querySelector(`[data-edit-form="${sectionType}"]`);
  const displayContent = document.querySelector(
    `[data-display-content="${sectionType}"]`
  );

  console.log("Edit form found:", editForm);
  console.log("Display content found:", displayContent);

  if (!editForm || !displayContent) return;

  // Get form values using more robust selectors
  const inputFields = editForm.querySelectorAll('input[type="text"]');
  const stateSelect = editForm.querySelector("select");

  console.log("Input fields found:", inputFields.length);
  console.log("State select found:", stateSelect);

  if (inputFields.length < 5 || !stateSelect) return;

  // Map inputs by their order in the form
  const nameInput = inputFields[0]; // Full Name
  const streetInput = inputFields[1]; // Street Address
  const aptInput = inputFields[2]; // Apartment/Suite
  const cityInput = inputFields[3]; // City
  const zipInput = inputFields[4]; // ZIP Code

  const name = nameInput.value.trim();
  const street = streetInput.value.trim();
  const apt = aptInput.value.trim();
  const city = cityInput.value.trim();
  const state = stateSelect.value;
  const zip = zipInput.value.trim();

  console.log("Form values:", { name, street, apt, city, state, zip });

  // Build address display text - show partial information as it's filled
  let addressText = "";
  let hasAnyContent = name || street || apt || city || state || zip;

  if (hasAnyContent) {
    if (name) {
      addressText += name + "<br />";
    }
    if (street) {
      addressText += street + "<br />";
    }
    if (apt) {
      addressText += apt + "<br />";
    }

    // Build city/state/zip line if any of them exist
    let locationLine = "";
    if (city) {
      locationLine += city;
    }
    if (state) {
      locationLine += (city ? ", " : "") + state;
    }
    if (zip) {
      locationLine += (city || state ? " " : "") + zip;
    }

    if (locationLine) {
      addressText += locationLine + "<br />";
    }

    // Always add country if we have any address content
    if (addressText) {
      addressText += "United States";
    }
  }

  console.log("Address text built:", addressText);

  // Handle display content update
  const addressElement = displayContent.querySelector(
    ".p-chk-address-card__address"
  );
  const emptyDescription = displayContent.querySelector(
    ".p-chk-address-card__empty-description"
  );

  console.log("Address element found:", addressElement);
  console.log("Empty description found:", emptyDescription);

  if (addressText) {
    // Hide empty description and show/update address
    if (emptyDescription) {
      emptyDescription.style.display = "none";
    }

    if (addressElement) {
      addressElement.innerHTML = addressText;
      addressElement.style.display = "block";
      console.log("Address display updated successfully");
    } else {
      // Create address element if it doesn't exist
      const newAddressElement = document.createElement("p");
      newAddressElement.className = "p-chk-address-card__address";
      newAddressElement.innerHTML = addressText;
      displayContent.appendChild(newAddressElement);
      console.log("Address element created and added");
    }

    // Update button text using generic function
    updateEditButtonText("delivery", true);
  } else {
    // No content - show empty state
    if (addressElement) {
      addressElement.style.display = "none";
    }
    if (emptyDescription) {
      emptyDescription.style.display = "block";
    }

    // Update button text using generic function
    updateEditButtonText("delivery", false);
  }
}

/**
 * Update delivery display from data object
 */
export function updateDeliveryDisplayFromData(deliveryData) {
  const displayContent = document.querySelector(
    '[data-display-content="delivery"]'
  );
  if (!displayContent) return;

  const addressElement = displayContent.querySelector(
    ".p-chk-address-card__address"
  );
  const emptyDescription = displayContent.querySelector(
    ".p-chk-address-card__empty-description"
  );

  // Build address display text
  let addressText = "";
  let hasAnyContent =
    deliveryData.fullName ||
    deliveryData.streetAddress ||
    deliveryData.apartment ||
    deliveryData.city ||
    deliveryData.state ||
    deliveryData.zip;

  if (hasAnyContent) {
    if (deliveryData.fullName) {
      addressText += deliveryData.fullName + "<br />";
    }
    if (deliveryData.streetAddress) {
      addressText += deliveryData.streetAddress + "<br />";
    }
    if (deliveryData.apartment) {
      addressText += deliveryData.apartment + "<br />";
    }

    // Build city/state/zip line
    let locationLine = "";
    if (deliveryData.city) {
      locationLine += deliveryData.city;
    }
    if (deliveryData.state) {
      locationLine += (deliveryData.city ? ", " : "") + deliveryData.state;
    }
    if (deliveryData.zip) {
      locationLine +=
        (deliveryData.city || deliveryData.state ? " " : "") + deliveryData.zip;
    }

    if (locationLine) {
      addressText += locationLine + "<br />";
    }

    if (addressText) {
      addressText += "United States";
    }
  }

  if (addressElement && emptyDescription) {
    if (addressText) {
      addressElement.innerHTML = addressText;
      addressElement.style.display = "block";
      emptyDescription.style.display = "none";
    } else {
      addressElement.style.display = "none";
      emptyDescription.style.display = "block";
    }
  }
}
