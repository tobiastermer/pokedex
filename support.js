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