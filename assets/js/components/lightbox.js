(function() {
  window.imagesLoad = function(images) {
    images = images || document.getElementsByTagName('img');
    var imagesCount = images.length, loadedCount = 0, image;
    var i, j, loaded = false, cbs = [];
    imagesCount < 1 && (loaded = true);
    for (i = 0; i < imagesCount; i++) {
      image = images[i];
      image.complete ? handleImageLoad() : image.addEventListener('load', handleImageLoad);
    }
    function handleImageLoad() {
      loadedCount++;
      if (loadedCount === imagesCount) {
        loaded = true;
        if (cbs.length > 0) {
          for (j = 0; j < cbs.length; j++) {
            cbs[j]();
          }
        }
      }
    }
    return {
      then: function(cb) {
        cb && (loaded ? cb() : (cbs.push(cb)));
      }
    };
  };
})();

(function () {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function() {
    var $pageGalleryModal = $('.js-page-gallery-modal');
    var $images = $('.page__content').find('img:not(.lightbox-ignore)');
    window.imagesLoad($images).then(function() {
      /* global Gallery */
      var pageGalleryModal = $pageGalleryModal.modal({ onChange: handleModalChange });
      var gallery = null;
      var modalVisible = false;
      var i, items = [], image, item;
      if($images && $images.length > 0) {
        for (i = 0; i < $images.length; i++) {
          image = $images.eq(i);
          if (image.get(0).naturalWidth > 800) {
            items.push({ src: image.attr('src'), w: image.get(0).naturalWidth, h: image.get(0).naturalHeight, $el: image});
          }
        }
      }

      if(items.length > 0) {
        gallery = new Gallery('.gallery', items);
        gallery.setOptions({ disabled: !modalVisible });
        gallery.init();
        for (i = 0; i < items.length; i++) {
          item = items[i];
          item.$el && (item.$el.addClass('popup-image'), item.$el.on('click', (function() {
            var index = i;
            return function() {
              pageGalleryModal.show();
              gallery.setOptions({ initialSlide: index });
              gallery.refresh(true, { animation: false });
            };
          })()));
        }
      }

      function handleModalChange(visible) {
        modalVisible = visible;
        gallery && gallery.setOptions({ disabled: !modalVisible });
      }

      $pageGalleryModal.on('click', function() {
        pageGalleryModal.hide();
      });
    });
  });
})();
