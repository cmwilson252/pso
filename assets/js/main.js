if ($('.tabular.menu .item').length > 0) {
    $('.tabular.menu .item').tab();
}
if ($('.ui.accordion').length > 0) {
    $('.ui.accordion').accordion();
}
if ($('.ui.dropdown').length > 0) {
    $('.ui.dropdown').dropdown();
}
if ($('.ui.sidebar').length > 0) {
    $('.ui.sidebar').sidebar('attach events', '.toc.item');
}
if ($('.ui.checkbox').not('[data-indeterminate="true"]').length > 0) {
    $('.ui.checkbox').not('[data-indeterminate="true"]').checkbox();
}

let Enums = {
    GameModeTypes:{
        Challenge: 0,
        Normal: 1
    },
    NumberOfPlayers: {
        OPM_No_PB:0,
        OPM_PB:1,
        _2P_No_PB:2,
        _2P_PB:3,
        _4P_No_PB:4,
        _4P_PB:5
    },
    Servers: {
        Ultima: 0,
        _2014:1,
        Gamecube:2,
        Vanilla:3
    }
}

function getJSON5(url, success, fail, always) {
    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        converters: {
            'text json': function(result) {
                if (typeof JSON5 === 'object' && typeof JSON5.parse === 'function') {
                    return JSON5.parse(result);
                } else if (typeof JSON === 'object' && typeof JSON.parse === 'function') {
                    return JSON.parse(result);
                } else {
                    // Fallback to jQuery's parser
                    return $.parseJSON(result);
                }
            }
        },
    }).done(function(data){
        if (success !== undefined) {
            success(data);
        }
    }).fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
        if (fail !== undefined) {
            fail(jqxhr);
        }
    }).always(function() {
        if(always !== undefined) {
            always();
        }
    });
}

// Remove
function animateAutoHeight(element, duration) {
    if(typeof duration === undefined) {
        duration = 300;
    }

    if (element.hasClass('collapsed')) {
        element.animate({
            height: element.get(0).scrollHeight
        }, duration, function() {
            element.removeClass('collapsed');
            element.height('auto');
        });
    } else {
        element.animate({
            height: 0
        }, duration, function(){
            element.addClass('collapsed');
        });
    }
}

$('.character-breakdown__header').on('click', function(e) {
    let parent = $(this).closest('.character-breakdown')
    let content = parent.find('.character-breakdown__content');
    if (parent.length != 0) {
        e.preventDefault();

        let el = $(parent[0]);
        el.toggleClass('collapsed');

        if (content.length != 0) {
            let el = $(content[0]);
            animateAutoHeight(el, 300);
        }
    }
});
