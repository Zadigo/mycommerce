# My Authentication

Is a simple Golang micro-service used to route and sync authentication on the four main services of the e-commerce application:

* Shop
* Cart
* Reviews
* Subscribers

## Architecture

```text
-------------
- Main shop - ---> Golang Router ---> Services
-------------
```
