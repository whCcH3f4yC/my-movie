// Elementos do DOM
const overlay = document.getElementById('modal-overlay');  // Overlay/modal de fundo
const modalContainer = document.getElementById('modal-container');  // Container do modal
let currentMovie = {};  // Objeto para armazenar informações do filme atual

// Função para fechar o modal
function fechaModal() {
    overlay.classList.remove('open');
}

// Função para adicionar o filme atual à lista
function addCurrentMovieToList() {
    // Verificar se o filme já está na lista
    if (isMovieAlreadyOnList(currentMovie.imdbID)) {
        // Exibir um alerta de erro se o filme já estiver na lista
        notie.alert({
            text: 'Filme já está na sua lista!',
            type: 'error',
        });
        return;
    }

    // Adicionar o filme à lista, atualizar a interface e fechar o modal
    addToList(currentMovie);
    updateUI(currentMovie);
    updateLocalStorage();
    fechaModal();
}

// Função para criar o conteúdo do modal com base nos dados do filme
function createModal(data) {
    // Atribuir os dados do filme atual
    currentMovie = data;

    // Atualizar o conteúdo do container do modal com os dados do filme
    modalContainer.innerHTML = `
    <section id="modal-body">
        <img id="movie-post"
             src="${data.Poster}"
             alt="Poster do Filme">

        <div id="movie-info">
            <h4 id="movie-title">${data.Title} - ${data.Year}</h4>
            <div id="imdb">
                <img src="assests/icon/imdb.png" alt="Nota imdb">
                <span>${data.imdbRating}</span>
            </div>

            <p id="movie-genre"><b>Gênero: </b>${data.Genre}</p>
            <p id="movie-actors"><b>Elenco: </b>${data.Actors}</p>
            <p id="movie-plot"><b>Sinopse:</b> ${data.Plot}</p>

            <div class="btn-info">
                <button id="addToList" onclick="addCurrentMovieToList()">
                    Adicionar à Lista
                    <i class="bi bi-patch-plus"></i>
                </button>
            </div>
        </div>
    </section>`;
}

// Adicionar um ouvinte de eventos para fechar o modal ao clicar no fundo
modalBackground.addEventListener('click', fechaModal);
