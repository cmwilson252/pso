window.fourwaypb = window.fourwaypb || {};
window.fourwaypb.time_attack_records = window.fourwaypb.time_attack_records || {};

// ready event
window.fourwaypb.time_attack_records.ready = function() {
    let ready = false;
    let records = null;
    let SearchSettings = {
        modes: [],
        metas: [],
        episodes: [],
        categories: [],
        photon_blasts: [],
        players: [],
        classes: [],
        teams: [],
        quests: [],
    };
    
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
        let format = 'mm:ss';
        if (seconds >= 3600) {
            format = 'HH:mm:ss';
        }
        return moment.unix(moment.duration().add(seconds, 's').asSeconds()).utc().format(format);
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
            case 'fonewm':      return 'FOnewm';
            case 'fonewearl':   return 'FOnewearl';
            default: return "Unknown";
        }
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
            // Player names
            if (SearchSettings.players.length > 0) {
                let group = false;
                SearchSettings.players.forEach(function (player) {
                    for (let i = 0; i < x.players.length; i++) {
                        if (x.players[i].id == player) {
                            group = true;
                            break;
                        }
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
            // Team names
            if (SearchSettings.teams.length > 0) {
                let group = false;
                SearchSettings.teams.forEach(function (team) {
                    if (x.team != null && x.team.id == team) {
                        group = true;
                    }
                });
                
                if (!group) {
                    result = false;
                }
            }
            // Quest names
            if (SearchSettings.quests.length > 0) {
                let group = false;
                SearchSettings.quests.forEach(function (quest) {
                    if (x.quest != null && x.quest.id == quest) {
                        group = true;
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
    
    function updateSearchSettings() {
        SearchSettings.modes = $('#modes').dropdown('get values');
        SearchSettings.metas = $('#metas').dropdown('get values');
        SearchSettings.episodes = $('#episodes').dropdown('get values');
        SearchSettings.categories = $('#categories').dropdown('get values');
        SearchSettings.photon_blasts = $('#photon_blasts').dropdown('get values');
        SearchSettings.players = $('#players').dropdown('get values');
        SearchSettings.classes = $('#classes').dropdown('get values');
        SearchSettings.teams = $('#teams').dropdown('get values');
        SearchSettings.quests = $('#quests').dropdown('get values');
    }
    
    $('#search').on('click', function() {
        updateSearchSettings();
        updateResults();
        //$('html, body').animate({
        //    scrollTop: $("#results").offset().top - 50,
        //}, 500);
    });
    
    function updateDropdownColumns() {
        let elements = $('.columned');
        elements.removeClass('column one two three four');
        
        elements.each(function() {
            let max_columns = $(this).data('max-columns');
            if (window.innerWidth <= 375 || max_columns < 2) {
                $(this).addClass('one');
            } else if (window.innerWidth <= 480 || max_columns < 3) {
                $(this).addClass('two');
            } else if (window.innerWidth <= 768 || max_columns < 4) {
                $(this).addClass('three');
            } else {
                $(this).addClass('four');
            }
            $(this).addClass('column');
        });
    }
    
    function filters1() {
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
                    name: 'Fonewm',
                    value: 'fonewm'
                },
                {
                    name: 'FOnewearl',
                    value: 'fonewearl'
                }
            ]
        });
    };
    function filters2() {
        let players = [];
        records.forEach(function(record) {
            record.players.forEach(function(player) {
                let current_player = players.find(x => x.id == player.id);
                if (current_player == undefined) {
                    players.push(player);
                }
            });
        });
        players = _.sortBy(players, ['name']);
        
        let players_dropdown = {
            values: [],
        };
        players.forEach(function(player) {
            players_dropdown.values.push({
                value: player.id,
                //text: player.name,
                name: player.name,
            });
        });
        $('#players').dropdown(players_dropdown);
        
        let teams = [];
        records.forEach(function(record) {
            if (record.team != null) {
                let current_team = teams.find(x => x.id == record.team.id);
                if (current_team == undefined) {
                    teams.push(record.team);
                }
            }
        });
        teams = _.sortBy(teams, ['name']);
        
        let teams_dropdown = {
            values: [],
        };
        teams.forEach(function(team) {
            teams_dropdown.values.push({
                value: team.id,
                //text: team.name,
                name: team.name,
                image: url_for(team.image),
            });
        });
        $('#teams').dropdown(teams_dropdown);
        
        let quests = [];
        records.forEach(function(record) {
            if (record.quest != null) {
                let current_quest = quests.find(x => x.id == record.quest.id);
                if (current_quest == undefined) {
                    quests.push(record.quest);
                }
            }
        });
        quests = _.sortBy(quests, ['name']);
        
        let quests_dropdown = {
            values: [],
        };
        quests.forEach(function(quest) {
            quests_dropdown.values.push({
                value: quest.id,
                //text: quest.name,
                name: quest.name,
            });
        });
        $('#quests').dropdown(quests_dropdown);
    };
    function filters3() {
        var table = new Tabulator("#results-table", {
            data: records,
            layout:"fitColumns",
            groupBy: ['quest.name', 'meta', 'category', 'pb'],
            //groupHeader:function(value, count, data, group){
            //    return value + "<span style='color:#d00; margin-left:10px;'>(" + count + " item" + (count == 1 ? '' : 's') +")</span>";
            //},
            columns:[
                {title:"Meta", field:"meta", sorter:"string",formatter:function(cell, formatterParams, onRendered) {
                    let result = '';
                    let value = cell.getValue();
                    result = metaToName(value);
                    return result;
                },width:80,},
                {title:"Episode", field:"episode", sorter:"number",width:85},
                {title:"Quest", field:"quest.name", sorter:"string",widthGrow:1,},
                {title:"Time", field:"time", sorter:function(a, b, aRow, bRow, column, dir, sorterParams){
                        if (aRow.getData().quest.is_countdown) {
                            a *= -1;
                        }
                        if (bRow.getData().quest.is_countdown) {
                            b *= -1;
                        }
                        
                        return a - b;
                    },
                    formatter:function(cell, formatterParams, onRendered) {
                        let result = '';
                        let format = 'mm:ss';
                        let seconds = cell.getValue();
                        if (seconds >= 3600) {
                            format = 'HH:mm:ss';
                        }
                        result = secondsToString(seconds);
                        if (cell.getRow().getData().quest.is_countdown) {
                            result = 'Remaining: '+result;
                        }
                        return result;
                },width:150,},
                {title:"Team", field:"team", sorter:"string",formatter:function(cell, formatterParams, onRendered) {
                    let result = '';
                    let value = cell.getValue();
                    if (value != null) {
                        result += '<span class="ui image team-flag"><img src="'+url_for(value.image)+'"></span>';
                        result += value.name;
                        result += '<br/>';
                    }
                    return result;
                },widthGrow:1,},
                {title:"Players", field:"players", sorter:"string",formatter:function(cell, formatterParams, onRendered) {
                    let result = '';
                    let value = cell.getValue();
                    if (value instanceof Array) {
                        value.forEach(function(player){
                            result += player.name;
                            result += '<br/>';
                        });
                    }
                    return result;
                },widthGrow:1,},
                {title:"Classes", field:"players", sorter:"string",formatter:function(cell, formatterParams, onRendered) {
                    let result = '';
                    let value = cell.getValue();
                    if (value instanceof Array) {
                        value.forEach(function(player){
                            result += classKeyToName(player.class);
                            result += '<br/>';
                        });
                    }
                    return result;
                },width:100,},
                {title:"Videos", field:"players", sorter:"string",formatter:function(cell, formatterParams, onRendered) {
                    let result = '';
                    let value = cell.getValue();
                    if (value instanceof Array) {
                        value.forEach(function(player){
                            if (true || player.video) {
                                result += '<a href="'+'#some_link'+'"/>Video</a>';
                            }
                            result += '<br/>';
                        });
                    }
                    return result;
                },width:100,},
            ],
        });
    }
    
    function setupPage() {
        filters1();
        filters2();
        filters3();
        
        $(window).on('resize', _.debounce(function () {
            updateDropdownColumns();
        }, 250));
        updateDropdownColumns();
    };
    
    getJSON5(url_for('data/records.json'), (function(data) {
        records = data;
        
        setupPage();
        
        ready = true;
        console.log('Page ready');
    }));
};

// attach ready event
window.addEventListener('DOMContentLoaded', function() {
    window.fourwaypb.time_attack_records.ready();
});
