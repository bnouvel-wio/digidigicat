angular.module('scanner.controllers', [])
    .controller('HomeController', function($scope, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, scoreKeeperService, infoService, $ionicModal) {
        var vm = this;
                
                vm.score = scoreKeeperService.getScore();
                vm.hasInfo = false;
                
                $ionicModal.fromTemplateUrl('templates/form-modal.html', {
                                            scope: $scope,
                                            animation: 'slide-in-up'
                                            }).then(function(modal) {
                vm.modal = modal;
                });
                
                vm.openForm = function(){
                vm.modal.show();
                };
                
                vm.closeForm = function() {
                vm.modal.hide();
                }

        vm.scan = function(){
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                          
                          //increment score
                          vm.score = scoreKeeperService.incrementScore();
                          
                          var qr_str = result.text;
                          
                          if (qr_str === 'digi-FORM') {
                          vm.hasInfo = false;
                          vm.openForm();
                          
                          } else {
                          var infoObj = infoService.getInfo(qr_str);
                          
                          if (infoObj) {
                          vm.hasInfo = true;
                          vm.result = infoObj;
                          }
                          }
                          
                          
                          
                        // Success! Barcode data is here
                        /*vm.scanResults = "We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled;*/
                    }, function(error) {
                        // An error occurred
                        vm.scanResults = 'Error: ' + error;
                    });
            });
        };

        vm.scanResults = '';
    });
