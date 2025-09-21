// Main checkout script module
import { initializePaymentForms } from "./modules/formUtil.js";
import {
  initializeSectionManager,
  handleEditButtonClick,
  handleCompleteButtonClick,
  handlePaymentCardClick,
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
  handleEditButtonClick: handleEditButtonClick,
  handleCompleteButtonClick: handleCompleteButtonClick,
  handlePaymentCardClick: handlePaymentCardClick,
};

document.addEventListener("DOMContentLoaded", function () {
  // Initialize section manager (includes state, buttons, and event handlers)
  window.GallsCheckout.initializeSectionManager();

  // Initialize payment forms
  window.GallsCheckout.initializePaymentForms();

  // Add CCA functionality to GallsCheckout from the function property
  window.GallsCheckout.handleCCAForm = window.GallsCheckout.handleCCAForm;
});
