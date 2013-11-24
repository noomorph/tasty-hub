/* jshint devel: true, debug: true */
/* global ko, recipe, window */

(function () {

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

  function StepViewModel (config, recipe, defaults) {
    config = config || {};
    defaults = defaults || {};
    this.duration = ko.observable(config.duration);

    this.index = ko.computed(function () {
      var index = recipe.steps.indexOf(this);
      if (index === -1) {
        index = recipe.steps().length;
      }
      return index;
    }, this);

    this.style = {
      left: ko.computed(function () {
        return (100 * this.index()) + '%';
      }, this)
    };

    this.actionTemplateId = ko.computed(function () {
      var duration = this.duration();
      if (typeof duration === "number") {
        return "action-timer";
      } else {
        return "action-tick";
      }
    }, this);

    this.status = ko.observable(config.status || 'available');
    this.done = ko.observable(false);
    this.mediaIndex = ko.observable(config.mediaIndex || 0);
    this.mediaItems = (config.mediaItems || [{}]).map(function (mediaItem) {
      return new StepMediaItemViewModel(mediaItem);
    }, this);
    this.header = ko.observable(config.header || 'Header');
    this.description = ko.observable(config.description || 'Description');
    this.tickImageURL = ko.computed(function () {
      if (this.done()) {
        return "img/checkbox_full.png";
      } else {
        return "img/checkbox_empty.png";
      }
    }, this);

    this.select = function () {
      recipe.stepIndex(this.index());
    };
  }

  function RecipeViewModel (config) {
    config = config || {};
    this.settings = {
      bubble: {
        width: ko.observable(22)
      }
    };

    this.stepIndex = ko.observable(config.stepIndex || 0);
    this.steps = ko.observableArray();

    (config.steps || []).forEach(function (step) {
      var model = new StepViewModel(step, this);
      this.steps.push(model);
    }, this);


    this.bubbleIndicator = {
      left: ko.computed(function () {
        var bubble = this.settings.bubble;
        return Math.round(bubble.width() * (this.stepIndex() + 0.5));
      }, this)
    };

    this.started = ko.computed(function () {
      return this.stepIndex() >= 0;
    }, this);
  }

  window.recipe = new RecipeViewModel({
	stepIndex: 2,
    steps: [
      {
        mediaItems: [
          { src: 'img/eda.jpg'}
        ],
        header: 'Boil the water',
        description: 'Place water in large enough pot to hold 3 cups without boiling over.'
      },
      {
        mediaItems: [
          { src: 'http://www.youtube.com/watch?v=17Onb2MBL_8'}
        ],
        header: 'Chop the meat',
        description: 'Place water in large enough pot to hold 3 cups without boiling over.'
      },
      {
        mediaItems: [
          { src: 'http://vimeo.com/73716693' }
        ],
        header: 'Cut vegetables',
        description: 'Place water in large enough pot to hold 3 cups without boiling over.'
      }
    ]
  });
  ko.applyBindings(recipe);
}());
