import { createStore } from "redux";
function city(state = "柘城", action) {
  switch (action.type) {
    case "getCity":
      //   console.log(action);
      //   state = action.data;
      return action.data;
    //   break;

    default:
      return state;
  }
}
const store = createStore(city);
export default store;
