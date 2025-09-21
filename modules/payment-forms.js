/**
 * Payment Forms Module
 * Handles form UI validation, input masking, and interaction logic for payment forms
 */

// Card number formatting using Inputmask library
function initializeCardNumberMasks() {
  const cardInputs = document.querySelectorAll(
    "#chkPostalCardNumber, #chkPersonalCardNumber"
  );

  cardInputs.forEach((input) => {
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
  const cvvInputs = document.querySelectorAll("#chkPostalCVV, #chkPersonalCVV");

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
    { button: "chkPostalToggleButton", form: "chkPostalFormSection" },
    { button: "chkPersonalToggleButton", form: "chkPersonalFormSection" },
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

// API call to submit voucher - placeholder function
function handleUploadVoucherButtonClick(event) {
  event.preventDefault();
  const fileNameInput = document.querySelector(
    '[data-chk-element="file-name-input"]'
  );
  // API call to send file to backend would go here
  if (true) {
    uploadVoucherButtonState("voucherUploadSuccess");
  } else {
    uploadVoucherButtonState("voucherUploadError");
  }
}

// Handle file selection dialog and update input field
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
        uploadVoucherButtonState("enableVoucherUpload");
      }
    }
  };
  input.click();
}

// Update submit button state based on form inputs and upload status
function uploadVoucherButtonState(state) {
  const uploadVoucherButton = document.querySelector(
    '[data-chk-element="upload-button"]'
  );
  const successMessage = document.querySelector(
    "[data-chk-voucher-upload-success]"
  );
  const errorMessage = document.querySelector(
    "[data-chk-voucher-upload-error]"
  );

  switch (state) {
    case "enableVoucherUpload":
      if (uploadVoucherButton) {
        uploadVoucherButton.disabled = false;
      }
      // Show remove button when file is selected
      toggleRemoveButton(true);
      break;

    case "voucherUploadSuccess":
      if (successMessage) {
        successMessage.style.display = "block";
      }
      if (errorMessage) {
        errorMessage.style.display = "none";
      }
      if (uploadVoucherButton) {
        uploadVoucherButton.style.display = "none";
      }
      // Keep remove button visible for successful uploads
      toggleRemoveButton(true);
      break;

    case "voucherUploadError":
      if (errorMessage) {
        errorMessage.style.display = "block";
      }
      if (successMessage) {
        successMessage.style.display = "none";
      }
      if (uploadVoucherButton) {
        uploadVoucherButton.disabled = true;
      }
      // Hide remove button on error
      toggleRemoveButton(false);
      break;

    case "resetUpload":
      // Reset upload state - hide messages, show upload button, disable it
      if (successMessage) {
        successMessage.style.display = "none";
      }
      if (errorMessage) {
        errorMessage.style.display = "none";
      }
      if (uploadVoucherButton) {
        uploadVoucherButton.style.display = "block";
        uploadVoucherButton.disabled = true;
      }
      // Hide remove button
      toggleRemoveButton(false);
      break;
  }
}

// Show or hide the remove file button
function toggleRemoveButton(show) {
  const removeButton = document.querySelector(
    '[data-chk-element="remove-file-button"]'
  );
  if (removeButton) {
    removeButton.style.display = show ? "flex" : "none";
  }
}

// Handle remove file button click
function handleRemoveFileClick(event) {
  event.preventDefault();

  // Reset file input and hide remove button
  const fileNameInput = document.querySelector(
    '[data-chk-element="file-name-input"]'
  );
  if (fileNameInput) {
    fileNameInput.value = "Name your file";
  }

  // Hide remove button
  toggleRemoveButton(false);

  // Reset upload state
  uploadVoucherButtonState("resetUpload");
}

// Reset CCA form to initial state
function resetCCAForm() {
  const fileNameInput = document.querySelector(
    '[data-chk-element="file-name-input"]'
  );
  const disclaimerCheckbox = document.querySelector(
    '[data-chk-element="disclaimer-checkbox"]'
  );
  const submitButton = document.querySelector(
    '[data-chk-element="submit-button"]'
  );
  const uploadVoucherButton = document.querySelector(
    "[data-chk-element='upload-button']"
  );
  const successMessage = document.querySelector(
    "[data-chk-voucher-upload-success]"
  );
  const errorMessage = document.querySelector(
    "[data-chk-voucher-upload-error]"
  );

  if (fileNameInput) {
    fileNameInput.value = "Name your file";
  }
  if (disclaimerCheckbox) {
    disclaimerCheckbox.checked = false;
  }
  if (submitButton) {
    submitButton.disabled = true;
  }
  if (uploadVoucherButton) {
    uploadVoucherButton.disabled = false;
  }
  if (successMessage) {
    successMessage.style.display = "none";
  }
  if (errorMessage) {
    errorMessage.style.display = "none";
  }

  // Hide remove button on reset
  toggleRemoveButton(false);
}

// Toggle the Postal form if user clicks the CCA checkbox
function togglePostalForm(checkbox) {
  const postalForm = document.querySelector(
    "[data-chk-element='postal-card-container']"
  );

  if (checkbox && postalForm) {
    if (checkbox.checked) {
      postalForm.style.display = "none";
    } else {
      postalForm.style.display = "block";
    }
  }
}

// CCA Form Handler Object - contains all CCA functionality
const handleCCAForm = {
  handleFileUploadClick,
  handleUploadVoucherButtonClick,
  handleRemoveFileClick,
  resetCCAForm,
  handleCCACheckboxClick: togglePostalForm,
};

// Initialize all payment form functionality
function initializePaymentForms() {
  initializeCardNumberMasks();
  initializeCVVMasks();
  setupToggleButtonRotation();
}

initializePaymentForms.handleCCAForm = handleCCAForm;

export { initializePaymentForms };
