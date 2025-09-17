/**
 * Main Application Module
 * Coordinates all checkout functionality and initializes the application
 */

import {
  SectionManager,
  updateEditButtonText,
} from "./modules/sectionManager.js";
import {
  saveCheckoutForm,
  errMsg,
  showErrors2,
  submitOrder,
  geoFmt,
  clickOnEnter,
} from "./modules/validation.js";
import {
  populateContactData,
  updateContactDisplay,
} from "./modules/contactComponent.js";
import {
  populateDeliveryData,
  updateDeliveryDisplay,
  updateDeliveryDisplayFromData,
} from "./modules/deliveryComponent.js";
import {
  initializeFromState,
  changeStateWithMockData,
  changeState,
} from "./test-states/testStates.js";

// Global state
let currentEditingSection = null;

// Make necessary functions available globally
window.SectionManager = SectionManager;
window.updateEditButtonText = updateEditButtonText;
window.saveCheckoutForm = saveCheckoutForm;
window.errMsg = errMsg;
window.showErrors2 = showErrors2;
window.submitOrder = submitOrder;
window.geoFmt = geoFmt;
window.clickOnEnter = clickOnEnter;
window.populateContactData = populateContactData;
window.updateContactDisplay = updateContactDisplay;
window.populateDeliveryData = populateDeliveryData;
window.updateDeliveryDisplay = updateDeliveryDisplay;
window.updateDeliveryDisplayFromData = updateDeliveryDisplayFromData;
window.currentEditingSection = currentEditingSection;
window.startEditing = startEditing;
window.completeEditing = completeEditing;

/**
 * Initialize the application
 */
function initializeApp() {
  console.log("Initializing Galls Postal Checkout Application");

  // Initialize from state attribute
  initializeFromState();

  // Initialize button states based on content
  initializeButtonStates();

  // Show any existing validation errors
  showErrors2();

  // Setup event listeners
  setupEventListeners();

  console.log("Application initialized successfully");
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Generic Complete button functionality for all sections
  document.querySelectorAll("[data-complete-edit]").forEach((button) => {
    button.addEventListener("click", function () {
      // Get section type from the closest editable section
      const section = this.closest("[data-editable-section]");
      const sectionType = section
        ? section.getAttribute("data-editable-section")
        : null;

      console.log("Generic complete button clicked for section:", sectionType);

      if (sectionType) {
        completeEditing(sectionType);
      }
    });
  });

  // Generic Edit button click handlers
  document.querySelectorAll("[data-edit-button]").forEach((button) => {
    button.addEventListener("click", function () {
      const sectionType = this.getAttribute("data-edit-button");
      console.log("Generic edit button clicked for section:", sectionType);
      startEditing(sectionType);
    });
  });

  // Payment section click handler
  const paymentSection = document.querySelector(
    '[data-editable-section="payment"]'
  );
  if (paymentSection) {
    paymentSection.addEventListener("click", function (e) {
      if (currentEditingSection === "payment") return;
      if (e.target.closest('[data-edit-button="payment"]')) return;
      if (e.target.closest('[data-complete-edit="payment"]')) return;
      startEditing("payment");
    });
  }

  // Setup payment components
  setupPaymentComponents();

  // Setup order buttons
  setupOrderButtons();
}

/**
 * Start editing a section
 */
function startEditing(sectionType) {
  // Handle new-contact as contact for consistency
  if (sectionType === "new-contact") {
    sectionType = "contact";
  }

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

  // Show edit form for contact and delivery sections using generic function
  if (sectionType === "contact" || sectionType === "delivery") {
    SectionManager.showSectionForm(sectionType);
  }
}

/**
 * Complete editing a section
 */
function completeEditing(sectionType) {
  console.log("completeEditing called with:", sectionType);

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

  // Smart automatic progression flow
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
        .querySelector(".p-chk-main__content")
        ?.getAttribute("data-chk-state");
      const nextIncompleteSection = getNextIncompleteSection();

      // Only auto-progress if appropriate
      const shouldAutoProgress =
        nextIncompleteSection &&
        ((currentState === "contact" && nextIncompleteSection === "delivery") ||
          (currentState === "delivery" && nextIncompleteSection === "payment"));

      if (shouldAutoProgress) {
        console.log("Auto-progressing to next section:", nextIncompleteSection);
        if (nextIncompleteSection === "payment") {
          SectionManager.manageHeaders("payment", "show-blue");
          SectionManager.manageBorderRadius("payment", "remove-top");
        } else {
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

/**
 * Initialize button states and forms based on content
 */
function initializeButtonStates() {
  // Check contact section state
  const contactSection = document.querySelector(
    '[data-editable-section="contact"]'
  );
  const contactEditButton = document.getElementById("contactEditButton");
  const contactDisplayContent = document.querySelector(
    '[data-display-content="contact"]'
  );
  const contactForm = document.querySelector('[data-edit-form="contact"]');

  if (contactSection && contactEditButton) {
    // Check if contact has content by looking for filled display content
    const contactEmail = contactDisplayContent?.querySelector(
      ".p-chk-contact-card__email"
    );
    const contactJob = contactDisplayContent?.querySelector(
      ".p-chk-contact-card__job-title"
    );
    const hasContactContent =
      (contactEmail && contactEmail.textContent.trim()) ||
      (contactJob && contactJob.textContent.trim());

    if (hasContactContent) {
      // Content exists - show Edit button
      updateEditButtonText("contact", true);
    } else {
      // No content - check if form is expanded (new user scenario)
      if (contactForm && contactForm.classList.contains("expanded")) {
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

  // Check delivery section state - similar logic
  const deliverySection = document.querySelector(
    '[data-editable-section="delivery"]'
  );
  const deliveryEditButton = document.getElementById("deliveryEditButton");
  const deliveryDisplayContent = document.querySelector(
    '[data-display-content="delivery"]'
  );
  const deliveryForm = document.querySelector('[data-edit-form="delivery"]');

  if (deliverySection && deliveryEditButton) {
    // Check if delivery has content
    const deliveryAddress = deliveryDisplayContent?.querySelector(
      ".p-chk-address-card__address"
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
      if (deliveryForm && deliveryForm.classList.contains("expanded")) {
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
    '[data-editable-section="payment"]'
  );
  if (paymentSection) {
    // If both contact and delivery have content, highlight payment
    const contactHasContent = contactDisplayContent
      ?.querySelector(".p-chk-contact-card__email")
      ?.textContent.trim();
    const deliveryHasContent = deliveryDisplayContent
      ?.querySelector(".p-chk-address-card__address")
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

/**
 * Determine the next incomplete section
 */
function getNextIncompleteSection() {
  // Check contact completion
  const contactDisplay = document.querySelector(
    '[data-display-content="contact"]'
  );
  const contactEmail = contactDisplay
    ?.querySelector(".p-chk-contact-card__email")
    ?.textContent?.trim();
  const contactCraft = contactDisplay
    ?.querySelector(".p-chk-contact-card__job-title")
    ?.textContent?.trim();
  const isContactComplete = contactEmail && contactCraft;

  // Check delivery completion
  const deliveryDisplay = document.querySelector(
    '[data-display-content="delivery"]'
  );
  const deliveryAddress = deliveryDisplay?.querySelector(
    ".p-chk-address-card__address"
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

/**
 * Setup payment components (CCA voucher, postal card, personal card)
 */
function setupPaymentComponents() {
  // This would include all the payment component setup
  // For now, just a placeholder - the existing payment code would go here
  console.log("Setting up payment components");
}

/**
 * Setup order completion buttons
 */
function setupOrderButtons() {
  // Complete order button
  const completeOrderBtn = document.querySelector(
    ".p-chk-global__button--primary"
  );

  // Place Order button from Order Summary
  const placeOrderBtn = document.querySelector(
    ".p-chk-order-summary__place-order-button"
  );

  if (completeOrderBtn) {
    completeOrderBtn.addEventListener("click", function () {
      // Basic validation - check if at least one form has data
      const postalCardNumber = document.getElementById(
        "postal-card-number-payment"
      )?.value;
      const personalCardNumber = document.getElementById(
        "personal-card-number-payment"
      )?.value;

      if (postalCardNumber || personalCardNumber) {
        alert("Order completed successfully!");
      } else {
        alert("Please enter payment information to complete your order.");
      }
    });
  }

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Use integrated Galls-style validation
      if (!submitOrder()) {
        return;
      }

      // Check payment information
      const postalCardNumber = document.getElementById(
        "postal-card-number-payment"
      )?.value;
      const personalCardNumber = document.getElementById(
        "personal-card-number-payment"
      )?.value;

      if (postalCardNumber || personalCardNumber) {
        alert("Processing your order...");
        setTimeout(() => {
          alert(
            "Order placed successfully! You will receive a confirmation email shortly."
          );
        }, 2000);
      } else {
        alert("Please enter payment information to complete your order.");
      }
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);

// Export functions that need to be globally accessible
export { startEditing, completeEditing, initializeButtonStates };
