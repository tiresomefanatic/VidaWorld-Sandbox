import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";
import { saveState } from "../../site/scripts/utils/localStorageUtils";
const Store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

Store.subscribe(() => {
  saveState({
    preBookingReducer: Store.getState().preBookingReducer,
    scooterInfoReducer: Store.getState().scooterInfoReducer,
    purchaseConfigReducer: Store.getState().purchaseConfigReducer
  });
});
export default Store;
