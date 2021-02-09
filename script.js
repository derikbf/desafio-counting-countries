let tabCountries = null;
let tabFavorites = null;
let allCountries = [];
let favoriteCountries = [];
let countCountries = 0;
let numberFormat = null;

addEventListener('load', () => {
  tabCountries = document.getElementById('tabCountries');
  tabFavorites = document.getElementById('tabFavorites');
  countCountries = document.getElementById('countCountries');
  countFavoriteCountries = document.getElementById('countFavorites');
  totalPopulationList = document.getElementById('totalPopulationList');
  totalPopulationFavoriteList = document.getElementById(
    'totalPopulationFavorites'
  );
  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountries();
});

//Função consumindo API atraves de fetch/then
// function fetchCountries(){
//   fetch('https://restcountries.eu/rest/v2/all')
//     .then(response => response.json())
//     .then(json => {(allCountries = json)
//       console.log(allCountries);
//     });
// }

//Função consumindo API atraves de Async/Await
async function fetchCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();
  allCountries = json.map((country) => {
    //No codigo aima, poderiamos fazer um destructing do obj country e desta forma não mencionar em cada item.
    //Para isso devemos colocar a seguinte sintaxe:
    // const {numericCode, translations, population, flag} = country;
    //Agora no return abaixo, podemos eliminar o obj "country" e o que for repetivo pode ser removido. Ex: Population e Flag.
    return {
      id: country.numericCode,
      name: country.translations.pt,
      population: country.population,
      flag: country.flag,
      formatPopulation: formatNumber(country.population),
    };
  });
  render();
}

function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList() {
  let countriesHTML = '<div>';
  allCountries.forEach((country) => {
    //Ordenando os elementos.
    allCountries.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    //Aplicando Destructing.
    const { name, flag, id, formatPopulation } = country;

    //Montando elementos na tela.
    const countryHtml = `
      <div class='country'>
        <div>
          <a id='${id}' class='waves-effect waves-light btn'> + </a>
        </div>
          
        <div>
          <img src="${flag}" title="Bandeira ${name}" alt="Bandeira ${name}" />
        </div>
          
        <div>
          <ul>
            <li>${name}</li>
            <li>${formatPopulation}</li>
        </div>
      </div>
    `;
    countriesHTML += countryHtml;
  });
  tabCountries.innerHTML = countriesHTML;
}

function renderFavorites() {
  let favoritesHTML = '<div>';

  favoriteCountries.forEach((country) => {
    //Aplicando Destructing.
    const { name, flag, id, formatPopulation } = country;

    //Montando elementos na tela.
    const favoriteCountryHtml = `
      <div class='country'>
        <div>
          <a id='${id}' class='waves-effect waves-light btn red darken-4'> - </a>
        </div>
          
        <div>
          <img src="${flag}" title="Bandeira ${name}" alt="Bandeira ${name}" />
        </div>
          
        <div>
          <ul>
            <li>${name}</li>
            <li>${formatPopulation}</li>
        </div>
      </div>
    `;
    favoritesHTML += favoriteCountryHtml;
  });
  tabFavorites.innerHTML = favoritesHTML;
}

function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavoriteCountries.textContent = favoriteCountries.length;

  //Reduce faz interação com cada elemento, espera receber uma variavel e o obj da iteração. Tambem é necessario informa o valor inicial da variavel.
  const totalPopulation = allCountries.reduce((accumulator, country) => {
    return accumulator + country.population;
  }, 0);

  const totalPopulationFavorite = favoriteCountries.reduce(
    (accumulatorFavorite, country) => {
      return (accumulatorFavorite += country.population);
    },
    0
  );

  totalPopulationList.textContent = formatNumber(totalPopulation);
  totalPopulationFavoriteList.textContent = formatNumber(
    totalPopulationFavorite
  );
}

function handleCountryButtons() {
  //Retorna uma NodeList, mas é preciso conter para um array.
  let countryButtons = tabCountries.querySelectorAll('.btn');
  //Convertendo para array.
  countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));

  //Pegando tambem os botoes da FavoriteList e ja convertendo direto em Array.
  const countryFavoriteButtons = Array.from(
    tabFavorites.querySelectorAll('.btn')
  );

  //Add eventListener a cada um dos botoes da lista geral.
  countryButtons.forEach((btns) => {
    btns.addEventListener('click', () => {
      addToFavorites(btns.id);
    });
  });

  //Add eventListener a cada um dos botoes da lista de favoritos.
  countryFavoriteButtons.forEach((btns) => {
    btns.addEventListener('click', () => {
      removeFromFavorite(btns.id);
    });
  });
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find((country) => country.id === id);

  //Realizando um spread para atribuir um valor no array. Com o spread, ele espalha os elementos que o array possui e reatribui o novo.
  favoriteCountries = [...favoriteCountries, countryToAdd];

  //Utilizando o Sort para ordenar os países na lista. Quando for String, pode-se utilizar a função LocaleCompare, informando pelo qual dado sera a comparação.
  favoriteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  allCountries = allCountries.filter((country) => country.id !== id);

  render();
}

function removeFromFavorite(id) {
  const countryToRemove = favoriteCountries.find(
    (country) => country.id === id
  );
  allCountries = [...allCountries, countryToRemove];

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  favoriteCountries = favoriteCountries.filter((country) => country.id !== id);

  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}
