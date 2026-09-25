/*
 * Autenticação da Ritmo K com Firebase Authentication + Realtime Database.
 *
 * Este arquivo usa apenas a configuração pública do Firebase (firebase-config.js).
 * O arquivo aula-94bbc-firebase-adminsdk-*.json NÃO deve ser usado no navegador;
 * ele contém uma chave privada e deve ficar apenas em um backend/servidor.
 */
(function () {
  const config = window.firebaseConfig || {};
  const firebaseConfigReady = Boolean(
    config.apiKey &&
    !config.apiKey.startsWith("COLE_") &&
    config.projectId &&
    !config.projectId.startsWith("SEU_")
  );
  const isAuthPage = document.body.dataset.page === "auth";

  const authElements = {
    modal: document.querySelector("#auth-modal"),
    tabs: document.querySelectorAll(".auth-tabs [data-auth-tab]"),
    tabTriggers: document.querySelectorAll("[data-auth-tab]"),
    loginPanel: document.querySelector("#login-panel"),
    registerPanel: document.querySelector("#register-panel"),
    loginForm: document.querySelector("#login-form"),
    registerForm: document.querySelector("#register-form"),
    googleButtons: document.querySelectorAll("#google-login, #google-register"),
    message: document.querySelector("#auth-message"),
    submitButtons: document.querySelectorAll("[data-auth-submit]"),
  };

  let firebaseAuth = null;
  let firebaseDatabase = null;

  function setAuthMessage(message, type) {
    if (!authElements.message) return;
    authElements.message.textContent = message || "";
    authElements.message.dataset.type = type || "";
    authElements.message.hidden = !message;
  }

  function notify(message) {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function setAuthLoading(loading) {
    authElements.submitButtons.forEach((button) => {
      if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
      button.disabled = loading;
      button.innerHTML = loading ? "Aguarde..." : button.dataset.originalHtml;
    });
    authElements.googleButtons.forEach((button) => {
      button.disabled = loading;
    });
  }

  function setAuthTab(tabName) {
    const isLogin = tabName === "login";
    authElements.tabs.forEach((tab) => {
      const selected = tab.dataset.authTab === tabName;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    if (authElements.loginPanel) authElements.loginPanel.hidden = !isLogin;
    if (authElements.registerPanel) authElements.registerPanel.hidden = isLogin;
    setAuthMessage("");
  }

  function isLoginActive() {
    return Boolean(authElements.loginPanel && !authElements.loginPanel.hidden);
  }

  function openAuthModal(tabName = "login") {
    if (!authElements.modal) {
      const query = tabName === "register" ? "?modo=register" : "";
      window.location.href = `login.html${query}`;
      return;
    }
    setAuthTab(tabName);
    authElements.modal.classList.add("open");
    authElements.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.setTimeout(() => {
      const firstInput = (isLoginActive() ? authElements.loginForm : authElements.registerForm)?.querySelector("input");
      firstInput?.focus();
    }, 100);
  }

  function closeAuthModal() {
    if (!authElements.modal) return;
    authElements.modal.classList.remove("open");
    authElements.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    setAuthMessage("");
  }

  function friendlyAuthError(error) {
    const messages = {
      "auth/invalid-credential": "E-mail ou senha incorretos. Tente novamente.",
      "auth/user-not-found": "Não encontramos uma conta com esse e-mail.",
      "auth/wrong-password": "E-mail ou senha incorretos. Tente novamente.",
      "auth/email-already-in-use": "Este e-mail já possui uma conta.",
      "auth/weak-password": "Use uma senha com pelo menos 6 caracteres.",
      "auth/popup-closed-by-user": "O login com Google foi cancelado.",
      "auth/popup-blocked": "Permita pop-ups para entrar com Google.",
      "auth/cancelled-popup-request": "A solicitação do Google foi cancelada. Tente novamente.",
      "auth/unauthorized-domain": "Adicione localhost e o domínio do site em Authentication > Authorized domains.",
      "auth/operation-not-allowed": "Ative o provider Google em Firebase Authentication > Sign-in method.",
      "auth/configuration-not-found": "Verifique o projeto e a configuração Web no Firebase.",
      "auth/internal-error": "O serviço de autenticação do Google falhou. Tente novamente.",
      "auth/too-many-requests": "Muitas tentativas. Aguarde um instante e tente novamente.",
      "auth/network-request-failed": "Não foi possível conectar ao Firebase. Verifique sua internet.",
    };
    return messages[error?.code] || "Não foi possível concluir a solicitação. Tente novamente.";
  }

  function initialsFor(user) {
    const source = user?.displayName || user?.email || "?";
    return source.split(/[\s.@_-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
  }

  function updateProfileButton(user) {
    const profileButton = document.querySelector(".profile-button");
    const avatar = profileButton?.querySelector(".avatar-small");
    if (!profileButton || !avatar) return;
    const label = profileButton.querySelector(".profile-label");

    if (user) {
      avatar.textContent = initialsFor(user);
      avatar.style.background = user.providerData?.[0]?.providerId === "google.com"
        ? "linear-gradient(145deg, #a8d1a5, #5e9d83)"
        : "linear-gradient(145deg, #f7bd86, #f36b50)";
      profileButton.setAttribute("data-authenticated", "true");
      profileButton.setAttribute("aria-label", `Perfil de ${user.displayName || user.email}`);
      profileButton.href = "perfil.html";
      if (label) label.textContent = "Perfil";
    } else {
      avatar.textContent = "JP";
      avatar.style.background = "linear-gradient(145deg, #f7bd86, #f36b50)";
      profileButton.setAttribute("data-authenticated", "false");
      profileButton.setAttribute("aria-label", "Entrar ou criar conta");
      profileButton.href = "login.html";
      if (label) label.textContent = "Entrar";
    }
  }

  function saveUserToDatabase(user, extraData = {}) {
    if (!firebaseDatabase || !user) return;
    const profile = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      provider: user.providerData?.[0]?.providerId || "firebase",
      lastLoginAt: new Date().toISOString(),
      ...extraData,
    };
    firebaseDatabase.ref(`users/${user.uid}`).set(profile).catch((error) => {
      console.warn("Não foi possível salvar o perfil no Realtime Database.", error);
    });
  }

  function initializeFirebase() {
    if (!window.firebase || !firebaseConfigReady) {
      setAuthMessage("Configure o Firebase em firebase-config.js para ativar o login.", "warning");
      return;
    }

    try {
      if (!window.firebase.apps?.length) {
        firebase.initializeApp(config);
      }
      if (window.firebase.analytics && config.measurementId) {
        try {
          window.firebase.analytics();
        } catch (analyticsError) {
          console.warn("Analytics não foi iniciado.", analyticsError);
        }
      }
      firebaseAuth = window.firebase.auth();
      try {
        firebaseDatabase = window.firebase.database();
      } catch (databaseError) {
        console.warn("Realtime Database não está disponível.", databaseError);
      }
      firebaseAuth.onAuthStateChanged((user) => {
        updateProfileButton(user);
        if (user) {
          saveUserToDatabase(user);
          if (authElements.modal) closeAuthModal();
          if (isAuthPage) window.setTimeout(() => { window.location.href = "perfil.html"; }, 350);
        }
      });
    } catch (error) {
      console.error(error);
      setAuthMessage("Não foi possível conectar ao Firebase. Confira a configuração.", "error");
    }
  }

  async function handleEmailAuth(event, mode) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const name = String(formData.get("name") || "").trim();

    if (!email || !password) {
      setAuthMessage("Preencha e-mail e senha para continuar.", "error");
      return;
    }
    if (!firebaseAuth || !firebaseConfigReady) {
      setAuthMessage("Configure o Firebase em firebase-config.js para ativar o login.", "warning");
      return;
    }

    setAuthLoading(true);
    setAuthMessage("");
    try {
      if (mode === "register") {
        await firebaseAuth.createUserWithEmailAndPassword(email, password);
        if (name) await firebaseAuth.updateProfile(firebaseAuth.currentUser, { displayName: name });
        saveUserToDatabase(firebaseAuth.currentUser, { displayName: name });
        setAuthMessage("Conta criada com sucesso!");
      } else {
        await firebaseAuth.signInWithEmailAndPassword(email, password);
        setAuthMessage("Bem-vinda de volta à Ritmo K.");
      }
      form.reset();
    } catch (error) {
      setAuthMessage(friendlyAuthError(error), "error");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleGoogleLogin(event) {
    if (!firebaseAuth || !firebaseConfigReady) {
      setAuthMessage("Configure o Firebase em firebase-config.js para ativar o Google.", "warning");
      return;
    }
    const isRegister = event?.currentTarget?.id === "google-register";
    setAuthLoading(true);
    setAuthMessage("");
    try {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await firebaseAuth.signInWithPopup(provider);
      const user = result.user || firebaseAuth.currentUser;
      if (user) {
        saveUserToDatabase(user, { displayName: user.displayName || "" });
        updateProfileButton(user);
        setAuthMessage(isRegister ? "Conta criada com Google." : "Login realizado com Google.");
        if (isAuthPage) window.setTimeout(() => { window.location.href = "perfil.html"; }, 350);
      }
    } catch (error) {
      console.error("Google Auth:", error);
      setAuthMessage(friendlyAuthError(error), "error");
    } finally {
      setAuthLoading(false);
    }
  }

  authElements.tabTriggers.forEach((tab) => {
    tab.addEventListener("click", () => setAuthTab(tab.dataset.authTab));
  });
  authElements.loginForm?.addEventListener("submit", (event) => handleEmailAuth(event, "login"));
  authElements.registerForm?.addEventListener("submit", (event) => handleEmailAuth(event, "register"));
  authElements.googleButtons.forEach((button) => {
    button.addEventListener("click", handleGoogleLogin);
  });

  document.querySelectorAll("[data-open-auth]").forEach((button) => {
    button.addEventListener("click", () => openAuthModal(button.dataset.authTab || "login"));
  });
  document.querySelectorAll("[data-account-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = firebaseAuth?.currentUser ? "perfil.html" : "login.html";
    });
  });
  document.querySelectorAll("[data-close-auth]").forEach((button) => button.addEventListener("click", closeAuthModal));
  if (authElements.modal) {
    authElements.modal.addEventListener("click", (event) => {
      if (event.target === authElements.modal) closeAuthModal();
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && authElements.modal?.classList.contains("open")) closeAuthModal();
  });

  if (isAuthPage) {
    const requestedMode = new URLSearchParams(window.location.search).get("modo");
    setAuthTab(requestedMode === "register" ? "register" : "login");
  }
  initializeFirebase();

  window.movaAuth = {
    open: openAuthModal,
    close: closeAuthModal,
    logout: async () => {
      if (firebaseAuth) await firebaseAuth.signOut();
      updateProfileButton(null);
      notify("Você saiu da sua conta.");
    },
    isReady: () => Boolean(firebaseAuth && firebaseConfigReady),
  };
})();
