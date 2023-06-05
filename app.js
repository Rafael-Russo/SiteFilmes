const TMDB_ENDPOINT = 'https://api.themoviedb.org/3';
const API_KEY = 'd33d7beb1964ee4152d0d75e05d4948c';
const LANG = 'pt-br';
const IMG_PREFIX = 'https://image.tmdb.org/t/p/w500';

let params = new URLSearchParams(document.location.search.substring(1));

function carregarFilmes(){
    let xhr = new XMLHttpRequest ();
    
    xhr.open ('GET', TMDB_ENDPOINT+'/movie/popular?api_key='+API_KEY+'&language='+LANG);
    xhr.onload = exibirFilmes;
    xhr.send();
}

function pesquisarFilmes(){
    let xhr = new XMLHttpRequest ();

    let pesquisa = document.getElementById('pesquisa');
    
    let query = pesquisa.value;

    xhr.open ('GET', TMDB_ENDPOINT+'/search/movie?api_key='+API_KEY+'&query='+ query +'&language='+LANG);
    xhr.onload = exibirFilmes;
    xhr.send();
}

function abrirFilme(id){
    let xhr = new XMLHttpRequest ();

    xhr.open ('GET', TMDB_ENDPOINT+'/movie/'+ id +'/external_ids?api_key='+API_KEY);
    xhr.onload = redirecionar;
    xhr.send();
}

function carregarDetails(id){
    let xhr = new XMLHttpRequest ();

    xhr.open ('GET', TMDB_ENDPOINT+'/movie/'+ id +'?api_key='+API_KEY);
    xhr.onload = exibirEspecifico;
    xhr.send();
}

function carregarCreditos(id){
    let xhr = new XMLHttpRequest ();

    xhr.open ('GET', TMDB_ENDPOINT+'/movie/'+ id +'/credits?api_key='+API_KEY);
    xhr.onload = exibirCreditos;
    xhr.send();
}

function exibirFilmes (evento){
    let textoHTML = '';
    let itemsCarousel = '';
    let ativo = '';

    let filmes = JSON.parse (evento.target.responseText);

    for(let i = 0; i < filmes.results.length; i++) {
        let titulo = filmes.results[i].title;
        let sinopse = filmes.results[i].overview;
        let imagem = IMG_PREFIX + filmes.results[i].poster_path;
        let score = filmes.results[i].vote_average;
        let id = filmes.results[i].id;

        if(i == 0){
            ativo = 'active';
        }else{
            ativo = '';
        }

        textoHTML += `
        <div class="item ${ativo}">
            <div class="row">
                <div class="col-6">
                    <a href="item.html?id=${id}"><img src="${imagem}"class="card-img-top" alt="..."></a>
                </div>
                <div class="col-6 card-body">
                    <h3 class="card-title">${titulo}</h3>
                    <p class="card-text"><b>Sinopse: </b> ${sinopse}</p>
                    <div class="row espaco">
                        <div class="col-6">
                            <h4><b>Avaliações: </b></h4><br>
                        </div>
                        <div class="col-6">
                            <h4 class="card-text">${score}</h4>
                        </div>
                    </div>
                    <div class="row">
                    <button class="btn btn-info" onclick="abrirFilme(${id})">Abrir Filme</button>
                    </div>
                </div>
            </div>
        </div>
        `

        itemsCarousel+=`
            <li data-target="#myCarousel" data-slide-to="${i}" class="espaco ${ativo}"></li>
        `
    }

    document.getElementById('tela').innerHTML = textoHTML;
    document.getElementById('itemsCarousel').innerHTML = itemsCarousel;
}

function redirecionar (a){
    let externaId = JSON.parse (a.target.responseText);

    let imdb_id = externaId.imdb_id;

    window.location.href = 'https://www.imdb.com/title/'+imdb_id+'/';
}

function exibirEspecifico (b){

    let filmeHTML = '';

    let filme = JSON.parse (b.target.responseText);

    let titulo = filme.title;
    let sinopse = filme.overview;
    let imagem = IMG_PREFIX + filme.poster_path;
    let score = filme.vote_average;
    let id = filme.id;
    filmeHTML +=`
    <div class="row">
        <div class="col-6">
            <img src="${imagem}"class="card-img-top" alt="...">
        </div>
        <div class="col-6 card-body">
            <h3 class="card-title">${titulo}</h3>
            <p class="card-text"><b>Sinopse: </b> ${sinopse}</p>
            <div class="row espaco">
                <div class="col-6">
                    <h4><b>Avaliações: </b></h4><br>
                </div>
                <div class="col-6">
                    <h4 class="card-text">${score}</h4>
                </div>
            </div>
            <div class="row">
                <button class="btn btn-info" onclick="abrirFilme(${id})">Abrir Filme</button>
            </div>
        </div>
    </div>
    `
    document.getElementById('tela').innerHTML = filmeHTML;
}

function exibirCreditos (c){

    let creditoHTML = '';

    let credito = JSON.parse (c.target.responseText);

    for(let i = 0; i < credito.cast.length; i++) {

        let papel = credito.cast[i].known_for_department;
        let personagem = credito.cast[i].character;
        let nome = credito.cast[i].name;

        creditoHTML +=`
        <div class="row espaco">
            <div class="col-4">
                <h4><b>${papel}</b></h4>
            </div>
            <div class="col-4">
                <h4><b>${personagem}</b></h4>
            </div>
            <div class="col-4">
                <h4>${nome}</h4>
            </div>
        </div>
        `
    }
    document.getElementById('creditos').innerHTML = creditoHTML;
}