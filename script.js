let currentPokemonId;
let currentPokemonName;
let currentPokemonDataOverview;
let currentPokemonDataSpecies;
let currentPokemonDataEvolution;
let allPokemon;
let load = 20;
let alreadyLoaded = 0;
let pokemonLimit = 250;
let pokemonID = 4;
let pokemonName = 'charmander';
const zeroPad = (num, places) => String(num).padStart(places, '0');

async function init() {
    await loadAllPokemon();
    await renderPokedex();
}



async function renderPokedex() {
    for (let i = alreadyLoaded; i < load; i++) {
        if (i < allPokemon['results'].length) {
            let name = allPokemon['results'][i]['name'];
            let capitalizedName = capitalizeFirstLetter(name);
            let id = i + 1;
            let formattedId = formatNumber(id, 3);
            let img = await getPictureByName(name);
            await loadPokemonSpecies(id);
            let color = getPokemonColor();
            let types = getPokemonTypes(color);
            document.getElementById('pokedex').innerHTML += getTemplatePokedex(capitalizedName, i, formattedId, img, types, color);
            alreadyLoaded++;
        } else {
            document.getElementById('container-loadMore').classList.add('d-none');
        }
    }
}

function loadMore() {
    load = load + 20;
    renderPokedex();
}

function openCard(i) {
    pokemonID = i + 1;
    document.getElementById('dialog').classList.remove('d-none');
    disableScroll();
    renderCard(i);
}

function closeCard() {
    document.getElementById('dialog').classList.add('d-none');
    enableScroll();
}

function nextPokemon() {
    let i = currentPokemonId; // -1 +1
    if (i < pokemonLimit) {
        renderCard(i);
    }
}

function previousPokemon() {
    let i = currentPokemonId - 2; // -1 -1
    if (i >= 0) {
        renderCard(i);
    }
}

async function loadAllPokemon() {
    let formattedLimit = formatNumber(pokemonLimit, 6);
    let url = 'https://pokeapi.co/api/v2/pokemon/?limit=000250&offset=0';
    let response = await fetch(url);
    allPokemon = await response.json();
    console.log(allPokemon);
}

async function loadPokemonOverview(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    currentPokemonDataOverview = await response.json();
    console.log(currentPokemonDataOverview);
}

async function loadPokemonSpecies(id) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`
    let response = await fetch(url);
    currentPokemonDataSpecies = await response.json();
    console.log(currentPokemonDataSpecies);
}

async function getPictureByName(name) {
    await loadPokemonOverview(name);
    return currentPokemonDataOverview['sprites']['other']['home']['front_default'];
}

async function getPokemonIdByName(name) {
    await loadPokemonOverview(name);
    return currentPokemonDataOverview['id'];
}

function getPokemonNameById(pokemonID) {
    pokemonName = currentPokemonDataSpecies['name'];
}

async function loadPokemonEvolution() {
    let url = 'https://pokeapi.co/api/v2/evolution-chain/2/'
    let response = await fetch(url);
    currentPokemonDataEvolution = await response.json();
    console.log(currentPokemonDataEvolution);
}

async function renderCard(i) {
    let name = allPokemon['results'][i]['name'];
    currentPokemonId = i + 1;
    await loadPokemonOverview(name);
    await loadPokemonSpecies(currentPokemonId);
    // await loadPokemonEvolution();
    renderCardUpperHalf();
    renderCardLowerHalf();
    renderCardAbout();
}

function renderCardUpperHalf() {
    let id = currentPokemonDataOverview['id'];
    let formattedId = formatNumber(id, 3);
    let capitalizedName = capitalizeFirstLetter(currentPokemonDataOverview['name']);
    let img = currentPokemonDataOverview['sprites']['other']['home']['front_default'];
    let color = getPokemonColor();
    let types = getPokemonTypes(color);
    document.getElementById('card').innerHTML = '';
    document.getElementById('card').innerHTML = getTemplateCardUpperHalf(capitalizedName, formattedId, img, types, color);
}

function renderCardLowerHalf() {
    document.getElementById('card').innerHTML += getTemplateCardLowerHalf();

}

function renderCardAbout() {
    toggleDescriptionLinkEffects(0);
    document.getElementById('description-content').innerHTML = getTemplateAbout();
    document.getElementById('pokemon-species').innerHTML = currentPokemonDataSpecies['genera'][7]['genus'];
    document.getElementById('pokemon-height').innerHTML = getPokemonHeight();
    document.getElementById('pokemon-weight').innerHTML = getPokemonWeight();
    document.getElementById('pokemon-abilities').innerHTML = getPokemonAbility();
    document.getElementById('pokemon-eggGroups').innerHTML = getPokemonEggGroups();
}

function renderCardBaseStats() {
    toggleDescriptionLinkEffects(1);
    document.getElementById('description-content').innerHTML = getTemplateBaseStats();
    let baseStats = currentPokemonDataOverview['stats'];
    let total = 0;
    for (i = 0; i < baseStats.length; i++) {
        let data = baseStats[i]['base_stat'];
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
    let moves = currentPokemonDataOverview['moves'];
    for (let i = 0; i < moves.length; i++) {
        let move = capitalizeFirstLetter(currentPokemonDataOverview['moves'][i]['move']['name']);
        document.getElementById('moves').innerHTML += getTemplateMoves(move);
    }
}

function getPokemonTypes(color) {
    let types = '';
    for (let i = 0; i < currentPokemonDataOverview['types'].length; i++) {
        types += `<div class="item ${color}-item">${currentPokemonDataOverview['types'][i]['type']['name']}</div>`;
    }
    return types;
}

function getPokemonColor() {
    let color = currentPokemonDataSpecies['color']['name'];
    return color;
}

function getPokemonHeight() {
    let cm = currentPokemonDataOverview['height'] * 10;
    let feet = Math.floor(cm / 30.48);
    let inches = ((cm % 30.48) / 2.54).toFixed(1);
    let feetInch = `${feet}’${inches}"`;
    let m = (cm / 100).toFixed(2);
    return `${feetInch} (${m} m)`;
}

function getPokemonWeight() {
    let kg = currentPokemonDataOverview['weight'] / 10;
    let lbs = (kg * 2.20462).toFixed(1);
    let kgString = kg.toFixed(1);
    return `${lbs} lbs (${kgString} kg)`;
}

function getPokemonAbility() {
    let abilities = currentPokemonDataOverview['abilities'];
    let abilityNames = [];
    for (let i = 0; i < abilities.length; i++) {
        let abilityName = abilities[i]['ability']['name'];
        abilityNames.push(abilityName.charAt(0).toUpperCase() + abilityName.slice(1));
    }
    return abilityNames.join(", ");
}

function getPokemonEggGroups() {
    let eggGroups = currentPokemonDataSpecies['egg_groups'];
    let eggGroupNames = [];
    for (let i = 0; i < eggGroups.length; i++) {
        let eggGroupName = eggGroups[i]['name'];
        eggGroupNames.push(eggGroupName.charAt(0).toUpperCase() + eggGroupName.slice(1));
    }
    return eggGroupNames.join(', ');
}

async function getPokemonEvolutionChain() {
    evolutionChain = [];

    let name = currentPokemonDataEvolution['chain']['evolves_to'][0]['species']['name'];
    let id = await getPokemonIdByName(name);
    let level = currentPokemonDataEvolution['chain']['evolves_to'][0]['evolution_details'][0]['min_level'];
    let trigger = currentPokemonDataEvolution['chain']['evolves_to'][0]['evolution_details'][0]['trigger']['name'];

    console.log(name, id, level, trigger)
}

function toggleDescriptionLinkEffects(id) {
    for (let i = 0; i < 4; i++) {
        if (i == id) {
            document.getElementById(`card-link-${i}`).classList.remove('inactive');
        } else {
            document.getElementById(`card-link-${i}`).classList.add('inactive');
        }
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatNumber(id, numbers) {
    return '#' + zeroPad(id, numbers);
}

function disableScroll() {
    document.body.classList.add("stop-scrolling");
}

function enableScroll() {
    document.body.classList.remove("stop-scrolling");
}