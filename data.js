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

// ************************************************************
// Functions to extract and/or transform data from API response

async function buildPokemonCleanArray() {
    for (let i = 0; i < allPokemon['results'].length; i++) {
        let id = i + 1;
        let name = allPokemon['results'][i]['name'];
        await loadPokemonData(id);
        let pokemonData = getTemplatePokemonCleanArray(id, name);
        allPokemonCleanArray.push(pokemonData);
    }
    console.log(allPokemonCleanArray);
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

function loadPokemonBasicInfos() {
    
}