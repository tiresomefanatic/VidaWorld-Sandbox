/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-this-alias */
/**
 * Initializer class
 *
 * Responsible for instantiating and map JS Class on components if [data-component=`component`] is present
 * Takes care of intantiation on DOM mutation
 */
import reactRenderer from "../react-components/app";
import CONSTANTS from "../site/scripts/constant";
class Initializer {
  constructor() {
    var self = this;
    this.selectors = {
      component: "[data-component]",
      body: "body"
    };

    // initialize the components on DOM ready
    if (document.readyState !== "loading") {
      self.onDocumentReady();
    } else {
      document.addEventListener(
        "DOMContentLoaded",
        self.onDocumentReady.bind(this)
      );
    }

    this.initMutation();
  }

  initMutation() {
    /*------------------------------------------------------------------
     * MutationObserver is used to listen for DOM changes
     * DOC: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#Instance_methods
     * Performance related article : https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
     *------------------------------------------------------------------
     */

    // observe body element for mutations change
    var targetNode = document.querySelector(this.selectors.body);

    // Options for the observer (which mutations to observe)
    const config = {
      attributes: false,
      childList: true,
      subtree: true
    };

    if (targetNode) {
      const observer = new MutationObserver(this.handleMutation.bind(this));
      // Start observing on body element for configured mutations
      observer.observe(targetNode, config);
    }
  }

  // Callback function to execute when mutations are observed
  handleMutation(mutationsList) {
    for (var mutation of mutationsList) {
      if (mutation.type == "childList") {
        const newNodes = mutation.addedNodes;
        // if new nodes are added to the DOM run through initialize component code
        if (newNodes.length) {
          newNodes.forEach((element) => {
            if (element.dataset && element.dataset.component) {
              this.initComponent(element);
            }
            element.querySelector &&
              element.querySelectorAll(this.selectors.component).length &&
              element
                .querySelectorAll(this.selectors.component)
                .forEach((el) => {
                  if (element.dataset && element.dataset.component) {
                    this.initComponent(el);
                  }
                });
          });
        }
      }
    }
  }

  initComponent(el) {
    const dataset = el.dataset;
    const componentName = dataset.component;
    const componentType = dataset.cmpType;
    const compVersion = dataset.cmpVersion;
    const isReactComponent =
      CONSTANTS.CUSTOM_COMPONENT_TYPE ===
      (componentType && componentType.toLowerCase());
    const pathExtension = isReactComponent
      ? compVersion === CONSTANTS.VIDA_2_VERSION
        ? CONSTANTS.VIDA_2_COMPONENTS_PATH
        : CONSTANTS.REACT_COMPONENTS_PATH
      : CONSTANTS.STATIC_COMPONENTS_PATH;

    if (componentName) {
      import(`../${pathExtension}/${componentName}/${componentName}.js`)
        .then((component) => {
          if (isReactComponent) {
            const Component = component.default; // Captilization is mandatory for the 'Component' variable
            reactRenderer(el, Component, dataset);
          } else {
            component.default.init(el);
          }
        })
        .catch(() => {
          console.error(`Error occured while loading ${componentName}`);
        });
    }
  }

  onDocumentReady() {
    //window.scrollBy(1, 1);
    const elements = document.querySelectorAll(this.selectors.component);
    for (let i = 0; i < elements.length; i++) {
      this.initComponent(elements[i]);
    }
  }
}

export { Initializer };
