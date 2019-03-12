
let HeaderList = [ 
	{ key: "QuestName", header: "Quest", collapse:true, formatter: (x) => { return x; }},
	//{ key: "Ep", header: "Episode", collapse: false, formatter: (x) => {return "Episode "+x;}},
	{ key: "TimeInSeconds", header: "Time", collapse: false, formatter: (x) => { return secondsToString(x); } },
	{ key: "Players", header: "Players", collapse: false, formatter: (x) => { return playersToList(x);}},
	//{ key: "Server", header: "Server", collapse: false, formatter: (x) => {return serverCodeToName(x);}},
	{ key: "TeamName", header: "Team Name", collapse: false, formatter: (x) => {return x || "";}},
]
let CurrentQuestName = "";
let CurrentSearch = {};
// from last to first
let Colors = ["#ffffff","#6bb6ff","#389dff","#0483ff","#006ad1"];

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
<div class="ui hidden divider"></div>
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
</div>
`

function serverCodeToName(code){
	switch(code){
		case 0: return "2014";
		case 1: return "Ultima";
		case 2: return "Gamecube";
		case 3: return "Vanilla";
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

function updateSearchTable() {
	CurrentHeader = [null,null,null,null];
	let data;
	if (CurrentSearch.GameMode === Enums.GameModeTypes.Challenge) data = recordData_cmode;
	if (CurrentSearch.GameMode === Enums.GameModeTypes.Normal) data = recordData_normal;

	// filter episode
	data = _.filter(data, (x) => {return x.Ep == CurrentSearch.Ep;});
	// filter server
	if (CurrentSearch.Serv !== null)	
		data = _.filter(data, (x) => {return x.Server == CurrentSearch.Serv;});
	// filter type
	data = _.filter(data, (x) => {return x.PlayerCount == CurrentSearch.PlayerCount;});

	// sort
	if (CurrentSearch.SortBy !== null) {
		data = _.sortBy(data,(x) => {return x["Place"];});
		data = _.sortBy(data,(x) => {return x[CurrentSearch.SortBy];});
	}

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
			if (CurrentSearch.SortBy == "QuestName" && HeaderList[i].key == "TimeInSeconds"){
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


function setupButtons() {
	$('#record_search_challenge').on('click', function () {
    	CurrentSearch.GameMode = Enums.GameModeTypes.Challenge;
		CurrentSearch.PlayerCount = $('#party_count_cmode').dropdown('get values');
		CurrentSearch.Ep = $('#episode_cmode').dropdown('get values');
		CurrentSearch.Serv = null;
		CurrentSearch.SortBy = "QuestName";
        updateSearchTable();
    });
    $('#record_search_normal').on('click', function () {
    	CurrentSearch.GameMode = Enums.GameModeTypes.Normal;
		CurrentSearch.PlayerCount = $('#party_count_normal').dropdown('get values');
		CurrentSearch.Ep = $('#episode_normal').dropdown('get values');
		CurrentSearch.Serv = $('#server_normal').dropdown('get values');
		CurrentSearch.SortBy = "QuestName";
        updateSearchTable();
    });
}

function sortBy(header){
	CurrentSearch.SortBy = _.filter(HeaderList,(x)=>{return x.header === header;})[0].key;
	updateSearchTable();
}

setupButtons();