// Main checkout script module
import { initializePaymentForms } from "./modules/formUtil.js";
import {
  initializeFromFormData,
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
  initializeFromFormData: initializeFromFormData,
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
  // Initialize sections based on form data
  window.GallsCheckout.initializeFromFormData();

  // Initialize payment forms
  window.GallsCheckout.initializePaymentForms();

  // Add CCA functionality to GallsCheckout from the function property
  window.GallsCheckout.handleCCAForm = window.GallsCheckout.handleCCAForm;
});
