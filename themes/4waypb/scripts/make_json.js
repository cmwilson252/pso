const fs = require('fs');
const path = require("path");

hexo.extend.filter.register('after_init', function(){
    console.log('Starting make_json.js');
    
    let input_data_dir = path.join(hexo.source_dir, 'data', '_input');
    let output_data_dir = path.join(hexo.source_dir, 'data');
    
    let players = {
        input: path.join(input_data_dir, 'players.json'),
        output: path.join(output_data_dir, 'players.json'),
        data: null,
    }
    let teams = {
        input: path.join(input_data_dir, 'teams.json'),
        output: path.join(output_data_dir, 'teams.json'),
        data: null,
    }
    let quests = {
        input: path.join(input_data_dir, 'quests.json'),
        output: path.join(output_data_dir, 'quests.json'),
        data: null,
    }
    let teamz = {
        input: path.join(input_data_dir, 'teamz.json'),
        output: path.join(output_data_dir, 'teamz.json'),
        data: null,
    }
    
    function readJsonFile(path) {
        let result = null;
        try {
            let buffer = fs.readFileSync(path);
            result = JSON.parse(buffer);
        } catch(error) {
            console.log("Error reading json file:", error);
        }
        return result;
    }
    function writeFile(path, data) {
        let result = false;
        try {
            fs.writeFileSync(path, data);
            result = true;
        } catch(error) {
            console.log("Error writing file:", error);
        }
        return result;
    }
    
    function hasDuplicates(array, key) {
        let seen = new Set();
        let hasDuplicates = array.some(function(array_item) {
            let is_duplicate = seen.size === seen.add(array_item[key]).size;
            if (is_duplicate) {
                console.log('Duplicated id: '+array_item[key]);
            }
            return is_duplicate;
        });
        return hasDuplicates;
    }
    
    players.data = readJsonFile(players.input);
    if (players.data == null) {
        let error = 'Could not load players';
        console.log(error);
        throw error;
    }
    if (hasDuplicates(players.data, 'id')) {
        let error = 'Players contains duplicate ids';
        console.log(error);
        throw error;
    }
    
    teams.data = readJsonFile(teams.input);
    if (teams.data == null) {
        let error = 'Could not load teams';
        console.log(error);
        throw error;
    }
    if (hasDuplicates(teams.data, 'id')) {
        let error = 'Teams contains duplicate ids';
        console.log(error);
        throw error;
    }
    
    quests.data = readJsonFile(quests.input);
    if (quests.data == null) {
        let error = 'Could not load quests';
        console.log(error);
        throw error;
    }
    if (hasDuplicates(quests.data, 'id')) {
        let error = 'Quests contains duplicate ids';
        console.log(error);
        throw error;
    }
    
    teamz.data = readJsonFile(teamz.input);
    if (teamz.data == null) {
        let error = 'Could not load teamz';
        console.log(error);
        throw error;
    }
    
    let has_errors = false;
    
    players.data.forEach(function(player) {
        player.teams = [];
        player.team_ids.forEach(function(team_id) {
            let team = teams.data.find(x => {
                return x.id === team_id;
            })
            if (team == undefined) {
                console.log('Could not find team: '+team_id);
                has_errors = true;
            } else {
                player.teams.push(team);
            }
        });
        delete player.team_ids;
    });
    
    teamz.data.forEach(function(event) {
        event.teams.forEach(function(team) {
            team.players = [];
            team.player_ids.forEach(function(player_id) {
                let player = players.data.find(x => {
                    return x.id === player_id;
                })
                if (player == undefined) {
                    console.log('Could not find player: '+player_id);
                    has_errors = true;
                } else {
                    team.players.push(player.name);
                }
            });
            delete team.player_ids;
        });
    });
    
    if (has_errors) {
        throw 'There were errors in the file generation';
    }
    
    if (writeFile(players.output, JSON.stringify(players.data)) == false) {
        let error = 'Could not write players file';
        console.log(error);
        throw error;
    } else {
        console.log('Generated '+players.output);
    }
    if (writeFile(quests.output, JSON.stringify(quests.data)) == false) {
        let error = 'Could not write quests file';
        console.log(error);
        throw error;
    } else {
        console.log('Generated '+quests.output);
    }
    if (writeFile(teamz.output, JSON.stringify(teamz.data)) == false) {
        let error = 'Could not write teamz file';
        console.log(error);
        throw error;
    } else {
        console.log('Generated '+teamz.output);
    }
    
    console.log('Finish make_json.js');
});
