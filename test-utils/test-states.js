// =============================================================================
// TEST STATE UTILITIES - DEVELOPMENT ONLY
// =============================================================================
// This file contains utilities for testing different checkout states
// and should NOT be included in production builds.

// Mock data for different checkout states
const mockData = {
  contact: {
    // New user - no data populated, form should be open
    contact: {
      email: "",
      craft: "",
    },
    delivery: {
      fullName: "",
      streetAddress: "",
      apartment: "",
      city: "",
      state: "",
      zip: "",
    },
  },
  delivery: {
    // Contact filled, delivery partially filled
    contact: {
      email: "john.doe@email.com",
      craft: "Police Officer",
    },
    delivery: {
      fullName: "John Doe",
      streetAddress: "123 Main Street",
      apartment: "", // Leave some fields blank
      city: "", // Leave some fields blank
      state: "",
      zip: "",
    },
  },
  payment: {
    // Both contact and delivery completed
    contact: {
      email: "example@test.com",
      craft: "Firefighter",
    },
    delivery: {
      fullName: "John Doe",
      streetAddress: "123 Main Street",
      apartment: "Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
  },
};

// Enhanced state change function with mock data population
function changeStateWithMockData(newState) {
  const mainContent = document.querySelector(".p-chk-main__content");
  if (mainContent) {
    mainContent.setAttribute("data-chk-state", newState);
    console.log("State changed to:", newState);

    // Reset current editing
    if (typeof currentEditingSection !== 'undefined' && currentEditingSection) {
      completeEditing(currentEditingSection);
    }

    // Populate mock data
    populateMockData(newState);

    // Re-initialize
    if (typeof initializeFromState === 'function') {
      initializeFromState();
    }
  }
}

// Function to populate mock data based on state
function populateMockData(state) {
  const data = mockData[state];
  if (!data) return;

  console.log("Populating mock data for state:", state, data);

  // Populate contact data
  populateContactData(data.contact);

  // Populate delivery data
  populateDeliveryData(data.delivery);
}

// Function to populate contact section with mock data
function populateContactData(contactData) {
  const contactSection = document.querySelector(
    '[data-editable-section="contact"]'
  );
  if (!contactSection) return;

  // Update display content
  const emailDisplay = contactSection.querySelector(
    ".p-chk-contact-card__email"
  );
  const jobDisplay = contactSection.querySelector(
    ".p-chk-contact-card__job-title"
  );

  if (emailDisplay) {
    emailDisplay.textContent = contactData.email || "";
  }
  if (jobDisplay) {
    jobDisplay.textContent = contactData.craft || "";
  }

  // Update form inputs
  const emailInput = contactSection.querySelector('input[type="email"]');
  const craftSelect = contactSection.querySelector("select");

  if (emailInput) {
    emailInput.value = contactData.email || "";
  }
  if (craftSelect && contactData.craft) {
    // Find the option that matches the craft
    const options = craftSelect.querySelectorAll("option");
    options.forEach((option) => {
      if (option.textContent.includes(contactData.craft)) {
        option.selected = true;
      }
    });
  }

  // Update button text based on content - check if contact has ANY data
  const hasContactContent =
    (contactData.email && contactData.email.trim()) ||
    (contactData.craft && contactData.craft.trim());
  if (typeof updateEditButtonText === 'function') {
    updateEditButtonText("contact", hasContactContent);
  }
}

// Function to populate delivery section with mock data
function populateDeliveryData(deliveryData) {
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
  if (typeof updateEditButtonText === 'function') {
    updateEditButtonText("delivery", hasContent);
  }
}

// Function to update delivery display from data object
function updateDeliveryDisplayFromData(deliveryData) {
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

// Utility function to change state for testing (can be called from browser console)
function changeState(newState) {
  const mainContent = document.querySelector(".p-chk-main__content");
  if (mainContent) {
    mainContent.setAttribute("data-chk-state", newState);
    console.log("State changed to:", newState);

    // Reset current editing
    if (typeof currentEditingSection !== 'undefined' && currentEditingSection) {
      completeEditing(currentEditingSection);
    }

    // Re-initialize
    if (typeof initializeFromState === 'function') {
      initializeFromState();
    }
  }
}

// Test States Panel Toggle Functionality
let testStatesPanelVisible = true;

function toggleTestStates() {
  const panel = document.getElementById("testStatesPanel");
  const tab = document.getElementById("testStatesTab");

  if (testStatesPanelVisible) {
    // Hide panel, show tab
    panel.style.transform = "translateX(-100%)";
    tab.style.left = "0px";
    testStatesPanelVisible = false;
  } else {
    // Show panel, hide tab
    panel.style.transform = "translateX(0)";
    tab.style.left = "-90px";
    testStatesPanelVisible = true;
  }
}