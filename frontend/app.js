var app = angular.module("olxApp", ["ngRoute"]);

app.config(function($locationProvider) {
  $locationProvider.hashPrefix('');
});
