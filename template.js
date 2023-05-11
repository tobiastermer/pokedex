function getTemplatePokedex(name, id, img, types, color) {
    return `<div class="mini-card ${color}">
                <div class="mini-card-header">           
                    <h4>${name}</h4>
                    <p>${id}</p>
                </div>
                <div class="pokemon-types">${types}</div>
                <img src="${img}">
            </div>`;
}

function getTemplateAbout() {
    return `<table>
                <tr>
                    <td>Species</td>
                    <td id="pokemon-species"></td>
                </tr>
                <tr>
                    <td>Height</td>
                    <td id="pokemon-height"></td>
                </tr>
                <tr>
                    <td>Weight</td>
                    <td id="pokemon-weight"></td>
                </tr>
                <tr>
                    <td>Abilities</td>
                    <td id="pokemon-abilities"></td>
                </tr>
            </table>

            <h3>Breeding</h3>

            <table>
                <tr>
                    <td>Gender</td>
                    <td id="pokemon-gender"></td>
                </tr>
                <tr>
                    <td>Egg Groups</td>
                    <td id="pokemon-eggGroups"></td>
                </tr>
                <tr>
                    <td>Egg Cycle</td>
                    <td id="pokemon-eggCycle"></td>
                </tr>
            </table>`
}

function getTemplateBaseStats() {
    return `<table>
                <tr>
                    <td>HP</td>
                    <td id="pokemon-bs0-number"></td>
                    <td id="pokemon-bs0-graph"></td>                    
                </tr>
                <tr>
                    <td>Attack</td>
                    <td id="pokemon-bs1-number"></td>
                    <td id="pokemon-bs1-graph"></td>                    
                </tr>
                <tr>
                    <td>Defense</td>
                    <td id="pokemon-bs2-number"></td>
                    <td id="pokemon-bs2-graph"></td>                    
                </tr>
                <tr>
                    <td>Sp. Atk</td>
                    <td id="pokemon-bs3-number"></td>
                    <td id="pokemon-bs3-graph"></td>                    
                </tr>
                <tr>
                    <td>Sp. Def</td>
                    <td id="pokemon-bs4-number"></td>
                    <td id="pokemon-bs4-graph"></td>                    
                </tr>
                <tr>
                    <td>Speed</td>
                    <td id="pokemon-bs5-number"></td>
                    <td id="pokemon-bs5-graph"></td>                    
                </tr>
                <tr>
                    <td>Total</td>
                    <td id="pokemon-bs6-number"></td>
                    <td id="pokemon-bs6-graph"></td>                    
                </tr>
            </table>`
}

function createBaseStatsGraph(data, maxValue) {
    let progress = data / maxValue * 100;
    let colour;
    if (data < maxValue * 0.5) {
        colour = 'bg-danger';
    } else {
        colour = 'bg-success';
    };

    return `<div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="${maxValue}">
                <div class="progress-bar ${colour}" style="width: ${progress}%"></div>
            </div>`;
}

function getTemplateEvolution() {
    return `<div>
    
    <img id="evolution-img-0" class="pokemon-evolution-img" src="" alt="">

    </div>`
}