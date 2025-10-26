---
title: 50 Must-know JavaScript Interview Questions by Ex-interviewers
description: "50 essential JavaScript coding interview questions and answers, curated by senior engineers and former interviewers from leading tech companies."
slug: 50-must-know-javascript-interview-questions
image: /static/images/50questions.png
date: "2025-10-25"
---

JavaScript is an essential skill for anyone pursuing a career in web development, but securing a job in this field can be particularly challenging for newcomers. A critical part of the hiring process is the technical interview, where your JavaScript expertise will be thoroughly evaluated.

To support your preparation and build your confidence, we've put together a list of the top 50 must-know JavaScript interview questions and answers frequently encountered in interviews.



## 1. What is Debouncing in JavaScript?

**Debouncing** is a smart way to handle events that fire repeatedly within a short time, such as typing in a search box or resizing a window. Instead of executing a function every single time the event is triggered, debouncing ensures the function runs only after the event stops firing for a specified time.

### Why is it important?

It prevents performance bottlenecks by reducing the number of unnecessary function calls, making your app smoother and more efficient.

### How does it work?

The debounce method delays a function's execution until after a defined "waiting period" has passed since the last event. Let's see an example using Lodash:

```javascript
import { debounce } from 'lodash';

const searchInput = document.getElementById('search-input');

const debouncedSearch = debounce(() => {
  // Perform the search operation here
  console.log('Searching for:', searchInput.value);
}, 300);

searchInput.addEventListener('input', debouncedSearch);
```

### Key features of debouncing

- **Delay-based execution**: Runs the function after user activity has stopped
- **Improves performance**: Prevents excessive computations or network calls during rapid events
- **Flexible configurations**: Supports leading (immediate) and trailing (delayed) execution, and even a maximum wait time

### How is it different from throttling?

While debouncing waits until user activity stops, throttling ensures the function runs at fixed intervals, regardless of how often the event occurs. Each technique suits specific use cases, such as search boxes (debouncing) versus scroll events (throttling).



## 2. Understanding Promise.all()

`Promise.all()` is a powerful method in JavaScript that allows you to handle multiple asynchronous tasks simultaneously. It takes an array of promises and returns a single promise that resolves when all the promises resolve, or rejects if any one of them fails.

This method is perfect when you need to wait for several independent asynchronous tasks to finish before proceeding, like fetching data from multiple APIs.

```javascript
const promise1 = fetch('https://api.example.com/data/1');
const promise2 = fetch('https://api.example.com/data/2');
const promise3 = fetch('https://api.example.com/data/3');

Promise.all([promise1, promise2, promise3])
  .then((responses) => {
    // Executes only when all promises are resolved.
    console.log('All responses:', responses);
  })
  .catch((error) => {
    // Catches any error from any promise.
    console.error('Error:', error);
  });
```

### Key Features of Promise.all

- **Concurrency**: Runs multiple asynchronous tasks in parallel, improving performance
- **All-or-nothing resolution**: The promise resolves only when all tasks succeed, or it rejects if any one fails
- **Simplifies workflows**: Ideal for managing interdependent or independent tasks efficiently



## 3. What is Deep Equal?

Deep equality involves comparing two objects or arrays to determine if they are structurally identical. Unlike shallow equality, which only checks if object references are the same, deep equality examines whether all nested values are equal.

```javascript
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (
    obj1 == null ||
    typeof obj1 !== 'object' ||
    obj2 == null ||
    typeof obj2 !== 'object'
  )
    return false;

  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

// Example usage
const object1 = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    zip: '10001',
  },
};

const object2 = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    zip: '10001',
  },
};

console.log(deepEqual(object1, object2)); // true
```

This function uses recursion to check nested properties, ensuring all values match in both objects or arrays. It's a critical concept for comparing complex data structures in frontend development.



## 4. Understanding Event Emitters

An **EventEmitter** is a utility that enables objects to listen for and emit events. It implements the observer pattern, allowing you to subscribe to actions or changes and handle them when triggered. This concept is fundamental in both JavaScript and Node.js for managing event-driven programming.

```javascript
const eventEmitter = new EventEmitter();

// Subscribe to an event
eventEmitter.on('customEvent', (data) => {
  console.log('Event emitted with data:', data);
});

// Emit the event
eventEmitter.emit('customEvent', { message: 'Hello, world!' });
```

EventEmitter allows flexible communication between components, making it useful in scenarios like state management, logging, or real-time updates.



## 5. What is Array.prototype.reduce()?

`Array.prototype.reduce()` is a versatile method for iterating through an array and reducing it to a single value. It processes each element with a callback function, carrying over an accumulator to build the final result. Common use cases include summing numbers, flattening arrays, or even building complex objects.

```javascript
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce(function (accumulator, currentValue) {
  return accumulator + currentValue;
}, 0);

console.log(sum); // Output: 15
```

### Why Use reduce?

- **Flexibility**: Handles various operations, from aggregations to transformations
- **Functional programming**: Encourages declarative and clean code
- **Powerful**: Can replace loops or multiple utility methods in a single chain



## 6. Simplifying arrays – Flattening

Flattening transforms a nested array into a single-level array, making it more manageable. Since ES2019, JavaScript provides the `Array.prototype.flat()` method for this.

```javascript
const nestedArray = [1, [2, [3, [4, [5]]]]];
const flatArray = nestedArray.flat(Infinity);

console.log(flatArray); // Output: [1, 2, 3, 4, 5]
```

Here, `.flat(Infinity)` ensures the entire array is flattened, no matter how deep. For less deeply nested arrays, you can specify the depth.

### Before ES2019

Custom solutions were common:

```javascript
// Custom recursive array flattener
function flattenArray(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val),
    [],
  );
}

const nestedArray = [1, [2, [3, [4, [5]]]]];
const flatArray = flattenArray(nestedArray);

console.log(flatArray); // Output: [1, 2, 3, 4, 5]
```



## 7. Merging data structures

Merging data is crucial when handling complex structures. JavaScript provides efficient ways to combine objects or arrays.

### Merging objects

#### Using the spread operator

The spread operator is concise and intuitive for merging objects:

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

const mergedObj = { ...obj1, ...obj2 };

console.log(mergedObj); // Output: { a: 1, b: 3, c: 4 }
```

#### Using Object.assign()

Another approach is `Object.assign()`:

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

const mergedObj = Object.assign({}, obj1, obj2);

console.log(mergedObj); // Output: { a: 1, b: 3, c: 4 }
```

### Merging arrays

#### Using the spread operator

```javascript
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];

const mergedArray = [...array1, ...array2];

console.log(mergedArray); // Output: [1, 2, 3, 4, 5, 6]
```

#### Using Array.concat()

```javascript
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];

const mergedArray = array1.concat(array2);

console.log(mergedArray); // Output: [1, 2, 3, 4, 5, 6]
```

### Deep merging

For nested objects, you'll need custom logic or libraries:

```javascript
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

const obj1 = { a: 1, b: { x: 10, y: 20 } };
const obj2 = { b: { y: 30, z: 40 }, c: 3 };

const mergedObj = deepMerge(obj1, obj2);

console.log(mergedObj); // Output: { a: 1, b: { x: 10, y: 30, z: 40 }, c: 3 }
```

Alternatively, libraries like Lodash simplify deep merging:

```javascript
const _ = require('lodash');

const obj1 = { a: 1, b: { x: 10, y: 20 } };
const obj2 = { b: { y: 30, z: 40 }, c: 3 };

const mergedObj = _.merge({}, obj1, obj2);

console.log(mergedObj); // Output: { a: 1, b: { x: 10, y: 30, z: 40 }, c: 3 }
```



## 8. Selecting DOM Elements – getElementsByClassName

`getElementsByClassName` fetches elements matching a specific class and returns them as a live HTMLCollection.

```javascript
// Fetch and loop through elements
const elements = document.getElementsByClassName('example');

for (let i = 0; i < elements.length; i++) {
  console.log(elements[i].textContent);
}
```

### Multiple classes

You can combine class names for more specific selections:

```javascript
const elements = document.getElementsByClassName('class1 class2');
```

### Live collections

HTMLCollection updates automatically if DOM elements are added or removed.

For more complex selectors, use `querySelectorAll`:

```javascript
const elements = document.querySelectorAll('.example');
```



## 9. Avoiding redundant computations with memoization

Memoization saves computed results to avoid redundant calculations.

```javascript
function expensiveOperation(n) {
  console.log('Calculating for', n);
  return n * 2;
}

// Memoize function
function memoize(func) {
  const cache = {};

  return function (n) {
    if (cache[n] !== undefined) {
      console.log('From cache for', n);
      return cache[n];
    }
    const result = func(n);
    cache[n] = result;
    return result;
  };
}

const memoizedExpensiveOperation = memoize(expensiveOperation);

console.log(memoizedExpensiveOperation(5)); // Calculating for 5, 10
console.log(memoizedExpensiveOperation(5)); // From cache for 5, 10
```

Libraries like Lodash also provide a memoize utility.



## 10. Safer nested property access: get

Accessing nested object properties risk errors if any property is undefined. Tools like Lodash's `get` or JavaScript's optional chaining (`?.`) help mitigate this.

```javascript
const user = { address: { city: 'New York' } };

console.log(_.get(user, 'address.city')); // 'New York'
console.log(user.address?.city); // 'New York'
```

These methods safely retrieve nested properties without crashing the program.



## 11. Hoisting in JavaScript

**Hoisting** refers to how JavaScript moves variable and function declarations to the top of their scope during compilation. While only the declaration is hoisted (not the initialization), understanding hoisting helps in writing cleaner and bug-free code.

### Hoisting with var

Variables declared with `var` are hoisted and initialized as `undefined`. Accessing them before initialization results in `undefined`.

```javascript
console.log(foo); // undefined
var foo = 1;
console.log(foo); // 1
```

### Hoisting with let, const, and class

Variables declared with `let`, `const`, and `class` are hoisted but exist in a "temporal dead zone" until their declaration is reached, causing a `ReferenceError` if accessed early.

```javascript
console.log(y); // ReferenceError
let y = 'local';
```

### Function hoisting

#### Function declarations

Both the declaration and definition of functions are hoisted, allowing them to be called before their declaration.

```javascript
foo(); // 'FOOOOO'

function foo() {
  console.log('FOOOOO');
}
```

#### Function expressions

For function expressions, only the variable is hoisted, not the function itself.

```javascript
console.log(bar); // undefined
bar(); // TypeError: bar is not a function

var bar = function () {
  console.log('BARRRR');
};
```

### Import statements

Imports are hoisted, making them available throughout the module. However, their initialization happens before the module code executes.

```javascript
foo.doSomething(); // Works fine

import foo from './modules/foo';
```

### Best practices

- Modern JavaScript uses `let` and `const` to avoid hoisting pitfalls
- Declare variables at the top of their scope for better readability
- Use tools like ESLint to enforce best practices: `no-use-before-define`, `no-undef`



## 12. What are the differences between JavaScript variables created using let, var, and const?

In JavaScript, `let`, `var`, and `const` are used to declare variables, but they differ in scope, initialization, redeclaration, reassignment, and behavior when accessed before declaration.

### Scope

Variables declared with `var` are function-scoped or global, while `let` and `const` are block-scoped (confined to the nearest `{}` block).

```javascript
if (true) {
  var foo = 1;
  let bar = 2;
  const baz = 3;
}

console.log(foo); // 1
console.log(bar); // ReferenceError
console.log(baz); // ReferenceError
```

### Initialization

`var` and `let` can be declared without initialization, but `const` requires an initial value.

```javascript
var a; // Valid
let b; // Valid
const c; // SyntaxError: Missing initializer
```

### Redeclaration

Variables declared with `var` can be redeclared, but `let` and `const` cannot.

```javascript
var x = 10;
var x = 20; // Allowed

let y = 10;
let y = 20; // SyntaxError: Identifier 'y' has already been declared
```

### Reassignment

`var` and `let` allow reassignment, while `const` does not.

```javascript
let a = 1;
a = 2; // Allowed

const b = 1;
b = 2; // TypeError: Assignment to constant variable
```

### Access before declaration

All variables are hoisted, but `var` initializes to `undefined`, whereas `let` and `const` exist in a "temporal dead zone" until the declaration is reached.

```javascript
console.log(foo); // undefined
var foo = 'foo';

console.log(bar); // ReferenceError
let bar = 'bar';
```

### Best practices

- Use `const` for variables that don't change to ensure immutability
- Use `let` when reassignment is needed
- Avoid `var` due to its hoisting and scoping issues
- Use tools like ESLint to enforce modern best practices



## 13. Explain the difference between == and === in JavaScript?

The `==` operator checks for equality after performing type conversion, while `===` checks for strict equality without type conversion.

### Loose equality (==)

`==` allows type coercion, which means JavaScript converts values to the same type before comparison. This can lead to unexpected results.

```javascript
42 == '42'; // true
0 == false; // true
null == undefined; // true
```

### Strict equality (===)

`===` checks both value and type, avoiding the pitfalls of type coercion.

```javascript
42 === '42'; // false
0 === false; // false
null === undefined; // false
```

### Use cases

- Prefer `===` for most comparisons as it avoids implicit type conversion and makes code more predictable
- Use `==` only when comparing `null` or `undefined` for simplicity

```javascript
let x = null;
console.log(x == null); // true
console.log(x == undefined); // true
```

### Bonus: Object.is()

`Object.is()` is similar to `===` but treats `-0` and `+0` as distinct and considers `NaN` equal to itself.

```javascript
console.log(Object.is(-0, +0)); // false
console.log(Object.is(NaN, NaN)); // true
```

### Conclusion

- Use `===` for strict comparisons to avoid bugs caused by type coercion
- Rely on `Object.is()` for nuanced comparisons like distinguishing `-0` and `+0`



## 14. Understanding the Event Loop in JavaScript

The **event loop** is the backbone of JavaScript's asynchronous behavior, enabling single-threaded execution without blocking.

### Key components

- **Call stack**: Tracks function executions in a Last-In-First-Out (LIFO) order
- **Web APIs/Node.js APIs**: Handle asynchronous tasks like `setTimeout` and HTTP requests on separate threads
- **Task queue (Macrotask queue)**: Queues tasks like `setTimeout` and UI events
- **Microtask queue**: Prioritizes tasks like Promise callbacks, executed before macrotasks

### How it works

1. **Synchronous code execution**: Functions are pushed and popped from the call stack
2. **Asynchronous tasks**: Offloaded to APIs for processing
3. **Task completion**: Completed tasks are queued
4. **Event loop execution**: Executes microtasks until the queue is empty. Processes one macrotask and checks the microtask queue again

```javascript
console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);

Promise.resolve().then(() => console.log('Promise 1'));

setTimeout(() => console.log('Timeout 2'), 0);

console.log('End');
```

**Output:**

```
Start
End
Promise 1
Timeout 1
Timeout 2
```

**Explanation:**

- Synchronous logs (`Start`, `End`) run first
- Microtasks (`Promise 1`) follow
- Macrotasks (`Timeout 1`, `Timeout 2`) run last



## 15. What is Event Delegation in JavaScript?

**Event delegation** is an efficient way to manage events for multiple elements by attaching a single event listener to their common parent.

### How it works

1. **Attach a listener**: Add an event listener to a parent element instead of each child
2. **Event bubbling**: Events triggered on children bubble up to the parent
3. **Identify target**: Use `event.target` to determine the clicked element
4. **Perform action**: Execute logic based on the event target

```javascript
// HTML:
// <ul id="item-list">
//   <li>Item 1</li>
//   <li>Item 2</li>
// </ul>

const itemList = document.getElementById('item-list');

itemList.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    console.log(`Clicked on ${event.target.textContent}`);
  }
});
```

### Benefits

- **Efficiency**: Reduces the number of event listeners, improving performance
- **Dynamic content**: Automatically handles new elements added to the DOM



## 16. How this works in JavaScript

The value of `this` depends on how a function is called. Let's explore its different behaviors.

### Scenarios

#### Using new

When creating objects, `this` refers to the newly created object.

```javascript
function Person(name) {
  this.name = name;
}
const person = new Person('Alice');
console.log(person.name); // 'Alice'
```

#### Using apply, call, or bind

Explicitly sets `this` to a specified object.

```javascript
function greet() {
  console.log(this.name);
}
const person = { name: 'Alice' };
greet.call(person); // 'Alice'
```

#### Method call

`this` refers to the object the method is called on.

```javascript
const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name);
  },
};
obj.greet(); // 'Alice'
```

#### Free function call

Defaults to the global object (`window` in browsers) or `undefined` in strict mode.

```javascript
function greet() {
  console.log(this); // global object or undefined
}
greet();
```

#### Arrow functions

Capture `this` from their enclosing scope.

```javascript
const obj = {
  name: 'Alice',
  greet: () => {
    console.log(this.name); // Inherits `this` from enclosing scope
  },
};
obj.greet(); // undefined
```

### ES6 and this

Arrow functions simplify usage by capturing `this` from their lexical scope.

```javascript
function Timer() {
  this.seconds = 0;
  setInterval(() => {
    this.seconds++;
    console.log(this.seconds);
  }, 1000);
}

const timer = new Timer();
```



## 17. What sets Cookies, sessionStorage, and localStorage apart?

When it comes to client-side storage, cookies, `localStorage`, and `sessionStorage` serve distinct roles:

### Cookies

- **Function**: Stores small pieces of data sent along with HTTP requests to the server
- **Limit**: Roughly 4KB per domain
- **Lifetime**: Can persist or expire after a set time. Session cookies disappear when the browser closes
- **Scope**: Accessible across pages and subdomains for a single domain
- **Security**: Features like `HttpOnly` and `Secure` flags add extra security

```javascript
// Set a cookie with an expiry date
document.cookie = 'userId=12345; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/';

// Read all cookies
console.log(document.cookie);

// Delete a cookie
document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
```

### localStorage

- **Function**: Allows persistent data storage on the client side
- **Limit**: About 5MB per origin
- **Lifetime**: Data stays until explicitly removed
- **Scope**: Shared across all tabs and windows for the same origin
- **Security**: Accessible by JavaScript within the same origin

```javascript
// Store data in localStorage
localStorage.setItem('username', 'john_doe');

// Retrieve data
console.log(localStorage.getItem('username'));

// Remove an item
localStorage.removeItem('username');

// Clear all localStorage data
localStorage.clear();
```

### sessionStorage

- **Function**: Stores data for the duration of a page session
- **Limit**: Similar to `localStorage` (around 5MB)
- **Lifetime**: Cleared when the tab or browser closes
- **Scope**: Data is confined to the current tab or window
- **Security**: Accessible by JavaScript on the same origin

```javascript
// Store data in sessionStorage
sessionStorage.setItem('sessionId', 'abcdef');

// Retrieve data
console.log(sessionStorage.getItem('sessionId'));

// Remove an item
sessionStorage.removeItem('sessionId');

// Clear all sessionStorage data
sessionStorage.clear();
```



## 18. How do `<script>`, `<script async>`, and `<script defer>` differ?

### `<script>`

When using the `<script>` tag without attributes, it fetches and executes the script immediately, pausing HTML parsing.

**Use case**: Critical scripts needed before page rendering.

```html
<script src="main.js"></script>
```

### `<script async>`

With `async`, the script loads in parallel to HTML parsing and executes as soon as it's ready.

**Use case**: Independent scripts like analytics or ads.

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

When using `defer`, the script loads alongside HTML parsing but only executes after the HTML is fully parsed.

**Use Case**: Scripts that rely on a complete DOM structure.

```html
<script defer src="deferred.js"></script>
```



## 19. What's the difference between null and undefined?

### Undeclared

Variables not defined using `var`, `let`, or `const` are considered undeclared and can cause global scope issues.

### undefined

A declared variable that hasn't been assigned a value is `undefined`.

### null

Represents the intentional absence of any value. It's an explicit assignment.

```javascript
let a;
console.log(a); // undefined

let b = null;
console.log(b); // null

try {
  console.log(c); // ReferenceError: c is not defined
} catch (e) {
  console.log('c is undeclared');
}
```



## 20. What's the difference between .call() vs .apply()?

Both `.call` and `.apply` let you invoke a function with a specified `this` value. The key difference lies in how arguments are passed:

- **`.call`**: Accepts arguments as a comma-separated list
- **`.apply`**: Accepts arguments as an array

**Memory aid:**

- **C** for call = **c**omma-separated
- **A** for apply = **a**rray

```javascript
function sum(a, b) {
  return a + b;
}

console.log(sum.call(null, 1, 2)); // 3
console.log(sum.apply(null, [1, 2])); // 3
```



## 21. How does Function.prototype.bind work?

The `bind` method is used to create a new function with a specific `this` value and, optionally, preset arguments. This ensures that the function always has the correct `this` context, regardless of how or where it's called.

### Key uses of bind:

- **Maintaining Context**: Ensures that `this` is correctly set for the function
- **Preset Arguments**: Allows you to predefine arguments for a function
- **Borrowing Methods**: Enables you to use methods from one object in another

```javascript
const john = {
  age: 42,
  getAge: function () {
    return this.age;
  },
};

console.log(john.getAge()); // 42

const unboundGetAge = john.getAge;
console.log(unboundGetAge()); // undefined

const boundGetAge = john.getAge.bind(john);
console.log(boundGetAge()); // 42

const mary = { age: 21 };
const boundGetAgeMary = john.getAge.bind(mary);
console.log(boundGetAgeMary()); // 21
```



## 22. Why use arrow functions in constructors?

Using arrow functions for methods in constructors automatically binds the `this` context to the constructor, avoiding the need to manually bind it. This eliminates issues caused by `this` referring to unexpected contexts.

```javascript
const Person = function (name) {
  this.name = name;
  this.sayName1 = function () {
    console.log(this.name);
  };
  this.sayName2 = () => {
    console.log(this.name);
  };
};

const john = new Person('John');
const dave = new Person('Dave');

john.sayName1(); // John
john.sayName2(); // John

john.sayName1.call(dave); // Dave
john.sayName2.call(dave); // John
```

Arrow functions are particularly useful in React class components, ensuring methods maintain the correct context when passed to child components.



## 23. How does prototypal inheritance work?

**Prototypal inheritance** is a way for objects to share properties and methods through their prototype chain.

### Key concepts:

- **Prototypes**: Each object has a prototype, from which it inherits properties and methods
- **Prototype chain**: JavaScript looks for properties/methods up the chain until it finds them or reaches `null`
- **Constructor functions**: Functions used with `new` to create objects

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayName = function () {
  console.log(`My name is ${this.name}`);
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.bark = function () {
  console.log('Woof!');
};

let fido = new Dog('Fido', 'Labrador');
fido.bark(); // "Woof!"
fido.sayName(); // "My name is Fido"
```



## 24. Differences between: function Person(){}, const person = Person(), and const person = new Person()?

### Key differences:

- **`function Person(){}`**: A function declaration, typically used for constructors if written in PascalCase
- **`const person = Person()`**: Calls the function normally and assigns the result to `person`. No object creation happens unless explicitly returned
- **`const person = new Person()`**: Invokes the function as a constructor, creating a new object and setting its prototype to `Person.prototype`



## 25. Function declarations vs. Function expressions

### Function declarations:

- **Syntax**: `function foo() {}`
- **Hoisting**: Fully hoisted; can be called before its definition

```javascript
foo(); // "Hello!"
function foo() {
  console.log('Hello!');
}
```

### Function expressions:

- **Syntax**: `var foo = function() {}`
- **Hoisting**: Only the variable is hoisted, not the function body

```javascript
foo(); // TypeError: foo is not a function
var foo = function () {
  console.log('Hello!');
};
```



## 26. What are the different ways to create objects in JavaScript?

Here are various approaches to creating objects in JavaScript:

### Object literals

The simplest and most common way to create an object is using curly braces `{}` with key-value pairs.

```javascript
const person = {
  firstName: 'John',
  lastName: 'Doe',
};
```

### Object constructor

Use the built-in `Object` constructor with the `new` keyword.

```javascript
const person = new Object();
person.firstName = 'John';
person.lastName = 'Doe';
```

### Object.create() method

Create an object with a specific prototype.

```javascript
const personPrototype = {
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  },
};

const person = Object.create(personPrototype);
person.name = 'John';
person.greet(); // Hello, my name is John.
```

### ES2015 classes

Define objects using the `class` syntax for a blueprint-like structure.

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old.`);
  }
}

const john = new Person('John', 30);
john.greet(); // Hi, I'm John and I'm 30 years old.
```

### Constructor functions

Use a function as a template for creating multiple objects.

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const john = new Person('John', 30);
console.log(john.name); // John
```



## 27. What is a higher-order function?

A **higher-order function** is a function that either:

### Accepts another function as an argument:

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

function greetUser(greeter, name) {
  console.log(greeter(name));
}

greetUser(greet, 'Alice'); // Hello, Alice!
```

### Returns another function:

```javascript
function multiplier(factor) {
  return function (num) {
    return num * factor;
  };
}

const double = multiplier(2);
console.log(double(4)); // 8
```



## 28. How do ES2015 classes differ from ES5 constructor functions?

### ES5 constructor functions

Use function constructors and prototypes for object creation and inheritance.

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function () {
  console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old.`);
};

const john = new Person('John', 30);
john.greet(); // Hi, I'm John and I'm 30 years old.
```

### ES2015 Classes

Use the `class` keyword for cleaner and more intuitive syntax.

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old.`);
  }
}

const john = new Person('John', 30);
john.greet(); // Hi, I'm John and I'm 30 years old.
```

### Key differences:

- **Syntax**: ES2015 classes are more readable and concise
- **Static methods**: Easier to define using `static` in ES2015
- **Inheritance**: Simpler with the `extends` and `super` keywords in ES2015



## 29. What is event bubbling?

**Event bubbling** is the process where an event triggers on the target element and then propagates upwards through its ancestors in the DOM.

```javascript
const parent = document.getElementById('parent');
const child = document.getElementById('child');

parent.addEventListener('click', () => {
  console.log('Parent clicked');
});

child.addEventListener('click', () => {
  console.log('Child clicked');
});
```

Clicking the child element will log both "Child clicked" and "Parent clicked" due to bubbling.

### Prevent bubbling:

Use `event.stopPropagation()` to prevent the event from propagating upwards.

```javascript
child.addEventListener('click', (event) => {
  event.stopPropagation();
  console.log('Child clicked only');
});
```



## 30. What is event capturing?

**Event capturing**, also called "trickling", is the reverse of bubbling. The event propagates from the root element down to the target element.

### Enable event capturing

Capturing is enabled by passing `{ capture: true }` to `addEventListener()` as the third argument.

```javascript
const parent = document.getElementById('parent');
const child = document.getElementById('child');

parent.addEventListener(
  'click',
  () => {
    console.log('Parent capturing');
  },
  { capture: true },
);

child.addEventListener('click', () => {
  console.log('Child clicked');
});
```

Clicking the child will log "Parent capturing" first, followed by "Child clicked."



## 31. How do mouseenter and mouseover differ?

### mouseenter

- Does not bubble up the DOM tree
- Triggered only when the mouse pointer enters the element itself, excluding its children
- Fires a single event when entering the target element

### mouseover

- Bubbles up the DOM tree
- Triggered when the mouse pointer enters the target element or any of its children
- Fires multiple events when moving over child elements



## 32. What's the difference between synchronous and asynchronous functions?

### Synchronous functions

- Execute tasks in a sequential, blocking manner
- Program execution halts until the current task completes
- Easier to debug due to their predictable flow

```javascript
const fs = require('fs');
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data); // Blocks until the file is fully read
console.log('Program ends');
```

### Asynchronous functions

- Perform tasks without blocking program execution
- Other operations can run while waiting for the task to finish
- Commonly used for I/O operations, network requests, and timers

```javascript
console.log('Start');

fetch('https://api.example.com/data')
  .then((response) => response.json())
  .then((data) => console.log(data)) // Non-blocking
  .catch((error) => console.error(error));

console.log('End');
```



## 33. What is AJAX?

**AJAX** (Asynchronous JavaScript and XML) is a technique that allows web pages to fetch and send data asynchronously, enabling dynamic updates without reloading the entire page.

### Key points

- **Asynchronous**: Updates parts of a page without reloading
- **Data formats**: Initially XML, now primarily JSON due to its simplicity
- **APIs**: Traditionally used `XMLHttpRequest`; `fetch()` is the modern alternative

### Using XMLHttpRequest:

```javascript
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.error('Request failed');
    }
  }
};
xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1', true);
xhr.send();
```

### Using fetch():

```javascript
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Fetch error:', error));
```



## 34. What are the pros and cons of using AJAX?

### Advantages

- Enhances user experience by enabling seamless updates
- Reduces server load by fetching only necessary data
- Keeps the user on the same page while updating content

### Disadvantages

- Relies on JavaScript, so functionality may break if it's disabled
- SEO challenges with dynamically loaded content
- Bookmarking specific page states becomes difficult



## 35. What are the differences between XMLHttpRequest and fetch()?

### XMLHttpRequest

- **Syntax**: Event-driven; requires listeners for response handling
- **Progress tracking**: Supports progress tracking via `onprogress`
- **Error handling**: Uses `onerror` event

```javascript
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://example.com/api', true);
xhr.onload = function () {
  if (xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
xhr.send();
```

### fetch()

- **Syntax**: Promise-based; simpler and more readable
- **Error handling**: Uses `.catch()` for better error management
- **Modern features**: Built-in support for `AbortController` for cancellations

```javascript
fetch('https://example.com/api')
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

### Key differences

- `fetch()` has cleaner syntax and better Promise integration
- `XMLHttpRequest` supports progress tracking, which `fetch()` does not



## 36. What are the various data types in JavaScript?

JavaScript features a mix of primitive and non-primitive (reference) data types.

### Primitive data types

- **Number**: Includes integers and floating-point values
- **String**: Text values enclosed in single, double quotes, or backticks
- **Boolean**: Represents `true` or `false`
- **Undefined**: A declared variable that hasn't been assigned a value
- **Null**: Indicates an intentional lack of value
- **Symbol**: A unique and immutable identifier often used as object property keys
- **BigInt**: Handles large integers with arbitrary precision

### Non-primitive data types

- **Object**: Collections of key-value pairs
- **Array**: Ordered lists of elements
- **Function**: First-class objects that can be assigned, passed, and returned
- **Date**: Represents date and time values
- **RegExp**: For pattern matching in strings
- **Map**: A collection of key-value pairs, allowing any type of key
- **Set**: Stores unique values, whether primitive or object references

**Tip**: Use the `typeof` operator to determine the type of a variable.



## 37. How do you iterate over object properties and array items?

JavaScript provides multiple ways to iterate over objects and arrays.

### Iterating over objects

#### 1. for...in

Loops over all enumerable properties, including inherited ones.

```javascript
for (const property in obj) {
  if (Object.hasOwn(obj, property)) {
    console.log(property);
  }
}
```

#### 2. Object.keys()

Retrieves an array of an object's own enumerable properties.

```javascript
Object.keys(obj).forEach((key) => console.log(key));
```

#### 3. Object.entries()

Returns an array of `[key, value]` pairs.

```javascript
Object.entries(obj).forEach(([key, value]) => console.log(`${key}: ${value}`));
```

#### 4. Object.getOwnPropertyNames()

Includes both enumerable and non-enumerable properties.

```javascript
Object.getOwnPropertyNames(obj).forEach((prop) => console.log(prop));
```

### Iterating over arrays

#### 1. for Loop

Classic approach for iterating through arrays:

```javascript
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

#### 2. Array.prototype.forEach()

Executes a callback for each array item.

```javascript
arr.forEach((element, index) => console.log(element, index));
```

#### 3. for...of

Ideal for looping through iterable objects like arrays.

```javascript
for (const element of arr) {
  console.log(element);
}
```

#### 4. Array.prototype.entries()

Iterates with both index and value.

```javascript
for (const [index, element] of arr.entries()) {
  console.log(index, ':', element);
}
```



## 38. What are the benefits of spread syntax, and how is it different from rest syntax?

### Spread syntax (...)

The spread operator is used to expand elements of arrays or objects.

#### Copying arrays/objects:

```javascript
const array = [1, 2, 3];
const newArray = [...array]; // [1, 2, 3]
```

#### Merging arrays/objects:

```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const mergedArray = [...arr1, ...arr2]; // [1, 2, 3, 4]
```

#### Passing function arguments:

```javascript
const nums = [1, 2, 3];
console.log(Math.max(...nums)); // 3
```

### Rest syntax (...)

The rest operator collects multiple elements into an array or object.

#### Function parameters:

```javascript
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b);
}
sum(1, 2, 3); // 6
```

#### Destructuring:

```javascript
const [first, ...rest] = [1, 2, 3];
console.log(rest); // [2, 3]
```



## 39. What are the differences between Maps vs. Plain objects?

### Map

- Keys can be any type
- Maintains the insertion order
- Has a `size` property
- Directly iterable

```javascript
const map = new Map();
map.set('key', 'value');
console.log(map.size); // 1
```

### Plain objects

- Keys are strings or symbols
- Iteration requires `Object.keys()`, `Object.values()`, or `Object.entries()`
- No direct size property

```javascript
const obj = { key: 'value' };
console.log(Object.keys(obj).length); // 1
```



## 40. What are the differences between Map/Set and WeakMap/WeakSet

### Key differences:

- **Key Types**: `WeakMap` and `WeakSet` keys must be objects, while `Map` and `Set` accept any data type
- **Memory Management**: `WeakMap` and `WeakSet` allow garbage collection of keys, making them useful for managing memory
- **Size**: Only `Map` and `Set` have a `size` property
- **Iteration**: `WeakMap` and `WeakSet` are not iterable

```javascript
// Map Example
const map = new Map();
map.set({}, 'value');
console.log(map.size); // 1

// WeakMap Example
const weakMap = new WeakMap();
let obj = {};
weakMap.set(obj, 'value');
obj = null; // Key is garbage-collected
```



## 41. What are practical use cases for arrow functions?

Arrow functions simplify function syntax, making them ideal for inline callbacks.

```javascript
// Traditional function syntax
const numbers = [1, 2, 3, 4, 5];
const doubledNumbers = numbers.map(function (number) {
  return number * 2;
});
console.log(doubledNumbers); // [2, 4, 6, 8, 10]

// Arrow function syntax
const doubledWithArrow = numbers.map((number) => number * 2);
console.log(doubledWithArrow); // [2, 4, 6, 8, 10]
```



## 42. What are callback functions in asynchronous operations?

A **callback** is a function passed as an argument to another function, executed after the completion of an asynchronous task.

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: 'John', age: 30 };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log(data); // { name: 'John', age: 30 }
});
```



## 43. What is debouncing and throttling?

### Debouncing

Delays execution of a function until a specified time has elapsed since its last invocation.

```javascript
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
```

### Throttling

Ensures a function executes at most once within a set time interval.

```javascript
function throttle(func, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```



## 44. How does destructuring assignment work?

Destructuring simplifies extracting values from arrays or objects into individual variables.

```javascript
// Array destructuring
const [a, b] = [1, 2];

// Object destructuring
const { name, age } = { name: 'John', age: 30 };
```



## 45. What is function hoisting?

Hoisting moves function declarations to the top of their scope during the compilation phase. However, function expressions and arrow functions do not get hoisted in the same way.

```javascript
// Function declaration
hoistedFunction(); // Works fine
function hoistedFunction() {
  console.log('This function is hoisted');
}

// Function expression
nonHoistedFunction(); // Throws an error
var nonHoistedFunction = function () {
  console.log('This function is not hoisted');
};
```



## 46. How does inheritance work in ES2015 classes?

Classes in ES2015 use `extends` for inheritance and `super` to access parent constructors and methods.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks.`);
  }
}

const dog = new Dog('Rex', 'German Shepherd');
dog.speak(); // Rex barks.
```



## 47. What is lexical scoping?

**Lexical scoping** determines variable access based on where functions are defined, not where they're called.

```javascript
function outerFunction() {
  let outerVariable = 'I am outside!';

  function innerFunction() {
    console.log(outerVariable); // I am outside!
  }

  innerFunction();
}

outerFunction();
```



## 48. What are scopes in JavaScript?

JavaScript has three main types of scope: global, function, and block.

```javascript
// Global scope
var globalVar = 'I am global';

function myFunction() {
  // Function scope
  var functionVar = 'I am in a function';

  if (true) {
    // Block scope
    let blockVar = 'I am in a block';
    console.log(blockVar); // Accessible here
  }
  // console.log(blockVar); // Error
}
```



## 49. What is the spread operator?

The spread operator (`...`) expands elements of an iterable (like arrays) or properties of objects into individual elements.

```javascript
// Copying an array
const arr1 = [1, 2, 3];
const arr2 = [...arr1];

// Merging arrays
const mergedArray = [...arr1, [4, 5]];

// Copying an object
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1 };

// Passing as function arguments
const sum = (x, y, z) => x + y + z;
const nums = [1, 2, 3];
sum(...nums); // 6
```



## 50. How does this work in event handlers?

In JavaScript, `this` in event handlers refers to the element that triggered the event. Its context can be explicitly bound using `bind()`, arrow functions, or direct assignment.

```javascript
const button = document.querySelector('button');
button.addEventListener('click', function () {
  console.log(this); // Refers to the button
});

const obj = {
  handleClick: function () {
    console.log(this); // Refers to obj
  },
};
button.addEventListener('click', obj.handleClick.bind(obj));
```



## Conclusion

Congratulations on reaching the end of our comprehensive collection of JavaScript interview questions and answers! We hope this guide has equipped you with the knowledge and confidence needed to excel in your next JavaScript interview. Keep in mind that consistent practice is essential. Continue coding and revisiting these concepts until they feel effortless.