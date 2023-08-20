## Requisitos

- NodeJS
- Docker
- Docker Compose

## Instalação

Instale os pacotes:

```bash
$ npm install
```

Crie o container do banco de dados:

```bash
$ docker-compose up -d --build
```

## Comandos

Adicionar um host:

```bash
$ node index.js add [host]
```

Importar arquivo contendo os hosts:

```bash
$ node index.js import [file]
```

Exibir hosts armazenados:

```bash
$ node index.js show
```

Exibir hosts armazenados (incluindo os que não estão ativos):

```bash
$ node index.js show --all
```

Exibir resumo:

```bash
$ node index.js resume
```

Checar hosts:

```bash
$ node index.js check
```