<template>
  <ul class="sidebar-menu">
    <li class="header">TOOLS</li>
    <li class="active pageLink" v-on:click="toggleMenu">
      <router-link to="/"><i class="fa fa-tachometer"></i>
        <span class="page">Dashboard</span>
      </router-link>
    </li>
    <li class="pageLink" v-on:click="toggleMenu">
      <router-link to="/listVHosts"><i class="fa fa-book"></i>
        <span class="page">List VHost</span>
      </router-link>
    </li>
    <li class="pageLink" v-on:click="toggleMenu">
      <router-link to="/VHost"><i class="fa fa-television"></i>
        <span class="page">VHost</span>
      </router-link>
    </li>
    <li class="pageLink" v-on:click="toggleMenu">
      <router-link to="/upstreams"><i class="fa fa-clone"></i>
        <span class="page">Upstreams</span>
      </router-link>
    </li>
	<li class="pageLink" v-on:click="toggleMenu">
      <router-link to="/opennebula"><i class="fa fa-cloud"></i>
        <span class="page">Open Nebula</span>
      </router-link>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'SidebarName',
  methods: {
    toggleMenu (event) {
      // remove active from li
      var active = document.querySelector('li.pageLink.active')

      if (active) {
        active.classList.remove('active')
      }
      // window.$('li.pageLink.active').removeClass('active')
      // Add it to the item that was clicked
      event.toElement.parentElement.className = 'pageLink active'
    }
  }
}
</script>
<style>
  /* override default */
  .sidebar-menu>li>a {
    padding: 12px 15px 12px 15px;
  }

  .sidebar-menu li.active>a>.fa-angle-left, .sidebar-menu li.active>a>.pull-right-container>.fa-angle-left {
    animation-name: rotate;
    animation-duration: .2s;
    animation-fill-mode: forwards;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(-90deg);
    }
  }
</style>
