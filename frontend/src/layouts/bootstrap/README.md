# Bootstrap for Vue
## Form
### Checkbox
```html
<base-checkbox id="dark-mode" :is-switch="true" label="Dark mode" @update:initial="toggleDarkMode" />
```

#### switch

### select

```html
<base-select :items="['A', 'B', 'C']" />
```

## Pagination

```html
<base-pagination :pages="4" />
```


## Modal

```html
<base-modal-vue id="test-modal" :show="showModal" :non-invasive="false" :scrollable="false" :centered="false" :static-backdrop="true" position="top-right" size="sm" @close="showModal = false">
    <p>...</p>
</base-modal-vue>
```


