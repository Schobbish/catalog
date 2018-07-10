$(document).ready(function() {
    // init slidebars
    var controller = new slidebars();
    controller.init();

    $('#fixed-navigation').click(function(event) {
        // Stop default action and bubbling
        event.stopPropagation();
        event.preventDefault();

        controller.toggle('menu');
    });
    $('#main').click(function(event) {
        controller.close('menu');
    });
});
