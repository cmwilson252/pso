
let HeaderList = [ 
	{ key: "QuestName", header: "Quest", formatter: (x) => { return x; }},
	//{ key: "Ep", header: "Episode", formatter: (x) => {return "Episode "+x;}},
	{ key: "TimeInSeconds", header: "Time", formatter: (x) => { return secondsToString(x); } },
	{ key: "Players", header: "Players", formatter: (x) => { return playersToList(x);}},
	//{ key: "Server", header: "Server", formatter: (x) => {return serverCodeToName(x);}},
]

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
	__HEADER__
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
		case 0: return "Ultima";
		case 1: return "2014";
		case 2: return "Gamecube";
		case 3: return "Vanilla";
		default: return "Unknown"
	}
}

function secondsToString(seconds){
	let hours = Math.floor(seconds / 3600);
	seconds = seconds % 3600;
	let min = Math.floor(seconds / 60);
	seconds = seconds % 60;
	return ""+hours+"\'"+min+"\""+seconds;
}

function playersToList(arr){
	if (arr[0] == null) return "";
	let result = ""+arr[0];
	for(let i=1; i < arr.length; i++){
		result += "</br>"+arr[i];
	}
	return result;
}

function search(type, ep, playerCount, serv=null) {
	let data;
	if (type === Enums.GameModeTypes.Challenge) data = recordData_cmode;
	if (type === Enums.GameModeTypes.Normal) data = recordData_normal;

	// filter episode
	data = _.filter(data, (x) => {return x.Ep == ep;});
	// filter server
	if (serv !== null)	
		data = _.filter(data, (x) => {return x.Server == serv;});
	// filter type
	data = _.filter(data, (x) => {return x.PlayerCount == playerCount;});

	let result_string = RESULT_LIST_TEMPLATE.substring(0);
	// build header list
	let headerList_string = "";
	for(let i=0; i < HeaderList.length; i++){
		let header_string = RESULT_HEADER_TEMPLATE.substring(0);
		header_string = header_string.replace("__HEADER__", HeaderList[i].header)
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
			element_string = element_string.replace("__VALUE__",formatter(current_quest[HeaderList[i].key]));
			quest_row_string += element_string;
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
		let playerCount = $('#party_count_cmode').dropdown('get values');
		let ep = $('#episode_cmode').dropdown('get values');
        search(Enums.GameModeTypes.Challenge,ep, playerCount);
    });
    $('#record_search_normal').on('click', function () {
		let playerCount = $('#party_count_normal').dropdown('get values');
		let ep = $('#episode_normal').dropdown('get values');
		let serv = $('#server_normal').dropdown('get values');
        search(Enums.GameModeTypes.Normal, ep, playerCount, serv);
    });
}


setupButtons();