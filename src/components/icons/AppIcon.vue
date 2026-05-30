<template>
  <img
    v-if="assetSrc"
    :src="assetSrc"
    :alt="alt"
    class="app-icon app-icon--img"
    :style="imgStyle"
    aria-hidden="true"
  />
  <svg
    v-else
    :width="size"
    :height="size"
    :viewBox="iconDef.viewBox"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="app-icon app-icon--svg"
    aria-hidden="true"
  >
    <path v-for="(d, i) in iconDef.paths" :key="i" :d="d" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { icons } from './icons.js'
import { iconAssets } from './iconAssets.js'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 20 },
  alt: { type: String, default: '' },
})

const assetSrc = computed(() => iconAssets[props.name] ?? null)

const imgStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

const iconDef = computed(() => icons[props.name] ?? icons.layout)
</script>

<style scoped>
.app-icon--img {
  display: block;
  object-fit: contain;
  flex-shrink: 0;
}

.app-icon--svg {
  display: block;
  flex-shrink: 0;
}
</style>
