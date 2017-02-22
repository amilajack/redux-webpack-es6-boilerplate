const jq = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');
const jsdom = require('jsdom');
const chai = require('chai');
const { expect } = require('chai');
const chaiJquery = require('chai-jquery');
const createHistory = require('react-router/lib/browserHistory');
const { Provider } = require('react-redux');
const { createStore } = require('redux');
const reducers = require('../../src/js/reducers');

/* eslint react/no-find-dom-node: 0 */

// Global prerequisites to make it work in the command line
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
const $ = jq(window);

// Set up chai-jquery
chaiJquery(chai, chai.util, $);

function renderComponent(ComponentClass, props = {}, state = {}) {
  const componentInstance = ReactTestUtils.renderIntoDocument(
    <Provider store={createStore(reducers, state)}>
      <ComponentClass {...props} />
    </Provider>
  );

  // Produces HTML
  return $(ReactDOM.findDOMNode(componentInstance));
}

function mockHistory(component) {
  component.childContextTypes = { history: React.PropTypes.object };
  component.prototype.getChildContext = () => ({ history: createHistory() });
}

// Helper for simulating events
$.fn.simulate = function(eventName, value) {
  if (value) {
    this.val(value);
  }
  ReactTestUtils.Simulate[eventName](this[0]);
};

module.exports = { renderComponent, mockHistory, expect };
