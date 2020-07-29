<template>
  <div ref='viewer'></div>
</template>

<script>
/* eslint-disable */
import WebViewer from '@pdftron/pdfjs-express'

export default {
  name: 'GraphViewer',
  props: {
    path: String,
    url: String
  },
  mounted: function () {
        WebViewer({
            path: this.path,
            initialDoc: this.url, // replace with your own PDF file
          }, this.$refs.viewer).then((instance) => {
            // call apis here
          })

        document.querySelector("#webviewer-1").style.height = '93vh'
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  width: 100%; 
  height: 93vh;
}
</style>
