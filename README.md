<p align="center">
  <a href="#sobre">Bank API</a> |
  <a href="#tecnologia">Tecnologias</a> |
  <a href="#features">Features</a> |
  <a href="#back">Rodando o back-end</a> |
  <a href="#documentacao">Documentação</a> |
  <a href="#ngrok">Usando Ngrok</a>
  <a href="#testes">Testes</a> |
  <a href="#desenvolvedores">Desenvolvedores</a> |
  <a href="#voltar">Voltar para o topo ⬆️</a>
</p>

<h2 id="sobre"> Bank API</h2> |


Este projeto é uma API desenvolvida em Nest, seguindo a arquitetura Clean Architecture, para gerenciar operações bancárias básicas como depósitos, saques, transferências e consulta de saldo.


<h2 id="tecnologia">🛠 Tecnologias</h2> |

- [Nest.js](https://nestjs.com): Framework para construir aplicações eficientes e escaláveis usando Node.js.
- [Docker](https://www.docker.com): Ferramenta de conteinerização para distribuir e rodar aplicações em contêineres.
- [Ngrok](https://ngrok.com): Ferramenta para criar túneis HTTP e expor seu servidor localmente a partir de uma URL pública.


<h2 id="features">🚀 Features</h2> |

A API possui endpoints para para realizar as transações de depósitos, saques e transferências entre contas

- [x] Depósito em contas bancárias
- [x] Saque de contas bancárias
- [x] Transferências entre contas.
- [x] Consulta de saldo de contas.
- [x] Testes automatizados.


<h2 id="back"> 🚀 Rodando o back-end</h2> |

#### Clonando o Repositório
Primeiro, clone o repositório do projeto:

```bash
git clone https://github.com/deduardolima/nestjs-bank-api.git
cd bank-api

```
#### Construindo e Subindo o Container
Este projeto usa Docker para simplificar a execução. Para construir a imagem e subir o container, use:

```bash
docker-compose up --build

```
Este comando irá:

- Construir a imagem Docker para o projeto.
- Subir o container na porta 3000.

#### Rodando Migrations
Depois de subir o container, execute as migrações para preparar o banco de dados:

```bash
docker-compose exec app npm run typeorm migration:run
```

<h2 id="documentacao">📖 Documentação da API</h2> |

A documentação da API está disponível via Swagger. Após iniciar o servidor, acesse:

```bash
http://localhost:3000/docs

```

<h2 id="ngrok">🌐 Usando Ngrok</h2> |

Para expor a API localmente utilizando Ngrok, siga os passos abaixo:

1. **Instale o Ngrok**:

   Baixe e instale o Ngrok diretamente do site oficial:

   [Baixar Ngrok](https://ngrok.com/download)

   Siga as instruções de instalação de acordo com seu sistema operacional.

2. **Inicie o Ngrok para expor a porta 3000**:

   Após instalar o Ngrok, inicie-o com o seguinte comando:

   ```bash
   ngrok http 3000
   ```

3.  Copie o link gerado pelo Ngrok e utilize-o para acessar a API de qualquer lugar.


<h2 id="testes">🧪 Rodando Testes</h2> |

Este projeto possui testes unitários. Para rodar os testes:

```
npm run test
```

Ou acesse a API para testar as funcionalidades:

```bash
https://ipkiss.pragmazero.com/
```

Após executar os testes, você terá seguinte resultado :
| Testes |
|-------|

| <img src="https://github.com/user-attachments/assets/c73c1460-a3da-48cb-a015-584edbbb0cdd" alt="Testes" width="300"> |

<h2 id="desenvolvedores">👨‍💻 Desenvolvedores</h2> |
<table>         
  <tr>
    <td align="center">
      <a href="https://github.com/deduardolima">
        <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/98969787?v=4" width="100px;" alt="Imagem profile Diego Lima desenvolvedor"/>
        <br />
        <sub><b> Diego Lima</b></sub>
    </td>
  </tr>
</table>

<h2 id="voltar">Voltar para o topo</h2>
