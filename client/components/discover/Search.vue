<template>
  <section id="menu" class="relative w-full px-6 mb-6 md:px-3 lg:mb-4 lg:w-1/4">
    <h2 class="text-3xl font-bold text-gray-300">Discover</h2>
    <SearchByName />
    <SearchWithFilters />
  </section>
</template>

<script>
import SearchByName from '@/components/discover/SearchByName'
import SearchWithFilters from '@/components/discover/SearchWithFilters'
export default {
  components: {
    SearchByName,
    SearchWithFilters
  }
}
</script>
