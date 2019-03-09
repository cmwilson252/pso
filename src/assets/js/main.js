$('.tabular.menu .item').tab();

$('.ui.accordion').accordion();

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
