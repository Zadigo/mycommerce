# Design Patterns References

Details about design patterns, including definitions, classifications, and examples of common design patterns used in software development. This reference serves as a guide for developers to understand the principles and applications of design patterns in their projects.

---

## Design Patterns Overview

1. **Creational** is focused on how objects are created, ensuring that they are created in a manner suitable to the situation.
    - Singleton
    - Builder
    - Factory Method
    - Abstract Factory
    - Prototype
2. **Structural** is concerned with how classes and objects are composed to form larger structures, ensuring that these structures are flexible and efficient.
    - Adapter
    - Composite
    - Decorator
    - Bridge
    - Composite
    - Flyweight
    - Proxy
3. **Behavioral** is focused on how objects interact and communicate with each other, ensuring that these interactions are efficient and maintainable.
    - Chain of Responsibility
    - Command
    - Iterator
    - Mediator
    - Memento
    - Observer
    - State
    - Strategy
    - Template Method
    - Visitor

---

## Abstract Factory Pattern

Prefer this pattern this method especially in Python when you want to create families of related or dependent objects without specifying their concrete classes.

### Example in Python

```python
from abc import ABC, abstractmethod

class Button(ABC):
    @abstractmethod
    def render(self):
        pass


class WindowsButton(Button):
    def render(self):
        return "Rendering a Windows button"


class MacOSButton(Button):
    def render(self):
        return "Rendering a MacOS button"
```

### Example in Typescript

```typescript
class Button {
    render(): string {
        throw new Error("Method not implemented.");
    }
}

class WindowsButton extends Button {
    render(): string {
        return "Rendering a Windows button";
    }
}

class MacOSButton extends Button {
    render(): string {
        return "Rendering a MacOS button";
    }
}
```

- [Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory)
- [Abstract Factory in Python](https://refactoring.guru/design-patterns/abstract-factory/python/example#example-0)

## Builder Pattern

Use this pattern when you want to construct a complex object step by step, allowing for more control over the construction process and enabling the creation of different representations of the object.

### Example in Python

```python
from abc import ABC, abstractmethod

class Car:
    def __init__(self):
        self.make = None
        self.model = None
        self.year = None


class Builder(ABC):
    @abstractmethod
    def set_make(self, make):
        pass

    @abstractmethod
    def set_model(self, model):
        pass

    @abstractmethod
    def set_year(self, year):
        pass

    @abstractmethod
    def build(self):
        pass


class CarBuilder(Builder):
    def __init__(self):
        self.car = Car()

    def set_make(self, make):
        self.car.make = make
        return self
    
    def set_model(self, model):
        self.car.model = model
        return self
    
    def set_year(self, year):
        self.car.year = year
        return self
    
    def build(self):
        return self.car

car_builder = CarBuilder()
car = (
    car_builder.set_make("Toyota")
    .set_model("Corolla")
    .set_year(2020)
    .build()
)
```

A `Director` class can also be implemented to manage the construction process, but it is optional and depends on the complexity of the object being built.

```python
class Director:
    def __init__(self, builder):
        self.builder = builder

    def construct_sports_car(self):
        return (
            self.builder.set_make("Porsche")
            .set_model("911")
            .set_year(2021)
            .build()
        )

director = Director(car_builder)
sports_car = director.construct_sports_car()
```

---

## Refactoring & Code Writing Principles
