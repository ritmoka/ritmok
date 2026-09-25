/* Perfil conectado ao Firebase Authentication. */
(function () {
  const firebaseReady = Boolean(window.firebase && window.movaAuth?.isReady());

  function initialsFor(user) {
    const source = user?.displayName || user?.email || "?";
    return source.split(/[\s.@_-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
  }

  function formatDate(value) {
    if (!value) return "Hoje";
    try {
      return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(value));
    } catch {
      return "Agora";
    }
  }

  function renderUser(user) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    const name = user.displayName || user.email?.split("@")[0] || "Dançarina";
    document.querySelector("#profile-name").textContent = name;
    document.querySelector("#profile-email").textContent = user.email || "Conta conectada";
    document.querySelector("#profile-avatar").textContent = initialsFor(user);
    document.querySelector("#detail-provider").textContent = user.providerData?.[0]?.providerId === "google.com" ? "Google" : "E-mail e senha";
    document.querySelector("#detail-created").textContent = formatDate(user.metadata?.creationTime);
    document.title = `${name} — meu perfil | Ritmo K.`;
  }

  if (firebaseReady) {
    const auth = window.firebase.auth();
    auth.onAuthStateChanged(renderUser);
  } else {
    window.setTimeout(() => {
      if (!window.firebase) {
        window.location.href = "login.html";
        return;
      }
      const auth = window.firebase.auth();
      auth.onAuthStateChanged(renderUser);
    }, 100);
  }

  document.querySelector("#logout-button")?.addEventListener("click", async () => {
    if (window.movaAuth?.logout) {
      await window.movaAuth.logout();
    } else {
      await window.firebase.auth().signOut();
    }
    window.location.href = "login.html";
  });
})();
