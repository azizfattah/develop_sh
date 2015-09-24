/**
  Category order manager
*/
window.ST.initializeCategoriesOrder = function() {
  var fieldMap = $(".top-level-category-container").map(function(id, row) {
    return {
      id: $(row).data("id"),
      element: $(row),
      up: $(row).find(".top-level-category-row").find(".category-action-up"),
      down: $(row).find(".top-level-category-row").find(".category-action-down"),
    };
  }).get();

  var topLevelChanges = window.ST.orderManager(fieldMap).order;

  var subLevelChanges = $(".top-level-category-container").get().map(function(topLevelContainer) {
    var subFieldMap = $(".sub-category-row", topLevelContainer).map(function(id, row) {
      return {
        id: $(row).data("id"),
        element: $(row),
        up: $(".category-action-up", row),
        down: $(".category-action-down", row)
      };
    }).get();

    return window.ST.orderManager(subFieldMap).order;
  });

  var allChanges = [topLevelChanges].concat(subLevelChanges);

  var ajaxRequest = Bacon.combineAsArray(allChanges).changes()
    .debounce(800)
    .map(function(orders) {
      var onlyOrders = orders.map(function(obj) {
        return obj.order;
      });
      return _.flatten(onlyOrders);
    })
    .skipDuplicates(_.isEqual)
    .map(function(order) {
      return {
        type: "POST",
        url: ST.utils.relativeUrl("order"),
        data: { order: order }
      };
    });

  var ajaxResponse = ajaxRequest.ajax();
  var ajaxStatus = window.ST.ajaxStatusIndicator(ajaxRequest, ajaxResponse);

  ajaxStatus.loading.onValue(function() {
    $("#category-ajax-saving").show();
    $("#category-ajax-error").hide();
    $("#category-ajax-success").hide();
  });

  ajaxStatus.success.onValue(function() {
    $("#category-ajax-saving").hide();
    $("#category-ajax-success").show();
  });

  ajaxStatus.error.onValue(function() {
    $("#category-ajax-saving").hide();
    $("#category-ajax-error").show();
  });

  ajaxStatus.idle.onValue(function() {
    $("#category-ajax-success").fadeOut();
  });
};

/*category tree javascript vivek */
$(function(){
  $(".tree").treemenu({delay:300}).openActive();
});
(function($){
$.fn.openActive = function(activeSel) {
    activeSel = activeSel || ".active";

    var c = this.attr("class");

    this.find(activeSel).each(function(){
        var el = $(this).parent();
        while (el.attr("class") !== c) {
            if(el.prop("tagName") === 'UL') {
                el.show();
            } else if (el.prop("tagName") === 'LI') {
                el.removeClass('tree-closed');
                el.addClass("tree-opened");
            }

            el = el.parent();
        }
    });

    return this;
}

$.fn.treemenu = function(options) {
    options = options || {};
    options.delay = options.delay || 0;
    options.openActive = options.openActive || false;
    options.activeSelector = options.activeSelector || "";

    this.addClass("treemenu");
    this.find("> li").each(function() {
        e = $(this);
        var subtree = e.find('> ul');
        var toggler = $('<span>');
        toggler.addClass('toggler');

        e.prepend(toggler);
        if(subtree.length > 0) {
            subtree.hide();

            e.addClass('tree-closed');

            e.find(toggler).click(function() {
                var li = $(this).parent('li');
                li.find('> ul').toggle(options.delay);
                li.toggleClass('tree-opened');
                li.toggleClass('tree-closed');
            });

            $(this).find('> ul').treemenu(options);
        } else {
            $(this).addClass('tree-empty');
        }
    });

    if (options.openActive) {
        this.openActive(options.activeSelector);
    }

    return this;
}
})(jQuery);



