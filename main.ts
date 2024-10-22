declare global {
	interface Window {
		Iconize: {
			render: () => void;
		};
	}
}

import { Plugin } from 'obsidian';

export default class ObsitestPlugin extends Plugin {

	private recipeTimes: Record<string, number> = {
		"Iron Gear": 0.5,  // Takes 0.5 seconds to craft one Iron Gear
		"Copper Cable": 0.2, // Takes 0.2 seconds to craft one Copper Cable
		// Add more recipes as needed
	};



	async onload() {
		console.log("Obsitest plugin loaded");

		// Register the Markdown code block processor for "factory"
		this.registerMarkdownCodeBlockProcessor('factory', (source, el, ctx) => {
			const params = this.parseFactoryBlock(source);
			const productionRate = this.calculateProductionRate(params.recipe, params.machines);

			// Generate the container for the machine box
			const machineBox = this.createMachineBox(params.recipe, params.machines, productionRate);
			el.appendChild(machineBox);
		});
	}

	parseFactoryBlock(source: string) {
		const lines = source.split('\n');
		const recipeLine = lines.find(line => line.startsWith('recipe'));
		const machinesLine = lines.find(line => line.startsWith('machines'));

		// Check if the recipe line exists and split it
		const recipe = recipeLine ? recipeLine.split(':')[1].trim() : '';

		// Check if the machines line exists and parse it
		const machines = machinesLine ? parseInt(machinesLine.split(':')[1].trim()) : 0;

		return { recipe, machines };
	}

	calculateProductionRate(recipe: string, machines: number): string {
		const craftTime = this.recipeTimes[recipe] || 1; // Default to 1 second if recipe not found

		// Calculate items per minute
		const itemsPerMinute = (machines / craftTime) * 60; // Convert to items per minute
		return itemsPerMinute.toFixed(2); // Return formatted string
	}

	createMachineBox(recipe: string, machines: number, productionRate: string): HTMLElement {
		const div = document.createElement('div');
		div.classList.add('machine-box');

		// Correct relative path
		const iconPath = "factoricons/assembling-machine-2.png"; // No leading slashes or app://

		// Update innerHTML to include the image
		div.innerHTML = `
        <img src="${iconPath}" style="width: 64px; height: 64px;">
        <strong>Recipe:</strong> ${recipe}<br>
        <strong>Machines:</strong> ${machines}<br>
        <strong>Production Rate:</strong> ${productionRate} items/minute
    `;

		return div;
	}

	addRow() {
		const row = document.createElement('div');
		row.classList.add('machine-row');

		const addButton = document.createElement('button');
		addButton.innerText = "Add Machine";
		addButton.onclick = () => this.addMachineBox(row);

		row.appendChild(addButton);
		document.body.appendChild(row);
	}

	addMachineBox(row: HTMLElement) {
		const machineBox = this.createMachineBox('Iron Gear', 5, '10/s');
		row.appendChild(machineBox);
	}

	onunload() {
		console.log("Obsitest plugin unloaded");
	}
}
