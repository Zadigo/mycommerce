/**
 * Name of the collection in Firestore that stores the session data.
 * This collection is used to store the session information associated with a specific user session.
 * Each document in this collection represents a session and contains relevant session data.
 * The session ID is used as a reference to associate session data with a specific user session.
 * The collection name is defined as a constant to ensure consistency across the application.
 * It is recommended to use a unique and descriptive name for the collection to avoid conflicts with other collections.
 * In this case, the collection name is set to 'test_sessions' for testing purposes.
 * In a production environment, it is advisable to use a more appropriate name that reflects the purpose of the collection.
 */
export const SESSION_COLLECTION_NAME = 'test_sessions'

/**
 * Name of the cookie used to store the session ID.
 * This cookie is used to associate the session data with a specific user session.
 * The cookie name is defined as a constant to ensure consistency across the application.
 * It is recommended to use a unique and descriptive name for the cookie to avoid conflicts with other cookies.
 * In this case, the cookie name is set to 'sessionId' for testing purposes.
 * In a production environment, it is advisable to use a more appropriate name that reflects the purpose of the cookie.
 */
export const SESSION_COOKIE_NAME = 'sessionId'

/**
 * Name of the cookie used to store the cart session ID.
 * This cookie is used to associate the cart items with a specific user session.
 * The cookie name is defined as a constant to ensure consistency across the application.
 * It is recommended to use a unique and descriptive name for the cookie to avoid conflicts with other cookies.
 * In this case, the cookie name is set to 'cart_session_id' for testing purposes.
 * In a production environment, it is advisable to use a more appropriate name that reflects the purpose of the cookie.
 */
export const CART_COOKIE_NAME = 'cart_session_id'

/**
 * Name of the collection in Firestore that stores the cart data.
 * This collection is used to store the cart items associated with a specific session.
 * Each document in this collection represents a session and contains an array of cart items.
 * The session ID is used as a reference to associate cart items with a specific user session.
 * The collection name is defined as a constant to ensure consistency across the application.
 * It is recommended to use a unique and descriptive name for the collection to avoid conflicts with other collections.
 * In this case, the collection name is set to 'test_cart' for testing purposes.
 * In a production environment, it is advisable to use a more appropriate name that reflects the purpose of the collection.
 */
export const CART_COLLECTION_NAME = 'test_cart'

/**
 * Name of the collection in Firestore that stores the likes data.
 * This collection is used to store the likes associated with a specific session.
 * Each document in this collection represents a session and contains an array of liked items.
 * The session ID is used as a reference to associate likes with a specific user session.
 * The collection name is defined as a constant to ensure consistency across the application.
 * It is recommended to use a unique and descriptive name for the collection to avoid conflicts with other collections.
 * In this case, the collection name is set to 'test_likes' for testing purposes.
 * In a production environment, it is advisable to use a more appropriate name that reflects the purpose of the collection.
 */
export const LIKE_COLLECTION_NAME = 'test_likes'
