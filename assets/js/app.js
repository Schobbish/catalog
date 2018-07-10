$(document).ready(function() {
    // stuff after the '?' in the url
    var uriQuery;
    try {
        uriQuery = decodeURIComponent(window.location.search).split('?')[1];
    } catch (e) {
        // if uri query is deformed remove it
        window.location.replace(window.location.href.split('?')[0]);
    }

    /******************
     * init slidebars *
     ******************/
    var controller = new slidebars();
    controller.init();

    $('#hamburger').click(function(event) {
        // Stop default action and bubbling
        event.stopPropagation();
        event.preventDefault();

        controller.toggle('menu');
    });
    $('#main').click(function(event) {
        controller.close('menu');
    });

    /**************
     * search bar *
     **************/
    $('#menu input').keydown(function(event) {
        // if user searches for something redirect to the view page and show results
        // this will not work on local
        if (event.key == 'Enter') {
            const searchQuery = '?' + $(this).val();
            const redirectURI = encodeURIComponent(window.location.origin + '/view/' + searchQuery);
            window.location.href = redirectURI;
        }
    });
    $('#test').html(uriQuery);
});
