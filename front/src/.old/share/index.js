
function createShareLinks(options) {
    return {
        install: (app) => {
            options
            app.mixin({
                methods: {
                    facebookShare(url) {
                        return `http://www.facebook.com/share.php?u=${url}`
                    },
    
                    twitterSharee(url) {
                        return `http://twitter.com/home?status=${url}`
                    },
    
                    pinterestShare(url, imageUrl) {
                        return `https://pinterest.com/pin/create/bookmarklet/?url=${url}&media=${imageUrl}`
                    }
                }
            })
        }
    }
}

export {
    createShareLinks
}
