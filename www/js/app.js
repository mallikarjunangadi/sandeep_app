angular.module('starter', ['ionic']).run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
}).config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'templates/home.html'
    })
    .state('calculation', {
        url: '/calculation',
        templateUrl: 'templates/calculation.html'
    })
    .state('history', {
        url: '/history',
        templateUrl: 'templates/history.html'
    })

    $urlRouterProvider.otherwise('home');
}).filter('threeDecimal', function(input, scope) {
    return function() {
        return input.toFixed(2);
    }
})
.factory('dataService', function() {
    var jsonObj;

    function put(obj) {
        console.log(obj);
        jsonObj = {};
        jsonObj = obj;
        console.log(jsonObj);
    }

    function get() {
        return jsonObj;
    }

    return {
        put: put,
        get: get
    }
})
.controller('homeCtrl', function($scope, $ionicPopover, $state, dataService) {

    $ionicPopover.fromTemplateUrl('my-homePopover.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
    };

    function calculateAdd(value, devide, multiply) {
        var result = (value / devide) + ((value / devide) * multiply) / 100;
        return result;
    }
    ;
    function calculateSub(value, devide, multiply) {
        var result = (value / devide) - ((value / devide) * multiply) / 100;
        return result;
    }
    ;
    var tableResult = {};

    function makeJson(value, num) {
        var key = "X/" + num;
        tableResult[key] = {
            "neg": calculateSub(value, num, 50).toFixed(2),
            "X": key,
            "Entry": (value / num).toFixed(2),
            "T1": calculateAdd(value, num, 50).toFixed(2),
            "T2": calculateAdd(value, num, 100).toFixed(2),
            "T3": calculateAdd(value, num, 200).toFixed(2),
            "T4": calculateAdd(value, num, 300).toFixed(2),
            "T5": calculateAdd(value, num, 400).toFixed(2),
            "T6": calculateAdd(value, num, 500).toFixed(2)
        }

    }

    $scope.user = {};
    $scope.calculate = function(value) {
        console.log($scope.user);
        if(!Number($scope.user.value)) {
            return;
        }
        
        if($scope.user.name && $scope.user.name.length > 11) {
            return;
        }
         
        var value = Number($scope.user.value);
        console.log('entered calculate...');

        makeJson(value, 2);
        makeJson(value, 3);
        makeJson(value, 5);
        makeJson(value, 8);
        makeJson(value, 11);
        makeJson(value, 21);
        makeJson(value, 34);
        makeJson(value, 55);

        console.log(tableResult);
        
        var d = new Date();
      
        var tableContent = {};
        var keyName = d.getTime();
        tableContent["name"] = $scope.user.name ? $scope.user.name : "Stranger";
        tableContent["value"] = $scope.user.value;
        tableContent["result"] = tableResult;
      
        localStorage.setItem(keyName, JSON.stringify(tableContent));
        dataService.put(tableContent);
       
       /*  
        if(localStorage.length > 8) {
            var lastItemKey = localStorage.key(localStorage.length-1);
            localStorage.removeItem(lastItemKey);
        } 
       */

        keyName = null;
        $state.go('calculation');
    }
})

.controller('calculationCtrl', function($scope, dataService, $state, $ionicPopover) {
    console.log('entered calculation ctrl');
    console.log(dataService.get());

    $ionicPopover.fromTemplateUrl('my-homePopover.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
    };
    
    $scope.$on("$ionicView.enter", function(scopes, states) {
         $scope.tableResult = dataService.get();
    })
    
    $scope.goBack = function() {
        $state.go('home');
    }
  /*
    $scope.$on("$ionicView.enter", function(scopes, states) {
        console.log('entered calculation ctrl before enter');
        console.log(dataService.get());
    });
   */
    
})

.controller('historyCtrl', function($scope, $state, dataService) {
    $scope.localKeyArr = [];
    
    $scope.$on("$ionicView.enter", function(scopes, states) {
        // localStorage.clear()
        $scope.localKeyArr = [];
        for(var i = 0 ; i < localStorage.length; i++) {
            var temp = JSON.parse(localStorage.getItem(localStorage.key(i)));
            var tempData = {name: temp.name, keyDate: localStorage.key(i)}
            $scope.localKeyArr.push(tempData);
        }
        $scope.localKeyArr.reverse();
    });
 
    $scope.goBack = function() {
        $state.go('home');
    }

    $scope.viewData = function(key) {
        console.log(key);
        var data = localStorage.getItem(key);
        console.log(JSON.parse(data));
        dataService.put(JSON.parse(data));

        $state.go('calculation');
    }
})