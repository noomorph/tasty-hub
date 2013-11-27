/*global define, io, alert */

// to depend on a bower installed component:
// define(['component/componentName/file'])

define(["knockout", "vm/recipe"], function(ko, RecipeViewModel) {
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
});
