/**
 * Component
 * ab-layers
 */

import './ab-layers.scss'

class abLayersCtrl {

    static get $inject() {
        return ['$window', '$element']
    }

    constructor($window, $element) {
        Object.assign(this, {
            $window,
            $element
        })

        this.abLayerElems = []
        this.layerCount = 0
        this.prevIndex = null
        this.index = 0
        this.transitioning = false

        this.handleResize = this.handleResize.bind(this)
    }

    $onInit() {
        if (this.interface) {
            this.interface.hasPrev = this.hasPrev.bind(this)
            this.interface.hasNext = this.hasNext.bind(this)
            this.interface.isRef = this.isRef.bind(this)
            this.interface.isTransitioning = this.isTransitioning.bind(this)
            this.interface.prev = this.prev.bind(this)
            this.interface.next = this.next.bind(this)
            this.interface.goTo = this.goTo.bind(this)
            this.interface.goToRef = this.goToRef.bind(this)
        }
    }

    $postLink() {
        this.storeElem = this.$element[0].querySelector('.ab-layers-store')
        this.transformElem = this.$element[0].querySelector('.ab-layers-transform')
        this.leftTransformElem = this.$element[0].querySelector('.ab-layers-transform-left')
        this.centerTransformElem = this.$element[0].querySelector('.ab-layers-transform-center')
        this.rightTransformElem = this.$element[0].querySelector('.ab-layers-transform-right')

        this.abLayerElems = Array.from(this.$element.find('ab-layer'))
        this.layerCount = this.abLayerElems.length

        if (this.ref) {
            this.index = this.getIndexForRef(this.ref) || 0
        }

        // Display initial layer
        const initialLayerElem = this.abLayerElems[this.index]
        this.centerTransformElem.appendChild(initialLayerElem)

        this.disableAnimation()
        setTimeout(this.setTransformOffset.bind(this, -1))

        this.$window.addEventListener('resize', this.handleResize)
    }

    $onDestroy() {
        this.$window.removeEventListener('resize', this.handleResize)
    }

    /**
     * Return true if there is a previous layer.
     *
     * @return {Boolean}
     */
    hasPrev() {
        return this.index > 0
    }

    /**
     * Return true if there is a next layer.
     *
     * @return {Boolean}
     */
    hasNext() {
        return this.index < this.layerCount - 1
    }

    /**
     * Return true if the current layers ref attribute value
     * matches at least one of a variable amount of values.
     *
     * @param  {String} refs
     *
     * @return {Boolean}
     */
    isRef(...refs) {
        if (!this.abLayerElems) {
            return false
        }

        let refAttr = this.abLayerElems[this.index].attributes.ref

        return refAttr && refs.includes(refAttr.value)
    }

    /**
     * Return true if transition is in progress.
     *
     * @return {Boolean}
     */
    isTransitioning() {
        return this.transitioning
    }

    /**
     * Go to the previous layer.
     */
    prev() {
        this.goTo(this.index - 1)
    }

    /**
     * Go to the next layer.
     */
    next() {
        this.goTo(this.index + 1)
    }

    /**
     * Go to a layer with a specific ref attribute value.
     *
     * @param {String} ref
     */
    goToRef(ref) {
        const index = this.getIndexForRef(ref)

        this.goTo(index)
    }

    /**
     * Go to a specific index.
     *
     * @param {Number} index
     */
    goTo(index) {
        if (this.transitioning) {
            return
        }

        if (index >= 0 && index < this.layerCount) {
            this.prevIndex = this.index
            this.index = index
            this.transition()
        }
    }

    /**
     * Run transition to layer index.
     */
    transition() {
        if (this.index === this.prevIndex) {
            return
        }

        this.transitioning = true

        // Add target layer to transform
        const prevLayerElem = this.abLayerElems[this.prevIndex]
        const targetLayerElem = this.abLayerElems[this.index]

        this.enableAnimation()

        if (this.index > this.prevIndex) {
            this.rightTransformElem.appendChild(targetLayerElem)
            this.setTransformOffset(-2)
        } else {
            this.leftTransformElem.appendChild(targetLayerElem)
            this.setTransformOffset(0)
        }

        const handleTransitionEnd = () => {
            // Remove previous layer from transform
            this.storeElem.appendChild(prevLayerElem)

            // Move target layer to center
            this.centerTransformElem.appendChild(targetLayerElem)

            // Reset transform
            this.disableAnimation()
            this.setTransformOffset(-1)

            this.transitioning = false
        }

        setTimeout(handleTransitionEnd, 700)

    }

    /**
     * Set transform offset multiplier.
     *
     * @param {Number} multiplier
     */
    setTransformOffset(multiplier) {
        const offset = multiplier * this.$element[0].offsetWidth

        this.transformElem.style.transform = `translate3d(${offset}px, 0, 0)`
    }

    /**
     * Enable transform animation.
     */
    enableAnimation() {
        this.disableAnimation(false)
    }

    /**
     * Disable transform animation.
     *
     * @param {Boolean} [disable]
     */
    disableAnimation(disable = true) {
        this.transformElem.style.transition = disable ? 'none' : ''
    }

    /**
     * Return layer index for a given ref.
     *
     * @param  {String} ref
     *
     * @return {Number|undefined}
     */
    getIndexForRef(ref) {
        return this.abLayerElems.findIndex(elem => {
            if ('ref' in elem.attributes) {
                return elem.attributes.ref.value === ref
            }
        })
    }

    /**
     * Window resize event handler.
     */
    handleResize() {
        this.disableAnimation()
        this.setTransformOffset(-1)
    }

}

const template = `
    <div class="ab-layers-transform">
        <div class="ab-layers-transform-left"></div>
        <div class="ab-layers-transform-center"></div>
        <div class="ab-layers-transform-right"></div>
    </div>
    <div class="ab-layers-store" ng-transclude></div>
`

export default {
    controller: abLayersCtrl,
    template,
    bindings: {
        interface: '=?',
        ref: '@?'
    },
    transclude: true
}
