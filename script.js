let currentPokemon;
let currentPokemonSpecies;
let currentPokemonEvolution;
let allPokemon;
let load = 20;
let alreadyLoaded = 0;
let pokemonID = 4;
let pokemonName = 'charmander';
const zeroPad = (num, places) => String(num).padStart(places, '0');

async function renderCard() {
    await loadAllPokemon();
    await renderPokedex();
    // await loadPokemon(pokemonName);
    // await loadPokemonSpecies(pokemonID);
    // await loadPokemonEvolution();
    // renderPokemon();
}

async function loadAllPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/?limit=000250&offset=0';
    let response = await fetch(url);
    allPokemon = await response.json();
    console.log(allPokemon);
}

async function renderPokedex() {
    for (let i = alreadyLoaded; i < load; i++) {
        if (i < allPokemon['results'].length) {
            let name = allPokemon['results'][i]['name'];
            let capitalizedName = capitalizeFirstLetter(name);
            let id = i + 1;
            let formattedId = '#' + zeroPad(id, 3);
            let img = await getPictureByName(name);
            await loadPokemonSpecies(id);
            let color = getPokemonColor();
            let types = getPokemonTypes(color);
            document.getElementById('pokedex').innerHTML += getTemplatePokedex(capitalizedName, formattedId, img, types, color);
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

async function loadPokemon(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log(currentPokemon);
}

async function loadPokemonSpecies(id) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`
    let response = await fetch(url);
    currentPokemonSpecies = await response.json();
    console.log(currentPokemonSpecies);
}

async function getPictureByName(name) {
    await loadPokemon(name);
    return currentPokemon['sprites']['other']['home']['front_default'];
}

async function getPokemonIdByName(name) {
    await loadPokemon(name);
    return currentPokemon['id'];
}

function getPokemonNameById(pokemonID) {
    pokemonName = currentPokemonSpecies['name'];
}

async function loadPokemonEvolution() {
    let url = 'https://pokeapi.co/api/v2/evolution-chain/2/'
    let response = await fetch(url);
    currentPokemonEvolution = await response.json();
    console.log(currentPokemonEvolution);
}


function renderPokemon() {
    document.getElementById('pokemon-name').innerHTML = currentPokemon['name'];
    document.getElementById('pokemon-img').src = currentPokemon['sprites']['other']['home']['front_default'];
    let color = getPokemonColor();
    document.getElementById('pokemon-types').innerHTML = getPokemonTypes(color);
    renderPokemonAbout();
}

function renderPokemonAbout() {
    document.getElementById('description-content').innerHTML = getTemplateAbout();
    document.getElementById('pokemon-species').innerHTML = currentPokemonSpecies['genera'][7]['genus'];
    document.getElementById('pokemon-height').innerHTML = getPokemonHeight();
    document.getElementById('pokemon-weight').innerHTML = getPokemonWeight();
    document.getElementById('pokemon-abilities').innerHTML = getPokemonAbility();
    document.getElementById('pokemon-eggGroups').innerHTML = getPokemonEggGroups();
}

function renderPokemonBaseStats() {
    document.getElementById('description-content').innerHTML = getTemplateBaseStats();
    let baseStats = currentPokemon['stats'];
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

function renderPokemonEvolution() {
    document.getElementById('description-content').innerHTML = getTemplateEvolution();
    document.getElementById('evolution-img-0').src = currentPokemon['sprites']['other']['home']['front_default'];
    
    getPokemonEvolutionChain();

    // if (currentPokemonSpecies['evolves_from_species'])

    // first Pokemon in evolution chain
    currentPokemonEvolution['id']
    currentPokemonEvolution['evolution_details']['id']


}



function renderPokemonMoves(color) {
 
}

function getPokemonTypes(color) {
    let types = '';
    for (let i = 0; i < currentPokemon['types'].length; i++) {
        types += `<div class="pokemon-type ${color}-type">${currentPokemon['types'][i]['type']['name']}</div>`;
    }
    return types;
}

function getPokemonColor() {
    let color = currentPokemonSpecies['color']['name'];
    return color;
}

function getPokemonHeight() {
    let cm = currentPokemon['height'] * 10;
    let feet = Math.floor(cm / 30.48);
    let inches = ((cm % 30.48) / 2.54).toFixed(1);
    let feetInch = `${feet}’${inches}"`;
    let m = (cm / 100).toFixed(2);
    return `${feetInch} (${m} m)`;
}

function getPokemonWeight() {
    let kg = currentPokemon['weight'] / 10;
    let lbs = (kg * 2.20462).toFixed(1);
    let kgString = kg.toFixed(1);
    return `${lbs} lbs (${kgString} kg)`;
}

function getPokemonAbility() {
    let abilities = currentPokemon['abilities'];
    let abilityNames = [];
    for (let i = 0; i < abilities.length; i++) {
        let abilityName = abilities[i]['ability']['name'];
        abilityNames.push(abilityName.charAt(0).toUpperCase() + abilityName.slice(1));
    }
    return abilityNames.join(", ");
}

function getPokemonEggGroups() {
    let eggGroups = currentPokemonSpecies['egg_groups'];
    let eggGroupNames = [];
    for (let i = 0; i < eggGroups.length; i++) {
        let eggGroupName = eggGroups[i]['name'];
        eggGroupNames.push(eggGroupName.charAt(0).toUpperCase() + eggGroupName.slice(1));
    }
    return eggGroupNames.join(', ');
}

async function getPokemonEvolutionChain() {
    evolutionChain = [];

    let name = currentPokemonEvolution['chain']['evolves_to'][0]['species']['name'];
    let id = await getPokemonIdByName(name);
    let level = currentPokemonEvolution['chain']['evolves_to'][0]['evolution_details'][0]['min_level'];
    let trigger = currentPokemonEvolution['chain']['evolves_to'][0]['evolution_details'][0]['trigger']['name'];

    console.log(name, id, level, trigger)
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}