const { registerRootComponent } = require('expo');

if (__DEV__) {
    global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
    global.FormData = global.originalFormData || global.FormData;
}
const App = require('./src/App').default;

registerRootComponent(App);
