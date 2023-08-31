# Immersive-YouTube
Um extensão voltada para o Youtube que aplica um efeito ambiente ao Youtube, alterando as cores principais e adicionando brilho ao seu vídeo.

## Instalação
Trata-se de uma extensão de navegador. Para proceder à instalação, faça o download do arquivo denominado ```immersiveYoutube.zip```. Em seguida, escolha uma pasta de sua preferência e efetue a extração do referido arquivo nessa localização. Após a conclusão desse processo, acesse a seção de extensões de seu navegador. Localize e habilite a opção **"Modo de Desenvolvedor"**. Posteriormente, clique em "Carregar sem Compactação" e selecione a pasta onde a extensão foi extraída. Feito isso, é recomendável desativar o "Modo de Desenvolvedor". Com essas etapas cumpridas, o processo estará completo. Abra o navegador e acesse o YouTube para visualizar os resultados.

## Adições
- Brilho em torno do video
- Alteração das cores do Youtube
- A alteração da saturação sincronizado com o video (beta)

## Exemplo
![image](https://github.com/Astro815/Immersive-YouTube/assets/103153597/267ab755-ef2b-4592-be44-b5ee1af38b1e)


## Brilho do video
Ao brilho do video utilizei um ```<canvas id="astry-cvglow">``` em Html, e o parametro ```filter``` em Css para realizar o efeito no video.

1º Passo foi estabilizar o **canvas** na tela com os seguintes codigos:

#### style.css
```css
background-color: transparent;
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    user-select: none;
    pointer-events: none;
    z-index: 99999999;
}
```

#### content.js
```js
let reduce = 20;
cvGlow.width = Math.round(window.innerWidth / reduce);
cvGlow.height = Math.round(window.innerHeight / reduce);

let infVid = vid.getBoundingClientRect();
let wd = (infVid.right - infVid.x) / reduce;
let hg = (infVid.bottom - infVid.y) / reduce;
let px = infVid.x / reduce;
let py = infVid.y / reduce;
```
```let reduce = 20;``` é para a redução de quantidade de pixel para serem renderizados no brilho, dividindo do tamanho da tela, assim resultando em mais velocidade na renderização.
Assim a tela que deveria renderizar **1366** pixels, pela redução de 20x menor, apenas renderizará **68** pixels.

### Processo de Filtro
![image](https://github.com/Astro815/Immersive-YouTube/assets/103153597/9fcebf1a-748c-4794-acf2-8794a13691ff)<br>
Esse processo é feito em Css para que o efeito do brilho apenas de o efeito "Glow" em partes mais brilhantes da imagem.

### Resultado
![image](https://github.com/Astro815/Immersive-YouTube/assets/103153597/8d11ac6e-d2b3-4e22-a022-ced83b55fc22)
