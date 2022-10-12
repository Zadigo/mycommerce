<template>
  <section ref="link" class="timeline-container">
    <transition-group name="opacity">
      <div v-for="(item, i) in items" :key="i" class="timeline-block">
        <div class="timeline-img cd-picture" @click="$emit('timeline-click', [i, item])">
          <img :src="item.image" :alt="item.title || `timeline-image-${i}`">
        </div>
  
        <div class="card">
          <div class="card-body">
            <h3 v-if="item.title" class="card-title">
              {{ item.title }}
            </h3>
            
            <p v-if="item.content" class="card-text">
              {{ item.content }}
            </p>
  
            <time :datetime="item.date" class="date text-muted">
              {{ item.date }}
            </time>
          </div>
        </div>

        <!-- <div class="card">
          <div class="card-body">
            google
          </div>
        </div> -->
      </div>
    </transition-group>
  </section>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'BaseTimeline',
  props: {
    items: {
      type: Array,
      default: () => []
    }
    // filterFields: {
    //   type: Array,
    //   default: () => []
    // }
  },
  emits: {
    'timeline-click' () {
      return true
    }
  },
  methods: {
    handleScroll () {
      //   var $timeline_block = $('.cd-timeline-block')

      //   //hide timeline blocks which are outside the viewport
      //   $timeline_block.each(function () {
      //     if ($(this).offset().top > $(window).scrollTop() + $(window).height() * 0.75) {
      //       $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden')
      //     }
      //   })

      //   //on scolling, show/animate timeline blocks when enter the viewport
      //   $(window).on('scroll', function () {
      //     $timeline_block.each(function () {
      //       if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.75 && $(this).find('.cd-timeline-img').hasClass('is-hidden')) {
      //         $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
      //       }
      //     })
      //   })
    }
  }
  // computed: {
  //   filteredItems () {
  //     return this.runFilter()
  //   }
  // },
  // value: {
  //   get () {
  //     return this.modelValue
  //   },
  //   set (value) {
  //     if (value) {

  //     }
  //   }
  // }
  // mounted () {

  // },
  // methods: {
  //   runFilter () {
  //     if (this.filterFields.length === 0) {
  //       return this.items
  //     } else {
  //       return _.filter(this.items, (item) => {
  //         const truthArray = []
  //         _.forEach(this.filterFields, (field) => {
  //           const value = item[field]
  //           truthArray.push(
  //             value === this.modelValue || 
  //             value.includes(this.modelValue) ||
  //             value.toLowerCase() === this.modelValue ||
  //             value.toLowerCase().includes(this.modelValue)
  //           )
  //         })
  //         return _.every(truthArray)
  //       })
  //     }
  //   }
  // }
}
</script>

<style scoped>
html * {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.timeline-container {
  /* 
   * This class is used to give a max-width to the element 
   * it is applied to, and center it horizontally 
   * when it reaches that max-width 
   */
  width: 90%;
  max-width: 1170px;
  margin: 0 auto;
  position: relative;
  padding: 2em 0;
  margin-top: 2em;
  margin-bottom: 2em;
}

.timeline-container::before {
  /* Vertical line */
  content: "";
  position: absolute;
  top: 0;
  left: 18px;
  height: 100%;
  width: 4px;
  /* background: #d7e4ed; */
  background: #adb5bd;
}

.timeline-container::after {
  /* Clearfix */
  content: "";
  display: table;
  clear: both;
}

@media only screen and (min-width: 1170px) {
  .timeline-container {
    margin-top: 3em;
    margin-bottom: 3em;
  }

  .timeline-container::before {
    left: 50%;
    margin-left: -2px;
  }
}

.timeline-block {
  position: relative;
  margin: 2em 0;
}

.card {
  position: relative;
  margin: 2em 0;
  margin-left: 60px;
}

/* .card::after {
  content: "";
  clear: both;
  display: table;
} */

.card:first-child {
  margin-top: 0;
}

.card:last-child {
  margin-bottom: 0;
}

@media only screen and (min-width: 1170px) {
  .card {
    margin: 4em 0;
    width: 45%;
  }

  .card:first-child {
    margin-top: 0;
  }

  .card:last-child {
    margin-bottom: 0;
  }
}

/* .card::before {
  content: "";
  position: absolute;
  top: 16px;
  right: 100%;
  height: 0;
  width: 0;
  border: 7px solid transparent;
  border-right: 7px solid #ffffff;
} */

.timeline-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  /* box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important; */
  /* box-shadow: 0 0 0 4px #ffffff, inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 0 4px rgba(0, 0, 0, 0.05); */
  box-shadow: 0 0 0 4px #ffffff, inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 .5rem 1rem rgba(0, 0, 0, .15);
}

.timeline-img img {
  display: block;
  width: 24px;
  height: 24px;
  position: relative;
  left: 50%;
  top: 50%;
  margin-left: -12px;
  margin-top: -12px;
}

@media only screen and (min-width: 1170px) {
  .timeline-img {
    width: 60px;
    height: 60px;
    left: 50%;
    margin-left: -30px;
    /* Force Hardware Acceleration in WebKit */
  }
}

.timeline-img.cd-picture {
  background: #198754;
}

.timeline-img.cd-movie {
  background: #d63384;
}

.timeline-img.cd-location {
  background: #ffc107;
}

.date {
  float: left;
  /* padding: 0.8em 0; */
  opacity: 0.7;
}

/* .timeline-block .card {
  float: right;
}

.timeline-block .card {
  clear: both;
  content: "";
  display: table;
} */

/* .timeline-block:nth-child(even) .card::before {
  top: 24px;
  left: auto;
  right: 100%;
  border-color: transparent;
  border-right-color: #ffffff;
} */
</style>
