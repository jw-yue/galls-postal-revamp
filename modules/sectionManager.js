// Section Manager Module - Handles all section editing state management and UI updates

// Global state
let currentEditingSection = null;

// Getter for current editing section (for test utilities)
function getCurrentEditingSection() {
  return currentEditingSection;
}

// Data-driven initialization function
function initializeFromFormData() {
  console.log("Initializing from form data...");

  // Collect form data from all sections
  const formData = {
    contact: getContactData(),
    delivery: getDeliveryData(),
    payment: getPaymentData(),
  };

  console.log("Form data:", formData);

  // Determine which section needs editing based on completeness
  const sectionToEdit = determineEditingSection(formData);
  console.log("Section to edit:", sectionToEdit);

  // Set up UI based on form data completeness
  setupSectionsFromData(formData, sectionToEdit);
}

// Extract contact form data
function getContactData() {
  const emailInput = document.querySelector(
    '#contactEditForm input[type="email"]'
  );
  return {
    email: emailInput?.value?.trim() || "",
    isComplete: function () {
      return this.email.length > 0;
    },
  };
}

// Extract delivery form data
function getDeliveryData() {
  const nameInput = document.querySelector(
    '#deliveryEditForm input[placeholder*="full name"], #deliveryEditForm input[placeholder*="Full Name"]'
  );
  const addressInput = document.querySelector(
    '#deliveryEditForm input[placeholder*="street"], #deliveryEditForm input[placeholder*="Street"]'
  );
  const cityInput = document.querySelector(
    '#deliveryEditForm input[placeholder*="city"], #deliveryEditForm input[placeholder*="City"]'
  );
  const stateSelect = document.querySelector("#deliveryEditForm select");
  const zipInput = document.querySelector(
    '#deliveryEditForm input[placeholder*="ZIP"], #deliveryEditForm input[placeholder*="zip"]'
  );

  return {
    name: nameInput?.value?.trim() || "",
    address: addressInput?.value?.trim() || "",
    city: cityInput?.value?.trim() || "",
    state: stateSelect?.value || "",
    zip: zipInput?.value?.trim() || "",
    isComplete: function () {
      return (
        this.name.length > 0 &&
        this.address.length > 0 &&
        this.city.length > 0 &&
        this.state.length > 0 &&
        this.zip.length > 0
      );
    },
  };
}

// Extract payment form data (comprehensive check)
function getPaymentData() {
  // Check postal card form completeness
  const postalCardNumber =
    document.querySelector("#chkPostalCardNumber")?.value?.trim() || "";
  const postalExpiry =
    document.querySelector("#chkPostalCardExpiry")?.value?.trim() || "";
  const postalCvv =
    document.querySelector("#chkPostalCardCVV")?.value?.trim() || "";
  const postalNameOnCard =
    document.querySelector("#chkPostalCardName")?.value?.trim() || "";

  // Check personal debit/credit card form completeness
  const personalCardNumber =
    document.querySelector("#chkPersonalCardNumber")?.value?.trim() || "";
  const personalExpiry =
    document.querySelector("#chkPersonalCardExpiry")?.value?.trim() || "";
  const personalCvv =
    document.querySelector("#chkPersonalCardCVV")?.value?.trim() || "";
  const personalNameOnCard =
    document.querySelector("#chkPersonalCardName")?.value?.trim() || "";

  // Determine if each payment method is completely filled
  const isPostalCardComplete =
    postalCardNumber.length > 0 &&
    postalExpiry.length > 0 &&
    postalCvv.length > 0 &&
    postalNameOnCard.length > 0;

  const isPersonalCardComplete =
    personalCardNumber.length > 0 &&
    personalExpiry.length > 0 &&
    personalCvv.length > 0 &&
    personalNameOnCard.length > 0;

  return {
    hasPostalCard: postalCardNumber.length > 0, // Any postal card data
    hasPersonalCard: personalCardNumber.length > 0, // Any personal card data
    isPostalCardComplete: isPostalCardComplete, // All postal card fields filled
    isPersonalCardComplete: isPersonalCardComplete, // All personal card fields filled
    isComplete: function () {
      return isPostalCardComplete || isPersonalCardComplete; // At least one payment method completely filled
    },
  };
}

// Manage payment form display based on editing state and data
function managePaymentForms(isEditingPayment, paymentData) {
  const postalForm = document.querySelector("#chkPostalFormSection");
  const personalForm = document.querySelector("#chkPersonalFormSection");
  const postalTitle = document.querySelector("[data-chk-postal-title]");
  const postalComplete = document.querySelector("[data-chk-postal-complete]");
  const personalTitle = document.querySelector("[data-chk-personal-title]");
  const personalComplete = document.querySelector(
    "[data-chk-personal-complete]"
  );

  if (isEditingPayment) {
    // When editing payment section, show postal form if incomplete, or show complete message if fully filled
    if (paymentData.isPostalCardComplete) {
      // Card is completely filled - show complete message, hide form
      if (postalForm) postalForm.classList.remove("show");
      if (postalTitle) postalTitle.style.display = "none";
      if (postalComplete) postalComplete.classList.remove("d-none");
    } else {
      // Card is incomplete - show form for editing
      if (postalForm) postalForm.classList.add("show");
      if (postalTitle) postalTitle.style.display = "block";
      if (postalComplete) postalComplete.classList.add("d-none");
    }

    // Similar logic for personal card
    if (paymentData.isPersonalCardComplete) {
      // Personal card is completely filled - show complete message, hide form
      if (personalForm) personalForm.classList.remove("show");
      if (personalTitle) personalTitle.style.display = "none";
      if (personalComplete) personalComplete.classList.remove("d-none");
    } else {
      // Personal card is incomplete - show form for editing
      if (personalForm) personalForm.classList.add("show");
      if (personalTitle) personalTitle.style.display = "block";
      if (personalComplete) personalComplete.classList.add("d-none");
    }
  } else {
    // When not editing payment section, close all payment forms
    if (postalForm) postalForm.classList.remove("show");
    if (personalForm) personalForm.classList.remove("show");

    // Show appropriate title/complete state based on full completion
    if (paymentData.isPostalCardComplete) {
      if (postalTitle) postalTitle.style.display = "none";
      if (postalComplete) postalComplete.classList.remove("d-none");
    } else {
      if (postalTitle) postalTitle.style.display = "block";
      if (postalComplete) postalComplete.classList.add("d-none");
    }

    if (paymentData.isPersonalCardComplete) {
      if (personalTitle) personalTitle.style.display = "none";
      if (personalComplete) personalComplete.classList.remove("d-none");
    } else {
      if (personalTitle) personalTitle.style.display = "block";
      if (personalComplete) personalComplete.classList.add("d-none");
    }
  }
}

// Determine which section should be in edit mode
function determineEditingSection(formData) {
  // Check sections in order: contact -> delivery -> payment
  if (!formData.contact.isComplete()) {
    return "contact";
  } else if (!formData.delivery.isComplete()) {
    return "delivery";
  } else if (!formData.payment.isComplete()) {
    return "payment";
  } else {
    return null; // All sections complete
  }
}

// Set up sections based on form data
function setupSectionsFromData(formData, sectionToEdit) {
  console.log("Setting up sections from data:", sectionToEdit);

  // First, ensure all sections are in their closed/summary state
  closeAllSections();

  // Get payment data for form management
  const paymentData = getPaymentData();

  // Update contact section
  if (formData.contact.isComplete()) {
    showContactSummary(formData.contact);
    SectionManager.manageHeaders("contact", "show-normal");
  } else {
    showContactEmpty();
    SectionManager.manageHeaders("contact", "hide-blue");
  }

  // Update delivery section
  if (formData.delivery.isComplete()) {
    showDeliverySummary(formData.delivery);
    updateEditButtonText("delivery", true); // Show "Edit"
    SectionManager.manageHeaders("delivery", "show-normal");
  } else {
    showDeliveryEmpty();
    updateEditButtonText("delivery", false); // Show "Add"
    SectionManager.manageHeaders("delivery", "hide-blue");
  }

  // Manage payment forms based on editing state
  const isEditingPayment = sectionToEdit === "payment";
  managePaymentForms(isEditingPayment, formData.payment);

  // Reset payment section header (will be set based on editing state)
  SectionManager.manageHeaders("payment", "hide-blue");
  SectionManager.manageBorderRadius("contact", "restore");
  SectionManager.manageBorderRadius("delivery", "restore");
  SectionManager.manageBorderRadius("payment", "restore");

  // Start editing the appropriate section
  if (sectionToEdit) {
    setTimeout(() => {
      startEditing(sectionToEdit);
    }, 100);
  }
}

// Close all section forms and show summaries
function closeAllSections() {
  // Close contact form, show summary
  const contactForm = document.querySelector("#contactEditForm");
  const contactDisplay = document.querySelector(
    '[data-chk-display-content="contact"]'
  );
  if (contactForm && contactDisplay) {
    contactForm.classList.remove("show");
    contactDisplay.classList.remove("hidden");
  }

  // Close delivery form, show summary
  const deliveryForm = document.querySelector("#deliveryEditForm");
  const deliveryDisplay = document.querySelector(
    '[data-chk-display-content="delivery"]'
  );
  if (deliveryForm && deliveryDisplay) {
    deliveryForm.classList.remove("show");
    deliveryDisplay.classList.remove("hidden");
  }

  // Close payment forms
  const postalForm = document.querySelector("#chkPostalFormSection");
  const personalForm = document.querySelector("#chkPersonalFormSection");
  if (postalForm) postalForm.classList.remove("show");
  if (personalForm) personalForm.classList.remove("show");

  // Reset current editing section
  currentEditingSection = null;
}

// Show contact summary with data
function showContactSummary(contactData) {
  const displayContent = document.querySelector(
    '[data-chk-display-content="contact"]'
  );
  const emailElement = displayContent?.querySelector(
    "[data-chk-contact-email]"
  );
  const emptyElement = displayContent?.querySelector(
    "[data-chk-contact-empty]"
  );

  if (emailElement && emptyElement) {
    emailElement.textContent = contactData.email;
    emailElement.style.display = "block";
    emptyElement.style.display = "none";
  }
}

// Show contact empty state
function showContactEmpty() {
  const displayContent = document.querySelector(
    '[data-chk-display-content="contact"]'
  );
  const emailElement = displayContent?.querySelector(
    "[data-chk-contact-email]"
  );
  const emptyElement = displayContent?.querySelector(
    "[data-chk-contact-empty]"
  );

  if (emailElement && emptyElement) {
    emailElement.style.display = "none";
    emptyElement.style.display = "block";
  }
}

// Show delivery summary with data
function showDeliverySummary(deliveryData) {
  const displayContent = document.querySelector(
    '[data-chk-display-content="delivery"]'
  );
  const addressElement = displayContent?.querySelector(
    "[data-chk-delivery-address]"
  );
  const emptyElement = displayContent?.querySelector(
    "[data-chk-delivery-empty]"
  );

  if (addressElement && emptyElement) {
    // Format address display
    addressElement.innerHTML = `
      ${deliveryData.name}<br/>
      ${deliveryData.address}<br/>
      ${deliveryData.city}, ${deliveryData.state} ${deliveryData.zip}<br/>
      United States
    `;
    addressElement.style.display = "block";
    emptyElement.style.display = "none";
  }
}

// Show delivery empty state
function showDeliveryEmpty() {
  const displayContent = document.querySelector(
    '[data-chk-display-content="delivery"]'
  );
  const addressElement = displayContent?.querySelector(
    "[data-chk-delivery-address]"
  );
  const emptyElement = displayContent?.querySelector(
    "[data-chk-delivery-empty]"
  );

  if (addressElement && emptyElement) {
    addressElement.style.display = "none";
    emptyElement.style.display = "block";
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
    } else if (action === "show-normal") {
      // Show header without blue styling (for completed sections)
      if (sectionHeader) {
        sectionHeader.classList.remove("active");
        sectionHeader.style.display = "block";
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
      // Check current application state to determine if we should auto-progress
      const formData = {
        contact: getContactData(),
        delivery: getDeliveryData(),
        payment: getPaymentData(),
      };
      const nextIncompleteSection = determineEditingSection(formData);

      // Only auto-progress if:
      // 1. There is a next incomplete section
      // 2. We're not already past that section (i.e., user isn't going backwards to edit)
      const shouldAutoProgress =
        nextIncompleteSection &&
        ((sectionType === "contact" && nextIncompleteSection === "delivery") ||
          (sectionType === "delivery" && nextIncompleteSection === "payment") ||
          (sectionType === "contact" && nextIncompleteSection === "payment"));

      if (shouldAutoProgress) {
        console.log(
          "Auto-progressing to next incomplete section:",
          nextIncompleteSection
        );
        // Start editing the next incomplete section
        startEditing(nextIncompleteSection);
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
  initializeFromFormData,
  startEditing,
  completeEditing,
  getCurrentEditingSection,
  updateEditButtonText,
  handleEditButtonClick,
  handleCompleteButtonClick,
  handlePaymentCardClick,
  closeAllSections,
};
