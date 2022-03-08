// import { createVueSession } from "./vue-session";


// var session = createVueSession({

// })

// export default session


import { createVueSession } from './vue-session/new'

var session = createVueSession({
    callbacks: {
        beforeSave() {
            // Some action
        }
    }
})

export default session
