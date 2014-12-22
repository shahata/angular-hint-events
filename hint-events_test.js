var hintLog = angular.hint;
describe('hintEvents', function() {
  var $rootScope, $compile, $controller;
  beforeEach(module('ngHintEvents'));
  beforeEach(inject(function(_$rootScope_, _$compile_, _$controller_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $controller = _$controller_;
  }));

  it('should log a message if the function to handle an ng-event is not found', function() {
    var elm = angular.element('<button id="increment1" ng-click="increments()" ng-src>Fake Increment</button>');
    scope = $rootScope;
    $compile(elm)(scope);
    scope.$digest();
    expect(Object.keys(hintLog.flush()['Events']).length).toBe(1);
  });


  it('should suggest a similar function to the not found ng-event function', function() {
    var scope = $rootScope.$new();
    var ctrl = $controller(function(){
      scope.name = 'Angular Hint: Events';
      scope.count = 0;
      scope.increment = function(){scope.count};
    });

    var elm = angular.element('<button id="increment1" ng-click="increments()" ng-src>Fake Increment</button>');
    $compile(elm)(scope);
    $rootScope.$digest();
    var log = hintLog.flush();
    expect(log['Events'].error[0]).toContain('Variable "increments" called on BUTTON ' +
      'element with id: #increment1 does not exist in that scope (Try "increment").');
  });

  it('should preserve normal event handling behavior', function() {
    var scope = $rootScope.$new();
    var ctrl = $controller(function(){
      scope.onclick = jasmine.createSpy('onclick');
      scope.onmouseover = jasmine.createSpy('onmouseover');
    });

    var elm = angular.element('<button ng-click="onclick()" ng-mouseover="onmouseover()">HI</button>');
    $compile(elm)(scope);
    $rootScope.$digest();

    elm.triggerHandler('click');
    elm.triggerHandler('mouseover');
    expect(scope.onclick).toHaveBeenCalled();
    expect(scope.onmouseover).toHaveBeenCalled();
  });
});