# SOLID Principles

It is a set of five design principles that help developers create more maintainable, flexible, and scalable software. The SOLID principles are:

# S — Single Responsibility Principle (SRP):

A component or module should have only one responsibility.
In React this means small focused components.
Instead of a large component handling everything:

```jsx
ProductDetails;
```

Split responsibilities into smaller components:

```jsx
ProductImage;
ProductInformation;
ProductReviews;
```

# O — Open/Closed Principle (OCP):

Software entities (classes, modules, functions) should be open for extension but closed for modification.
Instead of modifying existing code, extend functionality through props or composition.

```jsx
// Instead of modifying ProductDetails, create a new component that extends it
function ProductDetailsWithDiscount({ product, discount }) {
  const discountedPrice = product.price - discount;
  return <ProductDetails product={{ ...product, price: discountedPrice }} />;
}
```

# L — Liskov Substitution Principle (LSP):

A replacement component must work wherever the original component works, without breaking the parent’s expectations.
In React, this means: if a parent expects a component to accept certain props and provide certain behavior, any replacement component must honor that same contract.
LSP means I should be able to replace a component with its alternative version without breaking the parent component.

```jsx
function Form({ Input }) {
  const [email, setEmail] = React.useState("");

  return (
    <Input
      value={email}
      onChange={(event) => setEmail(event.target.value)}
    />
  );
}


function ProductDetailsWithDiscount({ product, discount }) {
  const discountedPrice = product.price - discount;
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Discounted Price: {discountedPrice}</p>
    </div>
  );
}

function SimpleInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}

function StyledInput({ value, onChange }) {
  return (
    <input
      className="styled-input"
      value={value}
      onChange={onChange}
    />
  );
}

<Form Input={SimpleInput} />
<Form Input={StyledInput} />
```

# I — Interface Segregation Principle (ISP):

Components should not be forced to depend on props they do not use.
In React, this means creating smaller, focused components that only require the props they need.

```jsx
function ProductDetails({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
```

# D — Dependency Inversion Principle (DIP):

High-level components should not depend on low-level components. Both should depend on abstractions (e.g., interfaces or props).
In React this usually means:
- passing dependencies via props
- separating data fetching from UI

```jsx
// Bad: ProductList directly fetches products
function ProductList() {
  fetchProducts();
}

// Good: ProductList receives products as a prop
function ProductList({ products }) {
  return (
    <div>
      {products.map((product) => (
        <ProductDetails key={product.id} product={product} />
      ))}
    </div>
  );
}
```
