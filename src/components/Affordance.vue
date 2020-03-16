<template>
    <div id='affordance_mode'>
    <h3 id='gene_name' v-on:click="showPanels()"></h3>
    <Title3D id="title3D"/>
    <SearchPanel id="searchByName"/>
    <Gallery id="gallery"/>
    <AboutUniprot id="uniprot"/>
    </div>
</template>

<script scoped>
import SearchPanel from './SearchPanel'
import Title3D from './Title3D'
import AboutUniprot from './AboutUniprot'
import Gallery from './Gallery'
import $ from 'jquery'

export default {
  name: 'AffordanceMode',
  components: {
    SearchPanel,
    AboutUniprot,
    Gallery,
    Title3D
  },
  methods: {
    showPanels: function () {
    // dim background
      if (document.getElementsByClassName('dimmer').length === 0) {
        $('body').append('<div class="dimmer"></div>')
        $('#gene_name').hide()
        $('div.dimmer').on('click', function () {
          $('#searchByName, #title3D,#uniprot, #gallery').hide()
          $('div.dimmer').remove()
          $('#gene_name').show()
        })
      } else {
        $('div.dimmer').remove()
      }

      $('#searchByName, #title3D').slideToggle('slow')
    }
  }
}
</script>

<style scoped>
#affordance_mode{
    width: 50vw;
    position: absolute;
    left: 25vw;
    z-index: 33;
}
#gene_name{
    font-size: 2vh;
    position: relative;
    top: 31px;
    background-color: #99999991;
    color: white;
    border-radius: 17px;
    width: fit-content;
    padding: 1vh;
}

#title3D{
    height: 5vh;
    font-size: 100%;
    background-color: #99999991;
    color: white;
    padding: 2vh 1vh 4px 1.5vh;
    border-radius: 17px;
    top: 33px;
    display: none;
    height: fit-content;
}

#searchByName{
    display: none;
    overflow: auto;
    width: fit-content;
    top: 40vh;
    position: relative;
    background-color: #d1d1d1;
    padding: 5px;
    border-radius: 10px;
}
#uniprot{
    display: none;
    top: 20vh;
    margin: 10px 0px;
    position: absolute;
    width: 100%;
    height: fit-content;
    padding: 10px;
}
#gallery{
    display: none;
    top: 20vh;
    margin: 10px 0px;
    position: absolute;
    width: 100%;
    height: fit-content;
    padding: 10px;
}
</style>
