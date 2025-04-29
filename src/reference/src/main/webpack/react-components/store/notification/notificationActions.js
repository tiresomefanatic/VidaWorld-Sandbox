import Store from "../store";
import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from "./notificationTypes";

export const showNotificationAction = (data) => {
  return {
    type: SHOW_NOTIFICATION,
    payload: {
      title: data.title,
      description: data.description,
      type: data.type,
      isVisible: data.isVisible,
      timeout: data.timeout ? data.timeout : 5000
    }
  };
};

export const hideNotificationAction = () => {
  return {
    type: HIDE_NOTIFICATION
  };
};

export const showNotificationDispatcher = (data, callback = () => false) => {
  Store.dispatch(showNotificationAction(data));
  setTimeout(() => {
    Store.dispatch(hideNotificationAction());
    callback();
  }, data.timeout || 5000);
};

export const hideNotificationDispatcher = () => {
  Store.dispatch(hideNotificationAction());
};
