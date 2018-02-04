require('./config$');

function success() {
require('../..//app');
require('../..//pages/map/map');
require('../..//pages/rental-point/rental-point');
require('../..//pages/order-cont/order-cont');
require('../..//pages/todos/todos');
require('../..//pages/order-list/order-list');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
