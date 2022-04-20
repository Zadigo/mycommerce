function loadView(component) {
    return () => import(`@/views/${component}.vue`)
}

function loadLayout(component) {
  return () => import(`@/layouts/${component}.vue`)
}

function loadComponent(component) {
  return () => import(`@/components/${component}.vue`)
}


export {
    loadView,
    loadLayout,
    loadComponent
}
