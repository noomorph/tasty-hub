/* global define */

define(["knockout", "vm/step_media_item"], function (ko, StepMediaItemViewModel) {
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
  return StepViewModel;
});
