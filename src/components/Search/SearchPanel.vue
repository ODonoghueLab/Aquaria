<template>
  <div id="searchByName">
    <p>Organism</p>
    <SearchOrganism/>
    <div id='osyns'>
      <p>&nbsp;</p>
    </div>
    <p>Protein</p>
    <SearchProtein/>
    <div id='psyns'>
      <p>(example: <a href="#" v-on:click="fillin('p53')">p53</a> or <a href="#" v-on:click="fillin('P04637');">P04637</a>)</p>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import SearchOrganism from './SearchOrganism'
import SearchProtein from './SearchProtein'
export default {
  components: {
    SearchOrganism,
    SearchProtein
  },
  name: 'SearchPanel',
  data () {
    return {
      search: require('../../assets/img/search_dark.png')
    }
  },
  methods: {
    fillin: function (term) {
      document.getElementById('protein_syn_input').value = term
      setTimeout(function () {
        window.location.href = '/P04637'
      }, 300)
    },
    selectOrganism: function (event) {

    },
    placeholderText: function (organism, protein) {
      var orgInput = document.querySelector('#organism_syn_input')
      var protInput = document.querySelector('#protein_syn_input')
      orgInput.placeholder = organism
      orgInput.setAttribute('size', orgInput.getAttribute('placeholder').length)
      protInput.placeholder = protein
      protInput.setAttribute('size', protInput.getAttribute('placeholder').length)

      $('#organism_syn_input').focus(function () {
        $(this).attr('placeholder', 'Specify an organism')
        orgInput.setAttribute('size', orgInput.getAttribute('placeholder').length)
      }).blur(function () {
        $(this).attr('placeholder', organism)
        orgInput.setAttribute('size', orgInput.getAttribute('placeholder').length)
      })

      $('#protein_syn_input').focus(function () {
        $(this).attr('placeholder', 'Specify a protein')
        protInput.setAttribute('size', protInput.getAttribute('placeholder').length)
      }).blur(function () {
        $(this).attr('placeholder', protein)
        protInput.setAttribute('size', protInput.getAttribute('placeholder').length)
      })
    }
  }
}
</script>

<style>
#searchByName {
  width: 100%;
}
.contents p {
  margin: 0.5em 0;
}
  input {
    z-index: 40;
    border: none;
    color: #333333;
    padding: 0.2rem 0.5rem;
    font-size: 0.9rem;
  }
</style>
