// *****************************************
// API-Functions to get Data for all Pokemon

async function loadAllPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=${pokemonLimit}&offset=0`;
    let response = await fetch(url);
    allPokemon = await response.json();
}

async function loadAllPokemonGender() {
    allPokemonDataGender = [];
    for (let i = 0; i < 3; i++) { // 1 female, 2 male, 3 genderless
        let id = i + 1;
        let url = `https://pokeapi.co/api/v2/gender/${id}`;
        let response = await fetch(url);
        let responseAsJson = await response.json();
        allPokemonDataGender[i] = responseAsJson;
    }
}

// ********************************************
// API-Functions to get Data for single Pokemon

async function loadPokemonData(id) {
    await loadPokemonOverview(id);
    await loadPokemonSpecies(id);
}

async function loadPokemonOverview(id) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    currentPokemonDataOverview = await response.json();
    // console.log(currentPokemonDataOverview);
}

async function loadPokemonSpecies(id) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`
    let response = await fetch(url);
    currentPokemonDataSpecies = await response.json();
    // console.log(currentPokemonDataSpecies);
}

async function loadPokemonEvolution() {
    let url = 'https://pokeapi.co/api/v2/evolution-chain/2/'
    let response = await fetch(url);
    currentPokemonDataEvolution = await response.json();
    console.log(currentPokemonDataEvolution);
}

// ************************************************************
// Functions to extract and/or transform data from API response

async function buildPokemonOwnArray() {
    for (let i = allPokemonOwnArray.length; i < load; i++) {
        if (i < pokemonLimit) {
            let id = i + 1;
            let name = allPokemon['results'][i]['name'];
            await loadPokemonData(id);
            let pokemonData = getTemplatePokemonOwnArray(id, name);
            allPokemonOwnArray.push(pokemonData);
        }
    }
}

function loadPokemonTypes() {
    let types = currentPokemonDataOverview['types'];
    let typesExtract = [];
    for (let i = 0; i < types.length; i++) {
        let type = types[i]['type']['name'];
        typesExtract.push(type);
    }
    return typesExtract;
}

function loadPokemonAbilities() {
    let abilities = currentPokemonDataOverview['abilities'];
    let abilitiesExtract = [];
    for (let i = 0; i < abilities.length; i++) {
        let abilityName = abilities[i]['ability']['name'];
        abilitiesExtract.push(abilityName);
    }
    return abilitiesExtract;
}

function loadPokemonEggGroups() {
    let eggGroups = currentPokemonDataSpecies['egg_groups'];
    let eggGroupNames = [];
    for (let i = 0; i < eggGroups.length; i++) {
        let eggGroupName = eggGroups[i]['name'];
        eggGroupNames.push(eggGroupName);
    }
    return eggGroupNames;
}

function loadPokemonBaseStats() {
    let baseStats = currentPokemonDataOverview['stats'];
    let baseStatsExtract = [];
    for (i = 0; i < baseStats.length; i++) {
        let baseStat = baseStats[i]['base_stat'];
        baseStatsExtract.push(baseStat);
    }
    return baseStatsExtract;
}

function loadPokemonMoves() {
    let moves = currentPokemonDataOverview['moves'];
    let movesExtracted = [];
    for (let i = 0; i < moves.length; i++) {
        let move = currentPokemonDataOverview['moves'][i]['move']['name'];
        movesExtracted.push(move);
    }
    return movesExtracted;
}

function loadPokemonEvolutionId() {
    let url = currentPokemonDataSpecies['evolution_chain']['url'];
    let lastSlashIndex = url.lastIndexOf('/');
    let secondLastSlashIndex = url.lastIndexOf('/', lastSlashIndex - 1);
    let id = url.substring(secondLastSlashIndex + 1, lastSlashIndex);
    return id;
}

function loadPokemonGender(name) {
    let pokemonGenderRates = [];
    for (let i = 0; i < allPokemonDataGender.length; i++) {
        let pokemonSpeciesDetailsPerGender = allPokemonDataGender[i]['pokemon_species_details'];
        let gender = allPokemonDataGender[i]['name'];
        for (let j = 0; j < pokemonSpeciesDetailsPerGender.length; j++) {
            let pokemonName = pokemonSpeciesDetailsPerGender[j]['pokemon_species']['name'];
            let pokemonGenderRate = pokemonSpeciesDetailsPerGender[j]['rate'];
            if (name == pokemonName) {
                let pokemonGenderInfos = {
                    'gender': gender,
                    'genderRate': pokemonGenderRate
                };
                pokemonGenderRates.push(pokemonGenderInfos);
                j = pokemonSpeciesDetailsPerGender.length;
            }
        }
    }
    return pokemonGenderRates;
}

// *************************************************************
// Functions to extract and/or transform data from own PokeArray

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

function getPokemonGender() {
    let formattedGender = [];
    let gender = currentPokemon.gender[0]['gender'];
    let genderRate = currentPokemon.gender[0]['genderRate'];
    if (genderRate >= 0) {
        let chanceMale = (100 - genderRate * 12.5);
        let chanceFemale = genderRate * 12.5;
        return getTemplateGenderFeMale(chanceMale, chanceFemale);
    } else {
        let chanceGenderless = 100;
        return getTemplateGenderGenderless(chanceGenderless);
    }
}

async function getPokemonEvolutionChain() {
    evolutionChain = [];

    let name = currentPokemonDataEvolution['chain']['evolves_to'][0]['species']['name'];
    let id = await getPokemonIdByName(name);
    let level = currentPokemonDataEvolution['chain']['evolves_to'][0]['evolution_details'][0]['min_level'];
    let trigger = currentPokemonDataEvolution['chain']['evolves_to'][0]['evolution_details'][0]['trigger']['name'];

    console.log(name, id, level, trigger)
}

