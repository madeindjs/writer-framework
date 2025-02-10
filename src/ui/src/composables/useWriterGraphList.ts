import { generateCore } from "@/core";
import { WriterGraph } from "@/writerTypes";
import { computed, readonly, shallowRef } from "vue";

import type { Option } from "@/builder/BuilderSelect.vue";

export function useWriterGraphList(wf: ReturnType<typeof generateCore>) {
	const graphs = shallowRef<WriterGraph[]>([]);

	async function load() {
		graphs.value = await wf.sendWriterGraphRequest({});
	}

	const options = computed(() =>
		graphs.value
			.map<Option>((graph) => ({
				// icon: graph.type === "connector" ? "network_node" : "graph_5",
				label: graph.name,
				detail: graph.description,
				value: graph.id,
			}))
			.sort((a, b) => a.label.localeCompare(b.label)),
	);

	return {
		graphs: readonly(graphs),
		options: readonly(options),
		load,
	};
}
