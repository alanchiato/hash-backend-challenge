# Descrição

Microserviço para consolidar o checkout.

## Funcionalidade

Ao acionar a rota /checkout, o serviço verificará a disponibilidade do produto escolhido,
tentará aplicar o desconto de cada produto através de estímulo na camada de descontos,
efetuara a totalização do pedido,
e incluirá um brinde caso elegível.

## Build

Use o docker e o docker-compose para a correta construção hash-backend-challenge. Certifique-se que as dependências poram instaladas corretamente

```bash
docker compose build
```

## Inicialização

Use o docker e o docker-compose para a correta inicialização do hash-backend-challenge.

```bash
docker compose up
```

## Testes

Para execução de testes e verificação de cobertura alcançada, execute o script.

```bash
npm run test
```

Caso a execução dos testes seja realizada fora do container, deve-se instalar todas as dependências previamente com o comando

```bash
npm i
```

## Request

A documentação da API pode ser aberta através da rota /docs, especificando cada campo e os possíveis cenários

## Documentos importantes

[express](https://expressjs.com/pt-br/)
[node-grpc-client](https://www.npmjs.com/package/node-grpc-client)
