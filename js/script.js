let openedPokemon;
let currentPokemon;
let currentPokemonDataOverview;
let currentPokemonDataSpecies;
let currentPokemonDataEvolution;
let allPokemon = [];
let allPokemonOwnArray = [];
let allPokemonEvolutionChains = [];
let searchArray = [];
let alreadyLoaded = 0;
let load = 50;
let pokemonLimit = 905;
const zeroPad = (num, places) => String(num).padStart(places, '0');

async function init() {
    await fetchAllPokemon();
    await buildPokemonOwnArray();
    await renderPokedex(alreadyLoaded);
}

async function renderPokedex(startIndex) {
    document.getElementById('spinner-container').classList.add('d-none');
    for (let i = startIndex; i < load; i++) {
        await renderPokedexElement(i + 1);
        alreadyLoaded++;
    }
    if (alreadyLoaded >= pokemonLimit) {
        document.getElementById('btn-loadMore').classList.add('d-none');
    } else {
        document.getElementById('btn-loadMore').classList.remove('d-none');
    }
}

async function renderPokedexSearch() {
    document.getElementById('btn-loadMore').classList.add('d-none');
    for (let i = 0; i < searchArray.length; i++) {
        await renderPokedexElement(searchArray[i]);
    }
}

async function renderPokedexElement(id) {
    let j = await getIndexExistingPokemonOrFetchNew(id);
    currentPokemon = allPokemonOwnArray[j];
    let capitalizedName = capitalizeFirstLetter(currentPokemon.name);
    let formattedId = formatNumber(currentPokemon.id, 3);
    let formattedtTypes = getPokemonTypes(currentPokemon);
    document.getElementById('pokedex').innerHTML += getTemplatePokedex(capitalizedName, j, formattedId, currentPokemon.img, formattedtTypes, currentPokemon.color);

}

async function loadMore() {
    load = load + 50;
    document.getElementById('btn-loadMore').classList.add('d-none');
    document.getElementById('spinner-container').classList.remove('d-none');
    await buildPokemonOwnArray();
    renderPokedex(alreadyLoaded);
    document.getElementById('btn-loadMore').classList.remove('d-none');
}

async function searchPokemon() {
    let searchTerm = document.getElementById('search').value;
    searchArray = [];
    if (searchTerm !== '') {
        searchArray = allPokemonOwnArray
            .filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm))
            .map(pokemon => pokemon.id);
        document.getElementById('pokedex').innerHTML = '';
        await renderPokedexSearch();
    } else {
        document.getElementById('pokedex').innerHTML = '';
        alreadyLoaded = 0;
        renderPokedex(alreadyLoaded);
    }
}