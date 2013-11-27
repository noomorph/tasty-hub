/* jshint devel: true, debug: true */
/* global ko, window, io */

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

    this.done = ko.observable(false);
    this.started = ko.observable();
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

    this.depends = ko.observableArray(config.depends);

    this.status = ko.computed(function () {
      if (this.done()) {
        return "done";
      }

      var steps = recipe.steps();

      if (this.depends().length > 0) {
        var statuses = this.depends().map(function (i) {
          return steps[i].status() === 'done';
        });
        if (statuses.indexOf(false) >= 0) {
          return 'forbidden';
        }
      }

      var prev = steps[this.index() - 1];
      if (prev && prev.status() === 'forbidden') {
        return 'forbidden';
      }

      if (this.duration() > 0 && this.started()) {
        return 'progress';
      }

      return 'available';
    }, this);

    this.select = function () {
      recipe.stepIndex(this.index());
    };

    this.countdown = function () {
      this.started(new Date());
    };

    this.markDone = function () {
      this.done(!this.done());
      var next = this.index() + 1;
      if (next < recipe.steps().length) {
        recipe.stepIndex(next);
      }
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

  var socket = io.connect('/');
  var compId = (function () {
    var s = location.search.split("compId=")[1];
    if (s) {
      var amp = s.indexOf('&');
      if (amp != -1) {
        s = s.substring(0, amp);
      }
      return s;
    }
  }());

  if (!compId) { return; }

  socket.on('error', function (data) {
    alert(data);
  });

  socket.on('recipe', function (recipe) {
    window.recipe = recipe = new RecipeViewModel(recipe);
    ko.applyBindings(recipe);
  });

  socket.emit('login', compId);
  socket.emit('load', { compId: compId });
}());
