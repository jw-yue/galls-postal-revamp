// Main checkout script module
import { initializePaymentForms } from "./modules/formUtil.js";
import {
  initializeSectionManager,
  startEditing,
  completeEditing,
} from "./modules/sectionManager.js";
import { initializeCCAForm } from "./modules/ccaForm.js";
import {
  handleSupervisorEmailInput,
  handleSupervisorPhoneInput,
  handleSubmitButtonClick,
} from "./validations/ccaValidation.js";

window.GallsCheckout = {
  // Initialization Functions
  initializeSectionManager: initializeSectionManager,
  initializePaymentForms: initializePaymentForms,
  handleCCAForm: initializeCCAForm,

  // Validation Functions
  ccaValidation: {
    handleSupervisorEmailInput: handleSupervisorEmailInput,
    handleSupervisorPhoneInput: handleSupervisorPhoneInput,
    handleSubmitButtonClick: handleSubmitButtonClick,
  },

  // Section Management Functions
  handleEditButtonClick: function (sectionType) {
    startEditing(sectionType);
  },

  handleCompleteButtonClick: function (element) {
    // Get section type from the closest editable section
    const section = element.closest("[data-chk-editable-section]");
    const sectionType = section
      ? section.getAttribute("data-chk-editable-section")
      : null;

    if (sectionType) {
      completeEditing(sectionType);
    }
  },

  // Payment section handlers
  handlePaymentCardClick: function (event) {
    // Don't trigger if clicking complete button
    if (event.target.closest('[data-complete-edit="payment"]')) {
      return;
    }

    // Trigger edit mode for payment section
    startEditing("payment");
  },
};

document.addEventListener("DOMContentLoaded", function () {
  // Initialize section manager (includes state, buttons, and event handlers)
  window.GallsCheckout.initializeSectionManager();

  // Initialize payment forms
  window.GallsCheckout.initializePaymentForms();

  // Add CCA functionality to GallsCheckout from the function property
  window.GallsCheckout.handleCCAForm = window.GallsCheckout.handleCCAForm;
});
