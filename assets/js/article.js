(function() {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js([SOURCES.jquery, SOURCES.clipboard], function() {
    $(function() {
      var $this ,$scroll;
      var $articleContent = $('.js-article-content');
      var hasSidebar = $('.js-page-root').hasClass('layout--page--sidebar');
      var scroll = hasSidebar ? '.js-page-main' : 'html, body';
      $scroll = $(scroll);

      // $articleContent.find('.highlight').each(function() {
      //   $this = $(this);
      //   $this.attr('data-lang', $this.find('code').attr('data-lang'));
      // });
      $articleContent.find('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').each(function() {
        $this = $(this);
        $this.append($('<a class="anchor d-print-none" aria-hidden="true"></a>').html('<i class="fas fa-anchor"></i>'));
      });
      $articleContent.on('click', '.anchor', function() {
        $scroll.scrollToAnchor('#' + $(this).parent().attr('id'), 400);
      });

      /*页面载入完成后，创建复制按钮*/
      var initCopyCode = function(){
        var copyHtml = '';
        copyHtml += '<button class="btn-copy" data-clipboard-snippet="">';
        copyHtml += '  <i class="fa fa-globe"></i><span>复制</span>';
        copyHtml += '</button>';
        $("div.highlight").prepend(copyHtml);
        new ClipboardJS('.btn-copy', {
          target: function(trigger) {
            return $(trigger).next().find('.rouge-code').get(0);
          }
        });
      }
      initCopyCode();
    });
  });
})();
