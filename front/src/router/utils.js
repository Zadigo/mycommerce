function loadView(component) {
    return () => import(`@/views/${component}.vue`)
}

function loadLayout(component) {
  return () => import(`@/layouts/${component}.vue`)
}

function loadComponent(name) {
  return () => import(`@/components/${name}.vue`)
}

export {
  loadComponent,
  loadLayout,
  loadView
}
