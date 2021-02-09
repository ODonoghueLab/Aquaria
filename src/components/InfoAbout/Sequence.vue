<template>
    <div id="Sequence" class="panel overlay about level4">
      <SearchPanel />
      <AboutUniprot />
    </div>
</template>
<script>
import SearchPanel from '../Search/SearchPanel'
import AboutUniprot from './AboutUniprot'
export default {
  name: 'Sequence',
  components: {
    SearchPanel,
    AboutUniprot
  }
}
</script>
