function searchCatalog(query) {
    $('#test').html(query);
}

$(document).ready(function() {
    const uriQuery = getURIQuery();

    if (uriQuery) {
        $('#bar').val(uriQuery);
        searchCatalog(uriQuery);
    } else {
        // ??
    }
    $('#bar').keydown(function(event) {
        if (event.key == 'Enter') {
            $(this).blur();
            searchCatalog($('#bar').val());
        }
    });
    $('#search-submit').click(function() {
        searchCatalog($('#bar').val());
    });
    $('#showing').change(function() {
        $('#total-entries').html($('#showing').val());
    });
});
