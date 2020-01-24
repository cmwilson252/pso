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
