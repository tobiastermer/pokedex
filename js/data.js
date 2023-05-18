// *****************************************************************
// API-Functions to get Data for all Pokemon or all evolution chains

async function fetchAllPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=${pokemonLimit}&offset=0`;
    let response = await fetch(url);
    allPokemon = await response.json();
}

// **********************************************************************
// API-Functions to get Data for single Pokemon or single evolution chain

async function fetchPokemonData(id) {
    await Promise.all([fetchPokemonOverview(id), fetchPokemonSpecies(id)]);
}

async function fetchPokemonOverview(id) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    currentPokemonDataOverview = await response.json();
}

async function fetchPokemonSpecies(id) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`
    let response = await fetch(url);
    currentPokemonDataSpecies = await response.json();
}

async function fetchPokemonEvolution(id) {
    let url = `https://pokeapi.co/api/v2/evolution-chain/${id}/`
    let response = await fetch(url);
    currentPokemonDataEvolution = await response.json();
}

// *************************************************************************
// Functions to extract and/or transform data from API response to own array

async function buildPokemonOwnArray() {
    for (let i = alreadyLoaded; i < load; i++) {
        if (i < pokemonLimit) {
            let id = extractStringBetweenSlashes(allPokemon['results'][i]['url']);
            let j = checkWhereIdIsInArray(id, allPokemonOwnArray);
            if (j < 0) {
                await loadPokemonForOwnArray(id);
            }
        }
    }
}

async function loadPokemonForOwnArray(id) {
    // get general data
    await fetchPokemonData(id);
    let name = currentPokemonDataOverview['name'];
    let pokemonData = getTemplatePokemonOwnArray(id, name);
    allPokemonOwnArray.push(pokemonData);

    // get evolution chain data
    let evolutionId = pokemonData['evolutionChainId'];
    buildPokemonEvolutionChainOwnArray(evolutionId);
}

async function getIndexExistingPokemonOrFetchNew(id) {
    let i = checkWhereIdIsInArray(id, allPokemonOwnArray);
    if (i >= 0) {
        return i;
    } else {
        await loadPokemonForOwnArray(id);
        i = checkWhereIdIsInArray(id, allPokemonOwnArray);
        return i;
    };
}

function loadGermanData(entries, key) {
    for (let i = 0; i < entries.length; i++) {
        if (entries[i]['language']['name'] === 'de') {
            return entries[i][key];
        }
    }
    return null;
}

function loadPokemonName() {
    const names = currentPokemonDataSpecies['names'];
    return loadGermanData(names, 'name');
}

function loadPokemonSpecies() {
    const species = currentPokemonDataSpecies['genera'];
    return loadGermanData(species, 'genus');
}

function loadPokemonFlavor() {
    const flavors = currentPokemonDataSpecies['flavor_text_entries'];
    return loadGermanData(flavors, 'flavor_text');
}

function extractDataFromObjectArray(array, key) {
    return array.map(item => item[key]);
}

function loadPokemonTypes() {
    const types = currentPokemonDataOverview['types'];
    return extractDataFromObjectArray(types, 'type').map(type => type['name']);
}

function loadPokemonAbilities() {
    const abilities = currentPokemonDataOverview['abilities'];
    return extractDataFromObjectArray(abilities, 'ability').map(ability => ability['name']);
}

function loadPokemonMoves() {
    const moves = currentPokemonDataOverview['moves'];
    return extractDataFromObjectArray(moves, 'move').map(move => move['name']);
}

function loadPokemonEggGroups() {
    const eggGroups = currentPokemonDataSpecies['egg_groups'];
    return extractDataFromObjectArray(eggGroups, 'name');
}

function loadPokemonBaseStats() {
    const baseStats = currentPokemonDataOverview['stats'];
    return extractDataFromObjectArray(baseStats, 'base_stat');
}

function loadPokemonEvolutionId() {
    let url = currentPokemonDataSpecies['evolution_chain']['url'];
    let id = extractStringBetweenSlashes(url);
    return id;
}

async function buildPokemonEvolutionChainOwnArray(id) {
    await fetchPokemonEvolution(id)
    if (checkWhereIdIsInArray(id, allPokemonEvolutionChains) < 0) {
        let numberOfEvolutions = getNumberOfEvolutions();
        let evolutionChain = [];
        let currentEvolution = currentPokemonDataEvolution['chain'];
        for (let i = 0; i < numberOfEvolutions; i++) {
            for (let j = 0; j < currentEvolution['evolves_to'].length; j++) {
                let evolutionChainChild = getArrayEvolutionChain(currentEvolution, j);
                evolutionChain.push(evolutionChainChild);
            }
            currentEvolution = currentEvolution.evolves_to[0];
        }
        allPokemonEvolutionChains.push(getTemplateEvolutionChainOwnArray(id, evolutionChain));
    }
}

function getArrayEvolutionChain(currentEvolution, i) {
    let evolutionDetails = currentEvolution['evolves_to'][i]['evolution_details'][0];
    let trigger = evolutionDetails['trigger']['name'];
    let minLevel = evolutionDetails['min_level'];
    let minHappiness = evolutionDetails['min_happiness'];
    let item = (trigger === 'use-item') ? evolutionDetails['item']['name'] : '';
    let heldItem = (trigger === 'trade' && evolutionDetails['held_item'] !== null) ? evolutionDetails['held_item']['name'] : '';
    let pokemonFromId = extractStringBetweenSlashes(currentEvolution['species']['url']);
    let pokemonToId = extractStringBetweenSlashes(currentEvolution['evolves_to'][i]['species']['url']);
    return getTemplateEvolutionChainOwnArrayChild(pokemonFromId, trigger, minLevel, minHappiness, item, heldItem, pokemonToId);
}

function getNumberOfEvolutions() {
    let numberOfEvolutions = 0;
    let currentEvolution = currentPokemonDataEvolution['chain'];
    while (currentEvolution.evolves_to.length > 0) {
        numberOfEvolutions += 1;
        currentEvolution = currentEvolution.evolves_to[0];
    }
    return numberOfEvolutions;
}

// *************************************************************
// Functions to extract and/or transform data from own PokeArray

function getPokemonTypes(pokemon) {
    let formattedTypes = '';
    for (let i = 0; i < pokemon.types.length; i++) {
        formattedTypes += `<div class="item ${pokemon.color}-item">${pokemon.types[i]}</div>`;
    }
    return formattedTypes;
}

function getPokemonHeight() {
    let cm = openedPokemon.height * 10;
    let feet = Math.floor(cm / 30.48);
    let inches = ((cm % 30.48) / 2.54).toFixed(1);
    let feetInch = `${feet}’${inches}"`;
    let m = (cm / 100).toFixed(2);
    return `${feetInch} (${m} m)`;
}

function getPokemonWeight() {
    let kg = openedPokemon.weight / 10;
    let lbs = (kg * 2.20462).toFixed(1);
    let kgString = kg.toFixed(1);
    return `${lbs} lbs (${kgString} kg)`;
}

function getPokemonAbility() {
    let formattedAbilities = [];
    for (let i = 0; i < openedPokemon.abilities.length; i++) {
        let ability = openedPokemon.abilities[i];
        formattedAbilities.push(ability.charAt(0).toUpperCase() + ability.slice(1));
    }
    return formattedAbilities.join(", ");
}

function getPokemonEggGroups() {
    let formattedEggGroups = [];
    for (let i = 0; i < openedPokemon.eggGroups.length; i++) {
        let eggGroup = openedPokemon.eggGroups[i];
        formattedEggGroups.push(eggGroup.charAt(0).toUpperCase() + eggGroup.slice(1));
    }
    return formattedEggGroups.join(', ');
}

function getPokemonGender() {
    let genderRate = openedPokemon.genderRate;
    if (genderRate >= 0) {
        let chanceMale = (100 - genderRate * 12.5);
        let chanceFemale = genderRate * 12.5;
        return getTemplateGenderFeMale(chanceMale, chanceFemale);
    } else {
        let chanceGenderless = 100;
        return getTemplateGenderGenderless(chanceGenderless);
    }
}

function getEvolutionTrigger(currentEvolution) {
    let trigger = currentEvolution['trigger'];
    let minLevel = currentEvolution['minLevel'];
    let minHappiness = currentEvolution['minHappiness'];
    let item = currentEvolution['item'];
    let heldItem = currentEvolution['heldItem'];

    if (trigger == 'level-up' && minHappiness > 0) {
        return `durch Level-Up<br>ab <b>Level ${minLevel}</b> und<br>min-happiness ${minHappiness}`;
    } else if (trigger == 'level-up') {
        return `durch Level-Up<br>ab <b>Level ${minLevel}</b>`;
    } else if (trigger == 'use-item') {
        return `durch <br><b>${item}</b>`;
    } else if (trigger == 'trade' && heldItem !== '') {
        return `durch Tausch<br>mit <b>${heldItem}</b>`;
    } else {
        return `durch ${trigger}`;
    }
}

