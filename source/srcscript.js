/* global $ */

$(document).ready(function () {

  var stopGoogleAds = true;

  //Test for local dev network
  if (/^10.0.0/.test(location.hostname) && stopGoogleAds) {

    // Remove Adsense from DOM
    $('.adsense').remove();

  } else {

    // Load Adsense JavaScript
    $.getScript('//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
  }

  /*
  * Cloudinary jQuery/JS Dynamic Images
  */

  (function () {

    $.cloudinary.config(
      {

      }
    );

    $.cloudinary.responsive({
      type: 'fetch',
      responsive_use_stoppoints: true
    });

    $('#cld-img-id').load(function () {
      $('#cld-parent-id').css('backgroundImage', 'url(' + $('#cld-img-id').attr('src') + ')');
    });

  })();

});
