---
title: Implementing Code Splitting and Lazy Loading in React
description: "Learn how to implement Code Splitting and Lazy Loading in React and it's importance."
slug: lazy-loading-and-code-splitting
image: /static/images/implementing.png
date: "2025-09-29"
---

As Front End Engineers, we aim to deliver the best user experience, and one of the ways to achieve that is by optimizing the applications' performance.

Users expect fast, responsive experiences and will quickly abandon sites that are slow to load. Studies show that if a web page takes more than 3 seconds to load, over 40% of users will leave. With the prevalent usage of mobile devices which can be on slower network speeds, optimizing performance is critical.

Code splitting and lazy loading are effective strategies to achieve great performance on the web. In this post, we’ll explore these techniques, their benefits, and how they can be implemented in React.

## Introduction to Code Splitting and Lazy Loading

Code splitting breaks down your application into smaller chunks, loading only the necessary parts to reduce the bundle size. Lazy loading defers loading non-essential resources until they’re needed, further enhancing performance.

For example, consider a React app with a Login, Dashboard, and Listing page. Traditionally, the code for all these pages is bundled in a single JS file. This is suboptimal because when the user visits the Login page, it is unnecessary to load pages such as the Dashboard and Listing page. But with implementing code splitting and lazy loading, we can dynamically load specific components/pages only when needed, significantly improving performance.

In React, code splitting can be introduced via dynamic `import()`. Dynamic import is a built-in way to do this in JavaScript. The syntax looks like this:

```js
import('./math').then((math) => {
  console.log(math.add(1, 2));
});
```

For React apps, code splitting using dynamic imports is supported out of the box via `React.lazy` if a boilerplate like `create-react-app` is used. The `React.lazy()` function lets you render a dynamic import as a regular component. This feature was introduced in React 16.6, which allows lazy loading of components via splitting a big JS bundle into multiple smaller JS chunks for each component that is lazily loaded.

However, if a custom Webpack setup is used, you must check the Webpack guide for setting up code splitting.

## Implementing in React

To implement lazy loading in React, we can leverage `React.lazy` function and the `Suspense` component to handle loading states. Here's an example demonstrating lazy loading in React:

```js
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
}
```

By wrapping a lazy-loaded component with Suspense, we can provide a fallback/placeholder UI while the component is being loaded asynchronously, such as a spinner.

However, there can be a case where `LazyComponent` fails to load due to some reason like network failure. In that case, it needs to handle the error smoothly for a better user experience with [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

```js
import MyErrorBoundary from './MyErrorBoundary';
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <MyErrorBoundary>
      <React.Suspense fallback={<div>Carregando...</div>}>
        <LazyComponent />
      </React.Suspense>
    </MyErrorBoundary>
  );
}
```
So, when the `LazyComponent` is lazily loaded, it signifies that the code for `LazyComponent` is segmented into a distinct JS chunk, separate from the main JS bundle. This JS chunk is exclusively loaded when the `LazyComponent` is required to be displayed on the user interface, optimizing the loading process and enhancing the application's performance.

Note: `React.lazy` and `Suspense` only work on the client side and are not available for server-side rendering. For server-side code splitting, the [loadable/component](https://loadable-components.com/) library can be used.

From the above, we have seen how we use `React.lazy` to code split and lazy load components. But the question is where to lazily load and code split. There are approaches like **Route-based code splitting** and **Component-based code splitting**.

## Route-based code splitting

![Front End Performance](/static/images/route-cs.png)

**Route-based code splitting** is almost always the best place to start code splitting, and it is also where we can achieve potential max size reduction of our JS bundle. It works best when the routes are very distinct, and there is very little code duplication between the routes because if it does, there will be duplicate codes in all the JS chunks of lazily loaded routes. When we try to lazily load all the routes in our app, there is a chance of code duplication in the output bundles. Hence, we need to be careful about this when we do code splitting at route level.

Here is an example of route-based code splitting:

```js
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Login = lazy(() => import('./Login'));
const Dashboard = lazy(() => import('./Dashboard'));

const App = () => (
  <Router>
    <Suspense>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<Dashboard />} />
      </Routes>
    </Suspense>
  </Router>
);
```

## Component-based code splitting

![Front End Performance](/static/images/cmp-cs.png)

**Component-based code splitting** provides granular control over loading specific components, allowing for more precise optimization. The real power of code splitting comes into the picture in component-based code splitting where we have more control over granular components. When deciding which components to lazy load, consider the importance and impact of each component on the initial rendering and user experience. Ideal candidates for lazy loading are large components with significant code or resources, conditional components that are not always needed, and secondary or non-essential features. These can be segmented into separate chunks and loaded on demand, optimizing performance. However, critical components like headers, main content, and dependencies should be loaded upfront to ensure a seamless user experience. We need to be careful in selecting which components to lazy load to strike a balance between initial load times and providing essential functionality. Here is an example of component-based code splitting:

```js
import { useState, lazy, Suspense } from 'react';

const Modal = lazy(() => import('./Modal'));

function App() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      {showModal && (
        <Suspense fallback={<div>Loading Modal...</div>}>
          <Modal onClose={closeModal} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
```

In this example, the `Modal` component is lazily loaded using `React.lazy()` and dynamically imported. The modal is conditionally rendered based on the `showModal` state, which is toggled by the `openModal` and `closeModal` functions. The `Suspense` component displays a loading indicator while the modal component is being loaded asynchronously. This implementation optimizes performance by loading the modal component only when the user interacts with the `Open Modal` button, preventing unnecessary loading of heavy components like a text editor until they are actually needed.

## Webpack magic comments
If you’re using Webpack to bundle your application, then you can use Webpack's [magic comments](https://webpack.js.org/api/module-methods/#magic-comments) to further improve the user experience with lazy loading.

We can use [webpackPrefetch](https://webpack.js.org/api/module-methods/#webpackprefetch) and [webpackPreload](https://webpack.js.org/api/module-methods/#webpackpreload) for dynamic imports. In the above example of the lazy loading Modal, the Modal is loaded only when the user clicks the `Open Modal` button, and the user has to wait for a fraction of a second to load the Modal.

We can improve the user experience by not making users wait for the Modal to load. So, in that scenario, we can prefetch or preload the Modal component. In the above example of the Lazy loading modal, the only difference will be in how we import the `Modal` component.

#### Before:

`const Modal = lazy(() => import('./Modal'));`

#### After:

`const Modal = lazy(() => import(/* webpackPrefetch: true */ './Modal'));`

What `webpackPrefetch: true` does is that it tells the browser to automatically load this component into the browser cache so it's ready ahead of time and the user won’t have to wait for the Modal component to load when the user clicks on the `Open Modal` button.

We can use `webpackPrefetch` and `webpackPreload` for a particular component when we think that there is a high possibility for the user to use that component when a user visits the app.

## When to use code splitting and lazy loading?
### Use code splitting and lazy loading when:
* Your application is large and complex, with many components and dependencies.
* Components are not needed on the initial page load (e.g., below-the-fold, only after interaction).
* You want to reduce the initial bundle size.
* Certain components are conditionally rendered or used in specific scenarios.
### Avoid code splitting and lazy loading when:
* Your application is small and simple, with minimal components.
* The overhead of managing code splitting outweighs the benefits.
* Critical components are always needed on the initial load.
## Conclusion
Be sure to assess your application's requirements, tech stack, and challenges when deciding the code splitting and lazy loading approach. By strategically dividing code and loading resources on demand, you can create fast, efficient, and engaging web applications.