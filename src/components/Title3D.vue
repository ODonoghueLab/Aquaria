<template>
  <h3 id="titleBar3Dview" data-intro="3D view: initially shows PDB structure estimated to be most relevant for the specified protein. Hue is used to indicate secondary structure: yellow = strand, blue = helix, and green = coil. Lightness is used to indicate amino acid substitutions between the specified protein and PDB structure: slightly dark = conserved, very dark = non-conserved, white = insertions, and semi-transparent = other chains. <br><p>&nbsp;</p>
<div class='bg_helpdoc'>
<table id='helptable'><tr><td>
<h2>Videos</h2>
<p><a target='_blank' href='http://youtu.be/FAQ3yVGYSzY'>Quick introduction (6:16)</a></p>
<p><a target='_blank' href='http://youtu.be/PIs1qyV_dIQ'>General overview (44:25)</a></p>
<p><a target='_blank' href='http://youtu.be/XU_6TWM9ke8'>Leap Motion controller (2:18)</a></p>
<h2>Installation</h2>
<p><a target='_blank' href='https://docs.google.com/document/d/1waNOvw442Bwncx_FlMJAATH35aJxXpxu0iRcrZt8hrQ/pub'>On Mac OS</a></p>
<p><a target='_blank' href='https://docs.google.com/document/d/1wZo-76MEPyoDj-9uAxHyz4y2f4_6ZR89uJcPBQvVUQc/pub'>On Windows</a></p>
<h2>Documentation</h2>
<p><a target='_blank' href='/help/Aquaria3D_QR_v1.pdf'>Mouse & keyboard controls</a></p>
<p><a target='_blank' href='https://docs.google.com/document/d/1566Ub_-WAXMcuOA8gmb2-X9JmYfWuZarrgneNVaBQd8/pub'>Aquaria API</a></p>
</td><td>
<h2>Publication</h2>
<p><a target='_blank' href='http://nature.com/articles/nmeth.3258'>O&rsquo;Donoghue et al., Nature Methods (2015)</a></p>
<h2>Forum</h2>
<p><a target='_blank' href='https://www.biostars.org/t/aquaria'>View forum</a></p>
<p><a target='_blank' href='https://www.biostars.org/p/new/post/?tag_val=aquaria'>Ask a question</a></p>
<h2>Bugs</h2>
<p><a target='_blank' href='https://github.com/ODonoghueLab/Aquaria/issues'>View known bugs</a></p>
<p><a target='_blank' href='https://github.com/ODonoghueLab/Aquaria/issues/new' >Report new bug</a></p>
</td></tr></table>
</div>
" data-position="bottom">3D structure
<span id="structureviewerexplanation" class="explanation"></span>
<div class="rightHeaderBar">
        <a href="javascript:;" title="Toggle full window view" data-intro="Full window" data-position="bottom">
        <span id="expander" class="roundButton" style="display: inline-block;">&nbsp;</span>
</a>
<a class="launchApplicationLink" href="#" target="_blank" title="Launch stand-alone Java application" data-intro="Standalone application" data-position="top">
            <span class="applauncher roundButton"
                style="display: inline-block;">&nbsp;</span>
</a>
</div>
</h3>
</template>

<script>
export default {
  name: 'Title3D'
}
</script>

<style scoped>
h3{
  position: absolute;
  z-index: 2;
  top: 40px;
  font-size: 10px;
  margin: 4vh;
  background-color: #999999;
}

.roundButton {
    color: #999;
    height: 17px;
    width: 17px;
    padding: 0 4px;
    /*margin-left: 4px;*/
  }
</style>
