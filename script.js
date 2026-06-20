const form = document.querySelector("#lead-form");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const consentInput = document.querySelector("#consent");
const successMessage = document.querySelector("#form-success");

const errorFields = {
  name: document.querySelector("#name-error"),
  phone: document.querySelector("#phone-error"),
  consent: document.querySelector("#consent-error"),
};

function clearErrors() {
  Object.values(errorFields).forEach((field) => {
    field.textContent = "";
  });
  successMessage.textContent = "";
}

function normalizePhone(value) {
  return value.replace(/[^\d+]/g, "");
}

function validateName(value) {
  return value.trim().length >= 4;
}

function validatePhone(value) {
  const normalized = normalizePhone(value);
  const hasValidPrefix = normalized.startsWith("+") || /^\d/.test(normalized);
  const digitsOnly = normalized.replace(/\D/g, "");

  return hasValidPrefix && digitsOnly.length >= 8 && digitsOnly.length <= 15;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const consent = consentInput.checked;

  let isValid = true;

  if (!validateName(name)) {
    errorFields.name.textContent =
      "Por favor, introduce tu nombre y apellido completos.";
    isValid = false;
  }

  if (!validatePhone(phone)) {
    errorFields.phone.textContent =
      "Introduce un teléfono válido en formato internacional.";
    isValid = false;
  }

  if (!consent) {
    errorFields.consent.textContent =
      "Debes aceptar el contacto para enviar la solicitud.";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const leadPayload = {
    name,
    phone: normalizePhone(phone),
    consent,
    source: "don-alejandro-landing",
    submittedAt: new Date().toISOString(),
  };

  // Conecta aquí tu CRM, webhook o endpoint de leads.
  console.log("Nuevo lead recibido:", leadPayload);

  form.reset();
  successMessage.textContent = "Gracias. Hemos recibido tu solicitud.";
});
