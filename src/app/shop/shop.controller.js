class ShopController {
    constructor(shop) {
        'ngInject';

        this.awesomeThings = ['i m shop'];

        shop.getShops()
        .then(
            (data) => {
                console.log(data);
            }
        );

    }
}

export default
    ShopController;
