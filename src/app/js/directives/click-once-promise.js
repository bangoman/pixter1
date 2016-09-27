/**
 * Created by ori on 07/09/16.
 */
angular.module('app').directive('clickOncePromise', function ($q,$timeout) {
    var delay = 500;   // min milliseconds between clicks

    return {
        scope: {
            clickOncePromise: '&',
        },
        restrict: 'A',
        link: function (scope, elem) {
            var inProcess;
            var minimumDelay = 500;

            function onClick() {
                if (!inProcess) {
                    inProcess = true;
                    $q
                        .all([
                            $timeout(angular.noop,minimumDelay),
                            scope.clickOncePromise(),
                        ])
                        .catch(angular.noop)
                        .then(function () {
                            inProcess = false;
                        });
                }
            }

            scope.$on('$destroy', function () {
                elem.off('click', onClick);
            });
            elem.on('click', onClick);
        }
    };
});