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

	//window.onbeforeunload = (evt) => {
	//	return "Are you sure?";
	//}
	
	document.body.style.font = "16pt monospace";

	const controlPanelDivE = document.createElement("div");
	document.body.appendChild(controlPanelDivE);
	
	const daysDropDownDivE = document.createElement("div");
	controlPanelDivE.appendChild(daysDropDownDivE);
	
	daysDropDownDivE.style.marginTop = "8px";
	daysDropDownDivE.style.marginRight = "8px";
	daysDropDownDivE.style.marginBottom = "8px";
	daysDropDownDivE.style.font = "16pt sans-serif";
	
	const daysDropDownSelectE = document.createElement("select");
	daysDropDownDivE.appendChild(daysDropDownSelectE);
	daysDropDownSelectE.style.font = "16pt sans-serif";
	
	const daysOptions = [
		["Today", undefined],
		["Monday", "mdwdvzz"],
		["Tuesday", "mdwdvzz"],
		["Wednesday", "mdwdvzz"],
		["Thursday", "mdwdvzz"],
		["Friday", "mdwdvzz"],
		["Saturday", "mdwdvzz"],
		["Sunday", "mdwdvzz"],
		["Weekday", "MDWDVZZ"],
		["Weekend--", "mdwdvZZ"],
		["Weekend++", "mdwdVZZ"],
		["Anyday", "MDWDVZZ"],
	];

	for (const [title, value] of daysOptions) {
		const optionE = document.createElement("option");
		daysDropDownSelectE.appendChild(optionE);
		optionE.style.font = "16pt sans-serif";
		optionE.innerText = title;
		optionE.value = value;
	}

	//
	
	const mutationDivE = document.createElement("div");
	controlPanelDivE.appendChild(mutationDivE);
	
	mutationDivE.style.marginTop = "8px";
	mutationDivE.style.marginRight = "8px";
	mutationDivE.style.marginBottom = "8px";
	
	const mutationTextAreaE = document.createElement("textarea");
	mutationDivE.appendChild(mutationTextAreaE);
	
	mutationTextAreaE.style.font = "18pt sans-serif";
	mutationTextAreaE.style.width = "100%";
	mutationTextAreaE.rows = "4";
	
	//

	const buttonDivE = document.createElement("div");
	controlPanelDivE.appendChild(buttonDivE);
	
	const applyButtonE = document.createElement("button");
	buttonDivE.appendChild(applyButtonE);

	applyButtonE.font = "16pt sans-serif";
	applyButtonE.style.width = "100%";
	applyButtonE.style.height = "100px";
	applyButtonE.innerText = "GO";

	//
	
	const hrE = document.createElement("hr");
	controlPanelDivE.appendChild(hrE);

	controlPanelDivE.style.display = "block";
	
	//
	
	const outputLine = (line) => {
		const preE = document.createElement("pre");
		preE.innerText = line;
		document.body.appendChild(preE);
	};
	
	const itemInfos = new ItemInfos(itemInfoDefs);

	const segments = new Segments(itemInfos, segmentDefs);

	const tours = new Tours(segments, tourDefs);

	const tour = tours.forName("Dubbele Pannenkoek");

	const tourDeForce = new TourDeForce(tour, new Date("8/24/2025"), "MDWDVZZ");

	outputLine(`TOUR DE FORCE`);
	
	outputLine(` `);
	
	const formattedDate = new Intl.DateTimeFormat('nl', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(tourDeForce.date);
	
	outputLine(`  name:`);
	outputLine(`    ${tourDeForce.name}`);
	
	outputLine(` `);
	
	outputLine(`  date:`);
	outputLine(`     ${formattedDate}`);
	
	outputLine(` `);
	
	outputLine(`  days:`);
	outputLine(`    ${tourDeForce.days} ${tourDeForce.dateDays !== tourDeForce.days ? `!== ${tourDeForce.dateDays}` : ``}`);
	
	let servedSegments = [];
	let injectedSegments = [];
	for (const segment of tour.servedSegments()) {
		const officialName = segment.officialName;
		if (officialName === null) {
			injectedSegments.push(segment);
		} else {
			servedSegments.push(segment);
		}
	}

	if (servedSegments.length > 0) {
		outputLine(` `);
		outputLine(`  serves:`);
		for (const servedSegment of servedSegments) {
			outputLine(`    ${servedSegment.officialName}`);
		}
	}
	
	if (injectedSegments.length > 0) {
		outputLine(` `);
		outputLine(`  injects:`);
		for (const servedSegment of injectedSegments) {
			outputLine(`    ${servedSegment.name}`);
		}
	}

	outputLine(` `);	
	
	outputLine(`UNASSIGNED ADDRESSES`);
	
	outputLine(` `);
	
	for (const unassignedAddress of tourDeForce.unassignedAddresses()) {
		outputLine(`  ${unassignedAddress.line}`);
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
			outputLine(`  ${preparationNumberDeForce.addressLine}:`);
			let prepStr = "    ";
			for (const itemDeForce of preparationNumberDeForce.allItemsDeForce()) {
				prepStr += "[" + itemDeForce.code;
				const quantity = itemDeForce.quantity;
				if (quantity < 1 || quantity > 1) {
					prepStr += ` (${quantity}x)`;
				}
				prepStr += "] ";
			}
			outputLine(prepStr);
		}
	}
	
	outputLine(` `);	
	
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
					if (itemDeForce.activeQuantity < 1 || itemDeForce.activeQuantity > 1) {
						line += ` (${itemDeForce.activeQuantity}x)`;
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
					if (itemDeForce.activeQuantity < 1 || itemDeForce.activeQuantity > 1) {
						line += ` (${itemDeForce.activeQuantity}x)`;
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