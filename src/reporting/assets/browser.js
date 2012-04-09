$(function() {

    'use strict';

    $('#search').keyup(function() {

        var searchText = $(this).val();

        $('.highlight').each(function(index, element) {
            $(element).replaceWith($(element).html());
        });

        var modulesToShow = $('.module:contains("' + searchText + '")');
        modulesToShow.show();
        modulesToShow.find('.moduleId, .moduleFilename, .dependency').each(function(index, element) {
            $(element).html($(element).html().replace(searchText, '<span class="highlight">' + searchText + '</span>'));
        });
        $('.module').not(modulesToShow).hide();

        return false;

    });

});