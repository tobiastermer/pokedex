let currentPokemon;
let currentPokemonDataOverview;
let currentPokemonDataSpecies;
let currentPokemonDataEvolution;
let allPokemon = [];
let allPokemonOwnArray = [];
let alreadyLoaded = 0;
let load = 50;
let pokemonLimit = 905;
const zeroPad = (num, places) => String(num).padStart(places, '0');

async function init() {
    await loadAllPokemon();
    await buildPokemonOwnArray();
    await renderPokedex();
}

function renderPokedex() {
    document.getElementById('spinner-container').classList.add('d-none');
    for (let i = alreadyLoaded; i < load; i++) {
            currentPokemon = allPokemonOwnArray[i];
            let capitalizedName = capitalizeFirstLetter(currentPokemon.name);
            let formattedId = formatNumber(currentPokemon.id, 3);
            let types = getPokemonTypes(currentPokemon.color);
            document.getElementById('pokedex').innerHTML += getTemplatePokedex(capitalizedName, i, formattedId, currentPokemon.img, types, currentPokemon.color);
            alreadyLoaded++;
    }
    if (alreadyLoaded >= pokemonLimit) {
        document.getElementById('btn-loadMore').classList.add('d-none');
    } else {
        document.getElementById('btn-loadMore').classList.remove('d-none');
    }
}

async function loadMore() {
    load = load + 50;
    document.getElementById('btn-loadMore').classList.add('d-none');
    document.getElementById('spinner-container').classList.remove('d-none');
    await buildPokemonOwnArray();
    renderPokedex();
    document.getElementById('btn-loadMore').classList.remove('d-none');
    document.getElementById('spinner-container').classList.add('d-none');
}

function openCard(i) {
    document.getElementById('dialog').classList.remove('d-none');
    disableScroll();
    renderCard(i);
}

function closeCard() {
    document.getElementById('dialog').classList.add('d-none');
    enableScroll();
}

function nextPokemon() {
    let i = currentPokemon.id; // -1 +1
    if (i < alreadyLoaded) {
        renderCard(i);
    }
}

function previousPokemon() {
    let i = currentPokemon.id - 2; // -1 -1
    if (i >= 0) {
        renderCard(i);
    }
}

async function renderCard(i) {
    currentPokemon = allPokemonOwnArray[i];
    renderCardUpperHalf();
    renderCardLowerHalf();
    renderCardAbout();
}

function renderCardUpperHalf() {
    let formattedId = formatNumber(currentPokemon.id, 3);
    let capitalizedName = capitalizeFirstLetter(currentPokemon.name);
    let types = getPokemonTypes(currentPokemon.color);
    document.getElementById('card').innerHTML = '';
    document.getElementById('card').innerHTML = getTemplateCardUpperHalf(capitalizedName, formattedId, currentPokemon.img, types, currentPokemon.color);
}

function renderCardLowerHalf() {
    document.getElementById('card').innerHTML += getTemplateCardLowerHalf();
}

function renderCardAbout() {
    toggleDescriptionLinkEffects(0);
    document.getElementById('description-content').innerHTML = getTemplateAbout();
    document.getElementById('pokemon-species').innerHTML = currentPokemon.species;
    document.getElementById('pokemon-height').innerHTML = getPokemonHeight();
    document.getElementById('pokemon-weight').innerHTML = getPokemonWeight();
    document.getElementById('pokemon-abilities').innerHTML = getPokemonAbility();
    document.getElementById('pokemon-gender').innerHTML = getPokemonGender();
    document.getElementById('pokemon-eggGroups').innerHTML = getPokemonEggGroups();
}

function renderCardBaseStats() {
    toggleDescriptionLinkEffects(1);
    document.getElementById('description-content').innerHTML = getTemplateBaseStats();
    let total = 0;
    for (i = 0; i < currentPokemon.baseStats.length; i++) {
        let data = currentPokemon.baseStats[i];
        document.getElementById(`pokemon-bs${i}-number`).innerHTML = data;
        document.getElementById(`pokemon-bs${i}-graph`).innerHTML = createBaseStatsGraph(data, 100);
        total = total + data;
    }
    document.getElementById(`pokemon-bs6-number`).innerHTML = total;
    document.getElementById(`pokemon-bs6-graph`).innerHTML = createBaseStatsGraph(total, 600);
}

function renderCardEvolution() {
    toggleDescriptionLinkEffects(2);
    document.getElementById('description-content').innerHTML = getTemplateEvolution();
    document.getElementById('evolution-img-0').src = currentPokemonDataOverview['sprites']['other']['home']['front_default'];

    getPokemonEvolutionChain();

    // if (currentPokemonDataSpecies['evolves_from_species'])

    // first Pokemon in evolution chain
    currentPokemonDataEvolution['id']
    currentPokemonDataEvolution['evolution_details']['id']

}

function renderCardMoves(color) {
    toggleDescriptionLinkEffects(3);
    document.getElementById('description-content').innerHTML = getTemplateMovesContainer();
    for (let i = 0; i < currentPokemon.moves.length; i++) {
        let move = capitalizeFirstLetter(currentPokemon.moves[i]);
        document.getElementById('moves').innerHTML += getTemplateMoves(move);
    }
}