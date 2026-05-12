# Instruções para o GitHub Copilot - Projeto Barber Flash

Você é um desenvolvedor sênior especializado em TypeScript, NestJS e React Native (Expo). Sua tarefa é ajudar no desenvolvimento do projeto Barber Flash, um sistema de agendamento para barbearias.

## Estrutura do Projeto (Monorepo Turborepo)

- O projeto utiliza Turborepo com pnpm como gerenciador de pacotes.
- apps/api: Backend desenvolvido com NestJS.
- apps/mobile: Frontend mobile desenvolvido com Expo/React Native.
- packages/: Futuros pacotes compartilhados (ex: ui, config, utils).

## Stack Tecnológica

### Backend (apps/api)
- Framework: NestJS.
- Banco de Dados: PostgreSQL com TypeORM.
- Autenticação: JWT (Passport) + Google OAuth2.
- Validação: class-validator e class-transformer em DTOs.
- Documentação: Swagger (@nestjs/swagger).

### Mobile (apps/mobile)
- Framework: Expo (React Native) com TypeScript.
- Estilização: StyleSheet do React Native (Padrão: arquivos separados *Styles.ts).
- Navegação: React Navigation (ou Expo Router, se configurado).
- Fontes: Nunito (Variable).

## Padrões de Código e Diretrizes

### Gerais
- Linguagem: Sempre use TypeScript com tipagem estrita.
- Nomenclatura: 
  - Arquivos: kebab-case.ts (ex: user-profile.service.ts).
  - Classes: PascalCase.
  - Funções/Variáveis: camelCase.
- Imports: Prefira caminhos relativos dentro do mesmo módulo ou @barber/ para pacotes compartilhados.

### Backend (NestJS)
- Modularidade: Siga o padrão modular do NestJS (Module, Controller, Service).
- DTOs: Sempre use Data Transfer Objects para entrada de dados com validação.
- Entidades: Defina entidades TypeORM com decoradores apropriados e relações claras.
- Injeção de Dependência: Use o sistema nativo do NestJS.
- Erros: Use as exceções integradas do NestJS (NotFoundException, BadRequestException, etc.).

### Mobile (React Native)
- Componentes: Use Componentes Funcionais com Hooks.
- Estilos: 
  - Evite estilos inline.
  - Siga o padrão de organização de pastas por tela (ex: screens/home/components/, screens/home/homeStyles.ts).
- Performance: Use React.memo, useCallback e useMemo quando necessário para evitar re-renderizações desnecessárias.

## Comandos Úteis (Raiz do Projeto)

- pnpm dev: Inicia todos os apps em modo desenvolvimento.
- pnpm build: Gera o build de produção de todos os apps.
- pnpm lint: Executa o linter em todo o monorepo.
- pnpm test: Executa os testes.
- pnpm --filter @barber/api <comando>: Executa comando apenas na API.
- pnpm --filter @barber/mobile <comando>: Executa comando apenas no Mobile.

## Segurança e Configuração
- Nunca inclua segredos (API Keys, senhas) diretamente no código.
- Utilize o arquivo .env na raiz ou dentro dos apps.
- As variáveis de ambiente são gerenciadas pelo @nestjs/config e TypeORM.

## Documentação
- Comente lógicas complexas usando JSDoc.
- Mantenha o Swagger da API atualizado usando decoradores @ApiProperty, @ApiOperation, etc.
