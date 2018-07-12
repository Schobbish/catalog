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
            searchCatalog($('#bar').val());
        }
    });
    $('#search-submit').click(function(event) {
        searchCatalog($('#bar').val());
    });
});
