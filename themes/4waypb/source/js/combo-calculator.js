window.fourwaypb = window.fourwaypb || {};
window.fourwaypb.ata_calc = window.fourwaypb.ata_calc || {};

window.fourwaypb.ata_calc.ready = function() {
    let enemies = [];
    let enemiesByName = {};
    let weapons = [];
    let weaponsByName = {};
    let classStats = {
        HUMAR: {atp: 1420, ata: 200},
        HUNEWEARL: {atp: 1237, ata: 199},
        HUCAST: {atp: 1639, ata: 191},
        HUCASEAL: {atp: 1301, ata: 218},
        RAMAR: {atp: 1260, ata: 249},
        RAMARL: {atp: 1145, ata: 241},
        RACAST: {atp: 1350, ata: 224},
        RACASEAL: {atp: 1175, ata: 231},
        FOMAR: {atp: 1002, ata: 163},
        FOMARL: {atp: 872, ata: 170},
        FONEWM: {atp: 814, ata: 180},
        FONEWEARL: {atp: 583, ata: 186}
    };
    let barrierStats = {
        NONE: {atp: 0, ata: 0},
        RED_RING: {atp: 20, ata: 20},
        RA_WALL: {atp: 0, ata: 20},
        KASAMI: {atp: 35, ata: 0},
        COMBAT_GEAR: {atp: 35, ata: 0},
        S_PARTS201: {atp: 0, ata: 15}
    }

    function accuracyModifierForAttackType(attackType) {
        if (attackType === 'N') {
            return 1.0;
        } else if (attackType === 'H' || attackType === 'VJAYA') {
            return 0.7;
        } else if (attackType === 'S') {
            return 0.5;
        }
    }

    function getDamageModifierForAttackType(attackType) {
        if (attackType === 'N') {
            return 1.0;
        } else if (attackType === 'H') {
            return 1.89;
        } else if (attackType === 'S') {
            return 3.32;
        } else if (attackType === 'VJAYA') {
            return 5.56;
        } else if (attackType === 'NONE') {
            return 0;
        }
    }

    function getEvpModifier(frozen, paralyzed) {
        let modifier = 1.0;
        if (frozen) {
            modifier *= 0.7;
        }
        if (paralyzed) {
            modifier *= 0.85;
        }
        return modifier;
    }

    function createMonsterRow(enemy, evpModifier, base_ata, snGlitch, atpInput, comboInput) {
        let modified_evp = enemy.evp * evpModifier;
        let a1Type = $('#attack1').dropdown('get value');
        let a2Type = $('#attack2').dropdown('get value');
        let a3Type = $('#attack3').dropdown('get value');

        let a1Accuracy = calculateAccuracy(base_ata, a1Type, 1.0, modified_evp);
        let a2Accuracy = calculateAccuracy(base_ata, a2Type, 1.3, modified_evp);
        let a3Accuracy = calculateAccuracy(base_ata, a3Type, 1.69, modified_evp);

        let baseDamage = calculateBaseDamage(atpInput, enemy);
        let damageToUse = atpInput.useMaxDamageRoll ? baseDamage.nMax : baseDamage.nMin;

        // Account for SN glitch - I'm assuming optimistic case where they're able to glitch
        // if the accuracy is better but not if it's worse
        let glitchedA1Accuracy = a1Accuracy;
        if (snGlitch && a2Accuracy > a1Accuracy && a2Type !== 'NONE') {
            glitchedA1Accuracy = a2Accuracy;
        }

        let glitchedA2Accuracy = a2Accuracy;
        if (snGlitch && a3Accuracy > a2Accuracy && a3Type !== 'NONE') {
            glitchedA2Accuracy = a3Accuracy;
        }
        let overallAccuracy = Math.pow((glitchedA1Accuracy * 0.01), comboInput.a1Hits)
                * Math.pow((glitchedA2Accuracy * 0.01), comboInput.a2Hits)
                * Math.pow((a3Accuracy * 0.01), comboInput.a3Hits);
        overallAccuracy *= 100;

        let a1Damage = getDamageModifierForAttackType(a1Type) * damageToUse;
        let a2Damage = getDamageModifierForAttackType(a2Type) * damageToUse;
        let a3Damage = getDamageModifierForAttackType(a3Type) * damageToUse;

        let comboDamage = (a1Damage * comboInput.a1Hits) + (a2Damage * comboInput.a2Hits) + (a3Damage * comboInput.a3Hits);
        let comboKill = comboDamage > enemy.hp;
        let percentDamage = 100 * (comboDamage / enemy.hp);
        if (percentDamage > 100) {
            percentDamage = 100;
        }

        let damageBgColor = comboKill ? 'rgb(61,73,61)' : 'rgb(73,73,61)';

        return $('<tr/>')
                .append($('<td/>', {
                    'data-label': 'monster',
                    'text': enemy.name + ' (' + enemy.location + ') '
                }))
                .append($('<td/>', {
                    'data-label': 'a1-accuracy',
                    'text': a1Damage.toFixed(0),
                    'style': a1Type === 'NONE' ? 'color: rgba(255,255,255,0.3)' : 'color: rgba(255,255,255,0.9)'
                }))
                .append($('<td/>', {
                    'data-label': 'a1-accuracy',
                    'text': a1Accuracy.toFixed(2) + '%',
                    'style': a1Type === 'NONE' ? 'color: rgba(255,255,255,0.3)' : 'color: rgba(255,255,255,0.9)'
                }))
                .append($('<td/>', {
                    'data-label': 'a2-accuracy',
                    'text': a2Damage.toFixed(0),
                    'style': a2Type === 'NONE' ? 'color: rgba(255,255,255,0.3)' : 'color: rgba(255,255,255,0.9)'
                }))
                .append($('<td/>', {
                    'data-label': 'a2-accuracy',
                    'text': a2Accuracy.toFixed(2) + '%',
                    'style': a2Type === 'NONE' ? 'color: rgba(255,255,255,0.3)' : 'color: rgba(255,255,255,0.9)'
                }))
                .append($('<td/>', {
                    'data-label': 'a3-accuracy',
                    'text': a3Damage.toFixed(0),
                    'style': a3Type === 'NONE' ? 'color: rgba(255,255,255,0.3)' : 'color: rgba(255,255,255,0.9)'
                }))
                .append($('<td/>', {
                    'data-label': 'a3-accuracy',
                    'text': a3Accuracy.toFixed(2) + '%',
                    'style': a3Type === 'NONE' ? 'color: rgba(255,255,255,0.3)' : 'color: rgba(255,255,255,0.9)'
                }))
                .append($('<td/>', {
                    'style': 'padding: 0'
                }).append($('<div>', {
                    'style': 'background: rgba(255,150,150,0.1)'
                }).append($('<div>', {
                    'style': 'background: ' + damageBgColor + '; padding: 0.78571429em 0.78571429em; width: ' + percentDamage + '%',
                    'text': comboDamage.toFixed(0),
                    'title': comboDamage.toFixed(0) + '/' + enemy.hp
                }))))
                .append($('<td/>', {
                    'data-label': 'accuracy',
                    'text': overallAccuracy.toFixed(2) + '%',
                    'style': overallAccuracy >= 100.0 ? 'background: rgba(150,255,150,0.1)' : 'background: rgba(255,150,150,0.1)'
                }));
                
    }

    function calculateBaseDamage(atpInput, enemy) {
        let areaPercent = enemy.ccaMiniboss ? 0 : atpInput.areaPercent;
        let minWeaponAtp = (atpInput.minAtp + atpInput.otherAtp) * ((areaPercent * 0.01) + 1);
        let maxWeaponAtp = (atpInput.maxAtp + atpInput.otherAtp) * ((areaPercent * 0.01) + 1);
        let shiftaModifier = 0;
        if (atpInput.shifta > 0) {
            shiftaModifier = ((1.3 * (atpInput.shifta - 1)) + 10) * 0.01;
        }
        let zalureModifier = 0;
        if (atpInput.zalure > 0) {
            zalureModifier = ((1.3 * (atpInput.zalure - 1)) + 10) * 0.01;
        }
        let minShiftaAtp = shiftaModifier * atpInput.baseAtp;
        let maxShiftaAtp = (shiftaModifier * atpInput.baseAtp) + ((atpInput.maxAtp - atpInput.minAtp) * shiftaModifier);

        let effectiveMinAtp = atpInput.baseAtp + minWeaponAtp + minShiftaAtp;
        let effectiveMaxAtp = atpInput.baseAtp + maxWeaponAtp + maxShiftaAtp;

        let effectiveDfp = enemy.dfp * (1.0 - zalureModifier);

        let nMin = ((effectiveMinAtp - effectiveDfp) / 5) * 0.9;
        if (nMin < 0) {
            nmin = 0;
        }
        let nMax = ((effectiveMaxAtp - effectiveDfp) / 5) * 0.9;
        if (nMax < 0) {
            nMax = 0;
        }
        return {
            nMin: nMin,
            nMax: nMax
        };
    }

    function calculateAccuracy(baseAta, attackType, comboModifier, totalEvp) {
        if (attackType === 'NONE') {
            return 100;
        }
        let effectiveAta = baseAta * accuracyModifierForAttackType(attackType) * comboModifier;
        let accuracy = effectiveAta - (totalEvp * 0.2);
        if (accuracy > 100) {
            accuracy = 100;
        }
        if (accuracy < 0) {
            accuracy = 0;
        }
        return accuracy;
    }

    function calculate() {
        let frozen = $('#frozen_checkbox').is(":checked");
        let paralyzed = $('#paralyzed_checkbox').is(":checked");
        let snGlitch = $('#sn_glitch_checkbox').is(":checked");
        let base_ata = $('#ata_input').val();
        let evpModifier = getEvpModifier(frozen, paralyzed);

        let atpInput = {
            baseAtp: Number($('#base_atp_input').val()),
            minAtp: Number($('#min_atp_input').val()),
            maxAtp: Number($('#max_atp_input').val()),
            otherAtp: Number($('#other_atp_input').val()),
            areaPercent: Number($('#area_percent_input').val()),
            useMaxDamageRoll: $('#max_damage_rolls').dropdown('get value') === 'true',
            shifta: Number($('#shifta_input').val()),
            zalure: Number($('#zalure_input').val()),
        };

        let comboInput = {
            a1Hits: Number($('#hits1').dropdown('get value')),
            a2Hits: Number($('#hits2').dropdown('get value')),
            a3Hits: Number($('#hits3').dropdown('get value')),
        }

        $('#accuracy_table_body').empty()
        let enemyValues = $('#enemy').dropdown('get values');
        if (!!enemyValues) {
            enemyValues.forEach(function(enemyName) {
                let enemy = enemiesByName[enemyName];
                $('#accuracy_table_body').append(createMonsterRow(enemy, evpModifier, base_ata, snGlitch, atpInput, comboInput));        
            })    
        }
    }
    
    function addEnemies() {
        let enemyType = $('#add_enemies').dropdown('get value');
        let enemyValues = $('#enemy').dropdown('get values');
        if (enemyValues === "") {
            enemyValues = [];
        }

        for (var enemyName in enemiesByName) {
            if (!enemyValues.includes(enemyName) && enemiesByName[enemyName].type === enemyType) {
                enemyValues.push(enemyName);
            }
        }
        $('#enemy_input').val(enemyValues).change();
    }

    function addByLocation() {
        let location = $('#add_by_location').dropdown('get value');
        let enemyValues = $('#enemy').dropdown('get values');
        if (enemyValues === "") {
            enemyValues = [];
        }

        for (var enemyName in enemiesByName) {
            if (!enemyValues.includes(enemyName) && enemiesByName[enemyName].location === location) {
                enemyValues.push(enemyName);
            }
        }
        $('#enemy_input').val(enemyValues).change();
    }
    function clearEnemies() {
        $('#enemy').dropdown('clear');
    }

    function applyPreset() {
        let playerClass = classStats[$('#playerClass').dropdown('get value')];
        let barrier = barrierStats[$('#barrier').dropdown('get value')];
        let hit = $('#hit_input').val();
        hit = !!hit ? Number(hit) : 0
        let weaponName = $('#weapon').dropdown('get value');
        let weapon = !!weaponName ? weaponsByName[weaponName] : weaponsByName['None'];

        $('#ata_input').val(playerClass.ata + weapon.ata + hit + barrier.ata);
        $('#min_atp_input').val(weapon.minAtp + (2 * weapon.grind));
        $('#max_atp_input').val(weapon.maxAtp + (2 * weapon.grind));
        $('#other_atp_input').val(barrier.atp);
        $('#base_atp_input').val(playerClass.atp);
    }

    function applyWeaponStats() {
        let weaponName = $('#weapon').dropdown('get value');
        let weapon = !!weaponName ? weaponsByName[weaponName] : weaponsByName['None'];
        let hits = !!weapon.comboPreset && !!weapon.comboPreset.attack1Hits ? weapon.comboPreset.attack1Hits : 1;
        $('#hits1_input').val(hits).change();
        hits = !!weapon.comboPreset && !!weapon.comboPreset.attack2Hits ? weapon.comboPreset.attack2Hits : 1
        $('#hits2_input').val(hits).change();
        hits = !!weapon.comboPreset && !!weapon.comboPreset.attack3Hits ? weapon.comboPreset.attack3Hits : 1
        $('#hits3_input').val(hits).change();

        if (!!weapon.comboPreset && !!weapon.comboPreset.attack1) {
            $('#attack1_input').val(weapon.comboPreset.attack1).change();
        } else if ($('#attack1').dropdown('get value') === 'NONE') {
            $('#attack1_input').val('N').change();
        }
        if (!!weapon.comboPreset && !!weapon.comboPreset.attack2) {
            $('#attack2_input').val(weapon.comboPreset.attack2).change();
        } else if ($('#attack2').dropdown('get value') === 'NONE') {
            $('#attack2_input').val('N').change();
        }
        if (!!weapon.comboPreset && !!weapon.comboPreset.attack3) {
            $('#attack3_input').val(weapon.comboPreset.attack3).change();
        } else if ($('#attack3').dropdown('get value') === 'NONE') {
            $('#attack3_input').val('N').change();
        }
        applyPreset();
    }

    getJSON5(url_for('data/enemies-vanilla-multi.json'), (function(data) {
        data.forEach(function (enemy) {
            enemyNameWithLocation = enemy.name + "_" + enemy.location;
            enemies.push({
                name: enemy.name + " (" + enemy.location + ")",
                value: enemyNameWithLocation
            })
            enemiesByName[enemyNameWithLocation] = enemy;
        });
        $('#enemy').dropdown({
            values: enemies,
        });
        $('#enemy').removeClass('loading');
    }));

    getJSON5(url_for('data/weapons-vanilla.json'), (function(data) {
        data.forEach(function (weapon) {
            let weaponDisplay = weapon.name;
            if (weapon.grind > 0) {
                weaponDisplay += ' +' + weapon.grind;
            }
            weapons.push({
                name: weaponDisplay,
                value: weapon.name
            })
            weaponsByName[weapon.name] = weapon;
        });
        $('#weapon').dropdown({
            values: weapons,
        });
        $('#weapon').removeClass('loading');
        $('#weapon').val('None').change();
    }));


    $('#calculate').on('click', calculate);
    $('#playerClass').change(applyPreset);
    $('#weapon').change(applyWeaponStats);
    $('#barrier').change(applyPreset);
    $('#hit_input').change(applyPreset);
    $('#add_enemies').change(addEnemies);
    $('#add_by_location').change(addByLocation);
    $('#clear_enemies').on('click', clearEnemies);

}

window.addEventListener('DOMContentLoaded', function() {
    window.fourwaypb.ata_calc.ready();
});