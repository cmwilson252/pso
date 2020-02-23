const fs = require('fs');
const path = require('path');

hexo.extend.filter.register('before_generate', function(){
    let cwd = process.cwd();
    let input_data_dir = path.join(cwd, 'source', 'data', '_input');
    let output_data_dir = path.join(cwd, 'source', 'data');
    
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
    
    function logError(...args) {
        console.log('\x1b[31m', 'ERROR', '\x1b[0m', args);
    }
    function logWarn(...args) {
        console.log('\x1b[33m', 'WARN', '\x1b[0m', args);
    }
    
    function readJsonFile(path) {
        let result = null;
        try {
            let buffer = fs.readFileSync(path);
            result = JSON.parse(buffer);
        } catch(error) {
            logError('Error reading json file:', error);
        }
        return result;
    }
    function writeFile(path, data) {
        let result = false;
        try {
            fs.writeFileSync(path, data);
            result = true;
        } catch(error) {
            logError('Error writing file:', error);
        }
        return result;
    }
    
    function hasDuplicates(array, key) {
        let seen = new Set();
        let hasDuplicates = array.some(function(array_item) {
            let is_duplicate = seen.size === seen.add(array_item[key]).size;
            if (is_duplicate) {
                logWarn('Duplicated id: '+array_item[key]);
            }
            return is_duplicate;
        });
        return hasDuplicates;
    }
    
    players.data = readJsonFile(players.input);
    if (players.data == null) {
        let error = 'Could not load players';
        logError(error);
        throw error;
    }
    if (hasDuplicates(players.data, 'id')) {
        let error = 'Players contains duplicate ids';
        logError(error);
        throw error;
    }
    
    teams.data = readJsonFile(teams.input);
    if (teams.data == null) {
        let error = 'Could not load teams';
        logError(error);
        throw error;
    }
    if (hasDuplicates(teams.data, 'id')) {
        let error = 'Teams contains duplicate ids';
        logError(error);
        throw error;
    }
    
    players.data.forEach(function(player) {
        player.teams = [];
        player.team_ids.forEach(function(team_id) {
            let team = teams.data.find(x => {
                return x.id === team_id;
            })
            if (team != undefined) {
                player.teams.push(team);
            }
        });
    });
    
    if (writeFile(players.output, JSON.stringify(players.data)) == false) {
        let error = 'Could not write players file';
        logError(error);
        throw error;
    }
});
