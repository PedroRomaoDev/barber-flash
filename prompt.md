Logs for your project will appear below. Press Ctrl+C to exit.
Android Bundled 3308ms apps\mobile\index.js (1090 modules)
Web Bundling failed 4129ms apps\mobile\index.js (842 modules)
 ERROR  Importing native-only module "react-native/Libraries/Utilities/codegenNativeComponent" on web from: ..\..\node_modules\.pnpm\@stripe+stripe-react-native_0ff8
0ebe1971e1241cfd046ab680accf\node_modules\@stripe\stripe-react-native\lib\module\specs\NativeAuBECSDebitForm.js

Import stack:

 node_modules\.pnpm\@stripe+stripe-react-native_0ff80ebe1971e1241cfd046ab680accf\node_modules\@stripe\stripe-react-native\lib\module\specs\NativeAuBECSDebitForm.js  
 | import "react-native/Libraries/Utilities/codegenNativeComponent"
           ^ Importing react-native internals is not supported on web.

 node_modules\.pnpm\@stripe+stripe-react-native_0ff80ebe1971e1241cfd046ab680accf\node_modules\@stripe\stripe-react-native\lib\module\components\AuBECSDebitForm.js   
 | import "../specs/NativeAuBECSDebitForm"

 node_modules\.pnpm\@stripe+stripe-react-native_0ff80ebe1971e1241cfd046ab680accf\node_modules\@stripe\stripe-react-native\lib\module\index.js
 | import "./components/AuBECSDebitForm"

 apps\mobile\src\App.tsx
 | import "@stripe/stripe-react-native"

 apps\mobile\index.js
 | import "./src/App"

 
 | import "./apps/mobile/index"

