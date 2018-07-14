// returns the decoded URI Query
function getURIQuery() {
    try {
        return decodeURIComponent(window.location.search).split('?')[1];
    } catch (e) {
        // if uri query is deformed remove it (test: %E0%A4%A)
        window.location.replace(window.location.href.split('?')[0]);
    }
}

// redirects to the view page and searches for query
function searchRedirect(query) {
    const encodedQuery = encodeURIComponent(query);
    window.location.href = window.location.origin + '/catalog/view/?' + encodedQuery;
}

// gets catalog.json. use alwaysFunction to specify what to do with that data.
// rootPath is the path to the root of the website; usually '../' or '' (default)
function getCatalog(successFunction, rootPath = '') {
    $.getJSON(rootPath + 'catalog.json').done(function(data) {
        successFunction(data);
    }).fail(function() {
        // if failed use example catalog
        console.log('failed to get catalog.json. using example-catalog.json instead');
        $.getJSON(rootPath + 'example-catalog.json').done(function(data) {
            successFunction(data);
        }).fail(function() {
            // if this fails send out error. (gets skipped over for some reason?)
            console.log('failed to get example-catalog.json. does it exist?');
        });
    });
}

var controller = new slidebars();

$(document).ready(function() {
    /******************
     * init slidebars *
     ******************/
    controller.init();

    $('#hamburger').click(function(event) {
        event.stopPropagation();
        event.preventDefault();

        controller.toggle('menu');
    });
    $('#main').click(function(event) {
        controller.close('menu');
    });
    $('.menu-links').click(function(event) {
        event.stopPropagation();
        event.preventDefault();

        controller.close('menu');
        // THEN go to the site after animation finishes
        // (href needs to be defined outside because $(this) returns undefined otherwise)
        var href = $(this).attr('href');
        window.setTimeout(function() {
            window.location.href = href;
        }, 275);
    });

    /*******************
     * menu search bar *
     *******************/
    $('#menu input').keydown(function(event) {
        // if user searches for something redirect to the view page and show results
        // this will not work on local
        if (event.key == 'Enter') {
            // close menu then delay to finish animation
            $(this).blur();
            controller.close('menu');
            window.setTimeout(function() {
                searchRedirect($('#menu input').val());
            }, 275);
        }
    });
});
