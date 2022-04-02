function loadView(component) {
    return () => import(`@/views/${component}.vue`)
}

function loadLayout(component) {
  return () => import(`@/layouts/${component}.vue`)
}


export {
    loadView,
    loadLayout
}
