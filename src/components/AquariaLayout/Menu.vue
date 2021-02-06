<template>
    <div id="Menu" class="panel floating">
      <a href="#" class="close"></a>
      <div>
        <!-- <a class="lnk" id='xr' href="#">XR Mode</a> -->
        <a class="lnk" id='print' href="#">Print</a>
      </div>
      <div>
        <a class="lnk" id='Sidechains' href="#Menu">Sidechains</a>
        <a class="lnk" id='Neighbors' href="#Menu">Neighbors</a>
        <a class="lnk active" id='Ligands' href="#Menu">Ligands</a>
        <a class="lnk" id='Water' href="#Menu">Water</a>
      </div>
      <select v-model="selected" @change="onChange($event)">
        <option id='ribbon' selected>Ribbon</option>
        <option id='sphere'>Sphere</option>
        <option id='backbone'>Backbone</option>
      </select>
      <!-- <span>SElected: {{selected}} </span> -->
    </div>
</template>
<script>

import { screenshot } from '../../utils/Screenshot'

export default {
  name: 'Menu',
  data () {
    return {
      selected: 'Ribbon'
    }
  },
  methods: {
    onChange (event) {
      const id = event.target.value.toLowerCase()
      document.querySelector('#threeDSpan-inner-menu-' + id).click()
    }
  },
  mounted () {
    const toggleActive = function (ev) {
      if (ev.target.className === 'lnk active') {
        ev.target.className = 'lnk'
      } else {
        ev.target.className = 'lnk active'
      }
    }
    document.querySelector('#print').addEventListener('click', async function (ev) {
      ev.preventDefault() // prevent default navigation
      const screenshotHref = await screenshot(7680, 4320, 0, 0)
      // construct a temporary anchor element with a download attribute and click it
      const a = document.createElement('a')
      a.href = screenshotHref // href is always a string. whether blob uri (Object URL) or data uri depends on browser support
      a.download = 'aquaria-screenshot.png' // @TODO consider a more meaningful filename here. maybe use protein name w/ a timestamp
      a.click()
    })
    // document.querySelector('#xr').addEventListener('click', function (ev) {
    //   ev.preventDefault() // prevent default navigation
    //   document.querySelector('.xr-menu-button').click()
    // })
    document.querySelector('#Sidechains').addEventListener('click', function (ev) {
      ev.preventDefault() // prevent default navigation
      toggleActive(ev) // toggle active state
      document.querySelector('#threeDSpan-inner > div.jolecule-embed-header.jolecule-embed-toolbar > span:nth-child(6)').click()
    })
    document.querySelector('#Neighbors').addEventListener('click', function (ev) {
      ev.preventDefault() // prevent default navigation
      toggleActive(ev) // toggle active state
      document.querySelector('#threeDSpan-inner > div.jolecule-embed-header.jolecule-embed-toolbar > span:nth-child(7)').click()
    })
    document.querySelector('#Ligands').addEventListener('click', function (ev) {
      ev.preventDefault() // prevent default navigation
      toggleActive(ev) // toggle active state
      document.querySelector('#threeDSpan-inner-menu-ligand').click()
    })
    document.querySelector('#Water').addEventListener('click', function (ev) {
      ev.preventDefault() // prevent default navigation
      toggleActive(ev) // toggle active state
      document.querySelector('#threeDSpan-inner-menu-water').click()
    })
  }
}
</script>
<style scoped>
/* Menu */
  #Menu:target.panel.floating {
    position: fixed;
    display: flex;
    background-color: transparent;
    width: 136px;
    border-radius: 0.25rem;
    top: 3rem;
    right: 1rem;
    }
    #Menu a.lnk {
        color: var(--text);
        display: block;
        background-color: var(--secondary-label);
        border-radius: 0.25em;
        padding: 0.2em 0.6em;
        margin: 2px 0;
        text-decoration: none;
    }
    #Menu a.lnk.active {
      background-color: var(--primary-highlight);
    }
    #Menu a.lnk:hover {
        background-color: var(--primary-link)
    }
    #Menu div {
        margin-bottom: 4px;
    }
    #Menu select {
        color: var(--text);
        background-color: var(--primary-highlight);
        border-radius: 0.25em;
        border: 0px none;
        padding: 0.2em;
        margin: 2px 0;
    }
</style>
