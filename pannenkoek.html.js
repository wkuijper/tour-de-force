import { itemInfoDefs } from "./items.js";
import { segmentDefs, tourDefs } from "./pannenkoek.js";

import { 
	ItemInfos, 
	Segments,
	Tours,
	TourDeForce,
	stemStreetNumber,
	unstemAndAlignStreetNumber,
	stemTownName,
	parseDayBits,
	mondayBit,
	tuesdayBit,
	wednesdayBit,
	thursdayBit,
	fridayBit,
	saturdayBit,
	sundayBit,
	weekdayBits,
	weekendBits,
	allweekBits,
	unparseDayBits,
	parseQuantity,
} from "./model.js";

function tourDeForce() {
	const outputLine = (line) => {
		const pre = document.createElement("pre");
		pre.innerText = line;
		document.body.appendChild(pre);
	};
	
	const itemInfos = new ItemInfos(itemInfoDefs);

	const segments = new Segments(itemInfos, segmentDefs);

	const tours = new Tours(segments, tourDefs);

	const tour = tours.forName("Dubbele Pannenkoek");

	const tourDeForce = new TourDeForce(tour, new Date("8/24/2025"));

	outputLine(`TOUR DE FORCE`);
	
	const formattedDate = new Intl.DateTimeFormat('nl', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(tourDeForce.date);
	
	outputLine(`  name: ${tourDeForce.name}`);
	outputLine(`  date: ${formattedDate}`);
	outputLine(`  days: ${tourDeForce.days}`);
	outputLine(`  serves:`);
	for (const segment of tour.servedSegments()) {
		const officialName = segment.officialName;
		if (officialName === null) {
			continue;
		}
		outputLine(`    ${officialName}`);
	}
	outputLine(`  injects:`);
	for (const segment of tour.servedSegments()) {
		const officialName = segment.officialName;
		if (officialName !== null) {
			continue;
		}
		outputLine(`    ${segment.name}`);
	}
	
	for (const batchDeForce of tourDeForce.allBatchesDeForce()) {
		outputLine(` `);
		outputLine(`PREP FOR BATCH #${batchDeForce.index} (${batchDeForce.title})`);
		outputLine(` `);
		outputLine(`  Product |   Amount`);
		outputLine(`  --------|---------`);
		for (const [code, count] of batchDeForce.activeQuantities()) {
			const codeWidth = 8;
			const codeLength = code.length;
			const codeOutdent = codeWidth - codeLength;
			const lineParts = [];
			lineParts.push("  ");
			lineParts.push(code);
			for (let i = 0; i < codeOutdent; i++) {
				lineParts.push(" ");
			}
			lineParts.push("| ");
			const countStr = `${count}`;
			const countStrWidth = 8;
			const countStrLength = countStr.length;
			const countStrIndent = countStrWidth - countStrLength;
			for (let i = 0; i < countStrIndent; i++) {
				lineParts.push(" ");
			}
			lineParts.push(countStr);
			const line = lineParts.join("");
			outputLine(line);		
		}
		outputLine(` `);
		for (const preparationNumberDeForce of batchDeForce.preparationNumbersDeForce()) {
			let prepStr = "";
			for (const itemDeForce of preparationNumberDeForce.allItemsDeForce()) {
				prepStr += "[" + itemDeForce.code;
				const quantity = itemDeForce.quantity;
				if (quantity < 1 || quantity > 1) {
					prepStr += ` (${quantity}x)`;
				}
				prepStr += "] ";
			}
			outputLine(`  ${preparationNumberDeForce.addressLine}: ${prepStr}`);
		}
	}
	
	outputLine(` `);	

	for (const numberDeForce of tourDeForce.allNumbersDeForce()) {
		if (numberDeForce.needsPreparation) {
			console.log(numberDeForce);
		}
	}
	
	outputLine(`DELIVER`);
	outputLine(` `);
	for (const legDeForce of tourDeForce.allLegsDeForce()) {
		outputLine(`  ========================================`)
		outputLine(`  ${legDeForce.desc} (${legDeForce.activeQuantity}x)`);
		for (const partDeForce of legDeForce.allPartsDeForce()) {
			if (partDeForce.numberOfAddresses <= 0) {
				continue;
			}
			outputLine(`    ----------------------------------------`)
			if (partDeForce.townIsNecessary) {
				outputLine(`    ${partDeForce.street}, ${partDeForce.town} (${partDeForce.activeQuantity}x)`)
			} else {
				outputLine(`    ${partDeForce.street} (${partDeForce.activeQuantity}x)`)
			}
			for (const numberDeForce of partDeForce.allNumbersDeForce()) {
				const firstInBatch = numberDeForce.firstInBatch;
				const indent = "      ";
				let line = 
					(firstInBatch !== null) 
					? `#${firstInBatch.index}    `
					: indent;
				const unstemmedAndAlignedStreetNumber = unstemAndAlignStreetNumber(numberDeForce.number, 3, 1, 4);
				line += unstemmedAndAlignedStreetNumber;
				for (const itemDeForce of numberDeForce.activeItemsDeForce()) {
					line += ` ${itemDeForce.code}`;
					if (itemDeForce.filteredNumQty < 1 || itemDeForce.filteredNumQty > 1) {
						line += ` (${itemDeForce.filteredNumQty}x)`;
					}
					for (const remark of itemDeForce.activeRemarks) {
						line += " | " + remark; 
					}
					for (const remark of itemDeForce.passiveRemarks) {
						line += " |-" + remark; 
					}
					if (itemDeForce.days !== null) {
						line += " | " + itemDeForce.days;
					}
					outputLine(line);
					line = indent;
					line += "        ";
				}
				for (const itemDeForce of numberDeForce.passiveItemsDeForce()) {
					line += `-${itemDeForce.code}`;
					if (itemDeForce.filteredNumQty < 1 || itemDeForce.filteredNumQty > 1) {
						line += ` (${itemDeForce.filteredNumQty}x)`;
					}
					for (const remark of itemDeForce.activeRemarks) {
						line += " | " + remark; 
					}
					for (const remark of itemDeForce.passiveRemarks) {
						line += " |-" + remark; 
					}
					if (itemDeForce.days !== null) {
						line += " | " + itemDeForce.days;
					}
					outputLine(line);
					line = indent;
					line += "        ";
				}
			}
		}
	}

}

tourDeForce();