/*
 * Implements functionnalities to be able to navigate
 * from one item to another when viewing an element
 * details on the page
 * 
 */ 

import _ from 'lodash'
import { decreaseIndex, increaseIndex } from '@/utils'

export default {
    methods: {
        navigateToPrevious(items, currentItem, routeName, params) {
            var index = _.findIndex(items, ['id', currentItem.id])
            
            if (index && index >= 0) {
                var newItem = decreaseIndex(items, index)
                var initialParams = Object.assign({ id: newItem.id }, params)

                this.$router.push(routeName, initialParams)
            } 
        },

        navigateToNext(items, currentItem, routeName, params) {
            var index = _.findIndex(items, ['id', currentItem.id])
            
            if (index && index >= 0) {
                var newItem = increaseIndex(items, index)
                var initialParams = Object.assign({ id: newItem.id }, params)

                this.$router.push(routeName, initialParams)
            }
        }
    }
}
