// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function () {
    var cache = {};

    this.tmpl = function tmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                // Convert the template into pure JavaScript
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
})();

$(document).ready(function () {

    $('#userCampaign').delegate('a.deleteUserCampaign', 'click', function (e) {
        e.preventDefault();
        $(this).closest('tr').remove();
    });

    $('#addUserCampaign').on("click", function (e) {
        e.preventDefault();

        var itemId = parseInt($('input[name=item_selector]').val()),
            itemName = $('ul.typeahead li.active').attr('data-value');

        if (itemId > 0 && !$('#campaign_' + itemId).length) {

            $('#emptyUserCompanyRow').remove();

            $('#userCampaign tbody').append(tmpl('userCampaignTemplate', {
                id: itemId,
                url: '/users/' + itemId + '/show',
                title: itemName
            }));

            $('span.dropdown-toggle').click();
        }

    });

    $('#tagAll').on("click", function (e) {
        $('.tags').each(function (i, el) {
            $(el).prop('checked', $(e.target).prop('checked'));
        });
    });

    $('.clockpicker').clockpicker();

    var to = false;
    $('#adCampaignTreeSearch').keyup(function () {
        if (to) {
            clearTimeout(to);
        }
        to = setTimeout(function () {
            $('#adCampaignTree').jstree("close_all");
            var v = $('#adCampaignTreeSearch').val();
            $('#adCampaignTree').jstree(true).search(v);

            //jstree-search

            var hidden = $('.jstree-search');
            var visible = $('.jstree-anchor');

            if(hidden.length == 0){
                $.each(visible, function(i){
                    $(this).parent().show();
                });
            }else {
                $.each(visible, function (i) {

                    if($(this).parent().hasClass('jstree-open')){
                        $(this).parent().show();
                    }else {
                        $(this).parent().hide();
                    }
                });
                $.each(hidden, function (i) {
                    $(this).parent().show();
                });
            }

        }, 250);
    });

    $('#adCampaignTree')
        .jstree({
            "plugins": ["wholerow", "search", "themes"/*, "state"*/],
            "search":{"close_opened_onclear":1},
            "core": {
                'themes': {
                    'name': 'proton',
                    'responsive': true,
                    "icons": false
                }
            }
        })
        .bind("click.jstree", function (event) {
            if($('#filter_form')){
                if( $(event.target).attr('href')) {
                    $('#filter_form').attr('action', $(event.target).attr('href'));
                    $('#filter_form').submit();
                }
            } else {
                window.location.href = $(event.target).attr('href');
            }
        });

});