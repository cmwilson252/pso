const fs = require('fs');
const path = require("path");

// Hook after_init until I figure out why before_generate doesn't get the files picked up un GitHub CI
hexo.extend.filter.register('after_init', function(){
    console.log('Starting make_json.js');
    
    // Variables
    let input_data_dir = path.join(hexo.source_dir, 'data', '_input');
    let output_data_dir = path.join(hexo.source_dir, 'data');
    
    let output_players_dir = path.join(output_data_dir, 'players');
    
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
    let records = {
        input: path.join(input_data_dir, 'records.json'),
        output: path.join(output_data_dir, 'records.json'),
        data: null,
    }
    let vanillaWeapons = {
        input: path.join(input_data_dir, 'weapons-vanilla.json'),
        output: path.join(output_data_dir, 'weapons-vanilla.json'),
        data: null,
    }
    let vanillaMultiplayerEnemies = {
        input: path.join(input_data_dir, 'enemies-vanilla-multi.json'),
        output: path.join(output_data_dir, 'enemies-vanilla-multi.json'),
        data: null,
    }
    let vanillaOpmEnemies = {
        input: path.join(input_data_dir, 'enemies-vanilla-opm.json'),
        output: path.join(output_data_dir, 'enemies-vanilla-opm.json'),
        data: null,
    }
    
    // Read file and parse it as JSON
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
    // Write data to file
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
    
    // Check if an array has duplicates (by a property value)
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
    
    // Load and check files
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
    
    records.data = readJsonFile(records.input);
    if (records.data == null) {
        let error = 'Could not load records';
        console.log(error);
        throw error;
    }

    vanillaWeapons.data = readJsonFile(vanillaWeapons.input);
    if (vanillaWeapons.data == null) {
        let error = 'Could not load vanilla weapons';
        console.log(error);
        throw error;
    }

    vanillaMultiplayerEnemies.data = readJsonFile(vanillaMultiplayerEnemies.input);
    if (vanillaMultiplayerEnemies.data == null) {
        let error = 'Could not load vanilla multiplayer enemies';
        console.log(error);
        throw error;
    }
    vanillaOpmEnemies.data = readJsonFile(vanillaOpmEnemies.input);
    if (vanillaOpmEnemies.data == null) {
        let error = 'Could not load vanilla opm enemies';
        console.log(error);
        throw error;
    }

    // Process files
    let has_errors = false;
    
    // Pre populate record quests so filtering works
    console.log('Pre-populating records data (quest only)');
    records.data.forEach(function(record, index) {
        record.index = index;
        
        let quest = quests.data.find(x => {
            return x.id === record.quest_id;
        });
        if (quest == undefined) {
            console.log('Could not find quest: '+record.quest_id);
            has_errors = true;
        } else {
            record.quest = {
                id: quest.id,
                name: quest.name,
                is_countdown: quest.is_countdown,
            };
        }
    });
    
    // Get filtered records to assign to players
    console.log('Filtering records');
    let filtered_records = records.data.reduce(function(r, o, i){
        var k = o.quest_id + o.meta + o.category + o.pb;
        if (r[k] || (r[k]=[])) {
            r[k].push(o);
        };
        return r;
    }, {});
    for (let key in filtered_records) {
        filtered_records[key].sort(function(a, b) {
            let result = 0;
            if (a.time > b.time) {
                result = 1;
            } else {
                result = -1;
            }
            
            if (a.quest.is_countdown) {
                result *= -1;
            }
            return result;
        });
        
        for(let i = 0; i < filtered_records[key].length; i++) {
            filtered_records[key][i].result = (i+1);
        }
    }
    
    console.log('Populating player data');
    players.data.forEach(function(player) {
        player.teams = [];
        player.team_ids.forEach(function(team_id) {
            let team = teams.data.find(x => {
                return x.id === team_id;
            });
            if (team == undefined) {
                console.log('Could not find team: '+team_id);
                has_errors = true;
            } else {
                player.teams.push({
                    name: team.name,
                    image: team.image,
                });
            }
        });
        delete player.team_ids;
        
        // Record count
        player.records = [];
        records.data.forEach(function(record) {
            record.players.forEach(function(record_player) {
                if (player.id == record_player.id) {
                    player.records.push(record);
                }
            });
        });
    });
    
    console.log('Populating teamz data');
    teamz.data.forEach(function(event) {
        let quest = quests.data.find(x => {
            return x.id === event.quest_id;
        });
        if (quest == undefined) {
            console.log('Could not find quest: '+event.quest_id);
            has_errors = true;
        } else {
            event.quest = {
                name: quest.name,
                is_countdown: quest.is_countdown,
            };
        }
        delete event.quest_id;
        
        event.teams.forEach(function(team) {
            team.players.forEach(function(player) {
                let player_data = players.data.find(x => {
                    return x.id === player.id;
                });
                if (player_data == undefined) {
                    console.log('Could not find player: '+player.id);
                    has_errors = true;
                } else {
                    player.name = player_data.name;
                }
            });
        });
    });
    
    console.log('Populating records data');
    records.data.forEach(function(record) {
        delete record.quest_id;
        
        record.team = null;
        if (record.team_id != null) {
            let team = teams.data.find(x => {
                return x.id === record.team_id;
            });
            if (team == undefined) {
                if (record.team !== null) {
                    console.log('Could not find team: '+record.team_id);
                    has_errors = true;
                }
            } else {
                record.team = {
                    id: team.id,
                    name: team.name,
                    image: team.image,
                };
            }
        }
        delete record.team_id;
        
        record.players.forEach(function(player) {
            let player_data = players.data.find(x => {
                return x.id === player.id;
            });
            if (player_data == undefined) {
                console.log('Could not find player: '+player.id);
                has_errors = true;
            } else {
                player.name = player_data.name;
            }
        });
    });
    
    console.log('Populating player records data');
    players.data.forEach(function(player) {
        player.record_count = player.records.length;
        player.record_results = [];
        player.records.forEach(function(record) {
            if (records.data.length <= record.index) {
                console.log('Could not find record: '+record.index);
                has_errors = true;
            } else {
                if (player.record_results[record.result] === undefined) {
                    player.record_results[record.result] = 0;
                }
                player.record_results[record.result]++;
            }
        });
    });
    
    if (has_errors) {
        throw 'There were errors in the file generation';
    }
    
    // TODO write each player in a single file
    // then remove the records key from the object
    players.data.forEach(function(player) {
        let output_file = path.join(output_players_dir, player.id+'.json');
        if (writeFile(output_file, JSON.stringify(player)) == false) {
            let error = 'Could not write player file: '+output_file;
            console.log(error);
            throw error;
        } else {
            console.log('Generated '+output_file);
        }
        
        delete player.records;
    });
    
    // Write files
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
    if (writeFile(records.output, JSON.stringify(records.data)) == false) {
        let error = 'Could not write records file';
        console.log(error);
        throw error;
    } else {
        console.log('Generated '+records.output);
    }

    if (writeFile(vanillaWeapons.output, JSON.stringify(vanillaWeapons.data)) == false) {
        let error = 'Could not write vanilla weapons file';
        console.log(error);
        throw error;
    } else {
        console.log('Generated '+vanillaWeapons.output);
    }

    if (writeFile(vanillaMultiplayerEnemies.output, JSON.stringify(vanillaMultiplayerEnemies.data)) == false) {
        let error = 'Could not write vanilla multiplayer enemies file';
        console.log(error);
        throw error;
    } else {
        console.log('Generated '+vanillaMultiplayerEnemies.output);
    }

    if (writeFile(vanillaOpmEnemies.output, JSON.stringify(vanillaOpmEnemies.data)) == false) {
        let error = 'Could not write vanilla opm enemies file';
        console.log(error);
        throw error;
    } else {
        console.log('Generated '+vanillaOpmEnemies.output);
    }
    
    
    console.log('Finish make_json.js');
});
