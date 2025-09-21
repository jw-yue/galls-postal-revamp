// Section Manager Module - Handles all section editing state management and UI updates

// Global state
let currentEditingSection = null;

// Getter for current editing section (for test utilities)
function getCurrentEditingSection() {
  return currentEditingSection;
}

// State-driven initialization function
function initializeFromState() {
  const mainContent = document.querySelector("[data-chk-state]");
  const state = mainContent ? mainContent.getAttribute("data-chk-state") : null;

  console.log("Initializing from state:", state);

  if (!state) return;

  // Set up UI based on the state
  switch (state) {
    case "contact":
      // Contact form should be open, other sections hidden/disabled (new user)
      console.log("Setting up contact state - new user");
      setTimeout(() => {
        startEditing("contact");
        // Restore payment section border radius when not in payment state
        SectionManager.manageBorderRadius("payment", "restore");
        // Show delivery Add button for new user (no delivery content yet)
        updateEditButtonText("delivery", false);
        // Ensure delivery shows empty state
        const deliveryDisplayContent = document.querySelector(
          '[data-chk-display-content="delivery"]'
        );
        const deliveryAddressElement = deliveryDisplayContent?.querySelector(
          "[data-chk-delivery-address]"
        );
        const deliveryEmptyDescription = deliveryDisplayContent?.querySelector(
          "[data-chk-delivery-empty]"
        );
        if (deliveryAddressElement && deliveryEmptyDescription) {
          deliveryAddressElement.style.display = "none";
          deliveryEmptyDescription.style.display = "block";
        }

        // Ensure contact shows empty state
        const contactDisplayContent = document.querySelector(
          '[data-chk-display-content="contact"]'
        );
        const contactEmailElement = contactDisplayContent?.querySelector(
          "[data-chk-contact-email]"
        );
        const contactEmptyDescription = contactDisplayContent?.querySelector(
          "[data-chk-contact-empty]"
        );
        if (contactEmailElement && contactEmptyDescription) {
          contactEmailElement.style.display = "none";
          contactEmptyDescription.style.display = "block";
        }
      }, 100);
      break;

    case "delivery":
      // Contact completed, delivery form open
      console.log("Setting up delivery state");
      setTimeout(() => {
        startEditing("delivery");
        // Restore payment section border radius when not in payment state
        SectionManager.manageBorderRadius("payment", "restore");

        // Ensure contact shows completed email (not empty state)
        const contactDisplayContent = document.querySelector(
          '[data-chk-display-content="contact"]'
        );
        const contactEmailElement = contactDisplayContent?.querySelector(
          "[data-chk-contact-email]"
        );
        const contactEmptyDescription = contactDisplayContent?.querySelector(
          "[data-chk-contact-empty]"
        );
        if (contactEmailElement && contactEmptyDescription) {
          contactEmailElement.style.display = "block";
          contactEmptyDescription.style.display = "none";
        }
      }, 100);
      break;

    case "payment":
      // Both contact and delivery completed, payment highlighted
      console.log("Setting up payment state");
      setTimeout(() => {
        SectionManager.manageHeaders("payment", "show-blue");
        SectionManager.manageBorderRadius("payment", "remove-top");

        // Ensure contact shows completed email (not empty state)
        const contactDisplayContent = document.querySelector(
          '[data-chk-display-content="contact"]'
        );
        const contactEmailElement = contactDisplayContent?.querySelector(
          "[data-chk-contact-email]"
        );
        const contactEmptyDescription = contactDisplayContent?.querySelector(
          "[data-chk-contact-empty]"
        );
        if (contactEmailElement && contactEmptyDescription) {
          contactEmailElement.style.display = "block";
          contactEmptyDescription.style.display = "none";
        }

        // Ensure delivery shows completed address (not empty state)
        const deliveryDisplayContent = document.querySelector(
          '[data-chk-display-content="delivery"]'
        );
        const deliveryAddressElement = deliveryDisplayContent?.querySelector(
          "[data-chk-delivery-address]"
        );
        const deliveryEmptyDescription = deliveryDisplayContent?.querySelector(
          "[data-chk-delivery-empty]"
        );
        if (deliveryAddressElement && deliveryEmptyDescription) {
          deliveryAddressElement.style.display = "block";
          deliveryEmptyDescription.style.display = "none";
        }
      }, 100);
      break;

    default:
      // Default state - no specific initialization needed
      console.log("No specific state initialization needed");
      break;
  }
}

const SectionManager = {
  // Cache DOM queries for performance
  getSection: (sectionType) =>
    document.querySelector(`[data-chk-editable-section="${sectionType}"]`),
  getSectionElement: (sectionType, selector) => {
    const section = SectionManager.getSection(sectionType);
    return section ? section.querySelector(selector) : null;
  },
  getSectionHeader: (sectionType) =>
    document.querySelector(`[data-chk-section-header="${sectionType}"]`),
  getDisplayContent: (sectionType) =>
    document.querySelector(`[data-chk-display-content="${sectionType}"]`),
  getEditForm: (sectionType) =>
    document.querySelector(`[data-chk-edit-form="${sectionType}"]`),

  // Generic function to show section form
  showSectionForm: (sectionType) => {
    const editForm = SectionManager.getEditForm(sectionType);
    if (editForm) {
      // Use Bootstrap 5 Collapse API
      const collapse = new bootstrap.Collapse(editForm, {
        toggle: false,
      });
      collapse.show();
    }
  },

  // Generic function to hide section form
  hideSectionForm: (sectionType) => {
    const editForm = SectionManager.getEditForm(sectionType);
    if (editForm) {
      // Use Bootstrap 5 Collapse API
      const collapse = new bootstrap.Collapse(editForm, {
        toggle: false,
      });
      collapse.hide();
    }
  },

  // Generic function to show section summary
  showSectionSummary: (sectionType) => {
    const displayContent = SectionManager.getDisplayContent(sectionType);
    if (displayContent && sectionType !== "payment") {
      displayContent.classList.remove("hidden");
    }
  },

  // Generic function to hide section summary
  hideSectionSummary: (sectionType) => {
    const displayContent = SectionManager.getDisplayContent(sectionType);
    if (displayContent && sectionType !== "payment") {
      displayContent.classList.add("hidden");
    }
  },

  // Unified header management
  manageHeaders: (sectionType, action) => {
    const isPayment = sectionType === "payment";
    const paymentCardHeader = document.querySelector(
      "[data-chk-payment-header]"
    );
    const sectionHeader = SectionManager.getSectionHeader(sectionType);

    if (action === "show-blue") {
      // Hide all blue headers first
      document.querySelectorAll("[data-chk-section-header]").forEach((h) => {
        h.classList.remove("active");
        h.style.display = "none";
      });

      // Show specific blue header
      if (sectionHeader) {
        sectionHeader.classList.add("active");
        sectionHeader.style.display = "block";
      }

      // Payment header management
      if (isPayment && paymentCardHeader) {
        // Hide payment card header when editing payment
        paymentCardHeader.style.display = "none";
      } else if (!isPayment && paymentCardHeader) {
        // Show payment card header when editing other sections (restore if hidden)
        paymentCardHeader.style.display = "block";
      }
    } else if (action === "hide-blue") {
      // Hide blue header
      if (sectionHeader) {
        sectionHeader.classList.remove("active");
        sectionHeader.style.display = "none";
      }

      // Show payment card header if completing payment
      if (isPayment && paymentCardHeader) {
        paymentCardHeader.style.display = "block";
      }
    }
  },

  // Unified border radius management
  manageBorderRadius: (sectionType, action) => {
    const section = SectionManager.getSection(sectionType);
    if (!section) return;

    const containers = [
      section.querySelector(
        "[data-chk-contact-container], [data-chk-delivery-container]"
      ),
      section.querySelector("[data-chk-payment-container]"),
    ].filter(Boolean);

    containers.forEach((container) => {
      if (action === "remove-top") {
        container.classList.add("no-top-radius");
      } else if (action === "restore") {
        container.classList.remove("no-top-radius");
      }
    });
  },

  // Unified section state management
  setSectionState: (sectionType, isEditing) => {
    const section = SectionManager.getSection(sectionType);
    if (!section) return;

    // Section editing class
    section.classList.toggle("editing", isEditing);

    // Regular header editing class
    const regularHeader = section.querySelector(
      "[data-chk-contact-header], [data-chk-delivery-header], [data-chk-payment-header]"
    );
    if (regularHeader) {
      regularHeader.classList.toggle("editing", isEditing);
    }

    // Display content visibility (except payment)
    if (sectionType !== "payment") {
      const displayContent = SectionManager.getDisplayContent(sectionType);
      if (displayContent) {
        displayContent.classList.toggle("hidden", isEditing);
      }
    }
  },
};

// Initialize button states and forms based on content
function initializeButtonStates() {
  // Check contact section state
  const contactSection = document.querySelector(
    '[data-chk-editable-section="contact"]'
  );
  const contactEditButton = document.getElementById("contactEditButton");
  const contactDisplayContent = document.querySelector(
    '[data-chk-display-content="contact"]'
  );
  const contactForm = document.querySelector('[data-chk-edit-form="contact"]');

  if (contactSection && contactEditButton) {
    // Check if contact has content by looking for filled display content
    const contactEmail = contactDisplayContent?.querySelector(
      "[data-chk-contact-email]"
    );
    const hasContactContent = contactEmail && contactEmail.textContent.trim();

    if (hasContactContent) {
      // Content exists - show Edit button
      updateEditButtonText("contact", true);
    } else {
      // No content - check if form is expanded (new user scenario)
      if (contactForm && contactForm.classList.contains("show")) {
        // Form is open for new user - hide button
        const contactEditButton = document.getElementById("contactEditButton");
        if (contactEditButton) {
          contactEditButton.style.display = "none";
        }
        startEditing("contact"); // Start editing for new users
      } else {
        // Form closed, no content - show Add button
        updateEditButtonText("contact", false);
      }
    }
  }

  // Check delivery section state
  const deliverySection = document.querySelector(
    '[data-chk-editable-section="delivery"]'
  );
  const deliveryEditButton = document.getElementById("deliveryEditButton");
  const deliveryDisplayContent = document.querySelector(
    '[data-chk-display-content="delivery"]'
  );
  const deliveryForm = document.querySelector(
    '[data-chk-edit-form="delivery"]'
  );

  if (deliverySection && deliveryEditButton) {
    // Check if delivery has content
    const deliveryAddress = deliveryDisplayContent?.querySelector(
      "[data-chk-delivery-address]"
    );
    const hasDeliveryContent =
      deliveryAddress &&
      deliveryAddress.textContent.trim() &&
      !deliveryAddress.textContent.includes("Add your delivery address");

    if (hasDeliveryContent) {
      // Content exists - show Edit button
      updateEditButtonText("delivery", true);
    } else {
      // No content - check if form is expanded (contact-filled scenario)
      if (deliveryForm && deliveryForm.classList.contains("show")) {
        // Form is open - hide button, user needs to complete first
        const deliveryEditButton =
          document.getElementById("deliveryEditButton");
        if (deliveryEditButton) {
          deliveryEditButton.style.display = "none";
        }
        startEditing("delivery"); // Start editing for contact-filled scenario
      } else {
        // Form closed, no content - show Add button
        updateEditButtonText("delivery", false);
      }
    }
  }

  // Check if payment section should be highlighted (scenario 3)
  const paymentSection = document.querySelector(
    '[data-chk-editable-section="payment"]'
  );
  if (paymentSection) {
    // If both contact and delivery have content, highlight payment
    const contactHasContent = contactDisplayContent
      ?.querySelector("[data-chk-contact-email]")
      ?.textContent.trim();
    const deliveryHasContent = deliveryDisplayContent
      ?.querySelector("[data-chk-delivery-address]")
      ?.textContent.trim();

    if (
      contactHasContent &&
      deliveryHasContent &&
      !deliveryHasContent.includes("Add your delivery address")
    ) {
      // Both sections complete - highlight payment (scenario 3)
      setTimeout(() => {
        SectionManager.manageHeaders("payment", "show-blue");
        SectionManager.manageBorderRadius("payment", "remove-top");
      }, 100);
    }
  }
}

function startEditing(sectionType) {
  // Clear any existing editing state
  if (currentEditingSection) {
    completeEditing(currentEditingSection);
  }

  currentEditingSection = sectionType;

  // Use unified header management
  SectionManager.manageHeaders(sectionType, "show-blue");

  // Use unified section state management
  SectionManager.setSectionState(sectionType, true);

  // Use unified border radius management
  SectionManager.manageBorderRadius(sectionType, "remove-top");

  // When editing contact or delivery, restore payment section border radius
  if (sectionType === "contact" || sectionType === "delivery") {
    SectionManager.manageBorderRadius("payment", "restore");
    SectionManager.showSectionForm(sectionType);
  }
}

function completeEditing(sectionType) {
  console.log("completeEditing called with:", sectionType);
  // **REFACTORED: Simplified with utility functions**

  // Use unified header management
  SectionManager.manageHeaders(sectionType, "hide-blue");

  // Use unified section state management
  SectionManager.setSectionState(sectionType, false);

  // Use unified border radius management
  SectionManager.manageBorderRadius(sectionType, "restore");

  // Update display content with form data for contact and delivery sections
  if (sectionType === "contact") {
    updateContactDisplay(sectionType);
  } else if (sectionType === "delivery") {
    console.log("Calling updateDeliveryDisplay...");
    updateDeliveryDisplay(sectionType);
  }

  // Hide edit form using generic function
  if (sectionType === "contact" || sectionType === "delivery") {
    SectionManager.hideSectionForm(sectionType);
  }

  currentEditingSection = null;

  // Smart automatic progression flow - determine next incomplete section
  setTimeout(() => {
    if (!currentEditingSection) {
      // Always show delivery edit button when contact is completed
      if (sectionType === "contact") {
        const deliveryEditButton =
          document.getElementById("deliveryEditButton");
        if (deliveryEditButton) {
          deliveryEditButton.style.display = "block";
        }
      }

      // Check current application state to determine if we should auto-progress
      const currentState = document
        .querySelector("[data-chk-state]")
        ?.getAttribute("data-chk-state");
      const nextIncompleteSection = getNextIncompleteSection();

      // Only auto-progress if:
      // 1. There is a next incomplete section
      // 2. We're not already past that section (i.e., user isn't going backwards to edit)
      const shouldAutoProgress =
        nextIncompleteSection &&
        ((currentState === "contact" && nextIncompleteSection === "delivery") ||
          (currentState === "delivery" &&
            nextIncompleteSection === "payment") ||
          (currentState === "contact" && nextIncompleteSection === "payment"));

      if (shouldAutoProgress) {
        console.log(
          "Auto-progressing to next incomplete section:",
          nextIncompleteSection
        );
        if (nextIncompleteSection === "payment") {
          // Highlight payment section
          SectionManager.manageHeaders("payment", "show-blue");
          SectionManager.manageBorderRadius("payment", "remove-top");
        } else {
          // Start editing the next incomplete section
          startEditing(nextIncompleteSection);
        }
      } else if (nextIncompleteSection === "payment") {
        // If all sections are complete, ensure payment is highlighted
        console.log("All sections complete, highlighting payment");
        SectionManager.manageHeaders("payment", "show-blue");
        SectionManager.manageBorderRadius("payment", "remove-top");
      }
    }
  }, 300);
}

// Function to determine the next incomplete section
function getNextIncompleteSection() {
  // Check contact completion
  const contactDisplay = document.querySelector(
    '[data-chk-display-content="contact"]'
  );
  const contactEmail = contactDisplay
    ?.querySelector("[data-chk-contact-email]")
    ?.textContent?.trim();
  const isContactComplete = contactEmail;

  // Check delivery completion
  const deliveryDisplay = document.querySelector(
    '[data-chk-display-content="delivery"]'
  );
  const deliveryAddress = deliveryDisplay?.querySelector(
    "[data-chk-delivery-address]"
  );
  const isDeliveryComplete =
    deliveryAddress &&
    deliveryAddress.style.display !== "none" &&
    deliveryAddress.textContent?.trim() &&
    !deliveryAddress.textContent.includes("Add your delivery address");

  console.log("Section completion status:", {
    isContactComplete,
    isDeliveryComplete,
  });

  // Return the first incomplete section
  if (!isContactComplete) {
    return "contact";
  } else if (!isDeliveryComplete) {
    return "delivery";
  } else {
    return "payment";
  }
}

// Generic function to update edit button text based on content
function updateEditButtonText(sectionType, hasContent) {
  const editButton = document.getElementById(`${sectionType}EditButton`);
  if (editButton) {
    editButton.textContent = hasContent ? "Edit" : "Add";
    editButton.style.display = "block";
  }
}

function updateContactDisplay(sectionType) {
  if (sectionType !== "contact") return;

  const editForm = document.querySelector(
    `[data-chk-edit-form="${sectionType}"]`
  );
  const displayContent = document.querySelector(
    `[data-chk-display-content="${sectionType}"]`
  );

  if (!editForm || !displayContent) return;

  // Get form values
  const emailInput = editForm.querySelector('input[type="email"]');

  if (!emailInput) return;

  const email = emailInput.value.trim();

  // Update display content
  const emailElement = displayContent.querySelector("[data-chk-contact-email]");

  if (emailElement && email) {
    emailElement.textContent = email;
  }

  // Handle empty state visibility
  const emptyElement = displayContent.querySelector("[data-chk-contact-empty]");
  if (emailElement && emptyElement) {
    if (email) {
      // Has content - show email, hide empty state
      emailElement.style.display = "block";
      emptyElement.style.display = "none";
    } else {
      // No content - hide email, show empty state
      emailElement.style.display = "none";
      emptyElement.style.display = "block";
    }
  }

  // Update button text using generic function
  const hasContactContent = email;
  updateEditButtonText("contact", hasContactContent);
}

function updateDeliveryDisplay(sectionType) {
  console.log("updateDeliveryDisplay called with:", sectionType);
  if (sectionType !== "delivery") return;

  const editForm = document.querySelector(
    `[data-chk-edit-form="${sectionType}"]`
  );
  const displayContent = document.querySelector(
    `[data-chk-display-content="${sectionType}"]`
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
    "[data-chk-delivery-address]"
  );
  const emptyDescription = displayContent.querySelector(
    "[data-chk-delivery-empty]"
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
      newAddressElement.setAttribute("data-chk-delivery-address", "");
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

// Main initialization function that sets up everything
function initializeSectionManager() {
  initializeFromState();
  initializeButtonStates();
}

// Section wrapper functions for HTML event handlers
function handleEditButtonClick(sectionType) {
  startEditing(sectionType);
}

function handleCompleteButtonClick(element) {
  // Get section type from the closest editable section
  const section = element.closest("[data-chk-editable-section]");
  const sectionType = section
    ? section.getAttribute("data-chk-editable-section")
    : null;

  if (sectionType) {
    completeEditing(sectionType);
  }
}

// Payment section handlers
function handlePaymentCardClick(event) {
  // Don't trigger if clicking complete button
  if (event.target.closest('[data-complete-edit="payment"]')) {
    return;
  }

  // Trigger edit mode for payment section
  startEditing("payment");
}

export {
  initializeSectionManager,
  startEditing,
  completeEditing,
  initializeFromState,
  getCurrentEditingSection,
  updateEditButtonText,
  handleEditButtonClick,
  handleCompleteButtonClick,
  handlePaymentCardClick,
};
