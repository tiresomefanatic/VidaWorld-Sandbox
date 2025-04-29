import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import fetch from "unfetch";
import loginUtils from "../site/scripts/utils/loginUtils";
import CONSTANT from "../site/scripts/constant";
import Logger from "./logger.service";
import { showNotificationDispatcher } from "../react-components/store/notification/notificationActions";
import appUtils from "../site/scripts/utils/appUtils";
import { setSpinnerActionDispatcher } from "../react-components/store/spinner/spinnerActions";

let apolloClient;
let apolloClientForGet;

const httpLink = createHttpLink({
  uri: appUtils.getConfig("magentoAPIUrl"),
  fetch: fetch
});

const httpLinkForGet = createHttpLink({
  uri: appUtils.getConfig("magentoAPIUrl"),
  fetch: fetch,
  fetchOptions: { method: "GET" }
});

const authLink = setContext((_, { headers }) => {
  const AUTH_TOKEN = loginUtils.getSessionToken();
  return {
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=UTF-8",
      ...(AUTH_TOKEN && { authorization: `Bearer ${AUTH_TOKEN}` })
    }
  };
});

const logoutLink = onError(({ graphQLErrors, networkError }) => {
  setSpinnerActionDispatcher(false);
  if (graphQLErrors) {
    Logger.error("GraphQL Error!", graphQLErrors);
    // Add one or more pages to ignore the notification
    const ignorePages = [appUtils.getPageUrl("loginUrl")];
    const url = window.location.pathname;
    const file = ignorePages.find(
      (page) =>
        page.substring(page.lastIndexOf("/") + 1) ===
        url.substring(url.lastIndexOf("/") + 1)
    );
    if (!file) {
      showNotificationDispatcher({
        title: CONSTANT.NOTIFICATION_TYPES.ERROR,
        description: graphQLErrors[0].message,
        type: CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
    }
    if (
      graphQLErrors[0]?.extensions?.category ===
      CONSTANT.GRAPHQL_EXTENSION.AUTHORIZATION
    ) {
      window.location.href = appUtils.getPageUrl("loginUrl");
    }
  }
  if (networkError) {
    const errorMsg =
      CONSTANT.HTTP_ERROR_CODES[networkError.statusCode] ||
      CONSTANT.OTHER_HTTP_ERROR;
    if (errorMsg) {
      Logger.error(errorMsg);
      showNotificationDispatcher({
        title: CONSTANT.NOTIFICATION_TYPES.ERROR,
        description: errorMsg,
        type: CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
    }
  }
});

try {
  const cache = new InMemoryCache();
  apolloClient = new ApolloClient({
    cache,
    link: logoutLink.concat(authLink.concat(httpLink)),
    resolvers: {}
  });
} catch (error) {
  log.error(error);
}

try {
  const cache = new InMemoryCache();
  apolloClientForGet = new ApolloClient({
    cache,
    link: logoutLink.concat(authLink.concat(httpLinkForGet)),
    resolvers: {}
  });
} catch (error) {
  log.error(error);
}

export { apolloClientForGet };

export default apolloClient;
