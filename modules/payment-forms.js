/**
 * Payment Forms Module
 * Handles form UI validation, input masking, and interaction logic for payment forms
 */

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

// Arrow direction toggle for toggle buttons (Bootstrap collapse specific)
function setupToggleButtonRotation() {
  const toggleButtons = [
    { button: "postalToggleButton", form: "postalFormSection" },
    { button: "personalToggleButton", form: "personalFormSection" },
  ];

  toggleButtons.forEach(({ button, form }) => {
    const toggleBtn = document.getElementById(button);
    const formSection = document.getElementById(form);

    if (toggleBtn && formSection) {
      const path = toggleBtn.querySelector("svg path");
      if (path) {
        formSection.addEventListener("show.bs.collapse", () => {
          path.setAttribute("d", "M3.5 8.75L7 5.25L10.5 8.75"); // Down arrow
        });

        formSection.addEventListener("hide.bs.collapse", () => {
          path.setAttribute("d", "M3.5 5.25L7 8.75L10.5 5.25"); // Up arrow
        });
      }
    }
  });
}

// CCA Form Management - Module-level variables for DOM elements
let ccaMainCheckbox, ccaCard, disclaimerCheckbox, fileNameInput, submitButton;

function initializeCCAForm() {
  ccaMainCheckbox = document.querySelector('[data-chk-element="cca-checkbox"]');
  ccaCard = document.querySelector('[data-chk-element="cca-card"]');
  disclaimerCheckbox = document.querySelector(
    '[data-chk-element="disclaimer-checkbox"]'
  );
  fileNameInput = document.querySelector(
    '[data-chk-element="file-name-input"]'
  );
  submitButton = document.querySelector('[data-chk-element="submit-button"]');

  // Initialize form state
  if (ccaMainCheckbox) {
    ccaMainCheckbox.setAttribute("aria-checked", "false");
  }
  if (ccaCard) {
    ccaCard.classList.remove("expanded");
  }
  resetCCAForm();
}

// Exported CCA functions
function toggleCCAMain() {
  const isChecked = ccaMainCheckbox.getAttribute("aria-checked") === "true";
  const newState = !isChecked;

  ccaMainCheckbox.setAttribute("aria-checked", newState);
  const postalCardContainer = document.querySelector(".p-chk-card__container");

  if (newState) {
    ccaCard.classList.add("expanded");
    if (postalCardContainer) {
      postalCardContainer.style.display = "none";
    }
  } else {
    ccaCard.classList.remove("expanded");
    if (postalCardContainer) {
      postalCardContainer.style.display = "flex";
    }
    resetCCAForm();
  }
}

function resetCCAForm() {
  if (disclaimerCheckbox) {
    disclaimerCheckbox.setAttribute("aria-checked", "false");
    disclaimerCheckbox.classList.remove("checked");
  }
  if (fileNameInput) {
    fileNameInput.value = "Voucher_Upload.pdf";
  }
  if (submitButton) {
    submitButton.disabled = true;
  }
}

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

  const canSubmit =
    (hasFile || disclaimerChecked) && supervisorEmail && supervisorPhone;
  submitButton.disabled = !canSubmit;
}

function showCCACard() {
  if (ccaCard) {
    ccaCard.classList.add("expanded");
    const postalCardContainer = document.querySelector(
      ".p-chk-card__container"
    );
    if (postalCardContainer) {
      postalCardContainer.style.display = "none";
    }
  }
}

function hideCCACard() {
  if (ccaCard) {
    ccaCard.classList.remove("expanded");
    const postalCardContainer = document.querySelector(
      ".p-chk-card__container"
    );
    if (postalCardContainer) {
      postalCardContainer.style.display = "flex";
    }
    resetCCAForm();
  }
}

function validateCCAForm() {
  const hasFile =
    fileNameInput &&
    fileNameInput.value.trim() &&
    fileNameInput.value !== "Voucher_Upload.pdf";
  const supervisorEmail = document.getElementById("cca-supervisor-email");
  const supervisorPhone = document.getElementById("cca-supervisor-phone");
  const hasEmail = supervisorEmail && supervisorEmail.value.trim();
  const hasPhone = supervisorPhone && supervisorPhone.value.trim();
  const disclaimerChecked =
    disclaimerCheckbox &&
    disclaimerCheckbox.getAttribute("aria-checked") === "true";

  return (hasFile || disclaimerChecked) && hasEmail && hasPhone;
}

// CCA Event Handlers
function handleCCACheckboxClick(event) {
  event.preventDefault();
  event.stopPropagation();
  toggleCCAMain();
}

function handleCCACheckboxKeydown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.stopPropagation();
    toggleCCAMain();
  }
}

function handleCCALabelClick(event) {
  event.preventDefault();
  toggleCCAMain();
}

function toggleDisclaimerCheckbox() {
  const disclaimerCheckbox = document.querySelector(
    '[data-chk-element="disclaimer-checkbox"]'
  );
  if (!disclaimerCheckbox) return;

  const isChecked = disclaimerCheckbox.getAttribute("aria-checked") === "true";
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

function handleDisclaimerKeydown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleDisclaimerCheckbox();
  }
}

function handleDisclaimerLabelClick(event) {
  event.preventDefault();
  toggleDisclaimerCheckbox();
}

function handleFileUploadClick(event) {
  event.preventDefault();
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".jpeg,.jpg,.png,.bmp,.doc,.docx,.pdf,.txt";
  input.onchange = function (event) {
    const file = event.target.files[0];
    if (file) {
      const fileNameInput = document.querySelector(
        '[data-chk-element="file-name-input"]'
      );
      if (fileNameInput) {
        fileNameInput.value = file.name;
        updateSubmitButtonState();
      }
    }
  };
  input.click();
}

function handleUploadButtonClick(event) {
  event.preventDefault();
  const fileNameInput = document.querySelector(
    '[data-chk-element="file-name-input"]'
  );
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

function handleSupervisorEmailInput() {
  updateSubmitButtonState();
}

function handleSupervisorPhoneInput() {
  updateSubmitButtonState();
}

function handleSubmitButtonClick(event) {
  event.preventDefault();
  if (!event.target.disabled) {
    alert("CCA Voucher submitted successfully!");

    // Close the CCA form after successful submission
    const ccaCard = document.querySelector('[data-chk-element="cca-card"]');
    if (ccaCard) {
      ccaCard.style.display = "none";
    }

    // Reset the CCA checkbox to unchecked state
    const ccaMainCheckbox = document.querySelector(
      '[data-chk-element="cca-checkbox"]'
    );
    if (ccaMainCheckbox) {
      ccaMainCheckbox.setAttribute("aria-checked", "false");
    }
  }
}

// CCA Form Handler Object - contains all CCA functionality
const handleCCAForm = {
  toggleCCAMain,
  updateSubmitButtonState,
  showCCACard,
  hideCCACard,
  validateCCAForm,
  resetCCAForm,
  handleCCACheckboxClick,
  handleCCACheckboxKeydown,
  handleCCALabelClick,
  toggleDisclaimerCheckbox,
  handleDisclaimerKeydown,
  handleDisclaimerLabelClick,
  handleFileUploadClick,
  handleUploadButtonClick,
  handleSupervisorEmailInput,
  handleSupervisorPhoneInput,
  handleSubmitButtonClick,
};

// Initialize all payment form functionality
function initializePaymentForms() {
  initializeCardNumberMasks();
  initializeCVVMasks();
  setupToggleButtonRotation();
  initializeCCAForm();
}

initializePaymentForms.handleCCAForm = handleCCAForm;

export { initializePaymentForms };
