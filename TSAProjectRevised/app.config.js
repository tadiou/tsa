'use strict';

angular.module('tsa').
  config(function($locationProvider,$routeProvider){
      $routeProvider
        .when('/', {
          template: "<claims-per-month></claims-per-month>"
        })
        .when("/vlpm", {
          template: "<value-loss-per-month></value-loss-per-month>"
        })
        .when("/cpm", {
          template: "<claims-per-month></claims-per-month>"
        })
        .otherwise({
          template: "<h1>Not Found</h1>"
        })
      })
