require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../..//pages/map/map');
require('../..//pages/order-cont/order-cont');
require('../..//pages/order-list/order-list');
require('../..//pages/rental-point/rental-point');
require('../..//pages/todos/todos');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
