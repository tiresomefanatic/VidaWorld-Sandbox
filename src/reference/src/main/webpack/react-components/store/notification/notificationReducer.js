import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from "./notificationTypes";

const initialState = {
  title: "",
  description: "",
  type: "",
  isVisible: false,
  timeout: 5000
};

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        title: action.payload.title,
        description: action.payload.description,
        type: action.payload.type,
        isVisible: action.payload.isVisible,
        timeout: action.payload.timeout
      };
    case HIDE_NOTIFICATION: {
      return {
        title: "",
        description: "",
        type: "",
        isVisible: false,
        timeout: 5000
      };
    }
    default:
      return state;
  }
}
