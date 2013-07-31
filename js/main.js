$(document).ready(function(){
  var loading_slidedeck = false;
  $("#loading-slides").click(function(){
    if(loading_slidedeck) return false;
    loading_slidedeck = true;
    $(this).css("cursor", "wait");
    $(this).find("h1").hide();
    $(this).find("img").show();
    $("#slidedeck").attr("src", "http://hackership.github.io/slides/presentations/hackership/?full#Cover"
      ).on("load", function(){
        var $deck = $(this);
        setTimeout(function() {
          $("#loading-slides").css("cursor", "default");
          $deck.fadeIn("slow");
          $("#slidedeck-prev, #slidedeck-next").fadeIn("slow");
        }, 100);
       });
    });
 $("#slidedeck-prev").click(function(){
  $("#slidedeck")[0].contentWindow.postMessage("prev", "*");
 });
 $("#slidedeck-next").click(function(){
  $("#slidedeck")[0].contentWindow.postMessage("next", "*");
 });
 
});
$(document).ready(function() {
  function filterPath(string) {
  return string
    .replace(/^\//,'')
    .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
    .replace(/\/$/,'');
  }
  var locationPath = filterPath(location.pathname);
  var scrollElem = scrollableElement('html', 'body');

  $('a[href*=#]').each(function() {
    var thisPath = filterPath(this.pathname) || locationPath;
    if (  locationPath == thisPath
    && (location.hostname == this.hostname || !this.hostname)
    && this.hash.replace(/#/,'') ) {
      var $target = $(this.hash), target = this.hash;
      if (target) {
        var targetOffset = $target.offset().top;
        $(this).click(function(event) {
          event.preventDefault();
          $(scrollElem).animate({scrollTop: targetOffset}, 800, function() {
            location.hash = target;
          });
        });
      }
    }
  });

  // use the first element that is "scrollable"
  function scrollableElement(els) {
    for (var i = 0, argLength = arguments.length; i <argLength; i++) {
      var el = arguments[i],
          $scrollElement = $(el);
      if ($scrollElement.scrollTop()> 0) {
        return el;
      } else {
        $scrollElement.scrollTop(1);
        var isScrollable = $scrollElement.scrollTop()> 0;
        $scrollElement.scrollTop(0);
        if (isScrollable) {
          return el;
        }
      }
    }
    return [];
  }
 
});
