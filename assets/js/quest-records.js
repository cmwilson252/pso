let ready = false;
let quests = null;
let records = null;
let HeaderList = [
    { key: "quest", header: "Quest", collapse:true, formatter: (x) => { return x.name; }},
    //{ key: "episode", header: "Episode", collapse: false, formatter: (x) => {return "Episode "+x;}},
    { key: "time", header: "Time", collapse: false, formatter: (x) => { return secondsToString(x); } },
    { key: "players", header: "Players", collapse: false, formatter: (x) => { return playersToList(x);}},
    { key: "meta", header: "Meta", collapse: false, formatter: (x) => {return metaToName(x);}},
    { key: "team", header: "Team", collapse: false, formatter: (x) => {return x || "";}},
]
let SearchSettings = {
    mode_normal: false,
    mode_challange: false,
    meta_vanilla: false,
    meta_2014: false,
    meta_gamecube: false,
    meta_ultima: false,
    episode_1: false,
    episode_2: false,
    episode_4: false,
    category_opm: false,
    category_1p: false,
    category_2p: false,
    category_3p: false,
    category_4p: false,
    pb_no: false,
    pb_yes: false,
    class_humar: false,
    class_hunewearl: false,
    class_hucast: false,
    class_hucaseal: false,
    class_ramar: false,
    class_ramarl: false,
    class_racast: false,
    class_racaseal: false,
    class_fomar: false,
    class_fomarl: false,
    class_fonewmn: false,
    class_fonewearl: false,
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

function playersToList(arr){
    let result = '';
    for (let i = 0; i < arr.length; i++) {
        if (i != 0) {
            result += '</br>';
        }
        result += arr[i].name;
    }
    return result;
}

function updateResults() {
    if (!ready) {
        $('#results').empty().append('Records not loaded');
        return;
    }
    
    let data = records;
    console.log(SearchSettings);
    // Do all filters
    data = _.filter(data, function(x) {
        // Mode
        if (SearchSettings.mode_normal && (x.mode == 'normal')) {
            return true;
        }
        if (SearchSettings.mode_challange && (x.mode == 'challenge')) {
            return true;
        }
        // Meta
        if (SearchSettings.meta_vanilla && (x.meta == 'vanilla')) {
            return true;
        }
        if (SearchSettings.meta_2014 && (x.meta == '2014')) {
            return true;
        }
        if (SearchSettings.meta_gamecube && (x.meta == 'gamecube')) {
            return true;
        }
        if (SearchSettings.meta_ultima && (x.meta == 'ultima')) {
            return true;
        }
        // Episiode
        if (SearchSettings.episode_1 && (x.episode == 1)) {
            return true;
        }
        if (SearchSettings.episode_2 && (x.episode == 2)) {
            return true;
        }
        if (SearchSettings.episode_4 && (x.episode == 4)) {
            return true;
        }
        // Category
        if (SearchSettings.category_opm && (x.category == 'opm')) {
            return true;
        }
        if (SearchSettings.category_1p && (x.category == '1p')) {
            return true;
        }
        if (SearchSettings.category_2p && (x.category == '2p')) {
            return true;
        }
        if (SearchSettings.category_3p && (x.category == '3p')) {
            return true;
        }
        if (SearchSettings.category_4p && (x.category == '4p')) {
            return true;
        }
        // Photon Blast
        if (SearchSettings.pb_no && (x.pb == false)) {
            return true;
        }
        if (SearchSettings.pb_yes && (x.pb == true)) {
            return true;
        }
        // Class
        if (SearchSettings.class_humar && (x.class == 'humar')) {
            return true;
        }
        if (SearchSettings.class_hunewearl && (x.class == 'hunewearl')) {
            return true;
        }
        if (SearchSettings.class_hucast && (x.class == 'hucast')) {
            return true;
        }
        if (SearchSettings.class_hucaseal && (x.class == 'hucaseal')) {
            return true;
        }
        if (SearchSettings.class_ramar && (x.class == 'ramar')) {
            return true;
        }
        if (SearchSettings.class_ramarl && (x.class == 'ramarl')) {
            return true;
        }
        if (SearchSettings.class_racast && (x.class == 'racast')) {
            return true;
        }
        if (SearchSettings.class_racaseal && (x.class == 'racaseal')) {
            return true;
        }
        if (SearchSettings.class_fomar && (x.class == 'fomar')) {
            return true;
        }
        if (SearchSettings.class_fomarl && (x.class == 'fomarl')) {
            return true;
        }
        if (SearchSettings.class_fonewmn && (x.class == 'fonewmn')) {
            return true;
        }
        if (SearchSettings.class_fonewearl && (x.class == 'fonewearl')) {
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
    SearchSettings.mode_normal = updateSearchSetting('mode_normal');
    SearchSettings.mode_challange = updateSearchSetting('mode_challange');
    SearchSettings.meta_vanilla = updateSearchSetting('meta_vanilla');
    SearchSettings.meta_2014 = updateSearchSetting('meta_2014');
    SearchSettings.meta_gamecube = updateSearchSetting('meta_gamecube');
    SearchSettings.meta_ultima = updateSearchSetting('meta_ultima');
    SearchSettings.episode_1 = updateSearchSetting('episode_1');
    SearchSettings.episode_2 = updateSearchSetting('episode_2');
    SearchSettings.episode_4 = updateSearchSetting('episode_4');
    SearchSettings.category_opm = updateSearchSetting('category_opm');
    SearchSettings.category_1p = updateSearchSetting('category_1p');
    SearchSettings.category_2p = updateSearchSetting('category_2p');
    SearchSettings.category_3p = updateSearchSetting('category_3p');
    SearchSettings.category_4p = updateSearchSetting('category_4p');
    SearchSettings.pb_no = updateSearchSetting('pb_no');
    SearchSettings.pb_yes = updateSearchSetting('pb_yes');
    SearchSettings.class_humar = updateSearchSetting('class_humar');
    SearchSettings.class_hunewearl = updateSearchSetting('class_hunewearl');
    SearchSettings.class_hucast = updateSearchSetting('class_hucast');
    SearchSettings.class_hucaseal = updateSearchSetting('class_hucaseal');
    SearchSettings.class_ramar = updateSearchSetting('class_ramar');
    SearchSettings.class_ramarl = updateSearchSetting('class_ramarl');
    SearchSettings.class_racast = updateSearchSetting('class_racast');
    SearchSettings.class_racaseal = updateSearchSetting('class_racaseal');
    SearchSettings.class_fomar = updateSearchSetting('class_fomar');
    SearchSettings.class_fomarl = updateSearchSetting('class_fomarl');
    SearchSettings.class_fonewmn = updateSearchSetting('class_fonewmn');
    SearchSettings.class_fonewearl = updateSearchSetting('class_fonewearl');
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
