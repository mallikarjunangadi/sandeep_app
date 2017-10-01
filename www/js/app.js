angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  
  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html'
  })

  $urlRouterProvider.otherwise('home');
})

.filter('threeDecimal',function(input, scope){
  return function(){
    return input.toFixed(3);
  }
})