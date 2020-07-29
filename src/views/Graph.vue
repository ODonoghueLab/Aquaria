<template>
  <div>
    <GraphViewer :path="`${publicPath}lib`" url="../COVID/web/Fig_1_hi-res.pdf"/>
  </div>
</template>

<script>
import GraphViewer from '../components/GraphViewer'

export default {
  name: 'Graph',
  components: {
    GraphViewer
  },
  data () {
    return {
      publicPath: process.env.BASE_URL
    }
  }
}
</script>

<style>

</style>
