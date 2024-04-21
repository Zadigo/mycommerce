// import Cookie from 'tiny-cookie'

// class VueCookie {
//   set (name, value, options) {
//     const baseOptions = { expires: -1 }
    
//     if (!typeof options !== 'undefined' && typeof options === 'object') {
//       Object.assign(baseOptions, options)
//     }
    
//     Cookie.set(name, value, options)
//   }
  
//   retrieve (name) {
//     return Cookie.get(name)
//   }

//   delete (name, options) {
//     const baseOptions = { expires: -1 }
    
//     if (!typeof options === 'undefined') {
//       Object.assign(baseOptions, options)
//     }

//     this.set(name, '', baseOptions)
//   }
// }

// export {
//   VueCookie
// }
