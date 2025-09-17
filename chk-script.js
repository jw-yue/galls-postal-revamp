document.addEventListener("DOMContentLoaded", function () {
  // Initialize from state attribute
  initializeFromState();

  // Initialize button states based on content
  initializeButtonStates();

  // Show any existing validation errors
  showErrors2();

  // Generic Complete button functionality for all sections
  document.querySelectorAll("[data-complete-edit]").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Get section type from the closest editable section
      const section = this.closest("[data-editable-section]");
      const sectionType = section
        ? section.getAttribute("data-editable-section")
        : null;

      console.log("Generic complete button clicked for section:", sectionType);

      if (sectionType) {
        // Set the section as currently being edited
        currentEditingSection = sectionType;

        // Complete the editing
        completeEditing(sectionType);
      }
    });
  });

  // CCA Voucher functionality with enhanced features
  const ccaMainCheckbox = document.querySelector(
    '[data-chk-element="cca-checkbox"]'
  );
  const ccaCard = document.querySelector('[data-chk-element="cca-card"]');
  const disclaimerCheckbox = document.querySelector(
    '[data-chk-element="disclaimer-checkbox"]'
  );
  const fileUploadLink = document.querySelector(
    '[data-chk-element="file-upload-link"]'
  );
  const fileNameInput = document.querySelector(
    '[data-chk-element="file-name-input"]'
  );
  const uploadButton = document.querySelector(
    '[data-chk-element="upload-button"]'
  );
  const submitButton = document.querySelector(
    '[data-chk-element="submit-button"]'
  );

  // Main CCA checkbox toggle functionality
  function toggleCCAMain() {
    const isChecked = ccaMainCheckbox.getAttribute("aria-checked") === "true";
    const newState = !isChecked;

    ccaMainCheckbox.setAttribute("aria-checked", newState);

    // Get postal card container
    const postalCardContainer = document
      .querySelector("#postalCardToggle")
      ?.closest(".p-chk-card__container");

    if (newState) {
      ccaCard.classList.add("expanded");
      // Hide postal card form when CCA is checked
      if (postalCardContainer) {
        postalCardContainer.style.display = "none";
      }
    } else {
      ccaCard.classList.remove("expanded");
      // Show postal card form when CCA is unchecked
      if (postalCardContainer) {
        postalCardContainer.style.display = "flex";
      }
      // Reset form when collapsed
      resetCCAForm();
    }
  }

  function resetCCAForm() {
    // Reset disclaimer checkbox
    if (disclaimerCheckbox) {
      disclaimerCheckbox.setAttribute("aria-checked", "false");
      disclaimerCheckbox.classList.remove("checked");
    }

    // Reset file input
    if (fileNameInput) {
      fileNameInput.value = "Voucher_Upload.pdf";
    }

    // Reset submit button
    if (submitButton) {
      submitButton.disabled = true;
    }
  }

  // Disclaimer checkbox functionality
  function toggleDisclaimerCheckbox() {
    const isChecked =
      disclaimerCheckbox.getAttribute("aria-checked") === "true";
    const newState = !isChecked;

    disclaimerCheckbox.setAttribute("aria-checked", newState);

    if (newState) {
      disclaimerCheckbox.classList.add("checked");
    } else {
      disclaimerCheckbox.classList.remove("checked");
    }

    // Update submit button state
    updateSubmitButtonState();
  }

  // File upload functionality
  function handleFileUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg,.jpg,.png,.bmp,.doc,.docx,.pdf,.txt";
    input.onchange = function (event) {
      const file = event.target.files[0];
      if (file) {
        fileNameInput.value = file.name;
        updateSubmitButtonState();
      }
    };
    input.click();
  }

  // Upload button functionality
  function handleVoucherUpload() {
    if (
      fileNameInput &&
      fileNameInput.value.trim() &&
      fileNameInput.value !== "Voucher_Upload.pdf"
    ) {
      alert("Voucher uploaded successfully!");
      updateSubmitButtonState();
    } else {
      alert("Please select a file first.");
    }
  }

  // Update submit button state based on form completion
  function updateSubmitButtonState() {
    if (!submitButton) return;

    const hasFile =
      fileNameInput &&
      fileNameInput.value.trim() &&
      fileNameInput.value !== "Voucher_Upload.pdf";
    const disclaimerChecked =
      disclaimerCheckbox &&
      disclaimerCheckbox.getAttribute("aria-checked") === "true";
    const supervisorEmail = document
      .getElementById("cca-supervisor-email")
      ?.value.trim();
    const supervisorPhone = document
      .getElementById("cca-supervisor-phone")
      ?.value.trim();

    // Enable submit if either file is uploaded OR disclaimer is checked, AND supervisor info is provided
    const canSubmit =
      (hasFile || disclaimerChecked) && supervisorEmail && supervisorPhone;

    // The CSS handles the visual state automatically based on disabled attribute
    submitButton.disabled = !canSubmit;
  }

  // Event listeners
  if (ccaMainCheckbox) {
    ccaMainCheckbox.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleCCAMain();
    });
    ccaMainCheckbox.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        toggleCCAMain();
      }
    });
  }

  if (disclaimerCheckbox) {
    disclaimerCheckbox.addEventListener("click", toggleDisclaimerCheckbox);
    disclaimerCheckbox.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleDisclaimerCheckbox();
      }
    });
  }

  if (fileUploadLink) {
    fileUploadLink.addEventListener("click", function (e) {
      e.preventDefault();
      handleFileUpload();
    });
  }

  if (uploadButton) {
    uploadButton.addEventListener("click", function (e) {
      e.preventDefault();
      handleVoucherUpload();
    });
  }

  if (submitButton) {
    submitButton.addEventListener("click", function (e) {
      e.preventDefault();
      if (!this.disabled) {
        alert("CCA Voucher submitted successfully!");

        // Close the CCA form after successful submission
        const ccaCard = document.querySelector('[data-chk-element="cca-card"]');
        if (ccaCard) {
          ccaCard.style.display = "none";
        }

        // Reset the CCA checkbox to unchecked state
        if (ccaMainCheckbox) {
          ccaMainCheckbox.setAttribute("aria-checked", "false");
        }

        // Check if all payment methods are completed
        checkPaymentCompletion();
      }
    });
  }

  // Add event listeners for supervisor fields to update submit button state
  const supervisorEmail = document.getElementById("cca-supervisor-email");
  const supervisorPhone = document.getElementById("cca-supervisor-phone");

  if (supervisorEmail) {
    supervisorEmail.addEventListener("input", updateSubmitButtonState);
  }

  if (supervisorPhone) {
    supervisorPhone.addEventListener("input", updateSubmitButtonState);
  }

  // Label click handlers
  const ccaLabel = document.querySelector(".p-chk-cca__label");
  const disclaimerLabel = document.querySelector(
    ".p-chk-cca__disclaimer-label"
  );

  if (ccaLabel) {
    ccaLabel.addEventListener("click", function (e) {
      e.preventDefault();
      toggleCCAMain();
    });
  }

  if (disclaimerLabel) {
    disclaimerLabel.addEventListener("click", function (e) {
      e.preventDefault();
      toggleDisclaimerCheckbox();
    });
  }

  // Initialize form state
  if (ccaMainCheckbox) {
    ccaMainCheckbox.setAttribute("aria-checked", "false");
  }
  if (ccaCard) {
    ccaCard.classList.remove("expanded");
  }
  resetCCAForm();

  // Payment form interaction handlers - show blue header when user interacts with forms
  // Consolidated payment form interaction handlers
  const paymentFormSelectors = [
    ".p-chk-cca__card input, .p-chk-cca__card select, .p-chk-cca__card textarea",
    ".p-chk-pcard__container input, .p-chk-pcard__container select, .p-chk-pcard__dropdown",
    ".p-chk-user-card__container input, .p-chk-user-card__container select, .p-chk-user-card__dropdown",
  ];

  paymentFormSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      ["focus", "click"].forEach((event) => {
        element.addEventListener(event, () => startEditing("payment"));
      });
    });
  });

  // Also trigger on toggle/checkbox clicks for postal and credit cards
  const postalToggle = document.querySelector(".p-chk-pcard__summary-toggle");
  if (postalToggle) {
    postalToggle.addEventListener("change", function () {
      if (this.checked) {
        startEditing("payment");
      }
    });
  }

  const creditCardToggle = document.querySelector(
    ".p-chk-user-card__summary-toggle"
  );
  if (creditCardToggle) {
    creditCardToggle.addEventListener("change", function () {
      if (this.checked) {
        startEditing("payment");
      }
    });
  }

  // Postal Card Component functionality with enhanced features
  const postalToggleButton = document.getElementById("postalToggleButton");
  const postalFormSection = document.getElementById("postalFormSection");
  const postalChargeInput = document.getElementById("postalChargeInput");
  const postalSaveCheckbox = document.getElementById("postalSaveCheckbox");
  const postalContinueButton = document.querySelector(
    '[data-chk-element="postal-continue-button"]'
  );
  let isPostalExpanded = false;

  // Main postal toggle functionality
  function togglePostalForm() {
    isPostalExpanded = !isPostalExpanded;

    if (isPostalExpanded) {
      postalToggleButton.classList.add("expanded");
      postalFormSection.classList.add("expanded");
    } else {
      postalToggleButton.classList.remove("expanded");
      postalFormSection.classList.remove("expanded");
    }
  }

  // Event listeners for postal toggle
  if (postalToggleButton) {
    postalToggleButton.addEventListener("click", togglePostalForm);
  }

  // Postal card checkbox functionality
  let isPostalCheckboxChecked = false;

  if (postalSaveCheckbox) {
    postalSaveCheckbox.addEventListener("click", function () {
      isPostalCheckboxChecked = !isPostalCheckboxChecked;
      this.setAttribute("aria-checked", isPostalCheckboxChecked);
    });

    // Label click handler
    const postalCheckboxLabel = document.querySelector(
      ".p-chk-pcard__checkbox-label"
    );
    if (postalCheckboxLabel) {
      postalCheckboxLabel.addEventListener("click", function (e) {
        e.preventDefault();
        postalSaveCheckbox.click();
      });
    }
  }

  // Continue button functionality
  if (postalContinueButton) {
    postalContinueButton.addEventListener("click", function () {
      alert("Postal card information saved successfully!");

      // Close the postal card form after successful submission
      const postalCardContainer = this.closest(".p-chk-pcard__container");
      if (postalCardContainer) {
        // Collapse the postal card form
        postalCardContainer.classList.remove("expanded");

        // Hide the form content but keep the summary visible
        const formSection = postalCardContainer.querySelector(
          '[data-chk-element="postal-form-section"]'
        );
        if (formSection) {
          formSection.style.display = "none";
        }

        // Show a completed state message or summary
        const summarySection = postalCardContainer.querySelector(
          ".p-chk-pcard__summary-section"
        );
        if (summarySection) {
          summarySection.style.display = "block";
        }
      }

      // Check if all payment methods are completed
      checkPaymentCompletion();
    });
  }

  // Postal Card dropdown functionality
  document
    .querySelectorAll(".p-chk-pcard__dropdown-option")
    .forEach((option) => {
      option.addEventListener("click", function () {
        const dropdown = this.closest(".p-chk-pcard__dropdown");
        const label = dropdown.querySelector(".p-chk-pcard__dropdown-text");
        const toggle = dropdown.querySelector(".p-chk-pcard__dropdown-toggle");

        label.textContent = this.textContent;
        label.classList.add("selected");
        toggle.checked = false; // Close dropdown
      });
    });

  // Close postal dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".p-chk-pcard__dropdown")) {
      document
        .querySelectorAll(".p-chk-pcard__dropdown-toggle")
        .forEach((toggle) => {
          toggle.checked = false;
        });
    }
  });

  // Personal Card Component functionality with enhanced features
  const personalCardToggle = document.getElementById("personalCardToggle");
  const personalCardNumber = document.getElementById(
    "personal-card-number-payment"
  );
  const personalCvv = document.getElementById("personal-cvv-payment");
  const personalSaveCardToggle = document.getElementById(
    "personalSaveCardToggle"
  );
  const personalContinueButton = document.querySelector(
    '[data-chk-element="personal-continue-button"]'
  );

  if (personalCardToggle) {
    personalCardToggle.addEventListener("change", function () {
      // Additional fallback to ensure content expands
      const collapsibleContent = document.querySelector(
        ".p-chk-user-card__collapsible-content"
      );
      if (collapsibleContent) {
        if (this.checked) {
          collapsibleContent.style.maxHeight = "1000px";
        } else {
          collapsibleContent.style.maxHeight = "0";
        }
      }
    });
  }

  // Save card checkbox functionality
  if (personalSaveCardToggle) {
    personalSaveCardToggle.addEventListener("change", function () {});
  }

  // Personal card form validation function
  function validatePersonalCardForm(
    cardNumber,
    expiryMonth,
    expiryYear,
    cvv,
    cardholderName,
    container
  ) {
    // Check if card number is filled and valid length (13-19 digits)
    if (
      !cardNumber ||
      !cardNumber.value.trim() ||
      cardNumber.value.replace(/\s/g, "").length < 13
    ) {
      cardNumber?.focus();
      return false;
    }

    // Check if expiry month is selected (look for dropdown label change)
    const monthLabel = container.querySelector(
      '[data-chk-element="personal-month-dropdown"] .p-chk-user-card__dropdown-text'
    );
    if (!monthLabel || monthLabel.textContent.trim() === "Month") {
      return false;
    }

    // Check if expiry year is selected (look for dropdown label change)
    const yearLabel = container.querySelector(
      '[data-chk-element="personal-year-dropdown"] .p-chk-user-card__dropdown-text'
    );
    if (!yearLabel || yearLabel.textContent.trim() === "Year") {
      return false;
    }

    // Check if CVV is filled (3-4 digits)
    if (!cvv || !cvv.value.trim() || cvv.value.length < 3) {
      cvv?.focus();
      return false;
    }

    // Check if cardholder name is filled
    if (!cardholderName || !cardholderName.value.trim()) {
      cardholderName?.focus();
      return false;
    }

    return true;
  }

  // Continue button functionality
  if (personalContinueButton) {
    personalContinueButton.addEventListener("click", function () {
      // **NEW: Validate form fields before closing**
      const personalCardContainer = this.closest(".p-chk-user-card__container");
      if (personalCardContainer) {
        // Get form fields with correct selectors
        const cardNumber = personalCardContainer.querySelector(
          "#personal-card-number-payment"
        );
        const cvv = personalCardContainer.querySelector(
          "#personal-cvv-payment"
        );
        const cardholderName = personalCardContainer.querySelector(
          "#personal-cardholder-payment"
        );

        // Validate required fields
        const isValid = validatePersonalCardForm(
          cardNumber,
          null,
          null,
          cvv,
          cardholderName,
          personalCardContainer
        );

        if (!isValid) {
          // Don't close the form if validation fails
          alert(
            "Please fill in all required card information before continuing."
          );
          return;
        }
      }

      alert("Personal card information saved successfully!");

      // **MOVED: Only close form after successful validation**
      if (personalCardContainer) {
        // Collapse the personal card form
        personalCardContainer.classList.remove("expanded");

        // Hide the collapsible content (the form)
        const collapsibleContent = personalCardContainer.querySelector(
          ".p-chk-user-card__collapsible-content"
        );
        if (collapsibleContent) {
          collapsibleContent.style.display = "none";
        }

        // Reset the toggle state
        const summaryToggle = personalCardContainer.querySelector(
          ".p-chk-user-card__summary-toggle"
        );
        if (summaryToggle) {
          summaryToggle.checked = false;
        }
      }

      // Check if all payment methods are completed
      checkPaymentCompletion();
    });
  }

  // Function to check if payment section should be completed
  function checkPaymentCompletion() {
    // **REFACTORED: Simplified completion check**
    const completionChecks = [
      {
        selector: '[data-chk-element="cca-card"]',
        condition: (el) => el && el.style.display === "none",
      },
      {
        selector: '[data-chk-element="postal-form-section"]',
        condition: (el) => el && el.style.display === "none",
      },
      {
        selector: ".p-chk-user-card__collapsible-content",
        condition: (el) => el && el.style.display === "none",
      },
    ];

    const isAnyCompleted = completionChecks.some((check) => {
      const element = document.querySelector(check.selector);
      return check.condition(element);
    });

    if (isAnyCompleted) {
      setTimeout(() => {
        // Use unified header and border radius management
        SectionManager.manageHeaders("payment", "hide-blue");
        SectionManager.manageBorderRadius("payment", "restore");
      }, 500);
    }
  }

  // Personal Card dropdown functionality
  document
    .querySelectorAll(".p-chk-user-card__dropdown-option")
    .forEach((option) => {
      option.addEventListener("click", function () {
        const dropdown = this.closest(".p-chk-user-card__dropdown");
        const label = dropdown.querySelector(".p-chk-user-card__dropdown-text");
        const toggle = dropdown.querySelector(
          ".p-chk-user-card__dropdown-toggle"
        );

        label.textContent = this.textContent;
        label.classList.add("selected");
        toggle.checked = false; // Close dropdown
      });
    });

  // Close personal dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".p-chk-user-card__dropdown")) {
      document
        .querySelectorAll(".p-chk-user-card__dropdown-toggle")
        .forEach((toggle) => {
          toggle.checked = false;
        });
    }
  });

  // Card number formatting using Inputmask library
  function initializeCardNumberMasks() {
    const cardNumberInputs = document.querySelectorAll(
      "#postal-card-number-payment, #personal-card-number-payment"
    );

    cardNumberInputs.forEach((input) => {
      // Apply credit card mask for 4 major card types
      const cardMask = new Inputmask({
        mask: [
          "9999 9999 9999 9999", // Visa, MasterCard, Discover (16 digits)
          "9999 999999 99999", // American Express (15 digits)
        ],
        keepStatic: true,
        placeholder: " ",
        showMaskOnHover: false,
        showMaskOnFocus: false,
        onBeforePaste: function (pastedValue, opts) {
          // Clean pasted value to only numbers
          return pastedValue.replace(/\D/g, "");
        },
        onKeyValidation: function (key, result) {
          // Allow only numeric input
          return /[0-9]/.test(key) || key === "Backspace" || key === "Delete";
        },
      });

      cardMask.mask(input);

      // Add card type detection for 4 major card types
      input.addEventListener("input", function () {
        const cleanValue = this.value.replace(/\D/g, "");
        let cardType = "unknown";

        // Card detection for 4 major card types only
        if (/^4/.test(cleanValue)) {
          cardType = "visa";
        } else if (
          /^5[1-5]/.test(cleanValue) ||
          /^2(?:2(?:2[1-9]|[3-9])|[3-6]|7(?:[01]|20))/.test(cleanValue)
        ) {
          // MasterCard: 51-55 (traditional) + 222100-272099 (new range)
          cardType = "mastercard";
        } else if (/^3[47]/.test(cleanValue)) {
          cardType = "amex";
        } else if (
          /^6(?:011|22(?:1(?:2[6-9]|[3-9])|[2-8]|9(?:[01]|2[0-5]))|4[4-9]|5)/.test(
            cleanValue
          )
        ) {
          // Discover: 6011, 622126-622925, 644-649, 65
          cardType = "discover";
        }

        // Update input class for card type styling
        this.className = this.className.replace(/card-type-\w+/g, "");
        if (cardType !== "unknown") {
          this.classList.add(`card-type-${cardType}`);
        }
      });
    });
  }

  // Initialize card masks when DOM is ready
  initializeCardNumberMasks();

  // CVV formatting using Inputmask library
  function initializeCVVMasks() {
    const cvvInputs = document.querySelectorAll(
      "#postal-cvv-payment, #personal-cvv-payment"
    );

    cvvInputs.forEach((input) => {
      // Apply CVV mask (3-4 digits)
      const cvvMask = new Inputmask({
        mask: ["999", "9999"],
        keepStatic: false,
        placeholder: "",
        showMaskOnHover: false,
        showMaskOnFocus: false,
        definitions: {
          9: {
            validator: "[0-9]",
            cardinality: 1,
          },
        },
        onKeyValidation: function (key, result) {
          // Allow only numeric input
          return /[0-9]/.test(key) || key === "Backspace" || key === "Delete";
        },
      });

      cvvMask.mask(input);
    });
  }

  // Initialize CVV masks
  initializeCVVMasks();

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
        alert("Please fill in payment information.");
      }
    });
  }

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Use integrated Galls-style validation
      if (!submitOrder()) {
        return; // Validation failed, don't proceed
      }

      // Check payment information
      const postalCardNumber = document.getElementById(
        "postal-card-number-payment"
      )?.value;
      const personalCardNumber = document.getElementById(
        "personal-card-number-payment"
      )?.value;

      if (postalCardNumber || personalCardNumber) {
        // Simulate order processing
        this.disabled = true;
        this.querySelector(
          ".p-chk-order-summary__place-order-text"
        ).textContent = "Processing...";

        setTimeout(() => {
          alert("Order placed successfully!");
          this.disabled = false;
          this.querySelector(
            ".p-chk-order-summary__place-order-text"
          ).textContent = "Place Order";
        }, 2000);
      } else {
        alert("Please fill in payment information.");
      }
    });
  }
});

// Section Edit Functionality
let currentEditingSection = null;

// State-driven initialization function
function initializeFromState() {
  const mainContent = document.querySelector(".p-chk-main__content");
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
        const displayContent = document.querySelector(
          '[data-display-content="delivery"]'
        );
        const addressElement = displayContent?.querySelector(
          ".p-chk-address-card__address"
        );
        const emptyDescription = displayContent?.querySelector(
          ".p-chk-address-card__empty-description"
        );
        if (addressElement && emptyDescription) {
          addressElement.style.display = "none";
          emptyDescription.style.display = "block";
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
      }, 100);
      break;

    case "payment":
      // Both contact and delivery completed, payment highlighted
      console.log("Setting up payment state");
      setTimeout(() => {
        SectionManager.manageHeaders("payment", "show-blue");
        SectionManager.manageBorderRadius("payment", "remove-top");

        // Ensure delivery shows completed address (not empty state)
        const displayContent = document.querySelector(
          '[data-display-content="delivery"]'
        );
        const addressElement = displayContent?.querySelector(
          ".p-chk-address-card__address"
        );
        const emptyDescription = displayContent?.querySelector(
          ".p-chk-address-card__empty-description"
        );
        if (addressElement && emptyDescription) {
          addressElement.style.display = "block";
          emptyDescription.style.display = "none";
        }
      }, 100);
      break;

    default:
      // Default state - no specific initialization needed
      console.log("No specific state initialization needed");
      break;
  }
}

// **REFACTORED: Utility functions for common operations**
const SectionManager = {
  // Cache DOM queries for performance
  getSection: (sectionType) =>
    document.querySelector(`[data-editable-section="${sectionType}"]`),
  getSectionElement: (sectionType, selector) => {
    const section = SectionManager.getSection(sectionType);
    return section ? section.querySelector(selector) : null;
  },
  getSectionHeader: (sectionType) =>
    document.querySelector(`[data-section-header="${sectionType}"]`),
  getDisplayContent: (sectionType) =>
    document.querySelector(`[data-display-content="${sectionType}"]`),
  getEditForm: (sectionType) =>
    document.querySelector(`[data-edit-form="${sectionType}"]`),

  // Generic function to show section form
  showSectionForm: (sectionType) => {
    const editForm = SectionManager.getEditForm(sectionType);
    if (editForm) {
      editForm.classList.add("expanded");
    }
  },

  // Generic function to hide section form
  hideSectionForm: (sectionType) => {
    const editForm = SectionManager.getEditForm(sectionType);
    if (editForm) {
      editForm.classList.remove("expanded");
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
      ".p-chk-payment-card__header"
    );
    const sectionHeader = SectionManager.getSectionHeader(sectionType);

    if (action === "show-blue") {
      // Hide all blue headers first
      document.querySelectorAll("[data-section-header]").forEach((h) => {
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
      section.querySelector(".p-chk-info-card__container"),
      section.querySelector(".p-chk-payment-container"),
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
      ".p-chk-contact-card__header, .p-chk-address-card__header, .p-chk-payment-card__header, .p-chk-info-card__header"
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

  // Check delivery section state
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

// Generic Edit button click handlers
document.querySelectorAll("[data-edit-button]").forEach((button) => {
  button.addEventListener("click", function () {
    const sectionType = this.getAttribute("data-edit-button");
    console.log("Generic edit button clicked for section:", sectionType);
    startEditing(sectionType);
  });
});

// Generic Complete button click handlers (moved here for organization)
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

function startEditing(sectionType) {
  // **REFACTORED: Simplified with utility functions**

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
        .querySelector(".p-chk-main__content")
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

  const editForm = document.querySelector(`[data-edit-form="${sectionType}"]`);
  const displayContent = document.querySelector(
    `[data-display-content="${sectionType}"]`
  );

  if (!editForm || !displayContent) return;

  // Get form values
  const emailInput = editForm.querySelector('input[type="email"]');
  const craftSelect = editForm.querySelector("select");

  if (!emailInput || !craftSelect) return;

  const email = emailInput.value.trim();
  const craftIndex = craftSelect.selectedIndex;
  const craftText = craftIndex > 0 ? craftSelect.options[craftIndex].text : "";

  // Update display content
  const emailElement = displayContent.querySelector(
    ".p-chk-contact-card__email"
  );
  const jobElement = displayContent.querySelector(
    ".p-chk-contact-card__job-title"
  );

  if (emailElement && email) {
    emailElement.textContent = email;
  }

  if (jobElement && craftText) {
    jobElement.textContent = craftText;
  }

  // Update button text using generic function
  const hasContactContent = email || craftText;
  updateEditButtonText("contact", hasContactContent);
}

function updateDeliveryDisplay(sectionType) {
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

// Payment section click handler - clicking anywhere inside triggers edit mode
const paymentSection = document.querySelector(
  '[data-editable-section="payment"]'
);
if (paymentSection) {
  paymentSection.addEventListener("click", function (e) {
    // Don't trigger if already editing payment section
    if (currentEditingSection === "payment") {
      return;
    }

    // Don't trigger if clicking edit button (already handled above)
    if (e.target.closest('[data-edit-button="payment"]')) {
      return;
    }

    // Don't trigger if clicking complete button
    if (e.target.closest('[data-complete-edit="payment"]')) {
      return;
    }

    // Trigger edit mode for payment section
    startEditing("payment");
  });
}

// **GALLS CHECKOUT VALIDATION FUNCTIONS**
// Functions extracted from Galls checkout for reuse in postal checkout

// Saves checkout form data via AJAX and performs server-side validation
function saveCheckoutForm(action, inputObj) {
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

// Shows all validation errors stored in hidden field on page load
function showErrors2() {
  const errorField = document.getElementById("SIERR2");
  if (!errorField || !errorField.value) return;

  try {
    const errorArray = JSON.parse(decodeURIComponent(errorField.value));
    for (let i = 0; i < errorArray.length; i++) {
      const error = errorArray[i];
      if (i === 0) {
        // Focus first error field
        const field = document.getElementById(error.id);
        if (field) field.focus();
      }
      errMsg(error.id, error.errmsg);
    }
  } catch (e) {
    console.error("Error parsing validation errors:", e);
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
    const section = focusedElement.closest("[data-editable-section]");
    if (section) {
      const sectionType = section.getAttribute("data-editable-section");

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
