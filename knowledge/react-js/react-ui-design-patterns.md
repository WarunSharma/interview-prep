# React UI Design Patterns

React UI design patterns are reusable solutions to common problems in building user interfaces with React. They help developers create maintainable, scalable, and efficient applications by providing best practices and guidelines for structuring components, managing state, and handling side effects.

## Common React UI Design Patterns

### 1. Container/Presentational Pattern

- **Definition**: A structural pattern that separates components into two categories: containers and presentational components.
- **Container Components**: Handle data fetching, state management, and business logic.
- **Presentational Components**: Focus on rendering UI based on props and are stateless.
- **Example**: A `ProductContainer` fetches products and passes them to a `ProductCard` presentational component.

### 2. Render Props Pattern

- **Definition**: A behavioural pattern for sharing code between React components using a prop whose value is a function.
- **Use Case**: Allows components to be more flexible and reusable by passing a function that returns JSX.
- **Example**:

```jsx
<Mouse
  render={({ x, y }) => (
    <h1>
      Mouse position: {x}, {y}
    </h1>
  )}
/>
```

### 3. Provider Pattern

- **Definition**: A behavioural or creational pattern depending upon context that uses React's Context API to provide data or functions to components without prop drilling.

```jsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

### 4. Hook Pattern

- **Definition**: A behavioural pattern that leverages React hooks to encapsulate and reuse stateful logic across components.
- **Example**: A custom hook `useFetch` that handles data fetching logic and can be reused in multiple components.

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log("Component mounted");
}, []);
```

### 5. Composition Pattern

- **Definition**: A structural pattern that promotes building components by combining smaller, reusable components rather than relying on inheritance.
- **Example**: A `Card` component that can accept `Header`, `Body`, and `Footer` components as children to create a flexible card layout.

```jsx
<Card>
  <Header>Title</Header>
  <Body>Content</Body>
  <Footer>Footer</Footer>
</Card>
```
