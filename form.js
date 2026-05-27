(function () {
        const form = document.getElementById("checkoutForm");
        const steps = document.querySelectorAll(".step");
        const btnNext = document.getElementById("btnNext");
        const btnBack = document.getElementById("btnBack");
        const btnSubmit = document.getElementById("btnSubmit");
        const progressFill = document.getElementById("progressFill");
        const stepLabel = document.getElementById("stepLabel");
        const percentLabel = document.getElementById("percentLabel");
        const progressBar = document.getElementById("progressBar");
        const successMessage = document.getElementById("successMessage");

        let currentStep = 0;
        const totalSteps = steps.length;

        function updateUI() {
          // Show/hide steps
          steps.forEach(function (step, i) {
            step.classList.toggle("hidden", i !== currentStep);
          });

          // Update progress
          const percent = Math.round(((currentStep + 1) / totalSteps) * 100);
          progressFill.style.width = percent + "%";
          progressBar.setAttribute("aria-valuenow", percent);
          stepLabel.textContent = "Paso " + (currentStep + 1) + " de " + totalSteps;
          percentLabel.textContent = percent + "%";

          // Update step indicators
          for (var i = 1; i <= totalSteps; i++) {
            var indicator = document.getElementById("indicator" + i);
            var circle = indicator.querySelector("span");
            if (i - 1 < currentStep) {
              indicator.className = "font-medium text-ink";
              circle.className = "block w-8 h-8 mx-auto mb-1 rounded-full bg-ink text-white flex items-center justify-center text-sm";
              circle.innerHTML = "&#10003;";
            } else if (i - 1 === currentStep) {
              indicator.className = "font-medium text-ink";
              circle.className = "block w-8 h-8 mx-auto mb-1 rounded-full bg-ink text-white flex items-center justify-center text-sm";
              circle.textContent = i;
            } else {
              indicator.className = "text-black/40";
              circle.className = "block w-8 h-8 mx-auto mb-1 rounded-full bg-sand/60 text-black/50 flex items-center justify-center text-sm";
              circle.textContent = i;
            }
          }

          // Show/hide buttons
          btnBack.classList.toggle("hidden", currentStep === 0);
          btnNext.classList.toggle("hidden", currentStep === totalSteps - 1);
          btnSubmit.classList.toggle("hidden", currentStep !== totalSteps - 1);

          // Move focus to the current fieldset legend for accessibility
          var currentLegend = steps[currentStep].querySelector("legend");
          if (currentLegend) {
            currentLegend.setAttribute("tabindex", "-1");
            currentLegend.focus();
          }
        }

        function validateStep(stepIndex) {
          var step = steps[stepIndex];
          var inputs = step.querySelectorAll("input[required], select[required]");
          var valid = true;

          inputs.forEach(function (input) {
            var errorMsg = input.parentElement.querySelector(".error-msg");
            if (!input.checkValidity()) {
              valid = false;
              input.classList.add("border-red-400");
              input.classList.remove("border-black/15");
              if (errorMsg) errorMsg.classList.remove("hidden");
              input.setAttribute("aria-invalid", "true");
            } else {
              input.classList.remove("border-red-400");
              input.classList.add("border-black/15");
              if (errorMsg) errorMsg.classList.add("hidden");
              input.removeAttribute("aria-invalid");
            }
          });

          return valid;
        }

        // Clear error on input
        form.addEventListener("input", function (e) {
          var input = e.target;
          if (input.checkValidity()) {
            input.classList.remove("border-red-400");
            input.classList.add("border-black/15");
            var errorMsg = input.parentElement.querySelector(".error-msg");
            if (errorMsg) errorMsg.classList.add("hidden");
            input.removeAttribute("aria-invalid");
          }
        });

        btnNext.addEventListener("click", function () {
          if (validateStep(currentStep)) {
            currentStep++;
            updateUI();
          }
        });

        btnBack.addEventListener("click", function () {
          if (currentStep > 0) {
            currentStep--;
            updateUI();
          }
        });

        form.addEventListener("submit", function (e) {
          e.preventDefault();
          if (validateStep(currentStep)) {
            form.classList.add("hidden");
            progressBar.parentElement.querySelector("h1").classList.add("hidden");
            progressBar.parentElement.querySelector("p").classList.add("hidden");
            progressBar.classList.add("hidden");
            document.querySelector("ol[aria-label='Pasos del formulario']").classList.add("hidden");
            successMessage.classList.remove("hidden");
            successMessage.focus();
          }
        });

        // Initialize
        updateUI();
      })();