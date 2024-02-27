const btnSearch = document.getElementById('btn-search');
const modalBackground = document.getElementById('modal-background');
const movieName = document.getElementById('movie-name');
const movieYear = document.getElementById('movie-year');
const movieListElement = document.getElementById('movie-list');
const key = '957ef281';

let movieList = JSON.parse(localStorage.getItem('movieList')) ?? [];

async function abriModal() {
  // Lista de filmes
  let movieList = [];

  // Função assíncrona para abrir o modal e buscar informações sobre o filme
  async function abriModal() {
    try {
      let url = `https://www.omdbapi.com/?apikey=${key}&t=${movieNameParameter()}${movieYearParameter()}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log(data);

      if (data.Error) {
        throw new Error('Filme não encontrado');
      }

      createModal(data);

      // Adicionando a classe 'open' para exibir o overlay/modal
      overlay.classList.add('open');
    } catch (error) {
      notie.alert({
        text: error.message,
        type: 'error',
      });
    }
  }

  // Função para obter o parâmetro do nome do filme
  function movieNameParameter() {
    // Se o campo estiver vazio, lançar uma exceção
    if (movieName.value === '') {
      throw new Error('O nome do filme deve ser informado');
    }
    // Substituir espaços por '+' na string do nome do filme
    return movieName.value.split(' ').join('+');
  }

  // Função para obter o parâmetro do ano do filme
  function movieYearParameter() {
    // Se o campo estiver vazio, retornar uma string vazia
    if (movieYear.value === '') {
      return '';
    }
    // Verificar se o ano possui 4 dígitos numéricos
    if (movieYear.value.length !== 4 || Number.isNaN(Number(movieYear.value))) {
      // Se não for válido, lançar uma exceção
      throw new Error('Ano do filme inválido.');
    }
    // Retornar a string formatada com o ano
    return `&y=${movieYear.value}`;
  }

  // Função para adicionar um filme à lista
  function addToList(movieObject) {
    movieList.push(movieObject);
  }

  // Função para verificar se um filme já está na lista
  function isMovieAlreadyOnList(id) {
    // Função interna para verificar se o ID pertence a um determinado filme
    function doesThisIdBelongToThisMovie(movieObject) {
      return movieObject.imdbID === id;
    }
    // Retornar verdadeiro se o filme com o ID fornecido estiver na lista
    return Boolean(movieList.find(doesThisIdBelongToThisMovie));
  }

  // Função para atualizar a interface do usuário com informações do filme
  function updateUI(movieObject) {
    // Adicionar um novo artigo à lista de filmes
    movieListElement.innerHTML += `<article>
      <img id="poster" src="${movieObject.Poster}" alt="Poster de ${movieObject.Title}.">
      <button id="remove-btn"><i class="bi bi-trash"></i>Remover</button>
    </article>`;
  }

  // Adicionar um ouvinte de eventos para o botão de pesquisa
  btnSearch.addEventListener('click', abriModal);

  // Bloco try-catch para lidar com a chamada assíncrona à API OMDB
  try {
    // Construção da URL da API com a chave, nome e ano do filme
    let url = `https://www.omdbapi.com/?apikey=${key}&t=${movieNameParameter()}${movieYearParameter()}`;

    // Chamada assíncrona para obter a resposta da API
    const response = await fetch(url);
    const data = await response.json(); // Convertendo a resposta para formato JSON

    // Exibição dos dados do filme no console para fins de debug
    console.log(data);

    // Se a resposta contiver um erro, lançar uma exceção
    if (data.Error) {
      throw new Error('Filme não encontrado');
    }

    // Criar e exibir o modal com base nos dados do filme
    createModal(data);

    // Adicionar a classe 'open' para exibir o overlay/modal
    overlay.classList.add('open');
  } catch (error) {
    // Em caso de erro, exibir um alerta utilizando a biblioteca 'notie'
    notie.alert({
      text: error.message,
      type: 'error',
    });
  }
}

// Função para obter o parâmetro do nome do filme
function movieNameParameter() {
  // Verificar se o campo de nome do filme está vazio
  if (movieName.value === '') {
    // Se estiver vazio, lançar uma exceção com uma mensagem de erro
    throw new Error('O nome do filme deve ser informado');
  }
  // Substituir espaços por '+' na string do nome do filme e retornar
  return movieName.value.split(' ').join('+');
}

// Função para obter o parâmetro do ano do filme
function movieYearParameter() {
  // Verificar se o campo de ano do filme está vazio
  if (movieYear.value === '') {
    // Se estiver vazio, retornar uma string vazia
    return '';
  }

  // Verificar se o ano possui 4 dígitos numéricos ou se é um número inválido
  if (movieYear.value.length !== 4 || Number.isNaN(Number(movieYear.value))) {
    // Se o ano for inválido, lançar uma exceção com uma mensagem de erro
    throw new Error('Ano do filme inválido.');
  }
  // Retornar a string formatada com o ano
  return `&y=${movieYear.value}`;
}

// Função para adicionar um filme à lista
function addToList(movieObject) {
  // Adicionar o objeto do filme à lista global
  movieList.push(movieObject);
}

// Função para verificar se um filme já está na lista
function isMovieAlreadyOnList(id) {
  // Função interna para verificar se o ID pertence a um determinado filme
  function doesThisIdBelongToThisMovie(movieObject) {
    return movieObject.imdbID === id;
  }
  // Retornar verdadeiro se o filme com o ID fornecido estiver na lista
  return Boolean(movieList.find(doesThisIdBelongToThisMovie));
}

// Função para atualizar a interface do usuário com informações do filme
function updateUI(movieObject) {
  // Adicionar um novo artigo à lista de filmes na interface
  movieListElement.innerHTML += `<article id="movie-card-${movieObject.imdbID}">
    <img id="poster" src= "${movieObject.Poster}" alt="Poster de ${movieObject.Title}.">
    <button id="remove-btn" onclick="{removeFilmFromList('${movieObject.imdbID}')}"><i class="bi' +
  ' bi-trash"></i>Remover</button>
  </article>`;
}

function removeFilmFromList(id) {
  notie.confirm({
    text: 'Deseja remover o filme de sua lista?',
    submitText: 'Sim',
    cancelText: 'Não',
    position: 'top',
    submitCallback: function remove() {
      movieList = movieList.filter((movie) => movie.imdbID !== id);
      document.getElementById(`movie-card-${id}`).remove();
      updateLocalStorage();
    },
  });
}

function updateLocalStorage() {
  localStorage.setItem('movieList', JSON.stringify(movieList));
}

for (const movieInfo of movieList) {
  updateUI(movieInfo);
}

// Adicionar um ouvinte de eventos para o botão de pesquisa
btnSearch.addEventListener('click', abriModal);
