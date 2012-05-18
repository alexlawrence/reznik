(function($) {

    $(function() {

        'use strict';

        $('#search').keyup(function() {

            var searchText = $(this).val();

            $('.highlight').each(function(index, element) {
                $(element).replaceWith($(element).html());
            });

            var modulesToShow = $('.script:contains("' + searchText + '")');
            modulesToShow.show();
            modulesToShow.find('.scriptId, .scriptilename, .dependency').each(function(index, element) {
                $(element).html($(element).html().replace(
                    searchText, '<span class="highlight">' + searchText + '</span>'));
            });
            $('.script').not(modulesToShow).hide();

            return false;

        });

    });

}(window.jQuery));