<template>
    <!-- Can use routing to route to about page for phone view -->
    <div id="tabs">
      <md-tabs class="md-primary" md-alignment="centered">
        <md-tab class="uniprot_explanation" md-label="About UniProt">
          <AboutUniProt/>
        </md-tab>
        <md-tab class="about_PDB" md-label="About PDB">
          <Gallery />
        </md-tab>
       </md-tabs>
    </div>
</template>

<script>
import AboutUniProt from './AboutUniprot'
import Gallery from './Gallery'

export default {
  name: 'Tabs',
  components: {
    AboutUniProt,
    Gallery
  }
}
</script>

<style scoped>
  #tabs{
    width: 240px;
    max-height: 400px;
    overflow: scroll;
    border-radius: 10px;
    position: relative;
  }

  .md-tabs {
    margin-bottom: 24px;
  }

  .md-tab{
    padding: 0;
    background-color: #cccccc;
  }
</style>
