const DATA_URL = "/imdb_top_1000.json";
var currentPage = 1;

class Movie {
  constructor(
    Poster_Link,
    Series_Title,
    Released_Year,
    Certificate,
    Runtime,
    Genre,
    IMDB_Rating,
    Overview,
    Meta_score,
    Director,
    Star1,
    Star2,
    Star3,
    Star4,
    No_of_Votes,
    Gross
  ) {
    this.Poster_Link = Poster_Link;
    this.Series_Title = Series_Title;
    this.Released_Year = Released_Year;
    this.Certificate = Certificate;
    this.Runtime = Runtime;
    this.Genre = Genre;
    this.IMDB_Rating = IMDB_Rating;
    this.Overview = Overview;
    this.Meta_score = Meta_score;
    this.Director = Director;
    this.Star1 = Star1;
    this.Star2 = Star2;
    this.Star3 = Star3;
    this.Star4 = Star4;
    this.No_of_Votes = No_of_Votes;
    this.Gross = Gross;
  }
}

/**
 * @param {Movie} data 
 * @returns {Element}
 */
function buildCard(data) {
 const card = document.createElement("div");
 card.className = "uk-card uk-card-default";
 card.innerHTML = `
 <div class="uk-card-header">
   <div class="uk-grid-small uk-flex-middle" uk-grid>
     <div class="uk-width-auto">
       <img width="40" height="40" src="${data.Poster_Link}" alt="${data.Series_Title}">
     </div>
     <div class="uk-width-expand">
       <h3 class="uk-card-title uk-margin-remove-bottom">${data.Series_Title} <span class="uk-badge">${data.Meta_score}/100</span></h3>
       <p class="uk-text-meta uk-margin-remove-top">${data.Released_Year}</p>
     </div>
   </div>
 </div>
 <div class="uk-card-body">
   <p>${data.Overview}</p>
 </div>
 <div class="uk-card-footer">
   <a href="#" class="uk-button uk-button-text">Leer más</a>
 </div>`;
 return card;
}

/**
 * @returns {Promise<Movie[]>}
 */
async function getMovies() {
  const req = await fetch(DATA_URL);
  return req.json();
}

/**
 * @param {Movie[]} movies 
 */
function fillContainer(movies, elementsPerRow) {
  const container = document.querySelector('#mainContent');
  container.innerHTML = '';
  for(let i = 0; i < movies.length; i+=elementsPerRow) {
    const res = createRow(movies.slice(i, i+elementsPerRow), elementsPerRow);
    if(!res) {
      break;
    }
    container.append(res);
  }
}

/**
 * 
 * @param {Movie[]} movies 
 * @param {number} amount 
 * @returns {Element}
 */
function createRow(movies, amount) {
  let row = document.createElement('div');
  row.className = 'uk-child-width-expand@m uk-padding-small uk-grid-match';
  row.setAttribute('uk-grid', '');
  for(let i = 0; i < amount; i++) {
    if(!movies[i]) {
      break;
    }
    const movie = movies[i];
    const cardContainer = document.createElement('div');
    cardContainer.append(buildCard(movie));
    row.append(cardContainer);
  }
  return row;
}

/**
 * @param {Movie[]} data 
 * @param {number} maxMovies
 */
function paginateArray(data, maxMovies) {
  const res = [];
  for(let i = 0; i < data.length; i+=maxMovies) {
    if(!data[i]) break;
    res.push(data.slice(i, i+maxMovies));
  }
  return res;
}

/**
 * @returns {Map<string, number>}
 */
function getSettings() {
  const maxMovies = document.querySelector('#maxmovies');
  let moviesCount = 0;
  const res = new Map();
  if(!maxMovies.value) moviesCount = 20;
  else moviesCount = parseInt(maxMovies.value);
  res.set('MaxMovies', moviesCount);
  return res;
}

/**
 * @param {Movie[][]} paginatedData 
 */
function renderPagination(paginatedData) {
  const paginationContainer = document.querySelector('#paginationContainer');
  const pagination = paginationContainer.querySelector('.uk-pagination');
  pagination.innerHTML = '<li id="backBtn"><a href="#"><span uk-pagination-previous></span></a></li>';
  for(let i = 1; i <= paginatedData.length; i++) {
    const listElem = document.createElement('li');
    const pageLink = document.createElement('a');
    pageLink.innerHTML = i;
    listElem.append(pageLink);
    if(i == currentPage) listElem.className = 'uk-active';
    pagination.append(listElem);
    listElem.id = `page-${i}`;
  }
  pagination.innerHTML += `<li><a href="#" id="nextBtn"><span uk-pagination-next></span></a></li>`;
  console.log(pagination);
  initPagination(paginatedData);
}

/**
 * @param {Movie[][]} paginatedData 
 */
function initPagination(paginatedData) {
  const paginationContainer = document.querySelector('#paginationContainer');
  const pagination = paginationContainer.querySelector('.uk-pagination');
  for(let i = 1; i <= paginatedData.length; i++) {
    const listElem = pagination.querySelector(`#page-${i}`);
    if(!listElem) break;
    listElem.addEventListener('click', () => {
      renderContainerPage(i, paginatedData);
      currentPage = i;
      renderPagination(paginatedData);
    });
  }
  const backBtn = document.querySelector('#backBtn');
  backBtn.addEventListener('click', () => {
    if(currentPage <= 1) return;
    currentPage--;
    renderContainerPage(currentPage, paginatedData);
    renderPagination(paginatedData);
  });
  const nextBtn = document.querySelector('#nextBtn');
  nextBtn.addEventListener('click', () => {
    if(currentPage >= paginatedData.length) return;
    currentPage++;
    renderContainerPage(currentPage, paginatedData);
    renderPagination(paginatedData);
  });
}

/**
 * @param {number} pageNumber 
 * @param {Movie[][]} data 
 */
function renderContainerPage(pageNumber, data) {
  const index = pageNumber-1;
  console.log(data[index]);
  fillContainer(data[index], 4);
}

/**
 * @returns {Promise<Map<string, number>[]>}
 */
async function getGrossByYear() {
  let res = new Map();
  let moviesYear = new Map();
  let merged = [];
  const data = await getMovies();
  for(let i = 0; i < data.length; i++) {
    const movie = data[i];
    if(moviesYear.get(movie.Released_Year)) {
      const yearCount = parseInt(moviesYear.get(movie.Released_Year));
      moviesYear.set(movie.Released_Year, yearCount+1);
    } else {
      moviesYear.set(movie.Released_Year, 1);
    }
    if(!movie.Gross) continue;
    let gross = parseInt(movie.Gross.split(",").join(""));
    if(res.get(movie.Released_Year)) gross += parseInt(res.get(movie.Released_Year));
    res.set(movie.Released_Year, parseInt(gross));
  }
  res = new Map([...res.entries()].sort());
  merged[0] = res;
  merged[1] = moviesYear;
  return merged;
}

async function main() {
  const data = await getMovies();
  const settings = getSettings();
  const paginatedData = paginateArray(data, settings.get('MaxMovies'));
  console.log(paginatedData);
  renderPagination(paginatedData);
  fillContainer(paginatedData[0], 4);
}

main();

const saveSettingsBtn = document.querySelector('#saveSettingsBtn');
saveSettingsBtn.addEventListener('click', () => {
  main();
});