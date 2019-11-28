let ready = false;
let quests = null;
let records = null;
let HeaderList = [
    { key: "quest", header: "Quest", collapse:true, formatter: (x) => { return x.name; }},
    //{ key: "episode", header: "Episode", collapse: false, formatter: (x) => {return "Episode "+x;}},
    { key: "time", header: "Time", collapse: false, formatter: (x) => { return secondsToString(x); } },
    { key: "players", header: "Players", collapse: false, formatter: (x) => { return playersToList(x);}},
    //{ key: "meta", header: "Meta", collapse: false, formatter: (x) => {return metaToName(x);}},
    { key: "team", header: "Team", collapse: false, formatter: (x) => {return x || "";}},
]
let SearchSettings = {
    mode: {
        normal: false,
        challange: false,
    },
    meta: {
        vanilla: false,
        _2014: false,
        gamecube: false,
        ultima: false,
    },
    episode: {
        _1: false,
        _2: false,
        _4: false,
    },
    category: {
        opm: false,
        _1p: false,
        _2p: false,
        _3p: false,
        _4p: false,
    },
    pb: {
        no: false,
        yes: false,
    },
    class: {
        humar: false,
        hunewearl: false,
        hucast: false,
        hucaseal: false,
        ramar: false,
        ramarl: false,
        racast: false,
        racaseal: false,
        fomar: false,
        fomarl: false,
        fonewmn: false,
        fonewearl: false,
    }
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
    <font __COLOR__>
        __VALUE__
    </font>
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
        case 'fonewmn':     return 'FOnewmn';
        case 'fonewearl':   return 'FOnewearl';
        default: return "Unknown";
    }
}

function playersToList(arr){
    let result = '';
    for (let i = 0; i < arr.length; i++) {
        if (i != 0) {
            result += '</br>';
        }
        result += arr[i].name;
        result += ' - ';
        result += classKeyToName(arr[i].class);
    }
    return result;
}

function updateResults() {
    if (!ready) {
        $('#results').empty().append('Records not loaded');
        return;
    }
    
    let data = records;
    // Do all filters
    data = _.filter(data, function(x) {
        // Mode
        if (SearchSettings.mode.normal && (x.mode == 'normal')) {
            return true;
        }
        if (SearchSettings.mode.challange && (x.mode == 'challenge')) {
            return true;
        }
        // Meta
        if (SearchSettings.meta.vanilla && (x.meta == 'vanilla')) {
            return true;
        }
        if (SearchSettings.meta._2014 && (x.meta == '2014')) {
            return true;
        }
        if (SearchSettings.meta.gamecube && (x.meta == 'gamecube')) {
            return true;
        }
        if (SearchSettings.meta.ultima && (x.meta == 'ultima')) {
            return true;
        }
        // Episiode
        if (SearchSettings.episode._1 && (x.episode == 1)) {
            return true;
        }
        if (SearchSettings.episode._2 && (x.episode == 2)) {
            return true;
        }
        if (SearchSettings.episode._4 && (x.episode == 4)) {
            return true;
        }
        // Category
        if (SearchSettings.category.opm && (x.category == 'opm')) {
            return true;
        }
        if (SearchSettings.category._1p && (x.category == '1p')) {
            return true;
        }
        if (SearchSettings.category._2p && (x.category == '2p')) {
            return true;
        }
        if (SearchSettings.category._3p && (x.category == '3p')) {
            return true;
        }
        if (SearchSettings.category._4p && (x.category == '4p')) {
            return true;
        }
        // Photon Blast
        if (SearchSettings.pb.no && (x.pb == false)) {
            return true;
        }
        if (SearchSettings.pb.yes && (x.pb == true)) {
            return true;
        }
        // Class
        let class_check = false;
        Object.keys(SearchSettings.class).forEach(function(key,index) {
            if (SearchSettings.class[key]) {
                for (let i = 0; i < x.players.length; i++) {
                    if (x.players[i].class == key) {
                        class_check = true;
                    }
                }
            }
        });
        if (class_check) {
            return true;
        }
        return false;
    });
    
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
    let current_quest_id = null;
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
            let color_replacement = "";
            // if cell is in a collapsable column && our header
            if (HeaderList[i].collapse && current_quest.quest_id == current_quest_id) {
                element_string = element_string.replace("__VALUE__","");
                quest_row_string += element_string.replace("__COLOR__",color_replacement);
            } else {
                current_quest_id = current_quest.quest_id;
                element_string = element_string.replace("__VALUE__",value);
                quest_row_string += element_string.replace("__COLOR__",color_replacement);
            }
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
    SearchSettings.mode.normal = updateSearchSetting('mode_normal');
    SearchSettings.mode.challange = updateSearchSetting('mode_challange');
    SearchSettings.meta.vanilla = updateSearchSetting('meta_vanilla');
    SearchSettings.meta._2014 = updateSearchSetting('meta_2014');
    SearchSettings.meta.gamecube = updateSearchSetting('meta_gamecube');
    SearchSettings.meta.ultima = updateSearchSetting('meta_ultima');
    SearchSettings.episode._1 = updateSearchSetting('episode_1');
    SearchSettings.episode._2 = updateSearchSetting('episode_2');
    SearchSettings.episode._4 = updateSearchSetting('episode_4');
    SearchSettings.category.opm = updateSearchSetting('category_opm');
    SearchSettings.category._1p = updateSearchSetting('category_1p');
    SearchSettings.category._2p = updateSearchSetting('category_2p');
    SearchSettings.category._3p = updateSearchSetting('category_3p');
    SearchSettings.category._4p = updateSearchSetting('category_4p');
    SearchSettings.pb.no = updateSearchSetting('pb_no');
    SearchSettings.pb.yes = updateSearchSetting('pb_yes');
    SearchSettings.class.humar = updateSearchSetting('class_humar');
    SearchSettings.class.hunewearl = updateSearchSetting('class_hunewearl');
    SearchSettings.class.hucast = updateSearchSetting('class_hucast');
    SearchSettings.class.hucaseal = updateSearchSetting('class_hucaseal');
    SearchSettings.class.ramar = updateSearchSetting('class_ramar');
    SearchSettings.class.ramarl = updateSearchSetting('class_ramarl');
    SearchSettings.class.racast = updateSearchSetting('class_racast');
    SearchSettings.class.racaseal = updateSearchSetting('class_racaseal');
    SearchSettings.class.fomar = updateSearchSetting('class_fomar');
    SearchSettings.class.fomarl = updateSearchSetting('class_fomarl');
    SearchSettings.class.fonewmn = updateSearchSetting('class_fonewmn');
    SearchSettings.class.fonewearl = updateSearchSetting('class_fonewearl');
}

$('#search').on('click', function() {
    updateSearchSettings();
    updateResults();
});

getJSON5('data/records.json', (function(data) {
    records = data;
    getJSON5('data/quests.json', (function(data) {
        quests = data;
        records.forEach(function(record) {
            record.quest = quests.find(x => x.id == record.quest_id);
        });
        ready = true;
        updateSearchSettings();
        updateResults();
        console.log('Page ready');
    }));
}));
