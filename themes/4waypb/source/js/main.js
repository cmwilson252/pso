window.fourwaypb = window.fourwaypb || {};

// ready event
window.fourwaypb.ready = function() {
    var sidebar = $('#sidebar');
    sidebar.sidebar('setting', {
        transition       : 'overlay',
        mobileTransition : 'uncover'
    });
    sidebar.sidebar('attach events', '.sidebar-button');
    
    if ($('.tabular.menu .item').length > 0) {
        $('.tabular.menu .item').tab();
    }
    if ($('.ui.accordion').length > 0) {
        $('.ui.accordion').accordion();
    }
    if ($('.ui.dropdown').length > 0) {
        $('.ui.dropdown').dropdown();
    }
    if ($('.ui.checkbox').not('[data-indeterminate="true"]').length > 0) {
        $('.ui.checkbox').not('[data-indeterminate="true"]').checkbox();
    }
};

// attach ready event
window.addEventListener('DOMContentLoaded', function() {
    window.fourwaypb.ready();
});

function url_for(url) {
    return hexo_root+url;
}
