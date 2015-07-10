class ShopService {
    constructor($log, $http) {
        'ngInject';

        this.$http = $http;
        //this.apiHost = 'http://shopdev.gf.com.cn/api/store/goldshop/1/5?asc=false&sortBy=gold';
        //this.apiHost = '/users';
        this.apiHost = '/rest/product/precision_product_nosession';
    }

    getShops() {

        return this.$http.get(this.apiHost)
            .then((response) => {
                console.log(response);
                return response.data;
            })
            .catch((error) => {
                this.$log.error('XHR Failed for getContributors.\n' + angular.toJson(error.data, true));
            });
    }
}

export default ShopService;
