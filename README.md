# Ritmo K — aulas de sertanejo e vanera universitária

A plataforma Ritmo K oferece dois módulos de dança: **Sertanejo** e **Vanera Universitária**, com aulas para iniciantes e dançaros intermediários.

Plano anual: **R$ 129,99 por ano** para assistir às aulas dos dois módulos.

## Firebase

O projeto inclui uma tela de login/cadastro com:

- login por e-mail e senha;
- cadastro por e-mail e senha;
- login/cadastro com Google;
- perfil básico salvo no Realtime Database em `users/{uid}`;
- upload de vídeos para o Firebase Storage, separados por módulo.

### Configuração

1. No Firebase Console, abra **Authentication** e habilite:
   - Email/Password;
   - Google.
2. Crie um Realtime Database e um Firebase Storage.
3. Em **Project settings → Your apps**, adicione um Web App e copie a configuração para `firebase-config.js`.
4. Publique as regras de segurança:
   - Realtime Database: `database.rules.json`;
   - Storage: `storage.rules` (Firebase Console → Storage → Rules);
   - Firestore: `firestore.rules.json` (se usar Firestore futuramente).
5. A configuração Web já está preenchida em `firebase-config.js`; não é necessário usar a service account para autenticar pelo navegador.
6. No upload, o arquivo é enviado para `videos/{uid}/{modulo}/` no Storage e os dados da aula ficam em `lessons/{uid}`.

O arquivo `aula-94bbc-firebase-adminsdk-*.json` é uma **service account**. Ele contém credencial privada e não deve ser colocado no `index.html`, em `auth.js` ou em qualquer arquivo público. O código atual usa o Firebase Web SDK e não precisa da service account para login no navegador.

> O arquivo de service account não foi incluído no site. Se ele estiver na pasta do projeto, mantenha-o fora de qualquer pasta publicada e não compartilhe o conteúdo dele.

### Abrir

O erro `ERR_CONNECTION_REFUSED` significa apenas que o servidor local não está rodando. Abra o PowerShell **dentro da pasta do projeto** e execute:

```bash
python -m http.server 5500
```

Mantenha essa janela aberta. Depois acesse:

- `http://localhost:5500/index.html`
- `http://localhost:5500/login.html`
- `http://localhost:5500/perfil.html`

Se `python` não estiver disponível, tente:

```bash
py -m http.server 5500
```

Não abra o HTML com duplo clique e não use `file://`; o Firebase e o login Google precisam de um endereço HTTP local.
