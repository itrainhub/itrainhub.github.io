(function () {
  var $root = document.getElementsByClassName('root')[0];
  if (window.hasEvent('touchstart')) {
    $root.dataset.isTouch = true;
    document.addEventListener('touchstart', function(){}, false);
  }
  document.addEventListener('copy', function(e) {
    if (e.path[2].className === 'rouge-code') { 
      return
    }
    var txt = window.getSelection().toString()
    if (txt && txt.length > 30) {
      setClipboardText(e, txt);
    }
  }, true)

  // 追加版权，保存剪贴板信息
  function setClipboardText(event, txt) {
    var clipboardData = event.clipboardData || window.clipboardData;
    if (clipboardData) {
      event.preventDefault();
      var htmlData = txt
                        + '<br><br>————————————————————————————————<br>'
                        + '版权声明：本文为 itrain 博主 isaac 的原创文章，遵循 CC BY-NC-4.0 版权协议，转载请附上原文出处链接及本声明。<br>'
                        + '作者:isaac<br>'
                        + '原文链接：' + window.location.href + '<br>'
                        + '来源：http://itrain.top';
      var textData = txt
                        + '\n\n————————————————————————————————\n'
                        + '版权声明：本文为 itrain 博主 isaac 的原创文章，遵循 CC BY-NC-4.0 版权协议，转载请附上原文出处链接及本声明。\n'
                        + '作者:isaac\n'
                        + '原文链接：' + window.location.href + '\n'
                        + '来源：http://itrain.top';

      clipboardData.setData('text/html', htmlData);
      clipboardData.setData('text/plain',textData);
    }
}
})();
