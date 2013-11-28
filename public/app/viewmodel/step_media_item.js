/* global define */

define(["knockout"], function (ko) {

  var VIMEO_REGEX = /vimeo.com\/(\d+)/;
  var YOUTUBE_REGEX = /youtu\.?be/;
  var IMAGE_REGEX = /.(png|jpeg|jpg|gif)/;
  var BLANK_IMAGE = 'img/eda.jpg';

  function StepMediaItemViewModel (config) {
    config = config || {};
    this.src = ko.observable(config.src || BLANK_IMAGE);

    this.mediaTemplateId = ko.computed(function () {
      var src = this.src();
      if (VIMEO_REGEX.test(src)) {
        return "media-video-vimeo";
      } else if (YOUTUBE_REGEX.test(src)) {
        return "media-video-youtube";
      } else if (IMAGE_REGEX.test(src)) {
        return "media-picture";
      } else {
        return "media-unknown";
      }
    }, this);

    this.vimeoURL = ko.computed(function () {
      if (this.mediaTemplateId() === "media-video-vimeo") {
        var src = this.src();
        return "//player.vimeo.com/video/" + VIMEO_REGEX.exec(src)[1] +
            "?title=0&amp;byline=0&amp;portrait=0&amp;color=ff9933";
      }
    }, this);

    this.youtubeURL = ko.computed(function () {
      if (this.mediaTemplateId() === "media-video-youtube") {
        var src = this.src();
        var video_id = src.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }
        return "//www.youtube.com/embed/" + video_id;
      }
    }, this);

    this.pictureURL = ko.computed(function () {
      if (this.mediaTemplateId() === "media-picture") {
        var src = this.src();
        return 'url(' + src + ')';
      }
    }, this);
  }

  return StepMediaItemViewModel;
});
