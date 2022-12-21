## Descrição

Sistema de conversão de moedas (BRL, USD, EUR, JPY) baseado em suas cotações atuais. Além de realizar conversões entre moedas, é armazenado as transações realizadas que são vinculados a usuários cadastrados no banco de dados.

O sistema foi criado com programação WEB, foi utilizado a linguagem Typescript, e os frameworks Node.js com NestJS e roda na porta 3000. Foi utilizado o banco de dados PostgreSQL para armazenamento dos dados e a bibliotecade ORM TypeORM. Todos os endpoints foram documentados usando Swagger, para acessar a documentação, acesse:

```bash
http://localhost:3000/api
```

## Instalação banco de dados

Instale o banco de dados PostgreSQL em sua máquina, após a instalação realize a configuração do arquivo .env na raíz do projeto. Ele é responsável pela configuração de conexão com o banco de dados.

```bash
DB_HOST='localhost'
DB_PORT=5432
DB_USERNAME='NOME DE USUÁRIO'
DB_PASSWORD='SUA SENHA'
DB_NAME='NOME DO DATABASE'
```

## Instalação app

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Testes

```bash
# unit tests
$ npm run test
```

## Criador

Douglas Schuch
