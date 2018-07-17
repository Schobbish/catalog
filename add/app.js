function switchClass(selector, newClass) {
    $(selector).removeClass('error warn good');
    $(selector).addClass(newClass);
}

// checks if elements' input value is in checkValues (array) and does something
// type will be displayed in the message (i.e. album in 'album already exists')
// good is true if it is good that the value is in checkValues
// returns whether they were all true
function checkValues(elements, checkValues, type, good) {
    var allSuccess = true;
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
                    $('#submit').prop('disabled', true);
                    $(ele).children('span').html(type + ' already exists');
                } else {
                    switchClass($(ele).children('span'), 'good');
                    $(ele).children('span').html('new ' + type);
                }
            }
        }
    }
    return allSuccess;
}

// this will return a string on failure so false is good and true is bad
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
            } else {
                // tests condition 4
                if (!$(element).children('.album-category').children('input').val()) {
                    throw new Error('One or more albums do not have a category');
                }
            }
        } else {
            // tests condition 4
            if ($(element).children('.album-name').children('input').val() &&
                $(element).children('.album-category').children('input').val()) {
                // do nothing
            } else {
                throw new Error('This field is empty');
            }
        }
    } catch (e) {
        console.log(e);
        return e;
    }
}

function checkAllAlbums(json) {
    /* CONDITIONS TO TEST:
     * 1. Artist must be filled in
     * 2. There cannot be any duplicate albums
     * 3. If the artist already exists,
     *    all the albums must not be in the catalog already.
     * 4. Each album must have a category (empty lines are okay)
     */
    try {
        // generate list of albums one by one to test for duplicates

        // iterate through all .album elements with checkAlbum()

        // submit form to php file as json (don't forget uri encoding!)
    } catch (e) {
        console.log(e);
        $('#after-submit').html(e);
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
        if (!checkAlbum($(this).parent(), $('#artist').val(), newArtist, json)) {
            $('#albums tbody').append(newAlbum);
            events(json, artistDone, newArtist);
        }
    });
    $('.album-category').change(function() {
        if ($(this).children('input').val() && artistDone) {
            checkValues($(this), compileAttrList('category', artists, json), 'category', true);
        } else {
            $(this).children('span').html('&nbsp;');
        }
        if (!checkAlbum($(this).parent(), $('#artist').val(), newArtist, json)) {
            $('#albums tbody').append(newAlbum);
            events(json, artistDone, newArtist);
        }
    });
    $('.delete input').click(function() {
        $(this).parent().parent().remove();
    });
    $('#submit').click(function() {
        checkAllAlbums(json);
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
