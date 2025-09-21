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

// Initialize all payment form functionality
function initializePaymentForms() {
  initializeCardNumberMasks();
  initializeCVVMasks();
  setupToggleButtonRotation();
}

export { initializePaymentForms };
