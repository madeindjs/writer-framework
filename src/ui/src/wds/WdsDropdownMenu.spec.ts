import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import WdsDropdownMenu from "./WdsDropdownMenu.vue";
import { WdsDropdownMenuOption } from "./WdsDropdownMenu.vue";

describe("WdsDropdownMenu", () => {
	const options: WdsDropdownMenuOption[] = [
		{ label: "Label A", value: "a" },
		{ label: "Label B", value: "b" },
		{ label: "Label C", value: "c" },
	];

	it("should support single mode", async () => {
		const wrapper = shallowMount(WdsDropdownMenu, {
			props: {
				selected: "a",
				enableMultiSelection: false,
				options,
			},
		});

		await wrapper
			.get(`.WdsDropdownMenu__item[data-automation-key="b"]`)
			.trigger("click");

		expect(wrapper.emitted("select").at(0)).toStrictEqual(["b"]);
	});

	it("should support multiple mode", async () => {
		const wrapper = shallowMount(WdsDropdownMenu, {
			props: {
				selected: ["a"],
				enableMultiSelection: true,
				options,
			},
		});

		await wrapper
			.get(`.WdsDropdownMenu__item[data-automation-key="b"]`)
			.trigger("click");

		expect(wrapper.emitted("select").at(0)).toStrictEqual([["a", "b"]]);
	});
});
