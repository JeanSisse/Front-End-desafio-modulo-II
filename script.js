const body = document.querySelector('body');
const movies = document.querySelector('.movies');
const subtitle = document.querySelector('.subtitle');

const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

const btnTheme = document.querySelector('.btn-theme');

const boxBuscarFilmes = document.querySelector('.input');

const highlightInfo = document.querySelector('.highlight__info');
const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightGenre = document.querySelector('.highlight__genres');
const highlightRating = document.querySelector('.highlight__rating');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightVideoLink = document.querySelector('.highlight__video-link');
const highlightDescription = document.querySelector('.highlight__description');
const highlightGenreLaunch = document.querySelector('.highlight__genre-launch');

const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImage = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalGenre = document.querySelector('.modal__genres');

const primeiroEndPoint = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false';
const endPointGeral = 'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR';
const endPointVideo = 'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR';
const endPointDeBusca = 'https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=';

// VARIAVEIS AUXILIARES
const limiteDeFilmesNaTela = 5;
const posicaoInicialDoConjuntoDeFilmeASerCarregado = 4;
let arrayFilmes;
let ultimaPosicaoQuintoFilmeNaTela;


// INÍCIO CSS DINÂMICO

const temaInicial = localStorage.getItem('tema');

btnTheme.src = temaInicial === 'claro' ? './assets/light-mode.svg' : './assets/dark-mode.svg';

btnPrev.src = temaInicial === 'claro'? "./assets/seta-esquerda-preta.svg" : "./assets/seta-esquerda-branca.svg";
btnNext.src = temaInicial === 'claro'? "./assets/seta-direita-preta.svg" : "./assets/seta-direita-branca.svg";

body.style.setProperty('--cor-branca', temaInicial === 'claro' ? '#ffffff' : '#242424');
body.style.setProperty('--cor-preta', temaInicial === 'claro' ? '#242424' : '#ffffff');

highlightInfo.style.setProperty('--box-shadow-para-claro', temaInicial === 'claro' ? '#00000026' : '#ffffff26');
highlightInfo.style.setProperty('--box-shadow-para-escuro', temaInicial === 'claro' ? '#ffffff26' : '#00000026');

highlightGenreLaunch.style.setProperty('--cor-highlight-genresLaunch-para-claro', temaInicial === 'claro' ? '#000000b3' : '#ffffffb3');
highlightGenreLaunch.style.setProperty('--cor-highlight-genresLaunch-para-escuro', temaInicial === 'claro' ? '#ffffffb3' : '#000000b3');

btnTheme.addEventListener('click', function(){

    btnTheme.src = btnTheme.src.includes('light-mode.svg') ? "./assets/dark-mode.svg" : "./assets/light-mode.svg";

    btnPrev.src = btnPrev.src.includes('seta-esquerda-preta.svg') ? "./assets/seta-esquerda-branca.svg" : "./assets/seta-esquerda-preta.svg";
    btnNext.src = btnNext.src.includes('seta-direita-preta.svg') ? "./assets/seta-direita-branca.svg" : "./assets/seta-direita-preta.svg";
    
    localStorage.setItem('tema', temaInicial === 'claro' ? 'escuro' : 'claro');
    
    const novoFundo = body.style.getPropertyValue('--cor-branca') === '#242424' ? '#ffffff' : '#242424';
    body.style.setProperty('--cor-branca', novoFundo);

    const novoCorTexto = body.style.getPropertyValue('--cor-preta') === '#ffffff' ? '#242424' : '#ffffff';
    body.style.setProperty('--cor-preta', novoCorTexto);

    const novoCorGenre = highlightGenreLaunch.style.getPropertyValue('--cor-highlight-genresLaunch-para-claro') === '#ffffffb3' ? '#000000b3' : '#ffffffb3';
    highlightGenreLaunch.style.setProperty('--cor-highlight-genresLaunch-para-claro', novoCorGenre);

    const novoHighlightDescBackground = highlightInfo.style.getPropertyValue('--box-shadow-para-claro') === '#00000026' ? '#ffffff26' : '#00000026';
    highlightInfo.style.setProperty('--box-shadow-para-claro', novoHighlightDescBackground);
});

// FIM CSS DINÂMICO


function abrirModal() {
    modal.classList.remove('hidden');
}

function fecharModal() {
    modal.classList.add('hidden');
}

function criarElementoHtml(elemento, valor){
    const element = document.createElement(elemento);
    if(elemento === 'img'){
        element.src = valor;
    } else {
        element.textContent = valor;
    }
    
    return element;
}

function adicionarEventClickListener(divMovie, index) {
    divMovie.addEventListener('click', (event) => {
        const idDoFilme = arrayFilmes[index].id;
        
        const language = '?language=pt-BR';
        const endPointDeBuscaPorId = 'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/'

        fetch(`${endPointDeBuscaPorId}${idDoFilme}${language}`).then((promessa) => {
            if (!promessa.ok){
                console.log("Erro, id do filme não encontrado ou inválido.");
                return;
            }

            const corpoDaPromessa = promessa.json();
            corpoDaPromessa.then((corpo) => {
                const arrayGenres = corpo.genres;

                modalTitle.textContent = corpo.title;
                modalImage.src = corpo.poster_path;
                modalDescription.textContent = corpo.overview;
                
                modalGenre.textContent = '';
                for (let genre of arrayGenres) {
                    const span = criarElementoHtml('span', genre.name);
                    modalGenre.append(span);
                }

                modalAverage.textContent = '';
                const span = criarElementoHtml('span', corpo.vote_average);
                modalAverage.append(span);
            });
        });

        abrirModal();
        
    });
}

modal.addEventListener('click', function() {
    fecharModal();
});

modalClose.addEventListener('click', function() {
    fecharModal();
});

function popularMovies(index, arrayFilmes) {
    
    ultimaPosicaoQuintoFilmeNaTela = index;

    const divMovie = document.createElement('div');
    divMovie.className = 'movie';
    divMovie.style.backgroundImage = `url(${arrayFilmes[index].poster_path})`

    const divMovieInfo = document.createElement('div');
    divMovieInfo.className = 'movie__info';

    const spanMoveTitle = document.createElement('span');
    spanMoveTitle.className = 'movie__title';
    spanMoveTitle.textContent = arrayFilmes[index].title;

    const spanMoveRating = document.createElement('span');
    spanMoveRating.className = 'movie__rating';

    const spanVoteAverage = criarElementoHtml('span', arrayFilmes[index].vote_average);

    const imgStar = criarElementoHtml('img', './assets/estrela.svg');
    spanMoveRating.append(imgStar, spanVoteAverage);

    divMovieInfo.append(spanMoveTitle, spanMoveRating);
    divMovie.append(divMovieInfo);
    
    adicionarEventClickListener(divMovie, index);
    
    movies.append(divMovie);
}

function carregarFilmeDoDia() {
    fetch(endPointGeral).then((promessaEndPointGeral) => {

        if (!promessaEndPointGeral.ok) {
            console.log("Erro na resposta do filme do dia.");
            return;
        }

        const corpoPromessaEndPointGeral = promessaEndPointGeral.json();

        corpoPromessaEndPointGeral.then((corpoEndPointGeral) => {
            highlightVideo.style.backgroundImage = `url(${corpoEndPointGeral.backdrop_path})`;
            highlightTitle.textContent = corpoEndPointGeral.title;
            highlightRating.textContent = corpoEndPointGeral.vote_average;

            const arrayGenres = corpoEndPointGeral.genres;
            const ArrayGenresName = [];

            for (let objGenre of arrayGenres) {
                ArrayGenresName.push(objGenre.name);
            }

            highlightGenre.textContent = `${ArrayGenresName}`;
            highlightLaunch.textContent = corpoEndPointGeral.release_date;
            highlightDescription.textContent = corpoEndPointGeral.overview;
        });
    });
}

function carregarVideoNaPagina() {
    fetch(endPointVideo).then((promessaEndPointVideo) =>  {

        if (!promessaEndPointVideo.ok) {
            console.log("Erro na resposta do video.");
            return;
        }

        const corpoPromessaEndPointVideo = promessaEndPointVideo.json();

        corpoPromessaEndPointVideo.then((corpoEndPointVideo) => {
            const resultadoVideo = corpoEndPointVideo.results;
            highlightVideoLink.href = `https://www.youtube.com/watch?v=${resultadoVideo[0].key}`
        });
    });
}

function carregarFilmesNapagina() {
    fetch(primeiroEndPoint).then((promessa) => {

        if (!promessa.ok) {
            console.log("Erro no carregamento dos filmes.");
            return;
        }

        const corpoPromessa = promessa.json();

        corpoPromessa.then((corpo) => {
            arrayFilmes = corpo.results;
            movies.textContent = '';
            
            for (let filme = 0; filme < 5; filme++) {
                popularMovies(filme, arrayFilmes);
            }
        });

        carregarFilmeDoDia();
        carregarVideoNaPagina();        
    });
}

carregarFilmesNapagina();

boxBuscarFilmes.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter'){
        return;
    }

    const filmePesquisado = boxBuscarFilmes.value;

    if (!filmePesquisado){
        carregarFilmesNapagina();
        return;
    }
    fetch(`${endPointDeBusca}${filmePesquisado}`).then((promessaDaBusca) => {
        
        if (!promessaDaBusca.ok) {
            console.log("Erro na resposta da busca.");
            return;
        }

        
        const corpoPromessaBusca = promessaDaBusca.json();
        
        corpoPromessaBusca.then((corpoDaRespostaDaBusca) => {
            arrayFilmes = corpoDaRespostaDaBusca.results;
            
            let limite = arrayFilmes.length > 5 ? 4 : (arrayFilmes.length - 1);

            movies.textContent = '';
            for(let filme = 0; filme <= limite; filme++) {
                popularMovies(filme, arrayFilmes);
            }
        });
    });
});

btnPrev.addEventListener('click', () => {

    
    let copiaUltimaPosicao;
    let posicaoParaIniciar;

    if (ultimaPosicaoQuintoFilmeNaTela <= posicaoInicialDoConjuntoDeFilmeASerCarregado) {
        copiaUltimaPosicao = arrayFilmes.length - 1;
        posicaoParaIniciar = arrayFilmes.length >= limiteDeFilmesNaTela ? arrayFilmes.length - limiteDeFilmesNaTela : 0;
        
    } else {
        ultimaPosicaoQuintoFilmeNaTela -= limiteDeFilmesNaTela;
        copiaUltimaPosicao = ultimaPosicaoQuintoFilmeNaTela;
        posicaoParaIniciar = (ultimaPosicaoQuintoFilmeNaTela - posicaoInicialDoConjuntoDeFilmeASerCarregado);
    }
    
    if (copiaUltimaPosicao != 0){
        movies.textContent = '';
        for(let filme = posicaoParaIniciar; filme <= copiaUltimaPosicao; filme++) {
            popularMovies(filme, arrayFilmes);
        }
    }
});

btnNext.addEventListener('click', () => {

    let copiaUltimaPosicao = 0;
    let posicaoParaIniciar = 0;

    if (ultimaPosicaoQuintoFilmeNaTela === (arrayFilmes.length - 1)) {

        posicaoParaIniciar = 0;
        copiaUltimaPosicao = arrayFilmes.length >= limiteDeFilmesNaTela ? posicaoInicialDoConjuntoDeFilmeASerCarregado : (arrayFilmes.length - 1);

    } else if ((ultimaPosicaoQuintoFilmeNaTela + limiteDeFilmesNaTela) <= (arrayFilmes.length - 1)) {

        ultimaPosicaoQuintoFilmeNaTela += limiteDeFilmesNaTela;
        copiaUltimaPosicao = ultimaPosicaoQuintoFilmeNaTela;
        posicaoParaIniciar = (ultimaPosicaoQuintoFilmeNaTela - posicaoInicialDoConjuntoDeFilmeASerCarregado);

    } else {

        ultimaPosicaoQuintoFilmeNaTela += (arrayFilmes.length - 1);
        copiaUltimaPosicao = ultimaPosicaoQuintoFilmeNaTela;
        posicaoParaIniciar = (ultimaPosicaoQuintoFilmeNaTela - posicaoInicialDoConjuntoDeFilmeASerCarregado);

    }

    if (copiaUltimaPosicao != 0){
        movies.textContent = '';
        for(let filme = posicaoParaIniciar; filme <= copiaUltimaPosicao; filme++) {
            popularMovies(filme, arrayFilmes);
        }
    }
});