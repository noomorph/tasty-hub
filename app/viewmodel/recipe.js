/* global define */

define(["knockout", "vm/step"], function (ko, StepViewModel) {
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

  return RecipeViewModel;
});
