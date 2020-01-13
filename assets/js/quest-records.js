let ready = false;
let quests = null;
let records = null;
let HeaderList = [
    {
        key: "meta",
        header: "Meta",
        collapse: false,
        last_value: null,
        formatter: (x) => {
            return metaToName(x);
        }
    },
    {
        key: "episode",
        header: "Episode",
        collapse: false,
        last_value: null,
        formatter: (x) => {
            return "Episode "+x;
        }
    },
    {
        key: "quest",
        header: "Quest",
        collapse: true,
        last_value: null,
        formatter: (x) => {
            return x.name;
        }
    },
    {
        key: "time",
        header: "Time",
        collapse: false,
        last_value: null,
        formatter: (x) => {
            return secondsToString(x);
        }
    },
    {
        key: "players",
        header: "Players",
        collapse: false,
        last_value: null,
        formatter: (x) => {
            return playerNamesToList(x);
        }
    },
    {
        key: "players",
        header: "Classes",
        collapse: false,
        last_value: null,
        formatter: (x) => {
            return playerClassesToList(x);
        }
    },
    {
        key: "team",
        header: "Team",
        collapse: false,
        last_value: null,
        formatter: (x) => {
            return x || "";
        }
    },
]
let SearchSettings = {
    modes: [],
    metas: [],
    episodes: [],
    categories: [],
    photon_blasts: [],
    classes: [],
    players: [],
};
// from last to first
let Colors = ["#B3E5FC","#4FC3F7","#03A9F4","#0288D1","#01579B"];

let RESULT_ELEMENT_TEMPLATE = `
<tr>
    __ELEMENT_VALUE_LIST__
</tr>
`
let RESULT_ELEMENT_VALUE_TEMPLATE = `
<td>
    __VALUE__
</td>
`
let RESULT_HEADER_TEMPLATE = `
<th>
    <a>
        __HEADER__
    </a>
</th>
`
let RESULT_LIST_TEMPLATE = `
<table class="ui selectable inverted table">
    <thead>
        <tr>
            __HEADER_LIST__
        </tr>
    </thead>
    <tbody>
    __ELEMENT_LIST__
    </tbody>
</table>
`

function metaToName(code){
    switch(code){
        case '2014': return "2014";
        case 'vanilla': return "Vanilla";
        case 'gamecube': return "Gamecube";
        case 'ultima': return "Ultima";
        case 'blueburst': return "Blue Burst";
        default: return "Unknown";
    }
}

function secondsToString(seconds){
    let hours = ""+Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    let min = ""+Math.floor(seconds / 60);
    seconds = ""+seconds % 60;
    return ""+hours+"\'"+min.padStart(2,'0')+"\""+seconds.padStart(2,'0');
}

function classKeyToName(key) {
    switch (key) {
        case 'humar':       return 'HUmar';
        case 'hunewearl':   return 'HUnewearl';
        case 'hucast':      return 'HUcast';
        case 'hucaseal':    return 'HUcaseal';
        case 'ramar':       return 'RAmar';
        case 'ramarl':      return 'RAmarl';
        case 'racast':      return 'RAcast';
        case 'racaseal':    return 'RAcaseal';
        case 'fomar':       return 'FOmar';
        case 'fomarl':      return 'FOmarl';
        case 'fonewm':     return 'FOnewm';
        case 'fonewearl':   return 'FOnewearl';
        default: return "Unknown";
    }
}

function playerNamesToList(arr){
    let result = '';
    for (let i = 0; i < arr.length; i++) {
        if (i != 0) {
            result += '</br>';
        }
        result += arr[i].name;
    }
    return result;
}
function playerClassesToList(arr){
    let result = '';
    for (let i = 0; i < arr.length; i++) {
        if (i != 0) {
            result += '</br>';
        }
        result += classKeyToName(arr[i].class);
    }
    return result;
}

function xor(a, b) {
    return (a || b) && !(a && b);
}

function filterData() {
    let data = records;
    // Do all filters
    data = _.filter(data, function(x) {
        // Record included by default
        // If no options in a group are selected, keep it that way
        // If options in a group are selected, only include matching ones
        let result = true;
        
        // Mode
        if (SearchSettings.modes.length > 0) {
            let group = false;
            SearchSettings.modes.forEach(function (mode) {
                if (x.mode == mode) {
                    group = true;
                }
            });
            
            if (!group) {
                result = false;
            }
        }
        // Meta
        if (SearchSettings.metas.length > 0) {
            let group = false;
            SearchSettings.metas.forEach(function (meta) {
                if (x.meta == meta) {
                    group = true;
                }
            });
            
            if (!group) {
                result = false;
            }
        }
        // Episode
        if (SearchSettings.episodes.length > 0) {
            let group = false;
            SearchSettings.episodes.forEach(function (episode) {
                if (x.episode == episode) {
                    group = true;
                }
            });
            
            if (!group) {
                result = false;
            }
        }
        // Category
        if (SearchSettings.categories.length > 0) {
            let group = false;
            SearchSettings.categories.forEach(function (category) {
                if (x.category == category) {
                    group = true;
                }
            });
            
            if (!group) {
                result = false;
            }
        }
        // Photon Blast
        if (SearchSettings.photon_blasts.length > 0) {
            let group = false;
            SearchSettings.photon_blasts.forEach(function (photon_blast) {
                if (String(x.pb) == photon_blast) {
                    group = true;
                }
            });
            
            if (!group) {
                result = false;
            }
        }
        // Classes
        if (SearchSettings.classes.length > 0) {
            let group = false;
            SearchSettings.classes.forEach(function (className) {
                for (let i = 0; i < x.players.length; i++) {
                    if (x.players[i].class == className) {
                        group = true;
                        break;
                    }
                }
            });
            
            if (!group) {
                result = false;
            }
        }
        // Player names
        if (SearchSettings.players.length > 0) {
            let group = false;
            SearchSettings.players.forEach(function (player) {
                for (let i = 0; i < x.players.length; i++) {
                    if (x.players[i].name == player) {
                        group = true;
                        break;
                    }
                }
            });
            
            if (!group) {
                result = false;
            }
        }
        
        return result;
    });
    return data;
}
function updateResults() {
    if (!ready) {
        $('#results').empty().append('Records not loaded');
        return;
    }
    
    let data = filterData();
    
    // Sort by time and group by quest (flatten afterwards)
    data = _.sortBy(data, function(x) {
        if (x.quest.is_countdown) {
            return x.time * -1;
        } else {
            return x.time;
        }
    });
    data = _.groupBy(data, x => x.quest_id);
    data = _.flatMap(data, x => x);

    let result_string = RESULT_LIST_TEMPLATE.substring(0);
    // build header list
    let headerList_string = "";
    for(let i=0; i < HeaderList.length; i++){
        let header_string = RESULT_HEADER_TEMPLATE.substring(0);
        header_string = header_string.replace(/__HEADER__/g, HeaderList[i].header)
        headerList_string += header_string;
    }
    // build results list
    let elementList_string = "";
    for(let d=0; d < data.length; d++){
        let current_quest = data[d];
        let quest_row_string = "";

        for(let i=0; i < HeaderList.length; i++){
            let element_string = RESULT_ELEMENT_VALUE_TEMPLATE.substring(0);
            let formatter = HeaderList[i].formatter;
            let value = formatter(current_quest[HeaderList[i].key]);
            
            if (current_quest.quest.is_countdown && HeaderList[i].key == 'time') {
                value = "Remaining: "+value;
            }
            
            if (HeaderList[i].collapse && HeaderList[i].last_value == value) {
                element_string = element_string.replace("__VALUE__","");
            } else {
                element_string = element_string.replace("__VALUE__",value);
                HeaderList[i].last_value = value;
            }
            quest_row_string += element_string;
        }
        quest_row_string = RESULT_ELEMENT_TEMPLATE.substring(0).replace("__ELEMENT_VALUE_LIST__",quest_row_string);
        elementList_string += quest_row_string;
    }
    result_string = result_string.replace("__HEADER_LIST__",headerList_string);
    result_string = result_string.replace("__ELEMENT_LIST__",elementList_string);

    $('#results').empty().append(result_string);
}

function updateSearchSetting(id) {
    let result = true;
    let checkbox = $('#'+id).closest('.checkbox');
    result = checkbox.checkbox('is checked');
    return result;
}
function updateSearchSettings() {
    SearchSettings.modes = $('#modes').dropdown('get values');
    SearchSettings.metas = $('#metas').dropdown('get values');
    SearchSettings.episodes = $('#episodes').dropdown('get values');
    SearchSettings.categories = $('#categories').dropdown('get values');
    SearchSettings.photon_blasts = $('#photon_blasts').dropdown('get values');
    SearchSettings.classes = $('#classes').dropdown('get values');
    SearchSettings.players = $('#players').dropdown('get values');
}

$('#search').on('click', function() {
    updateSearchSettings();
    updateResults();
    $('html, body').animate({
        scrollTop: $("#results").offset().top - 50,
    }, 500);
});

function updateDropdownColumns() {
    $('.columned').removeClass('column one two three four');
    if (window.innerWidth <= 375) {
        $('.columned').addClass('one');
    } else if (window.innerWidth <= 480) {
        $('.columned').addClass('two');
    } else if (window.innerWidth <= 768) {
        $('.columned').addClass('three');
    } else {
        $('.columned').addClass('four');
    }
    $('.columned').addClass('column');
}

function setupPage() {
    let players = [];
    records.forEach(function(record) {
        record.quest = quests.find(x => x.id == record.quest_id);
        record.players.forEach(function(player) {
            let current_player = players.find(x => x.name == player.name);
            if (current_player != undefined) {
                current_player.records++;
            } else {
                players.push({
                    name: player.name,
                    records: 1,
                });
            }
        });
    });
    players = _.sortBy(players, ['name']);
    
    let dropdown = {
        values: [],
    };
    players.forEach(function(player) {
        dropdown.values.push({
            value: player.name,
            //text: player.name+' ('+player.records+')',
            name: player.name+' ('+player.records+')',
        });
    });
    
    $('#modes').dropdown({
        values: [
            {
                name: 'Normal',
                value: 'normal'
            },
            {
                name : 'Challenge',
                value : 'challenge',
            }
        ]
    });
    $('#metas').dropdown({
        values: [
            {
                name: 'Vanilla',
                value: 'vanilla'
            },
            {
                name : '2014',
                value : '2014',
            },
            {
                name : 'Gamecube',
                value : 'gamecube',
            },
            {
                name : 'Ultima',
                value : 'ultima',
            }
        ]
    });
    $('#episodes').dropdown({
        values: [
            {
                name: 'Episode 1',
                value: '1'
            },
            {
                name : 'Episode 2',
                value : '2',
            },
            {
                name : 'Episode 4',
                value : '4',
            }
        ]
    });
    $('#categories').dropdown({
        values: [
            {
                name: 'OPM',
                value: 'opm'
            },
            {
                name : '1P',
                value : '1p',
            },
            {
                name : '2P',
                value : '2p',
            },
            {
                name : '3P',
                value : '3p',
            },
            {
                name : '4P',
                value : '4p',
            }
        ]
    });
    $('#photon_blasts').dropdown({
        values: [
            {
                name: 'No PB',
                value: 'false'
            },
            {
                name : 'PB',
                value : 'true',
            }
        ]
    });
    $('#classes').dropdown({
        values: [
            {
                name: 'HUmar',
                value: 'humar'
            },
            {
                name: 'HUnewearl',
                value: 'hunewearl'
            },
            {
                name: 'HUcast',
                value: 'hucast'
            },
            {
                name: 'HUcaseal',
                value: 'hucaseal'
            },
            {
                name: 'RAmar',
                value: 'ramar'
            },
            {
                name: 'RAmarl',
                value: 'ramarl'
            },
            {
                name: 'RAcast',
                value: 'racast'
            },
            {
                name: 'RAcaseal',
                value: 'racaseal'
            },
            {
                name: 'FOmar',
                value: 'fomar'
            },
            {
                name: 'FOmarl',
                value: 'fomarl'
            },
            {
                name: 'FOnewm',
                value: 'fonewm'
            },
            {
                name: 'FOnewearl',
                value: 'fonewearl'
            }
        ]
    });
    $('#players').dropdown(dropdown);
    
    $(window).on('resize', _.debounce(function () {
        updateDropdownColumns();
    }, 250));
    updateDropdownColumns();
};

getJSON5('data/records.json', (function(data) {
    records = data;
    getJSON5('data/quests.json', (function(data) {
        quests = data;
        
        setupPage();
        
        ready = true;
        console.log('Page ready');
    }));
}));
