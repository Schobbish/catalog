// gets catalog.json. use alwaysFunction to specify what to do with that data.
function getCatalog(alwaysFunction) {
    var json;
    $.getJSON('../catalog.json').done(function(data) {
        json = data;
    }).fail(function() {
        // if failed use example catalog
        console.log('failed to get ../catalog.json. using ../example-catalog.json instead');
        $.getJSON('../example-catalog.json').done(function(data) {
            json = data;
        }).fail(function() {
            // if this fails send out error.
            console.error('failed to get ../example-catalog.json. does it exist?');
        });
    }).always(alwaysFunction);
}

// also does other things like show the total artists and get the maxArtists value
// artists, albums (optional), & categories are lists that the function can choose from.
function generateTable(artists, json, start, albums = undefined, categories = undefined) {
    // max artists that can be displayed, as acorrding to the dropdown
    const maxArtists = $('#showing').val();
    var artistCounter = 0;  // counts how many artists have been displayed

    // show how many artists there are
    $('#total-artists').html(artists.length);
    // for artist in artists, starting at start and ending when there are no more artists or maxArtists is reached
    for (var i = start; i < artists.length && artistCounter < maxArtists; i++) {
        artistCounter++;
        // album names (not the objects) of the current artist
        const artistAlbums = Object.keys(json[artists[i]]).sort();
        var firstAlbum = true;  // first album gets special status
        for (var j = 0; j < artistAlbums.length; j++) {
            const category = json[artists[i]][artistAlbums[j]].category;
            // skip if album is not in albums, if defined
            if (albums && !albums.includes(artistAlbums[j])) continue;
            // ditto for categories
            if (albums && !categories.includes(category)) continue;

            // will be built up then appended to table
            var entry;
            if (firstAlbum) {
                // only do this for the artist's first album
                entry = `<tr><td>${artists[i]}</td>`;
                firstAlbum = false;
            } else {
                entry = '<tr><td>\u201D</td>';
            }
            entry = entry + `<td>${artistAlbums[j]}</td><td>${category}</td></tr>`;
            $('#TABLE').append(entry);
        }
    }
}

// searches json for query then generates the table
function searchCatalog(query, json) {
    // TODO: this function should make an artist and albums for generateTable
    // or artist and categories
    // runs generateTable when finish
    $('#test').html(query);
}


$(document).ready(function() {
    const uriQuery = getURIQuery();

    // search for query if present
    if (uriQuery) {
        $('#bar').val(uriQuery);
        getCatalog(function(json) {
            // exit early if no json
            if (!json) {
                $('#TABLE').html('<tr><td>Failed to get any info to show here</td></tr>');
                return 1;
            }
            searchCatalog(uriQuery);
        });
    } else {
        getCatalog(function(json) {
            // exit early if no json
            if (!json) {
                $('#TABLE').html('<tr><td>Failed to get any info to show here</td></tr>');
                return 1;
            }

            // generate table
            const artists = Object.keys(json).sort();
            const startIndex = 0;
            generateTable(artists, json, startIndex);
        });
    }

    $('#bar').keydown(function(event) {
        if (event.key == 'Enter') {
            $(this).blur();
            searchRedirect($('#bar').val());
        }
    });
    $('#search-submit').click(function() {
        searchRedirect($('#bar').val());
    });
});
