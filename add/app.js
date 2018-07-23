function switchClass(selector, newClass) {
    $(selector).removeClass('error warn good');
    $(selector).addClass(newClass);
}

// checks if elements' input value is in checkValues (array) and does something
// type will be displayed in the message (i.e. album in 'album already exists')
// good is true if it is good that the value is in checkValues
function checkValues(elements, checkValues, type, good) {
    for (var ele of elements) {
        const value = $(ele).children('input').val();
        if (value) {
            if (good) {
                // if it is good that the value is in checkValues
                if (checkValues.includes(value)) {
                    switchClass($(ele).children('span'), 'good');
                    $(ele).children('span').html('existing ' + type);
                } else {
                    allSuccess = false;
                    switchClass($(ele).children('span'), 'warn');
                    $(ele).children('span').html('new ' + type);
                }
            } else {
                // if it is bad that the value is in checkValues
                if (checkValues.includes(value)) {
                    allSuccess = false;
                    switchClass($(ele).children('span'), 'error');
                    $(ele).children('span').html(type + ' already exists');
                } else {
                    switchClass($(ele).children('span'), 'good');
                    $(ele).children('span').html('new ' + type);
                }
            }
        }
    }
}

// this will return a string on failure so false is good and true is bad
// element should be a .album element
// only used in the next function (as of 2018-07-23)
function checkAlbum(element, artist, newArtist, json) {
    try {
        // tests condition 1
        if (!artist)
            throw new Error('Artist is required');
        if (!newArtist) {
            const artistAlbums = Object.keys(json[artist]);
            // tests condition 3
            if (artistAlbums.includes($(element)
                .children('.album-name').children('input').val())) {
                throw new Error('One or more albums already exist');
            }
        }
        // tests condition 4
        if ($(element).children('.album-name').children('input').val() &&
            $(element).children('.album-category').children('input').val()) {
            // do nothing
        } else {
            throw new Error('There is an empty field');
        }
    } catch (e) {
        console.log(e);
        return e;
    }
}

function checkAllAlbums(json, artists) {
    // disable button for some reason
    $('#submit').prop('disabled', true);
    /* CONDITIONS TO TEST:
     * 1. Artist must be filled in
     * 2. There cannot be any duplicate albums
     * 3. If the artist already exists,
     *    all the albums must not be in the catalog already.
     * 4. Each album must have a category (empty lines are okay)
     */
    try {
        // generate list of albums one by one to test for duplicates (condition 1)
        const artist = $('#artist').val();
        const newArtist = !artists.includes(artist);
        var albumList = [];

        $('.album').each(function() {
            // traverse the tree to get the album name
            const currAlbum = $(this).children('.album-name').children('input').val();
            // check if list already has the album
            if (!albumList.includes(currAlbum)) {
                albumList.push(currAlbum);
                const checkOutput = checkAlbum($(this), artist, newArtist, json);
                if (checkOutput) throw new Error(checkOutput);
            } else {
                throw new Error('There are duplicate albums.');
            }
        });

        // submit form to php file as json (don't forget uri encoding!)
        switchClass($('#after-submit'), 'good');
        $('#after-submit').html('Submitting...');
    } catch (e) {
        console.log(e);
        $('#after-submit').html(e);
        $('#submit').prop('disabled', false);
    }
}

function events(json, artistDone, newArtist) {
    const artists = Object.keys(json);
    const newAlbum = `<tr class="album">
    <td class="album-name">
        <input type="text">
        <span>&nbsp;</span>
    </td>
    <td class="album-category">
        <input type="text">
        <span>&nbsp;</span>
    </td>
    <td class="delete">
        <input type="button" value="del">
    </td>
</tr>`;

    // remove event listeners before adding them again
    $('#artist, .album-name, .album-category, .delete input, #add-row, #submit').off();

    $('#artist').change(function() {
        if ($(this).val()) {
            artistDone = true;
            $('#after-submit').html('');
            if (artists.includes($(this).val())) {
                switchClass('#artist-check', 'good');
                newArtist = false;
                $('#artist-check').html('existing artist');
                checkValues($('.album-name'), compileAlbumList([$(this).val()], json), 'album', false);
                checkValues($('.album-category'), compileAttrList('category', artists, json), 'category', true);
            } else {
                switchClass('#artist-check', 'warn');
                newArtist = true;
                $('#artist-check').html('new artist');
                checkValues($('.album-name'), [], 'album', false);
                checkValues($('.album-category'), compileAttrList('category', artists, json), 'category', true);
            }
        } else {
            artistDone = false;
            switchClass('#artist-check', 'error');
            $('#artist-check').html('artist is required');
        }
    });
    $('.album-name').change(function() {
        if ($(this).children('input').val() && artistDone) {
            if (!newArtist) {
                checkValues($(this), compileAlbumList([$('#artist').val()], json), 'album', false);
            } else {
                checkValues($(this), [], 'album', false);
            }
        } else {
            $(this).children('span').html('&nbsp;');
        }
    });
    $('.album-category').change(function() {
        if ($(this).children('input').val() && artistDone) {
            checkValues($(this), compileAttrList('category', artists, json), 'category', true);
        } else {
            $(this).children('span').html('&nbsp;');
        }
    });
    $('.delete input').click(function() {
        $(this).parent().parent().remove();
    });
    $('#add-row').click(function() {
        $('#albums tbody').append(newAlbum);
        // redo all the event listeners
        events(json, artistDone, newArtist);
    });
    $('#submit').click(function() {
        checkAllAlbums(json, artists);
    });
}


$(document).ready(function() {
    getCatalog(function(json) {
        // remove please waits
        $('#after-submit').html('');
        $('#artist').val('');

        events(json, false, false);
    }, function() {
        $('#main').html('Failed to get the catalog.');
    }, '../');
});
