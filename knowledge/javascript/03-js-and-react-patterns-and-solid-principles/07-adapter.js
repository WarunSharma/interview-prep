
// For more information https://refactoring.guru/design-patterns/adapter

/*
Adapter pattern is a structural design pattern that allows objects with incompatible interfaces to collaborate.

Problem: Imagine that you’re creating a stock market monitoring app. The app downloads the stock data 
from multiple sources in XML format and then displays nice-looking charts and diagrams for the user.
At some point, you decide to improve the app by integrating a smart 3rd-party analytics library. 
But there’s a catch: the analytics library only works with data in JSON format. You could change the 
library to work with XML. However, this might break some existing code that relies on the library. 
And worse, you might not have access to the library’s source code in the first place, making this 
approach impossible.

Solution: The Adapter pattern solves this problem by creating a wrapper class that converts the XML data
into JSON format. The wrapper class implements the interface expected by the analytics library, 
allowing it to work seamlessly with the existing code.

*/

class XMLData {
    constructor(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }
}

class JSONData {
    constructor(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }
}

class XMLToJSONAdapter {
    constructor(xmlData) {
        this.xmlData = xmlData;
    }

    getData() {
        // Convert XML to JSON (for simplicity, we just wrap the XML data in a JSON object)
        return new JSONData({ xml: this.xmlData.getData() });
    }
}

// Usage
const xmlData = new XMLData('<stock><symbol>GOOG</symbol><price>2800</price></stock>');
const adapter = new XMLToJSONAdapter(xmlData);
const jsonData = adapter.getData();

console.log(jsonData.getData()); // Output: { xml: '<stock><symbol>GOOG</symbol><price>2800</price></stock>' }