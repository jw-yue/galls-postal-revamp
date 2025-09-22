// Import showBSAlertModal from formUtil
import { showBSAlertModal } from "./formUtil.js";

// API call to submit voucher - placeholder function
function handleUploadVoucherButtonClick(event) {
  event.preventDefault();

  // Check if file has been selected
  const fileNameInput = document.querySelector(
    '[data-chk-element="file-name-input"]'
  );

  if (
    !fileNameInput ||
    !fileNameInput.value ||
    fileNameInput.value === "Name your file"
  ) {
    // No file selected - show alert modal
    showBSAlertModal(
      "File Upload Required",
      "Please upload a file to continue."
    );
    return;
  }

  // File is selected, proceed with upload
  uploadVoucherButtonState("voucherUploadSuccess");
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
  const voucherForm = document.getElementById("chkCCAVoucherUploadSection");

  if (fileNameInput) {
    fileNameInput.value = "Name your file";
  }
  if (disclaimerCheckbox) {
    disclaimerCheckbox.setAttribute("aria-expanded", "true");
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

  // Reset voucher form to shown state (since disclaimer unchecked means they want to upload)
  if (voucherForm) {
    // Use existing Bootstrap functionality
    if (!voucherForm.classList.contains("show")) {
      voucherForm.classList.add("show");
    }
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
const initializeCCAForm = {
  handleFileUploadClick,
  handleUploadVoucherButtonClick,
  handleRemoveFileClick,
  resetCCAForm,
  handleCCACheckboxClick: togglePostalForm,
};

export { initializeCCAForm };
