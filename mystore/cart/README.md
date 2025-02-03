## Cart

The ecommerce cart represents the products that are in the user's cart.


## How it works

The user can add multiple products to his cart using a unique session identifier. The session identifier is extremely useful in cases where we want to allow anonymous users to add elements to their cart.

When the user wants to checkout, that unique session identifier is used to collect all items stored under that key. That's how we know what the user's cart contains.
