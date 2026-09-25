/*
 * Upload de aulas da Ritmo K no Firebase Storage.
 * A interface é carregada somente no index.html.
 */
(function () {
  const form = document.querySelector("#upload-form");
  const fileInput = document.querySelector("#video-upload");
  const moduleSelect = document.querySelector("#video-module");
  const titleInput = document.querySelector("#video-title");
  const descriptionInput = document.querySelector("#video-description");
  const instructorInput = document.querySelector("#video-instructor");
  const progressBar = document.querySelector("#upload-progress-bar");
  const progressText = document.querySelector("#upload-progress-text");
  const uploadButton = document.querySelector("#upload-submit");
  const uploadSuccess = document.querySelector("#upload-success");

  if (!form || !fileInput) return;

  const storageRoot = "sb_publishable_MDrdfXwCzFYstjWo_k4gLQ_0MxL8Dv7";
  const moduleFolders = {
    "sertanejo": "sertanejo",
    "vanera-universitaria": "vanera-universitaria",
  };

  function setProgress(percent, label) {
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.textContent = label;
  }

  function getFirebaseServices() {
    if (!window.firebase?.auth || !window.firebase?.storage || !window.firebase?.database) {
      throw new Error("Firebase Storage não está disponível. Verifique os scripts e a configuração.");
    }
    return {
      auth: window.firebase.auth(),
      storage: window.firebase.storage(),
      database: window.firebase.database(),
    };
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
  }

  function setLoading(loading) {
    if (!uploadButton) return;
    uploadButton.disabled = loading;
    uploadButton.innerHTML = loading ? "Enviando..." : "Enviar vídeo <span>→</span>";
  }

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const drop = fileInput.closest(".file-drop");
    const name = drop?.querySelector("strong");
    const detail = drop?.querySelector("small");
    if (name) name.textContent = file.name;
    if (detail) detail.textContent = formatBytes(file.size);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = fileInput.files?.[0];
    const moduleId = moduleSelect?.value;
    const title = titleInput?.value.trim();
    const description = descriptionInput?.value.trim() || "Aula da Ritmo K.";
    const instructor = instructorInput?.value.trim() || window.firebase?.auth?.currentUser?.displayName || "Professor Ritmo K";

    if (!file) {
      window.dispatchEvent(new CustomEvent("ritmo-toast", { detail: "Escolha um vídeo para enviar." }));
      return;
    }
    if (!file.type.startsWith("video/")) {
      window.dispatchEvent(new CustomEvent("ritmo-toast", { detail: "O arquivo precisa ser um vídeo MP4, MOV ou WebM." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024 * 1024) {
      window.dispatchEvent(new CustomEvent("ritmo-toast", { detail: "O vídeo precisa ter no máximo 2 GB." }));
      return;
    }
    if (!title || !moduleId) {
      window.dispatchEvent(new CustomEvent("ritmo-toast", { detail: "Preencha o módulo e o nome da aula." }));
      return;
    }

    let services;
    try {
      services = getFirebaseServices();
    } catch (error) {
      window.dispatchEvent(new CustomEvent("ritmo-toast", { detail: error.message }));
      return;
    }

    const user = services.auth.currentUser;
    if (!user) {
      window.dispatchEvent(new CustomEvent("ritmo-toast", { detail: "Entre na sua conta para enviar uma aula." }));
      return;
    }

    const folder = moduleFolders[moduleId] || moduleId;
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storagePath = `${storageRoot}/${user.uid}/${folder}/${Date.now()}-${safeName}`;
    const storageRef = services.storage.ref(storagePath);
    const databaseRef = services.database.ref(`lessons/${user.uid}`).push();

    setLoading(true);
    if (progressBar) progressBar.parentElement.hidden = false;
    setProgress(0, "Preparando upload...");

    try {
      const uploadTask = storageRef.put(file, { contentType: file.type, customMetadata: { module: moduleId, title } });
      uploadTask.on("state_changed", (snapshot) => {
        const percent = snapshot.totalBytes ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) : 0;
        setProgress(percent, `Enviando... ${percent}%`);
      }, (error) => {
        console.error("Upload cancelado:", error);
      });

      await uploadTask;
      const downloadURL = await storageRef.getDownloadURL();
      await databaseRef.set({
        title,
        description,
        instructor,
        module: moduleId,
        moduleName: moduleId === "sertanejo" ? "Sertanejo" : "Vanera Universitária",
        fileName: file.name,
        contentType: file.type,
        size: file.size,
        storagePath,
        downloadURL,
        uploadedAt: new Date().toISOString(),
        uid: user.uid,
        status: "published",
      });

      form.hidden = true;
      if (uploadSuccess) uploadSuccess.hidden = false;
      setProgress(100, "Vídeo enviado com sucesso.");
    } catch (error) {
      console.error("Falha no upload:", error);
      const messages = {
        "storage/unauthorized": "Você não tem permissão para enviar vídeos.",
        "storage/retry-limit-exceeded": "A conexão foi interrompida. Tente novamente.",
        "storage/canceled": "O envio foi cancelado.",
      };
      window.dispatchEvent(new CustomEvent("ritmo-toast", { detail: messages[error?.code] || "Não foi possível enviar o vídeo. Tente novamente." }));
      setProgress(0, "O envio não foi concluído.");
    } finally {
      setLoading(false);
    }
  });
})();
