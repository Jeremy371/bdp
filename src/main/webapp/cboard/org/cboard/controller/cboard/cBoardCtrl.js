/**
 * Created by yfyuan on 2016/7/19.
 */
cBoard.controller('cBoardCtrl', function ($rootScope, $scope, $location, $http, $q, $filter, $uibModal, ModalUtils) {

    var translate = $filter('translate');

    $rootScope.alert = function (msg) {
        ModalUtils.alert(msg);
    };

    /**
     * Author: Jeremy Kim
     * Date: 2018.08.20
     * 
     * main-header.html에 정보를 표시하는데에 쓰임
     * - user 객체를 세션에 넣으면 필요없을 것으로 보여짐
     * 
     * */
    $http.get("/bdp/cboard/commons/getUserDetail").success(function (response) {
	    var avatarUrl = '/bdp/cboard/dist/img/user-male-circle-blue-128.png';
        $scope.user = response;
	    $scope.user.avatar = avatarUrl;
    });
    
    var getMenuList = function () {
        $http.get("/bdp/cboard/commons/getMenuList").success(function (response) {
            $scope.menuList = response;
        });
    };

    var getCategoryList = function () {
        $http.get("/bdp/cboard/dashboard/getCategoryList").success(function (response) {
            $scope.categoryList = response;
        });
    };

    var getBoardList = function () {
        $http.get("/bdp/cboard/dashboard/getBoardList").success(function (response) {
            $scope.boardList = response;
        });
    };

    $scope.$on("boardChange", function () {
        getBoardList();
    });

    $scope.$on("categoryChange", function () {
        getCategoryList();
    });

    $scope.isShowMenu = function (code) {
        return !_.isUndefined(_.find($scope.menuList, function (menu) {
            return menu.menuCode == code
        }));
    };

    getMenuList();
    getCategoryList();
    getBoardList();

    $scope.changePwd = function () {
        $uibModal.open({
            templateUrl: 'org/cboard/view/cboard/changePwd.html',
            windowTemplateUrl: 'org/cboard/view/util/modal/window.html',
            backdrop: false,
            size: 'sm',
            controller: function ($scope, $uibModalInstance) {
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $http.post("/bdp/cboard/commons/changePwd", {
                        curPwd: $scope.curPwd,
                        newPwd: $scope.newPwd,
                        cfmPwd: $scope.cfmPwd
                    }).success(function (serviceStatus) {
                        if (serviceStatus.status == '1') {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $uibModalInstance.close();
                        } else {
                            ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                        }
                    });
                };
            }
        });
    }
});