<template>
    <div id="Menu" class="panel floating">
      <a href="#" class="close"></a>
      <div>
        <!-- <a class="lnk" href="#">XR Mode</a> -->
        <a class="lnk" id='print' href="#">Print</a>
      </div>
      <div>
        <a class="lnk" href="#Menu">Sidechains</a>
        <a class="lnk" href="#Menu">Neighbors</a>
        <a class="lnk" href="#Menu">Ligands</a>
        <a class="lnk" href="#Menu">Water</a>
      </div>
      <select>
        <option selected>Ribbon</option>
        <option >Sphere</option>
        <option >Backbone</option>
      </select>
    </div>
</template>
<script>
export default {
  name: 'Menu',
  mounted () {
    document.querySelector('#print').addEventListener('click', function (ev) {
      ev.preventDefault() // prevent default navigation
      window.AQUARIA.screenshot() // invoke screenshot feature
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
        display: block;
        background-color: var(--secondary-label);
        border-radius: 0.25em;
        padding: 0.2em 0.6em;
        margin: 2px 0;
        text-decoration: none;
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
