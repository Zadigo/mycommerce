# Vue Session

Vue session is a simple session manager for Vue JS applications

## Set

Save an item to the session

```html
<script>
export default {
    mounted () {
        this.$session.set('state', true)
    }
}
<script>
```

## Retrieve

Gets an item from the session

```html
<script>
export default {
    mounted () {
        var result = this.$session.retrieve('state')
    }
}
<script>
```

## Remove

Removes an item from the session

```html
<script>
export default {
    mounted () {
        this.$session.remove('state')
    }
}
<script>
```

## Clear

Removes the stored data from the session while keeping the current session still active

```html
<script>
export default {
    mounted () {
        this.$session.clear()
    }
}
<script>
```

## Destroy

Destroys the whole session

```html
<script>
export default {
    mounted () {
        this.$session.destroy()
    }
}
<script>
```

## Renew

Renews the session ID

```html
<script>
export default {
    mounted () {
        this.$session.renew()
    }
}
<script>
```

## Contains

Checks if a key is in the given session

```html
<script>
export default {
    mounted () {
        var result = this.$session.contains('state')
    }
}
<script>
```
