---
title: JavaScript Interview Questions for 2 Years of Experience
description: "Explore a list of JavaScript interview questions and answers tailored for engineers with 2 years of experience, curated by big tech senior engineers."
slug: javascript-interview-questions-for-2-years-of-experience
image: /static/images/js2.png
date: "2025-10-27"
---

As a JavaScript developer with 2 years of experience, you've already demonstrated your skills in building robust and scalable applications. However, the interview process can still be daunting, especially when faced with tricky technical questions.

To help you prepare and showcase your expertise, we've curated a list of 30 JavaScript interview questions that are tailored to your level of experience. These questions cover advanced topics such as performance optimization, design patterns, and more, and are designed to help you demonstrate your skills and confidence in your next interviews.



## 1. Explain the concept of caching and how it can be used to improve performance

Caching involves storing copies of files or data temporarily to speed up access times. It enhances performance by minimizing the frequency of fetching data from its original source. In web development, caching techniques include utilizing browser caches, service workers, and HTTP headers such as Cache-Control to effectively implement this optimization.



## 2. Explain the concept of lazy loading and how it can improve performance

Lazy loading is a design approach that defers the loading of resources until they are required. This can notably enhance performance by decreasing initial load times and conserving bandwidth. For instance, in web development, images can be lazily loaded, ensuring they are fetched only when they enter the viewport.

```html
<img src="image.jpg" loading="lazy" alt="Lazy loaded image" />
```



## 3. What are design patterns and why are they useful?

Design patterns offer reusable solutions to typical software design challenges, serving as a blueprint for solving problems across various contexts. They are beneficial as they guide developers in sidestepping common issues, enhancing code clarity, and simplifying the maintenance and scalability of applications.



## 4. Explain the concept of the Prototype pattern

The Prototype pattern is a creational pattern used to create new objects by copying an existing object, known as the prototype. This pattern is advantageous when creating a new object is more resource-intensive than cloning an existing one.

```javascript
const prototypeObject = {
  greet() {
    console.log('Hello, world!');
  },
};

const newObject = Object.create(prototypeObject);
newObject.greet(); // Outputs: Hello, world!
```

This pattern allows objects to inherit properties and methods from a prototype, promoting code reuse and maintaining a clear structure in object-oriented programming.



## 5. Explain the concept of the Singleton pattern

The Singleton pattern ensures that a class has only one instance and provides a global access point to that instance. It is beneficial when you need precisely one object to manage tasks or resources system-wide.

```javascript
class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = this;
    }
    return Singleton.instance;
  }
}

const instance1 = new Singleton();
const instance2 = new Singleton();

console.log(instance1 === instance2); // true
```

This pattern is useful in scenarios like managing configurations, logging, and resource sharing across an application.



## 6. What is the Factory pattern and how is it used?

The Factory pattern in software design enables object creation without specifying their exact class upfront. It encapsulates complex instantiation logic and is ideal for situations where object types are determined dynamically at runtime.

```javascript
function createAnimal(type) {
  if (type === 'dog') {
    return { sound: 'woof' };
  } else if (type === 'cat') {
    return { sound: 'meow' };
  }
}

const dog = createAnimal('dog');
const cat = createAnimal('cat');
```

This approach promotes code flexibility and modularity by centralizing object creation logic.



## 7. Explain the Observer pattern and its use cases

The Observer pattern is a design pattern where an object, called the subject, maintains a list of its dependents, known as observers, and notifies them of any state changes. This pattern facilitates loose coupling between objects, making it useful for:

- Implementing event-driven architectures
- Real-time updates in user interfaces
- Data synchronization across different parts of an application

It enables components to react dynamically to changes without explicitly knowing each other.



## 8. What is the Decorator pattern and how is it used?

The Decorator pattern is a structural design pattern that allows behavior to be added to objects without affecting other instances of the same class. It wraps objects with additional functionality, extending their capabilities.

```javascript
class Car {
  drive() {
    return 'Driving';
  }
}

class CarDecorator {
  constructor(car) {
    this.car = car;
  }

  drive() {
    return this.car.drive();
  }
}

class GPSDecorator extends CarDecorator {
  drive() {
    return `${super.drive()} with GPS`;
  }
}

const myCar = new Car();
const myCarWithGPS = new GPSDecorator(myCar);
console.log(myCarWithGPS.drive()); // Outputs: "Driving with GPS"
```



## 9. Explain the concept of the Strategy pattern

The Strategy pattern is a behavioral design pattern that allows you to encapsulate different algorithms into separate classes that are interchangeable. It enables the selection of algorithms at runtime without modifying client code.

```javascript
class Context {
  constructor(strategy) {
    this.strategy = strategy;
  }

  execute(data) {
    return this.strategy.algorithm(data);
  }
}

class ConcreteStrategyA {
  algorithm(data) {
    return data.sort(); // Example: sorting algorithm
  }
}

class ConcreteStrategyB {
  algorithm(data) {
    return data.reverse(); // Example: reverse algorithm
  }
}

// Usage
const context = new Context(new ConcreteStrategyA());
const data = [3, 1, 2];
console.log(context.execute(data)); // Outputs: [1, 2, 3]

context.strategy = new ConcreteStrategyB();
console.log(context.execute(data)); // Outputs: [3, 2, 1]
```



## 10. What is the Command pattern and how is it used?

The Command pattern is a behavioral design pattern that turns a request into a stand-alone object containing all information about the request. This transformation allows for:

- Parameterization of methods with different requests
- Queuing of requests
- Logging of requests
- Undoable operations

```javascript
class Command {
  execute() {}
  undo() {}
}

class LightOnCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }
  execute() {
    this.light.on();
  }
  undo() {
    this.light.off();
  }
}

class Light {
  on() {
    console.log('Light is on');
  }
  off() {
    console.log('Light is off');
  }
}

const light = new Light();
const lightOnCommand = new LightOnCommand(light);
lightOnCommand.execute(); // Light is on
lightOnCommand.undo(); // Light is off
```



## 11. What is the Module pattern and how does it help with encapsulation?

The Module pattern in JavaScript is a design pattern used to create self-contained modules of code. It helps with encapsulation by allowing you to define private and public members within a module. Private members are not accessible from outside the module, while public members are exposed through a returned object.

```javascript
var myModule = (function () {
  var privateVar = 'I am private';

  function privateMethod() {
    console.log(privateVar);
  }

  return {
    publicMethod: function () {
      privateMethod();
    },
  };
})();

myModule.publicMethod(); // Logs: I am private
```



## 12. How can you avoid problems related to hoisting?

To avoid issues related to hoisting in JavaScript:

- Use `let` or `const` to declare variables instead of `var`
- Unlike `var`, `let` and `const` are block-scoped
- Declare functions before they are called

```javascript
// Use let or const
let x = 10;
const y = 20;

// Declare functions before calling them
function myFunction() {
  console.log('Hello, world!');
}
myFunction();
```



## 13. How can you share code between JavaScript files?

### Using ES6 Modules:

```javascript
// file1.js
export function greet() {
  console.log('Hello, world!');
}

// file2.js
import { greet } from './file1.js';
greet();
```

### Using CommonJS Modules (Node.js):

```javascript
// file1.js
module.exports = function greet() {
  console.log('Hello, world!');
};

// file2.js
const greet = require('./file1.js');
greet();
```



## 14. How do you get the query string values of the current page in JavaScript?

```javascript
// Assuming the URL is: http://example.com/page?key=value&foo=bar

// Create a URLSearchParams object from the current page's query string
const params = new URLSearchParams(window.location.search);

// Retrieve specific query parameter values
const keyValue = params.get('key'); // 'value'
const fooValue = params.get('foo'); // 'bar'

// Example usage
console.log(keyValue); // Outputs: 'value'
console.log(fooValue); // Outputs: 'bar'
```



## 15. How do you handle errors in asynchronous operations?

### Using async/await with try...catch:

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}
```

### Using Promises with .catch() method:

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching data:', error.message));
```



## 16. How do you manipulate CSS styles using JavaScript?

### Direct style manipulation:

```javascript
// Changing background color
document.getElementById('myDiv').style.backgroundColor = 'blue';
```

### Using classList:

```javascript
document.getElementById('myDiv').classList.add('newClass');
document.getElementById('myDiv').classList.remove('oldClass');
document.getElementById('myDiv').classList.toggle('toggleClass');
```



## 17. What are the common pitfalls of using the this keyword?

Using the `this` keyword can be tricky because its value depends on the function's invocation context. Common pitfalls include:

- Losing `this` context when passing methods as callbacks
- Using `this` inside nested functions
- Misunderstanding `this` in arrow functions

To address these issues, developers often use methods like `.bind()`, arrow functions, or store `this` context in a variable.



## 18. What is the DOM and how is it structured?

The DOM, or Document Object Model, is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content. The DOM is structured as a tree of objects, where each node represents part of the document, such as elements, attributes, and text nodes.



## 19. What do you think of AMD vs CommonJS?

**AMD (Asynchronous Module Definition)** focuses on asynchronous loading, ideal for browsers, using `define()` and `require()`.

**CommonJS**, geared towards server-side environments like Node.js, employs `module.exports` and `require()` for synchronous module loading.



## 20. What are the different ways to make an API call in JavaScript?

- **XMLHttpRequest**: Traditional method, more verbose
- **fetch**: Modern approach that returns promises
- **Axios**: Third-party library that simplifies API calls and offers additional features



## 21. What are some tools that can be used for JavaScript testing?

- **Jest**: Praised for its simplicity and built-in functionalities
- **Mocha**: Offers flexibility and can be integrated with various libraries
- **Jasmine**: Known for its straightforward setup and BDD approach
- **Cypress**: Excels in end-to-end testing with real browser interactions



## 22. What is the difference between event.preventDefault() and event.stopPropagation()?

- **event.preventDefault()**: Prevents the default action of an event (e.g., stopping a form submission)
- **event.stopPropagation()**: Prevents the event from bubbling up to parent elements



## 23. What is the difference between innerHTML and textContent?

```javascript
// innerHTML - parses and renders HTML tags
element.innerHTML = '<strong>Bold Text</strong>'; // Renders as bold text

// textContent - renders HTML tags as plain text
element.textContent = '<strong>Bold Text</strong>'; // Renders as plain text: <strong>Bold Text</strong>
```



## 24. What is the difference between the window object and the document object?

- **window object**: Represents the browser window, offering methods to control it (e.g., opening new windows, accessing browser history)
- **document object**: Represents the web page's content within the window, providing methods to manipulate the DOM (e.g., selecting elements, modifying content)



## 25. What is the difference between setTimeout(), setImmediate(), and process.nextTick()?

- **setTimeout()**: Schedules a callback to run after a minimum delay
- **setImmediate()**: Schedules a callback to run after the current event loop completes
- **process.nextTick()**: Schedules a callback to run before the next event loop iteration begins

```javascript
setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
```

In this example, `process.nextTick()` executes first, followed by either `setTimeout()` or `setImmediate()` depending on the environment.



## 26. How do you use window.history API?

The `window.history` API allows you to manipulate the browser's session history.

```javascript
// Add a new entry to the history
history.pushState({ page: 1 }, 'title 1', '?page=1');

// Replace the current history entry
history.replaceState({ page: 2 }, 'title 2', '?page=2');

// Navigate back, forward, or to a specific point in history
history.back(); // Go back one step
history.forward(); // Go forward one step
history.go(-2); // Go back two steps
```



## 27. What are the pros and cons of using Promises instead of callbacks in JavaScript?

### Pros:

- **Avoids Callback Hell**: Provides a more linear and readable structure
- **Sequential Execution**: Easily write sequential asynchronous code using `.then()`
- **Parallel Execution**: Use `Promise.all()` for parallel asynchronous operations

### Cons:

- **Slightly More Complex**: Some developers find promises marginally more complex compared to straightforward callbacks



## 28. What are the metadata fields of a module?

Metadata fields of a module often include the module's name, version, description, author, license, and dependencies. These fields are commonly found in a `package.json` file.

```json
{
  "name": "my-module",
  "version": "1.0.0",
  "description": "A sample module",
  "author": "John Doe",
  "license": "MIT",
  "dependencies": {
    "express": "^4.17.1"
  }
}
```



## 29. What are the different types of errors in JavaScript?

1. **Syntax Errors**: Occur when the code violates the language's grammar rules (e.g., missing a parenthesis)
2. **Runtime Errors**: Happen during code execution (e.g., trying to access a property of undefined)
3. **Logical Errors**: Mistakes in the code's logic that lead to incorrect results without throwing an error



## 30. Explain the concept of error propagation in JavaScript

Error propagation in JavaScript refers to the process of passing errors up the call stack. When an error occurs in a function, it can be caught and handled with `try...catch` blocks. If not caught, the error moves up the call stack until it is either caught or causes the program to terminate.

```javascript
function a() {
  throw new Error('An error occurred');
}

function b() {
  a();
}

try {
  b();
} catch (e) {
  console.error(e.message); // Outputs: An error occurred
}
```

In this example, the error thrown in function `a` propagates to function `b` and is caught in the `try...catch` block.



## Conclusion

You've reached the end of our list of 30 JavaScript interview questions! We hope these questions have helped you identify areas for improvement and solidify your understanding of advanced JavaScript concepts. Remember, the key to acing an interview is not just about knowing the answers, but also about demonstrating your thought process, problem-solving skills, and ability to communicate complex ideas simply.