const searchForm = document.querySelector("#trip-search");
    const destinationSelect = document.querySelector("#destination");
    const destinationCards = [...document.querySelectorAll(".destination-card")];
    const searchFeedback = document.querySelector("#search-feedback");
    const contactForm = document.querySelector("#contact-form");
    const contactFeedback = document.querySelector("#contact-feedback");
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#site-navigation");
    const authDialog = document.querySelector("#auth-dialog");
    const authTabs = [...document.querySelectorAll(".auth-tab")];
    const authStatus = document.querySelector("#auth-status");
    const loginForm = document.querySelector("#login-form");
    const registerForm = document.querySelector("#register-form");
    const registerPassword = document.querySelector("#register-password");
    const registerPasswordConfirmation = document.querySelector("#register-password-confirmation");

    function showAuthPanel(panelName) {
      const isLogin = panelName === "login";
      document.querySelector("#login-panel").hidden = !isLogin;
      document.querySelector("#register-panel").hidden = isLogin;
      document.querySelector("#auth-dialog-title").textContent = isLogin ? "Welcome back." : "Join the journey.";
      authTabs.forEach((tab) => {
        const selected = tab.id === `${panelName}-tab`;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      authStatus.textContent = "";
      authDialog.querySelector(isLogin ? "#login-email" : "#register-name").focus();
    }

    document.querySelectorAll("[data-auth-panel]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const panelName = trigger.dataset.authPanel;
        if (!authDialog.open) authDialog.showModal();
        showAuthPanel(panelName);
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });

    authTabs.forEach((tab) => {
      tab.addEventListener("click", () => showAuthPanel(tab.id === "login-tab" ? "login" : "register"));
      tab.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          const nextPanel = tab.id === "login-tab" ? "register" : "login";
          showAuthPanel(nextPanel);
          document.querySelector(`#${nextPanel}-tab`).focus();
        }
      });
    });

    authDialog.querySelector(".auth-close").addEventListener("click", () => authDialog.close());
    authDialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") authDialog.close();
    });
    authDialog.addEventListener("click", (event) => {
      if (event.target === authDialog) authDialog.close();
    });

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      authStatus.textContent = "Login isn’t connected yet. Your credentials were not sent or saved.";
    });

    function validatePasswordConfirmation() {
      registerPasswordConfirmation.setCustomValidity(
        registerPasswordConfirmation.value === registerPassword.value ? "" : "Passwords must match."
      );
    }

    registerPassword.addEventListener("input", validatePasswordConfirmation);
    registerPasswordConfirmation.addEventListener("input", validatePasswordConfirmation);
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      validatePasswordConfirmation();
      if (!registerForm.reportValidity()) return;
      authStatus.textContent = "Account creation isn’t connected yet. Your details were not sent or saved.";
    });

    if (searchForm) searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const selected = destinationSelect.value;
      let visibleCount = 0;

      destinationCards.forEach((card) => {
        const matches = selected === "all" || card.dataset.category === selected;
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      const destinationName = destinationSelect.options[destinationSelect.selectedIndex].text;
      const partySize = document.querySelector("#travellers").value;
      const travelDate = document.querySelector("#travel-date").value;
      const tripDetails = ` This trip is for ${partySize} ${partySize === "1" ? "traveller" : "travellers"}${travelDate ? `, around ${new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(new Date(`${travelDate}T00:00:00`))}` : ""}.`;
      searchFeedback.textContent = (selected === "all"
        ? `A little inspiration for your Sri Lanka adventure — ${visibleCount} travel packages to explore.`
        : `Lovely choice. We found ${visibleCount} ${visibleCount === 1 ? "package" : "packages"} for ${destinationName.toLowerCase()}.`) + tripDetails;
      document.querySelector("#packages").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    if (contactForm) contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const subject = encodeURIComponent("Sri Lanka trip enquiry");
      const body = encodeURIComponent(
        `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\n\nTrip details:\n${formData.get("message")}`
      );
      contactFeedback.textContent = "Opening your email app with your enquiry ready to send.";
      window.location.href = `mailto:hello@lankatravellers.com?subject=${subject}&body=${body}`;
    });

    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });
