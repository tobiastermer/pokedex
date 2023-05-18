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

function extractStringBetweenSlashes(inputUrl) {
    let url = inputUrl;
    let lastSlashIndex = url.lastIndexOf('/');
    let secondLastSlashIndex = url.lastIndexOf('/', lastSlashIndex - 1);
    let id = url.substring(secondLastSlashIndex + 1, lastSlashIndex);
    return id;
}

function checkWhereIdIsInArray(id, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i]['id'] == id) {
            return i;
        }
    }
    return -1;
}