const countdownTimer = document.querySelector("#countdown-timer");
const form = document.querySelector("#lead-form");
const nameInput = document.querySelector("#full-name");
const phoneInput = document.querySelector("#phone");
const successMessage = document.querySelector("#form-success");
const errorFields = {
  name: document.querySelector("#name-error"),
  phone: document.querySelector("#phone-error"),
};

function getEndOfToday() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
}

function formatUnit(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  if (!countdownTimer) return;

  const remaining = Math.max(0, getEndOfToday() - new Date());
  const hours = Math.floor(remaining / 1000 / 60 / 60);
  const minutes = Math.floor((remaining / 1000 / 60) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  countdownTimer.textContent = `${formatUnit(hours)}:${formatUnit(minutes)}:${formatUnit(seconds)}`;
}

function normalizePhone(value) {
  return value.replace(/[^\d+]/g, "");
}

function validateFullName(value) {
  const words = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words.length >= 2 && words.join("").length >= 5;
}

function validatePhone(value) {
  const normalized = normalizePhone(value);
  const digits = normalized.replace(/\D/g, "");
  const hasValidStart = normalized.startsWith("+") || /^\d/.test(normalized);

  return hasValidStart && digits.length >= 8 && digits.length <= 15;
}

function setFieldError(input, errorNode, message) {
  input.setAttribute("aria-invalid", message ? "true" : "false");
  errorNode.textContent = message;
}

function clearFormMessages() {
  setFieldError(nameInput, errorFields.name, "");
  setFieldError(phoneInput, errorFields.phone, "");
  successMessage.textContent = "";
}

function handleSubmit(event) {
  event.preventDefault();
  clearFormMessages();

  const fullName = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  let isValid = true;

  if (!validateFullName(fullName)) {
    setFieldError(
      nameInput,
      errorFields.name,
      "Please enter your first and last name in this single field."
    );
    isValid = false;
  }

  if (!validatePhone(phone)) {
    setFieldError(
      phoneInput,
      errorFields.phone,
      "Please enter a valid phone number, preferably with country code."
    );
    isValid = false;
  }

  if (!isValid) return;

  const lead = {
    fullName,
    phone: normalizePhone(phone),
    source: "sergey-volkov-habanos-landing",
    offer: "$49",
    submittedAt: new Date().toISOString(),
  };

  console.info("Reservation lead captured:", lead);

  form.reset();
  nameInput.setAttribute("aria-invalid", "false");
  phoneInput.setAttribute("aria-invalid", "false");
  successMessage.textContent =
    "Thank you. Your reservation request has been received. A specialist will contact you shortly.";
}

function initRevealAnimations() {
  const revealNodes = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -48px",
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function initStickyCtaGuard() {
  const stickyCta = document.querySelector(".mobile-sticky-cta");
  const reserveSection = document.querySelector("#reserve");

  if (!stickyCta || !reserveSection) {
    return;
  }

  const updateStickyState = () => {
    const rect = reserveSection.getBoundingClientRect();
    const isReserveActive = rect.top < window.innerHeight * 0.82 && rect.bottom > 120;
    stickyCta.classList.toggle("is-hidden", isReserveActive);
  };

  updateStickyState();
  window.addEventListener("scroll", updateStickyState, { passive: true });
  window.addEventListener("resize", updateStickyState);
}

updateCountdown();
setInterval(updateCountdown, 1000);
initRevealAnimations();
initStickyCtaGuard();

form.addEventListener("submit", handleSubmit);
