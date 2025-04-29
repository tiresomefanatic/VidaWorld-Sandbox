import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import Store from "./store/store";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

export default function reactRenderer(el, Component, props) {
  const root = createRoot(el);
  const config = props.cmpConfig && window.appConfig[props.cmpConfig];

  root.render(
    <ErrorBoundary>
      <Provider store={Store}>
        <Suspense fallback="Loading">
          {config ? <Component config={config} /> : <Component {...props} />}
        </Suspense>
      </Provider>
    </ErrorBoundary>
  );
}
