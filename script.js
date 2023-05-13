let currentPokemon;
let currentPokemonId;
let currentPokemonName;
let currentPokemonDataOverview;
let currentPokemonDataSpecies;
let currentPokemonDataEvolution;
let allPokemon = [];
let allPokemonCleanArray = [];
let allPokemonDataGender = [];
let load = 25;
let alreadyLoaded = 0;
let pokemonLimit = 250;
let pokemonID = 4;
let pokemonName = 'charmander';
const zeroPad = (num, places) => String(num).padStart(places, '0');

async function init() {
    await loadAllPokemon();
    await loadAllPokemonGender();
    await buildPokemonCleanArray();
    await renderPokedex();
}




async function renderPokedex() {
    for (let i = alreadyLoaded; i < load; i++) {
        if (i < allPokemonCleanArray.length) {
            currentPokemon = allPokemonCleanArray[i];
            let capitalizedName = capitalizeFirstLetter(currentPokemon.name);
            let formattedId = formatNumber(currentPokemon.id, 3);
            let types = getPokemonTypes(currentPokemon.color);
            document.getElementById('pokedex').innerHTML += getTemplatePokedex(capitalizedName, i, formattedId, currentPokemon.img, types, currentPokemon.color);
            alreadyLoaded++;
        } else {
            document.getElementById('container-loadMore').classList.add('d-none');
        }
    }
}

function loadMore() {
    load = load + 25;
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



async function loadPokemonEvolution() {
    let url = 'https://pokeapi.co/api/v2/evolution-chain/2/'
    let response = await fetch(url);
    currentPokemonDataEvolution = await response.json();
    console.log(currentPokemonDataEvolution);
}


async function renderCard(i) {
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
    document.getElementById('pokemon-species').innerHTML = currentPokemonDataSpecies['genera'][7]['genus'];
    document.getElementById('pokemon-height').innerHTML = getPokemonHeight();
    document.getElementById('pokemon-weight').innerHTML = getPokemonWeight();
    document.getElementById('pokemon-abilities').innerHTML = getPokemonAbility();
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

function getPokemonTypes() {
    let formattedTypes = '';
    for (let i = 0; i < currentPokemon.types.length; i++) {
        formattedTypes += `<div class="item ${currentPokemon.color}-item">${currentPokemon.types[i]}</div>`;
    }
    return formattedTypes;
}

function getPokemonHeight() {
    let cm = currentPokemon.height * 10;
    let feet = Math.floor(cm / 30.48);
    let inches = ((cm % 30.48) / 2.54).toFixed(1);
    let feetInch = `${feet}’${inches}"`;
    let m = (cm / 100).toFixed(2);
    return `${feetInch} (${m} m)`;
}

function getPokemonWeight() {
    let kg = currentPokemon.weight / 10;
    let lbs = (kg * 2.20462).toFixed(1);
    let kgString = kg.toFixed(1);
    return `${lbs} lbs (${kgString} kg)`;
}

function getPokemonAbility() {
    let formattedAbilities = [];
    for (let i = 0; i < currentPokemon.abilities.length; i++) {
        let ability = currentPokemon.abilities[i];
        formattedAbilities.push(ability.charAt(0).toUpperCase() + ability.slice(1));
    }
    return formattedAbilities.join(", ");
}

function getPokemonEggGroups() {
    let formattedEggGroups = [];
    for (let i = 0; i < currentPokemon.eggGroups.length; i++) {
        let eggGroup = currentPokemon.eggGroups[i];
        formattedEggGroups.push(eggGroup.charAt(0).toUpperCase() + eggGroup.slice(1));
    }
    return formattedEggGroups.join(', ');
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