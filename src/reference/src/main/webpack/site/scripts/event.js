/**
 * @author Noor Mohamed <nmohamme@adobe.com>
 * Pub-Sub Pattern :: Event Class
 */

class Event {
  constructor() {
    this.topics = {};
    this.subscribersId = -1;
  }

  subscribe(topic, func) {
    // Check whether the topic and func exist.
    if (!topic || !func) {
      return;
    }

    // Create the topic if not yet created.
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }

    this.subscribersId += 1;
    const token = this.subscribersId.toString();

    // Add the token and func to the Queue.
    this.topics[topic].push({
      token,
      func
    });
    return token;
  }

  unsubscribe(token) {
    const found = Object.keys(this.topics).some((topic) =>
      this.topics[topic].some((subscriber, index) => {
        const areEqual = subscriber.token === token.toString();
        if (areEqual) {
          this.topics[topic].splice(index, 1);
        }
        return areEqual;
      })
    );

    return found ? token : null;
  }

  publish(topic, data) {
    // Check whether the topic and data exist.
    if (!this.topics[topic] || this.topics[topic].length < 1) {
      return;
    }

    // Fire the event to all the listeners
    this.topics[topic].forEach(function (listener) {
      listener.func(data || {});
    });
    return true;
  }
}

const eventQueue = new Event();

export default eventQueue;
