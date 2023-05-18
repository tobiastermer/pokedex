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
    let i = checkWhereIdIsInArray(+openedPokemon.id + 1, allPokemonOwnArray)
    if (i >= 0) {
        renderCard(i);
    }
}

function previousPokemon() {
    let i = checkWhereIdIsInArray(+openedPokemon.id - 1, allPokemonOwnArray)
    if (i >= 0) {
        renderCard(i);
    }
}

async function renderCard(i) {
    openedPokemon = allPokemonOwnArray[i];
    renderCardUpperHalf();
    renderCardLowerHalf();
    renderCardAbout();
}

function renderCardUpperHalf() {
    let formattedId = formatNumber(openedPokemon.id, 3);
    let capitalizedName = capitalizeFirstLetter(openedPokemon.name);
    let types = getPokemonTypes(openedPokemon);
    document.getElementById('card').innerHTML = '';
    document.getElementById('card').innerHTML = getTemplateCardUpperHalf(capitalizedName, formattedId, openedPokemon.img, types, openedPokemon.color);
}

function renderCardLowerHalf() {
    document.getElementById('card').innerHTML += getTemplateCardLowerHalf();
}

function renderCardAbout() {
    toggleDescriptionLinkEffects(0);
    document.getElementById('description-content').innerHTML = getTemplateAbout();
    document.getElementById('pokemon-flavor').innerHTML = openedPokemon.flavor;
    document.getElementById('pokemon-species').innerHTML = openedPokemon.species;
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
    for (i = 0; i < openedPokemon.baseStats.length; i++) {
        let data = openedPokemon.baseStats[i];
        document.getElementById(`pokemon-bs${i}-number`).innerHTML = data;
        document.getElementById(`pokemon-bs${i}-graph`).innerHTML = createBaseStatsGraph(data, 150);
        total = total + data;
    }
    document.getElementById(`pokemon-bs6-number`).innerHTML = total;
    document.getElementById(`pokemon-bs6-graph`).innerHTML = createBaseStatsGraph(total, 700);
}

async function renderCardEvolution() {
    toggleDescriptionLinkEffects(2);
    document.getElementById('description-content').innerHTML = '';
    let i = checkWhereIdIsInArray(openedPokemon.evolutionChainId, allPokemonEvolutionChains);
    let evolutionStairs = allPokemonEvolutionChains[i]['stairs'];
    if (evolutionStairs.length > 0) {
        for (let j = 0; j < evolutionStairs.length; j++) {
            let pokemonFromId = evolutionStairs[j]['pokemonFromId'];
            let pokemonFromIndex = await getIndexExistingPokemonOrFetchNew(pokemonFromId);
            let pokemonToId = evolutionStairs[j]['pokemonToId'];
            let pokemonToIndex = await getIndexExistingPokemonOrFetchNew(pokemonToId);
            let pokemonFormattedTrigger = getEvolutionTrigger(evolutionStairs[j]);
            document.getElementById('description-content').innerHTML += getTemplateEvolutionStair(pokemonFromIndex, pokemonToIndex, pokemonFormattedTrigger);
        }
    } else {
        document.getElementById('description-content').innerHTML += getTemplateEvolutionStairNoEvolution(openedPokemon.id);
    }
}

function renderCardMoves(color) {
    toggleDescriptionLinkEffects(3);
    document.getElementById('description-content').innerHTML = getTemplateMovesContainer();
    for (let i = 0; i < openedPokemon.moves.length; i++) {
        let move = capitalizeFirstLetter(openedPokemon.moves[i]);
        document.getElementById('moves').innerHTML += getTemplateMoves(move);
    }
}
