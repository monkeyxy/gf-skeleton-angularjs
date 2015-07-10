function routerConfig($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'

            // views: {
            //     "lazyLoadView": {
            //         controller: 'AppCtrl',
            //         templateUrl: 'partials/main.html'
            //     }
            // },
            // resolve: {
            //     loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            //         // you can lazy load files for an existing module
            //         return $ocLazyLoad.load('js/AppCtrl.js');
            //     }]
            // }
        })
        .state('shop', {
            url: '/shop',
            templateUrl: 'app/shop/shop.html',
            controller: 'ShopController',
            controllerAs: 'shop'
        });

    $urlRouterProvider.otherwise('/');
}

export default routerConfig;
