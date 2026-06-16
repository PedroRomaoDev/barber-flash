# Flash Barber 💈

Projeto fullstack (Monorepo) para o aplicativo de agendamentos **Flash Barber**. O repositório contém a API em NestJS (`apps/api`) e o aplicativo Mobile em React Native/Expo (`apps/mobile`).

> [!IMPORTANT]
> **Branch Principal:** Certifique-se de estar na branch `16-06` para rodar a versão mais atualizada deste projeto.
> ```bash
> git checkout 16-06
> ```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/pt/installation)
- [Docker](https://www.docker.com/) e Docker Compose
- App Expo Go no celular ou Emulador configurado

---

### 1. Instalar as Dependências

Na raiz do projeto (pasta `barber-flash`), instale as dependências de todos os apps usando o pnpm:

```bash
pnpm install
```

---

### 2. Subir o Banco de Dados (Docker)

O projeto usa o PostgreSQL. Para subir o banco via Docker, rode na raiz do projeto:

```bash
docker compose up -d
```
Isso deixará o banco de dados rodando em segundo plano.

---

### 3. Rodar a API (Backend)

Abra um terminal e acesse a pasta da API:

```bash
cd apps/api
```

Certifique-se de que o arquivo `.env` está configurado corretamente. Em seguida, inicie o servidor em modo de desenvolvimento:

```bash
pnpm dev
```
A API estará rodando em `http://localhost:3000`.

---

### 4. Popular o Banco de Dados (Seed)

Para popular o banco com dados iniciais de teste (Barbearias, Barbeiros, Serviços, etc.), abra outro terminal na pasta da API (`apps/api`) e rode o comando de seed:

```bash
pnpm seed
```
*(Importante: a API e o banco de dados já devem estar rodando para que o seed funcione corretamente).*

---

### 5. Rodar o App Mobile (Frontend)

Abra outro terminal e acesse a pasta do mobile:

```bash
cd apps/mobile
```

Verifique o `.env` do mobile (o `EXPO_PUBLIC_API_URL` geralmente aponta para seu IP local caso vá testar no Expo Go via Wi-Fi). Então, inicie o Expo:

```bash
npx expo start -c
```
- Pressione `a` para abrir no Android (se tiver um emulador rodando).
- Pressione `i` para abrir no iOS.
- Ou escaneie o QRCode gerado com o aplicativo **Expo Go** no seu celular físico.

---

## Estrutura do Monorepo

- `apps/api`: Servidor backend rodando **NestJS** + **TypeORM**.
- `apps/mobile`: Aplicativo mobile rodando **React Native** + **Expo**.
- Usamos **TurboRepo** e **pnpm workspaces** para o gerenciamento do projeto.

