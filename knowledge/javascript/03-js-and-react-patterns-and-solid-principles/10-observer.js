
/*
Observer Pattern is a behavioral design pattern that allows an object (the subject) to maintain a list of
 its dependents (observers) and notify them automatically of any state changes, usually by calling one of 
 their methods. This pattern is commonly used in event-driven programming and is a key part of the 
 Model-View-Controller (MVC) architectural pattern.

*/

class YouTubeChannel {
  constructor(name) {
    this.name = name;
    this.subscribers = [];
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    this.subscribers = this.subscribers.filter(
      (item) => item !== subscriber
    );
  }

  uploadVideo(title) {
    console.log(`${this.name} uploaded: ${title}`);

    this.subscribers.forEach((subscriber) => {
      subscriber.notify(this.name, title);
    });
  }
}

class Subscriber {
  constructor(name) {
    this.name = name;
  }

  notify(channelName, videoTitle) {
    console.log(
      `${this.name} received notification: ${channelName} uploaded "${videoTitle}"`
    );
  }
}

// Usage
const channel = new YouTubeChannel("Code with Sam");

const alice = new Subscriber("Alice");
const bob = new Subscriber("Bob");

channel.subscribe(alice);
channel.subscribe(bob);

channel.uploadVideo("Observer Pattern Explained");