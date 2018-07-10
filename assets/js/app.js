$(document).ready(function() {
    // stuff after the '?' in the url
    var uriQuery;
    try {
        uriQuery = decodeURIComponent(window.location.search).split('?')[1];
    } catch (e) {
        // if uri query is deformed remove it (test: %E0%A4%A)
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
    $('.menu-links').click(function(event) {
        // stop default action and bubbling
        event.stopPropagation();
        event.preventDefault();
        // toggle menu
        controller.close('menu');
        /* THEN go to the site (href needs to be defined outside because $(this)
        returns undefined otherwise) */
        var href = $(this).attr('href');
        window.setTimeout(function() {
            window.location.href = href;
        }, 275);
    });

    /**************
     * search bar *
     **************/
    $('#menu input').keydown(function(event) {
        // if user searches for something redirect to the view page and show results
        // this will not work on local
        if (event.key == 'Enter') {
            const searchQuery = encodeURIComponent($(this).val());
            const redirectURI = window.location.origin + '/catalog/view/?' + searchQuery;
            window.location.href = redirectURI;
        }
    });
    $('#test').html(uriQuery);
});
