import { generateCore } from "@/core";
import { WriterGraph } from "@/writerTypes";
import { computed, readonly, shallowRef } from "vue";

import type { Option } from "@/builder/BuilderSelect.vue";

import graphResponse from "./graphs.json";

export function useWriterGraphList(wf: ReturnType<typeof generateCore>) {
	const graphs = shallowRef<WriterGraph[]>([]);

	async function load() {
		// const result = await wf.sendWriterGraphRequest({});
		await new Promise((res) => setTimeout(res, 1_000));

		// @ts-expect-error just for testing
		graphs.value = graphResponse.data;
	}

	const options = computed(() =>
		graphs.value
			.map<Option>((graph) => ({
				// icon: graph.type === "connector" ? "network_node" : "graph_5",
				label: graph.name,
				detail: graph.type,
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
