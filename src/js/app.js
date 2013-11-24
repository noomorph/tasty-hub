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
  stepIndex: 0,
    steps: [
    {
      mediaItems: [{ src: 'img/ingredients.jpg'}],
      header: 'Prepare ingredients',
      description:
        '2 large or 3 medium beets, thoroughly washed. \n' + 
        '2 large or 3 medium potatoes, sliced into bite-sized pieces.\n' +
        '4 Tbsp of cooking oil. \n' +
        '1 medium onion, finely chopped. \n' +
        '2 carrots, grated \n' +
        '1/2 head of cabbage, thinly chopped (see picture) \n' +
        '1 can kidney beans with their juice \n' +
        '2 bay leaves \n' +
        '16 cup of water \n' +
        '5 Tbsp ketchup \n' +
        '4 Tbsp lemon juice \n' +
        '1/4 tsp freshly ground pepper \n' +
        '1 Tbsp dill'
      },
      {
        mediaItems: [{ src: 'img/1.jpg'}],
        header: 'Boiling beets',
        description:
          'Fill a large soup pot with 10 cups of water.\n' +
          'Add 2 – 3 beets. Cover and boil for about 1 hour \n' +
          '(some beats take longer, some take less time. \n' +
          'It depends on how old the beets are). \n' +
          'Once you can smoothly pierce the beets \n' +
          'with a butter knife, remove from the water \n' +
          'and set aside to cool. Keep the water.'
      },
      {
        mediaItems: [{ src: 'img/2.1.jpg'}],
        header: 'Boiling broth',
        description: 'Continue boiling broth on the middle fire.'
      },
      {
        mediaItems: [{ src: 'img/3.jpg'}],
        header: 'Slicing potatoes',
        description: 'Slice 3 potatoes.'
      },
      {
        mediaItems: [{ src: 'img/4.jpg'}],
        header: 'Adding and boiling potatoes',
        description: 'Add potatoes into the same water and boil 15-20 minutes.'
      },
      {
        mediaItems: [{ src: 'img/5.jpg'}],
        header: 'Grating carrots and dicing onion',
        description: 'Grate both carrots and dice one onion.'
      },
      {
        mediaItems: [
          { src: 'img/6.1.jpg'},
          { src: 'img/6.2.jpg'}
        ],
        header: 'Roasting',
        description: 
          'Take carrots and onion. \n' +
          'Add 4 Tbsp of cooking oil \n' +
          'to the skillet and saute vegetables \n' +
          'until they are soft. \n' +
          'Stir in ketchup when they are \n' +
          'almost done cooking. '
      },
      {
        mediaItems: [{ src: 'img/7.jpg'}],
        header: 'Shredding cabbage ',
        description: 'Thinly shred 1/2 a cabbage.'
      },
      {
        mediaItems: [{ src: 'img/8.jpg'}],
        header: 'Adding cabbage and boiling',
        description:
          'Add cabbage to the pot\n' +
          'when potatoes are half way done\n' +
          'and boil 7-10min.'
      },
      {
        mediaItems: [{ src: 'img/9.jpg'}],
        header: 'Pealing and slicing beets',
        description:
          'Next, peel and slice the beets' +
          'into match sticks.'
      },
      {
        mediaItems: [{ src: 'img/10.jpg'}],
        header: 'Adding ingredients and finish',
        description:
          'Add 6 cups of water, beets, lemon juice, ' +
          'pepper, bay leaves and can of kidney beans ' +
          '(with their juice). Also add sauted carrots ' +
          'and onion to the pot along with chopped dill. ' +
          'Cook 5-10 minutes, until the cabbage is done.'
      },
      {
        mediaItems: [
          { src: 'img/10.1.jpg'},
          { src: 'img/10.2.jpg'},
          { src: 'img/10.3.jpg'},
          { src: 'img/10.4.jpg'},
          { src: 'img/10.5.jpg'},
          { src: 'img/10.6.jpg'},
          { src: 'img/10.7.jpg'},
          { src: 'img/10.8.jpg'},
          { src: 'img/10.9.jpg'}
        ],
        header: 'Adding ingredients and finish',
        description:
          'Add 6 cups of water, beets, lemon juice, ' +
          'pepper, bay leaves and can of kidney beans ' +
          '(with their juice). Also add sauted carrots ' +
          'and onion to the pot along with chopped dill. ' +
          'Cook 5-10 minutes, until the cabbage is done.'
      },
      {
        mediaItems: [{ src: 'img/main.jpg'}],
        header: 'Serving',
        description:
          'Please serve the borsch with a dollop of sour ' +
          'cream or real mayo. Wish you bon appetite and ' +
          'enjoy the GREAT TASTE you did yourself! \n' +
          'P.S. Keep TastyHub in secret and you \n' +
          'will be appreciated as a chef.'
      }
    ]
  });
  ko.applyBindings(recipe);
}());
