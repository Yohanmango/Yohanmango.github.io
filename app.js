let cantidadNoticias = 6;
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = "TIC";

let noticias = {
    "apiKey": "95fc64555bfe420ebe7d6898b04273af",
    fetchNoticias: function (categoria) {
        mostrarMensaje("Cargando noticias...");

        fetch(
            "https://newsapi.org/v2/everything?q="
            + categoria +
            "&language=es&sortBy=publishedAt&apiKey=" + this.apiKey
        )
        .then((response) => {
            if (!response.ok) {
                throw new Error("La API no está disponible (código " + response.status + ").");
            }
            return response.json();
        })
        .then((data) => {
            if (data.status === "error") {
                throw new Error(data.message || "Ocurrió un error al obtener las noticias.");
            }
            this.displayNoticias(data);
        })
        .catch((error) => {
            console.error(error);
            mostrarMensaje("No se pudieron cargar las noticias. " + error.message);
        });
    },
    displayNoticias: function (data) {
        if (!data.articles || data.articles.length === 0) {
            mostrarMensaje("No se encontraron noticias para esta búsqueda.");
            document.querySelector(".container-noticias").textContent = "";
            return;
        }

        limpiarMensaje();

        if (pageInicial == 0) {
            document.querySelector(".container-noticias").textContent = "";
        }

        let btnAnterior = document.querySelector("#btnSiguiente");
        if (btnAnterior) {
            btnAnterior.remove();
        }

        for (let i = pageInicial; i < pageFinal; i++) {
            if (!data.articles[i]) break;

            const { title } = data.articles[i];
            let h2 = document.createElement("h2");
            h2.textContent = title;

            const { urlToImage } = data.articles[i];
            let img = document.createElement("img");
            img.setAttribute("src", urlToImage || "");

            let info_item = document.createElement("div");
            info_item.className = "info_item";

            const { publishedAt } = data.articles[i];
            let fecha = document.createElement("span");
            let date = publishedAt;
            date = date.split("T")[0].split("-").reverse().join("-");
            fecha.className = "fecha";
            fecha.textContent = date;

            const { name } = data.articles[i].source;
            let fuente = document.createElement("span");
            fuente.className = "fuente";
            fuente.textContent = name;

            info_item.appendChild(fecha);
            info_item.appendChild(fuente);

            const { url } = data.articles[i];

            let item = document.createElement("div");
            item.className = "item";
            item.appendChild(h2);
            item.appendChild(img);
            item.appendChild(info_item);
            item.setAttribute("onclick", "location.href='" + url + "'");
            document.querySelector(".container-noticias").appendChild(item);
        }

        if (data.articles.length > pageFinal) {
            let btnSiguiente = document.createElement("span");
            btnSiguiente.id = "btnSiguiente";
            btnSiguiente.textContent = "Ver más";
            btnSiguiente.setAttribute("onclick", "siguiente()");
            document.querySelector(".container-noticias").appendChild(btnSiguiente);
        }
    }
};

function mostrarMensaje(texto) {
    let el = document.querySelector("#mensaje-estado");
    if (el) {
        el.textContent = texto;
    }
}

function limpiarMensaje() {
    let el = document.querySelector("#mensaje-estado");
    if (el) {
        el.textContent = "";
    }
}

function buscar(categoria) {
    temaActual = categoria;
    pageInicial = 0;
    pageFinal = cantidadNoticias;
    noticias.fetchNoticias(temaActual);
}

function buscarTema() {
    let input = document.querySelector(".busqueda input");
    let texto = input.value.trim();
    if (texto !== "") {
        buscar(texto);
    }
}

function siguiente() {
    pageInicial = pageFinal;
    pageFinal += cantidadNoticias;
    noticias.fetchNoticias(temaActual);
}

function actualizar() {
    pageInicial = 0;
    pageFinal = cantidadNoticias;
    noticias.fetchNoticias(temaActual);
}

noticias.fetchNoticias(temaActual);