import angular from 'angular'
import abLayers from '../src'
import './demo.scss'

class DemoCtrl {

    constructor() {
        this.abLayers = {}
    }

    $onInit() {
        //
    }

}

const template = `
    <div class="demo">
        <div class="box">
            <ab-layers interface="$ctrl.abLayers">
                <ab-layer>
                    <div>Layer 1</div>
                </ab-layer>

                <ab-layer ref="two">
                    <div>Layer 2</div>
                    <div>Layer 2</div>
                </ab-layer>

                <ab-layer>
                    <div>Layer 3</div>
                    <div>Layer 3</div>
                    <div>Layer 3</div>
                </ab-layer>

                <ab-layer ref="last">
                    <div>Last Layer</div>
                </ab-layer>
            </ab-layers>
        </div>

        <button ng-click="$ctrl.abLayers.prev()">Prev</button>
        <button ng-click="$ctrl.abLayers.next()">Next</button>
        <button ng-click="$ctrl.abLayers.goTo(0)">Layer 1</button>
        <button ng-click="$ctrl.abLayers.goTo(1)">Layer 2</button>
        <button ng-click="$ctrl.abLayers.goTo(2)">Layer 3</button>
        <button ng-click="$ctrl.abLayers.goToRef('last')">Last Layer</button>

        <ul>
            <li>
                <code>hasPrev()<code>
                <strong ng-bind="$ctrl.abLayers.hasPrev() ? 'true' : 'false'"></strong>
            </li>
            <li>
                <code>hasNext()<code>
                <strong ng-bind="$ctrl.abLayers.hasNext() ? 'true' : 'false'"></strong>
            </li>
            <li>
                <code>isRef('last')<code>
                <strong ng-bind="$ctrl.abLayers.isRef('last') ? 'true' : 'false'"></strong>
            </li>
        </ul>
    </<div>
`

angular
    .module('demo', [abLayers])
    .component('demo', {
        controller: DemoCtrl,
        template
    })

angular.bootstrap(document, ['demo'])
