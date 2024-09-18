### Tópico 1
Para a criação do workspace é necessário ter o NX instalado na sua máquina e ter o Expo CLI, pois isso irá facilitar o processo.

O primeiro passo é instalar o NX e o Expo CLI usando o comando:
```bash
pnpm install -g nx expo-cli
```

Após a instalação navegue pelo terminal até a pasta onde você tem os seus projetos e rode o comando que irá criar o workspace e já irá criar o seu primeiro aplicativo:
```bash
pnpm create nx-workspace@latest --preset=expo --appName=seu-nome-do-app
```

Durante a execução do programa, você deverá informar o nome do workspace, esse nome será usado como nome da pasta do projeto.
No final você terá a sua estrutura inicial criada e já poderá executar o projeto.

### Tópico 2
Após a criação do projeto e do workspace, você poderá executar o seu aplicativo com o seguinte comando:
```bash
pnpm nx start seu-nome-do-app
```

Para executar múltiplos aplicativos o melhor é, dentro do package.json, criar um script para encapsular a execução deles e mapear diferentes portas, caso necessário.
Exemplo:
```JSON
"scripts": {
    "start:all": "nx serve app1 --port=8080 & nx serve app2 --port=8081"
  }
```

No exemplo acima, você só precisará rodar um único comando para executar as duas aplicações de uma só vez.
### Tópico 3
A melhor maneira, e a recomendada, para se criar um novo aplicativo dentro do seu workspace é por meio do seguinte comando:
```bash
pnpm nx g @nx/expo:app novo-app
```

Lembrando que esse comando deve ser executado dentro da pasta do workspace.

Durante a execução do comando, será perguntado se você deseja que o novo aplicativo seja inserido dentro da pasta "apps", pasta padrão do NX onde os aplicativos estarão.
### Tópico 4
Para a inclusão de dependências externas, ou bibliotecas, ao nível de workspace, você deve estar na raiz do seu workspace e executar o comando:
```bash
pnpm add nome-do-pacote
```

Isso irá instalar o pacote no workspace e ele ficará disponível para todos os aplicativos.

Para utilizá-lo, basta importar nos arquivos em que você deseja usar, sem nenhuma configuração adicional.
### Tópico 5
Digamos que você deseje criar um “lib”, interna, para fazer isso você precisará rodar um comando do NX que irá criar e configurar o seu workspace para utilizá-la.

```bash
npx nx g @nx/expo:lib nome-da-lib --directory=pasta/desejada
```

Isso criará uma “lib” que poderá ser utilizada em todos os aplicativos do seu workspace.

Você também pode incluir componentes dentro da sua lib, que são partes de interface que podem ser reutilizadas. A principal diferença entre _components_ e _libs_ em um workspace Nx é a seguinte:
- **Componentes**: São partes reutilizáveis da interface do usuário que podem ser geradas em uma biblioteca. Eles são focados em apresentar dados e interagir com o usuário. Para gerar um novo componente em uma biblioteca, você pode usar o seguinte comando:
	```bash
	npx nx g @nx/expo:component your-component-name --project=your-lib-name --export
	```

- **Libs**: Representam bibliotecas que contêm serviços, componentes, utilitários, etc. Elas têm uma API pública bem definida, representada por um arquivo `index.ts`. Isso força os desenvolvedores a pensar sobre o que deve ser exposto e o que deve permanecer privado dentro da biblioteca. As libs são uma forma de organizar o código de maneira modular e coesa, permitindo uma separação clara de preocupações.

Em resumo, enquanto os componentes são elementos individuais da interface do usuário, as libs são coleções de componentes e lógica que podem ser reutilizadas em diferentes aplicativos dentro do workspace.


## Configuração do Storybook
### Passo a passo
1. Passo é instalar o plugin do storybook para o Nx:
```bash
nx add @nx/storybook
```

2. Agora é necessário startar a configuração do storybook dentro do Nx com o comando abaixo:
```bash
nx g @nx/storybook:init
```

3. O próximo passo é a criação dos arquivos de configuração para o projeto específico, nesta etapa você será questionado sobre qual framework quer usar, escolha @storybook/react-webpack5 para funcionar com nossa aplicação expo:
```bash
nx g @nx/storybook:configuration <nome_do_app>
```

4. Após o último comando, seu aplicativo deve ter uma pasta .storybook com alguns arquivos de configuração. Se ela existir, você já pode criar uma story dentro do aplicativo que você configurou, como o exemplo abaixo:
```typescript
import Login from './index';

export default {
  title: 'Login',
  component: Login,

  argTypes: {
  },
};

export const Default = () => <Login />
```

5. Com tudo pronto, basta rodar o comando abaixo para executar o storybook:
```bash
nx run <nome_do_app>:storybook
```

Esses 5 passos configuram o storybook para um aplicativo dentro do Nx workspace.

### Como importar as stories dos outros aplicativos para dentro do sofisapro

O primeiro passo é realizar a configuração do storybook para o aplicativo sofisapro com o comando listado no passo 3.
Isso irá criar a pasta .storybook e configurará o projeto para executar o storybook.
Então você deve acessar o arquivo main.ts dentro da pasta .storybook do sofisapro e dentro do array de stories, você deve incluir uma nova string que irá referenciar todas as stories dentro dos outros apps:
```typescript
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../src/app/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../login/src/app/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@nx/react/plugins/storybook',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-native$': 'react-native-web',
      };
      config.resolve.extensions = [
        '.web.tsx',
        '.web.ts',
        '.web.jsx',
        '.web.js',
        ...(config.resolve.extensions ?? []),
      ];
    }
    return config;
  },
};

export default config;
```

No exemplo acima, a linha incluída foi a de número 6
```typescript
	 '../../login/src/app/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
```

Fazendo isso, ao executar o comando nx run sofisapro:storybook você verá todas as stories do sofisapro e do aplicativo que você referenciou no passo anterior.

