window.fourwaypb = window.fourwaypb || {};
window.fourwaypb.ata_calc = window.fourwaypb.ata_calc || {};

window.fourwaypb.ata_calc.ready = function() {
    let enemies = [];
    let enemiesByName = {};
    let weapons = [];
    let weaponsByName = {};

    function accuracyModifierForAttackType(attackType) {
        if (attackType === 'N') {
            return 1.0;
        } else if (attackType === 'H') {
            return 0.7;
        } else if (attackType === 'S') {
            return 0.5;
        }
    }

    function getEvpModifier(frozen, paralyzed) {
        if (frozen) {
            return 0.7;
        } else if (paralyzed) {
            return 0.85;
        } else {
            return 1.0;
        }
    }

    function createMonsterRow(enemy, evpModifier, base_ata, snGlitch) {
        let modified_evp = enemy.evp * evpModifier;
        let a1Type = $('#attack1').dropdown('get value');
        let a2Type = $('#attack2').dropdown('get value');
        let a3Type = $('#attack3').dropdown('get value');

        let a1Accuracy = calculateAccuracy(base_ata, a1Type, 1.0, modified_evp);
        let a2Accuracy = calculateAccuracy(base_ata, a2Type, 1.3, modified_evp);
        let a3Accuracy = calculateAccuracy(base_ata, a3Type, 1.69, modified_evp);

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
        let overallAccuracy = glitchedA1Accuracy * (glitchedA2Accuracy * 0.01) * (a3Accuracy * 0.01);

        return $('<tr/>')
                .append($('<td/>', {
                    'data-label': 'monster',
                    'text': enemy.name + ' (' + enemy.location + ')'
                }))
                .append($('<td/>', {
                    'data-label': 'a1-accuracy',
                    'text': a1Accuracy.toFixed(2) + '%'
                }))
                .append($('<td/>', {
                    'data-label': 'a2-accuracy',
                    'text': a2Accuracy.toFixed(2) + '%'
                }))
                .append($('<td/>', {
                    'data-label': 'a3-accuracy',
                    'text': a3Accuracy.toFixed(2) + '%'
                }))
                .append($('<td/>', {
                    'data-label': 'accuracy',
                    'text': overallAccuracy.toFixed(2) + '%'
                }));
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

        $('#accuracy_table_body').empty()
        let enemyValues = $('#enemy').dropdown('get values');
        if (!!enemyValues) {
            enemyValues.forEach(function(enemyName) {
                let enemy = enemiesByName[enemyName];
                $('#accuracy_table_body').append(createMonsterRow(enemy, evpModifier, base_ata, snGlitch));        
            })    
        }
    }

    function applyPreset() {
        let classAta = $('#playerClass').dropdown('get value');
        classAta = !!classAta ? Number(classAta) : 0
        let hit = $('#hit_input').val();
        hit = !!hit ? Number(hit) : 0
        let weaponName = $('#weapon').dropdown('get value');
        let weaponAta = !!weaponName ? weaponsByName[weaponName].ata : 0;

        $('#ata_input').val(classAta + weaponAta + hit);
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
            weapons.push({
                name: weapon.name,
                value: weapon.name
            })
            weaponsByName[weapon.name] = weapon;
        });
        $('#weapon').dropdown({
            values: weapons,
        });
        $('#weapon').removeClass('loading');
    }));


    $('#calculate').on('click', function () {
        calculate();
    });
    $('#apply').on('click', function () {
        applyPreset();
    });
}

window.addEventListener('DOMContentLoaded', function() {
    window.fourwaypb.ata_calc.ready();
});