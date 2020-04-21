window.fourwaypb = window.fourwaypb || {};


window.fourwaypb.psobbClasses = [
    'humar',
    'hunewearl',
    'hucast',
    'hucaseal',
    'ramar',
    'ramarl',
    'racast',
    'racaseal',
    'fomar',
    'fomarl',
    'fonewm',
    'fonewearl',
];

window.fourwaypb.classKeyToName = function(key) {
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
};

window.fourwaypb.decodeHTML = function(str) {
    var txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
};
window.fourwaypb.encodeHTML = function(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';';
    });
};

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

window.addEventListener('DOMContentLoaded', function() {
    window.fourwaypb.ready();
});

function url_for(url) {
    return hexo_root+url;
}
