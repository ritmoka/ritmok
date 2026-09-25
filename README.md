# Ritmo K

Plataforma de aulas de dança da **Ritmo K**, com dois módulos:

- **Módulo 1 — Sertanejo**
- **Módulo 2 — Vanera Universitária**

O projeto tem visual responsivo, player de vídeo, autenticação Firebase, perfil de usuário, plano anual e upload de aulas para o Firebase Storage.

## Plano anual

- Valor: **R$ 129,99 por ano**
- Acesso às aulas dos dois módulos
- Acesso por 12 meses
- Sem mensalidade

> O botão de assinatura exibe o plano. Para receber pagamento real, será necessário integrar um gateway como Mercado Pago, PagSeguro, Stripe ou PIX em um backend seguro.

## Tecnologias

- HTML, CSS e JavaScript
- Firebase Authentication
  - E-mail e senha
  - Google
- Firebase Realtime Database
- Firebase Storage
- Firebase Analytics
- GitHub
- Vercel

---

# Conectar à Vercel

## 1. Publicar o projeto no GitHub

O projeto já está configurado para o repositório:

```text
https://github.com/ritmoka/ritmok
```

Se fizer alterações, envie-as com Git:

```bash
git add .
git commit -m "Atualiza projeto Ritmo K"
git push
```

## 2. Criar um projeto na Vercel

1. Acesse [vercel.com](https://vercel.com).
2. Entre com sua conta.
3. Clique em **Add New** → **Project**.
4. Importe o repositório:

```text
ritmoka/ritmok
```

5. Nas configurações do projeto, use:

```text
Framework Preset: Other
Install Command: deixar em branco
Build Command: deixar em branco
Output Directory: .
```

6. Clique em **Deploy**.

A Vercel recognise o `index.html` na raiz e publica o site como um projeto estático.

## 3. Abrir o site

Depois do primeiro deploy, a Vercel mostrará um endereço parecido com:

```text
https://ritmok.vercel.app
```

As páginas principais serão:

```text
https://ritmok.vercel.app/
https://ritmok.vercel.app/login.html
https://ritmok.vercel.app/perfil.html
```

Se você usar um domínio próprio, substitua `ritmok.vercel.app` pelo domínio configurado na Vercel.

---

# Configurar o Firebase

A configuração Web já está no arquivo:

```text
firebase-config.js
```

Esse arquivo pode ser publicado no site. Ele contém identificadores públicos do aplicativo, não uma chave privada.

## Authentication

No [Firebase Console](https://console.firebase.google.com/), selecione o projeto `aula-94bbc` e abra:

```text
Authentication → Sign-in method
```

Ative:

- **Email/Password**
- **Google**

## Domínio da Vercel

Depois do deploy, abra:

```text
Authentication → Settings → Authorized domains
```

Adicione o domínio da Vercel, por exemplo:

```text
ritmok.vercel.app
```

Se você usar um domínio próprio, adicione esse domínio também.

O domínio `localhost` já é usado para desenvolvimento local e deve permanecer autorizado.

## Realtime Database

1. Abra **Realtime Database** no Firebase Console.
2. Crie o banco, se ainda não existir.
3. Abra a aba **Rules**.
4. Copie o conteúdo de:

```text
database.rules.json
```

5. Publique as regras.

O perfil do usuário é salvo em:

```text
users/{uid}
```

As aulas enviadas são registradas em:

```text
lessons/{uid}
```

## Firebase Storage

1. Abra **Storage** no Firebase Console.
2. Crie o Storage, se ainda não existir.
3. Copie o conteúdo de:

```text
storage.rules
```

4. Publique as regras.

Os vídeos são enviados para caminhos separados por módulo:

```text
videos/{uid}/sertanejo/
videos/{uid}/vanera-universitaria/
```

Aceitamos:

- MP4
- MOV
- WebM
- Até 2 GB por vídeo

O upload exige que o usuário esteja autenticado.

## Analytics

O Analytics é inicializado automaticamente quando o projeto possui `measurementId` na configuração. Não é necessário criar uma variável de ambiente para ele.

---

# Testar localmente

O Firebase e o login Google precisam de um endereço HTTP. Não abra os arquivos com duplo clique.

Na pasta do projeto, execute:

```bash
python -m http.server 5500
```

Ou, se o comando `python` não estiver disponível:

```bash
py -m http.server 5500
```

Mantenha o terminal aberto e acesse:

```text
http://localhost:5500/index.html
```

Para testar o upload:

1. Faça login em `http://localhost:5500/login.html`.
2. Volte para a página inicial.
3. Clique em **Enviar uma aula para a escola Ritmo K**.
4. Escolha Sertanejo ou Vanera Universitária.
5. Selecione um vídeo.
6. Preencha nome, professor e descrição.
7. Clique em **Enviar vídeo**.

---

# Segurança

O arquivo de service account do Firebase não deve ser enviado ao GitHub. Ele contém uma chave privada.

O `.gitignore` já protege arquivos como:

```text
*-firebase-adminsdk-*.json
*-firebase-adminsdk*.json
firebase-service-account*.json
```

Não coloque a service account em `index.html`, em `auth.js` ou em qualquer pasta pública.

---

# Estrutura principal

```text
index.html              Página inicial
login.html              Login e cadastro
perfil.html             Perfil do usuário
app.js                  Cards, filtros, player e navegação
auth.js                 Firebase Authentication
video-storage.js        Upload dos vídeos
video-storage.css       Estilos do upload
firebase-config.js      Configuração pública do Firebase
database.rules.json     Regras do Realtime Database
storage.rules            Regras do Firebase Storage
```

# Solução de problemas

## Site abre 404

Verifique se está usando:

```text
https://ritmok.vercel.app/index.html
```

Não use `file:///C:/...`.

## Google login não funciona

Adicione o domínio da Vercel em:

```text
Firebase Console → Authentication → Settings → Authorized domains
```

## Upload retorna `storage/unauthorized`

Confirme que:

1. O usuário está autenticado.
2. As regras de `storage.rules` foram publicadas.
3. O arquivo é MP4, MOV ou WebM.
4. O tamanho é menor que 2 GB.

## Firebase não conecta

Confirme que:

- `firebase-config.js` está na raiz do projeto.
- Os scripts do Firebase estão carregando em `index.html`, `login.html` e `perfil.html`.
- O projeto correto está selecionado no Firebase Console.
- O domínio usado está autorizado no Authentication.

# Publicação

Depois de alterar os arquivos, envie a versão atualizada ao GitHub:

```bash
git add .
git commit -m "Atualiza site da Ritmo K"
git push
```

A Vercel normalmente atualiza o site automaticamente após cada `push` na branch `main`.
