<template>
  <div id="controls">
    <Logo/>
    <div>
        <SearchPanel id="searchByName"/>
        <Tabs/>
    </div>
  </div>
</template>

<script>
import Logo from './Logo'
import SearchPanel from './SearchPanel'
import Tabs from './Tabs'

export default {
  name: 'Controls',
  components: {
    Logo,
    SearchPanel,
    Tabs
  }
}
</script>

<style scoped>
#controls{
  padding-left: 10px;
  position: absolute;
  z-index: 2;
}
</style>
