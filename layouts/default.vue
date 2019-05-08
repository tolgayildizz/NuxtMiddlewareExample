<template>
  <div>
    <Header/>
    <nuxt/>
  </div>
</template>

<script>
import Header from '@/components/Header';
export default {
  middleware:["session-control","auth"],
  components: {
    Header,
  }
}
</script>
