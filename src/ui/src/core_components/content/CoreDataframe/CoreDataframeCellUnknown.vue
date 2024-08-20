<script setup lang="ts">
import { computed } from "vue";
import { bigIntReplacer } from "../../../core/serializer";

const props = defineProps({
	value: { validator: () => true, required: true },
});

const text = computed(() => JSON.stringify(props.value, bigIntReplacer));
</script>

<template>
	<div class="CoreDataframeCellUnknown">
		{{ text }}
	</div>
</template>
