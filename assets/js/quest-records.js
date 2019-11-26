
let HeaderList = [
    { key: "QuestName", header: "Quest", collapse:true, formatter: (x) => { return x; }},
    //{ key: "Ep", header: "Episode", collapse: false, formatter: (x) => {return "Episode "+x;}},
    { key: "TimeInSeconds", header: "Time", collapse: false, formatter: (x) => { return secondsToString(x); } },
    { key: "Players", header: "Players", collapse: false, formatter: (x) => { return playersToList(x);}},
    //{ key: "Server", header: "Server", collapse: false, formatter: (x) => {return serverCodeToName(x);}},
    { key: "TeamName", header: "Team Name", collapse: false, formatter: (x) => {return x || "";}},
]
let CurrentQuestName = "";
let SearchSettings = {
    sort: '',
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
    <a href="javascript:void(0)" onclick="sortBy('__HEADER__')">
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

function serverCodeToName(code){
    switch(code){
        case 0: return "2014";
        case 1: return "Vanilla";
        case 2: return "Gamecube";
        case 3: return "Ultima";
        case 4: return "Blue Burst";
        default: return "Unknown"
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
    if (arr[0] == null) return "";
    let result = ""+arr[0];
    for(let i=1; i < arr.length; i++){
        if (arr[i] !== null)
            result += "</br>"+arr[i];
    }
    return result;
}

function updateResults() {
    let data = record_data;
    
    // Do all filters
    data = _.filter(data, function(x) {
        if (SearchSettings.episode_1 && (x.Ep == 1)) {
            return true;
        }
        if (SearchSettings.episode_2 && (x.Ep == 2)) {
            return true;
        }
        if (SearchSettings.episode_4 && (x.Ep == 4)) {
            return true;
        }
        return false;
    });
    
    //data = _.filter(data, (x) => {return x.Ep == CurrentSearch.Ep;});
    
    //// sort
    //if (CurrentSearch.SortBy !== null) {
    //    data = _.sortBy(data,(x) => {return x["Place"];});
    //    data = _.sortBy(data,(x) => {return x[CurrentSearch.SortBy];});
    //}

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
    let color_index = 4;
    CurrentQuestName = null;
    for(let d=0; d < data.length; d++){
        let current_quest = data[d];
        let quest_row_string = "";
        if (CurrentQuestName !== current_quest.QuestName)
            color_index = 4;

        for(let i=0; i < HeaderList.length; i++){
            let element_string = RESULT_ELEMENT_VALUE_TEMPLATE.substring(0);
            let formatter = HeaderList[i].formatter;
            let value = formatter(current_quest[HeaderList[i].key]);
            let color_replacement = "";
            if (SearchSettings.sort == "QuestName" && HeaderList[i].key == "TimeInSeconds"){
                let color = Colors[color_index];
                if (color_index > 0)
                    color_index -= 1;
                color_replacement = "color='"+color+"'";
            }
            // if cell is in a collapsable column && our header
            if (HeaderList[i].collapse && current_quest.QuestName == CurrentQuestName) {
                element_string = element_string.replace("__VALUE__","");
                quest_row_string += element_string.replace("__COLOR__",color_replacement);
            } else {
                CurrentQuestName = current_quest.QuestName;
                element_string = element_string.replace("__VALUE__",value);
                quest_row_string += element_string.replace("__COLOR__",color_replacement);
            }
        }
        quest_row_string = RESULT_ELEMENT_TEMPLATE.substring(0).replace("__ELEMENT_VALUE_LIST__",quest_row_string);
        elementList_string += quest_row_string;
    }
    result_string = result_string.replace("__HEADER_LIST__",headerList_string);
    result_string = result_string.replace("__ELEMENT_LIST__",elementList_string);

    $('#results').empty();
    $('#results').append(result_string);
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

function sortBy(header){
    SearchSettings.sort = _.filter(HeaderList,(x)=>{return x.header === header;})[0].key;
    updateResults();
}
