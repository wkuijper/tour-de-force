import { itemInfoDefs } from "./items.js";
import { segmentDefs, tourDefs } from "./pannenkoek.js";

import { 
	ItemInfos, 
	Segments,
	Tours,
	TourDeForce,
	stemStreetNumber,
	unstemAndAlignStreetNumber,
	splitStemmedStreetNumber,
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

function tourDeForce(fontSize, bgColor, fgColor, days) {

	/*window.onbeforeunload = (evt) => {
		return "Are you sure?";
	}*/

	document.body.onclick = (evt) => {
		evt.preventDefault();
		if (document.body.style.background !== "green") {
			document.body.style.background = "green";	
		} else {
			document.body.style.background = bgColor;
		}
	};
	
	document.body.style.font = `${fontSize} sans-serif`;
	document.body.style.color = fgColor;
	document.body.style.background = bgColor;
	document.body.style.width = "720px";
	document.body.style.marginLeft = "auto";
	document.body.style.marginRight = "auto";
	
	const controlPanelDivE = document.createElement("div");
	document.body.appendChild(controlPanelDivE);
	
	const daysDropDownDivE = document.createElement("div");
	controlPanelDivE.appendChild(daysDropDownDivE);
	
	daysDropDownDivE.style.marginTop = "8px";
	daysDropDownDivE.style.marginRight = "8px";
	daysDropDownDivE.style.marginBottom = "8px";
	daysDropDownDivE.style.font = `${fontSize} sans-serif`;
	
	const daysDropDownSelectE = document.createElement("select");
	daysDropDownDivE.appendChild(daysDropDownSelectE);
	daysDropDownSelectE.style.font = `${fontSize} sans-serif`;
	daysDropDownSelectE.style.background = bgColor;
	daysDropDownSelectE.style.color = fgColor;
	
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
		optionE.style.font = `${fontSize} sans-serif`;
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
	
	mutationTextAreaE.style.background = bgColor;
	mutationTextAreaE.style.color = fgColor;
	
	//

	const buttonDivE = document.createElement("div");
	controlPanelDivE.appendChild(buttonDivE);
	
	const applyButtonE = document.createElement("button");
	buttonDivE.appendChild(applyButtonE);

	applyButtonE.style.font = `${fontSize} sans-serif`;
	applyButtonE.style.background = "gray";
	applyButtonE.style.color = "white";
	applyButtonE.style.width = "100%";
	applyButtonE.style.height = "100px";
	applyButtonE.innerText = "GO";

	//
	
	/*const hrE = document.createElement("hr");
	controlPanelDivE.appendChild(hrE);*/

	controlPanelDivE.style.marginBottom = "20px";
	
	controlPanelDivE.style.display = "none";
	
	//
	
	const output = (text, lineAbove, lineBelow) => {
		if (lineAbove === undefined) {
			lineAbove = false;
		}
		if (lineBelow === undefined) {
			lineBelow = false;
		}
		const preE = document.createElement("pre");
		if (lineAbove) {
			preE.style.borderTop = `1px solid ${fgColor}`;
		}
		if (lineBelow) {
			preE.style.borderBottom = `1px solid ${fgColor}`;
		}
		preE.style.marginTop = "4px";
		preE.style.marginBottom = "4px";
		
		preE.innerText = text;
		document.body.appendChild(preE);
	};
	
	const itemInfos = new ItemInfos(itemInfoDefs);

	const segments = new Segments(itemInfos, segmentDefs);

	const tours = new Tours(segments, tourDefs);

	const tour = tours.forName("Dubbele Pannenkoek");

	const tourDeForce = new TourDeForce(tour, new Date(), days);

	output(`TOUR DE FORCE`, true, true);
	
	output(` `);
	
	const formattedDate = new Intl.DateTimeFormat('nl', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(tourDeForce.date);
	
	output(`  name:`);
	output(`    ${tourDeForce.name}`);
	
	output(` `);
	
	output(`  date:`);
	output(`     ${formattedDate}`);
	
	output(` `);
	
	output(`  days:`);
	output(`    ${tourDeForce.days} ${tourDeForce.dateDays !== tourDeForce.days ? `!== ${tourDeForce.dateDays}` : ``}`);
	
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
		output(` `);
		output(`  serves:`);
		for (const servedSegment of servedSegments) {
			output(`    ${servedSegment.officialName}`);
		}
	}
	
	if (injectedSegments.length > 0) {
		output(` `);
		output(`  injects:`);
		for (const servedSegment of injectedSegments) {
			output(`    ${servedSegment.name}`);
		}
	}

	output(` `);	

	if (tourDeForce.numberOfUnassignedAddresses > 0) {
		output(`UNASSIGNED ADDRESSES`, true, true);
		
		output(` `);
		
		for (const unassignedAddress of tourDeForce.unassignedAddresses()) {
			output(`  ${unassignedAddress.line}`);
		}
	}
	
	for (const batchDeForce of tourDeForce.allBatchesDeForce()) {
		output(` `);
		output(`PREP FOR BATCH #${batchDeForce.index} (${batchDeForce.title})`, true, true);
		output(` `);
		
		for (const batchCountClusterDeForce of batchDeForce.countClustersDeForce()) {
			output(`  ${batchCountClusterDeForce.days}:`);
			output(`      Product |   Amount`);
			output(`      --------|---------`);
			for (const [code, count] of batchCountClusterDeForce.activeQuantities()) {
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
				output(line);		
			}
			output(` `);
		}
		
		const tourDayBits = tourDeForce.dayBits;
		for (const preparationNumberDeForce of batchDeForce.preparationNumbersDeForce()) {
			output(`  ${preparationNumberDeForce.addressLine}:`);
			for (const itemDeForce of preparationNumberDeForce.activeItemsDeForce()) {
				let line = "    ";
				let codeQuantityStr = itemDeForce.code;
				const quantity = itemDeForce.activeQuantity;
				codeQuantityStr += (quantity < 1 || quantity > 1) ? ` x${quantity}` : "";
				line += codeQuantityStr;
				const codeQuantityLength = codeQuantityStr.length;
				const codeQuantityOutdent = Math.max(1, 8 - codeQuantityLength);
				for (let i = 0; i < codeQuantityOutdent; i++) {
					line += " ";
				}
				const dayBits = itemDeForce.dayBits;
				if (dayBits !== allweekBits) {
					line += itemDeForce.days;
				}
				output(line);
			}
			/*let prepStr = "    ";
			for (const itemDeForce of preparationNumberDeForce.allItemsDeForce()) {
				if (itemDeForce.activeQuantity === 0) {
					continue;
				}
				prepStr += "[" + itemDeForce.code;
				const quantity = itemDeForce.activeQuantity;
				if (quantity < 1 || quantity > 1) {
					prepStr += ` (${quantity}x)`;
				}
				prepStr += "] ";
			}
			output(prepStr);*/
			output(` `);
		}
	}
	
	output(` `);	
	
	output(`DELIVER`, true, true);
	output(` `);
	for (const legDeForce of tourDeForce.allLegsDeForce()) {
		output(` `)
		output(`${legDeForce.desc} (${legDeForce.activeQuantity}x)`, true);
		for (const partDeForce of legDeForce.allPartsDeForce()) {
			if (partDeForce.numberOfAddresses <= 0) {
				continue;
			}
			output(` `)
			if (partDeForce.townIsNecessary) {
				output(`    ${partDeForce.street}, ${partDeForce.town} (${partDeForce.activeQuantity}x)`)
			} else {
				output(`    ${partDeForce.street} (${partDeForce.activeQuantity}x)`)
			}
			for (const numberDeForce of partDeForce.allNumbersDeForce()) {
				
				const firstInBatch = numberDeForce.firstInBatch;
				const indent = "    ";
				let line;
				if (firstInBatch !== null) {
					const tagStr = `#${firstInBatch.index}`;
					line = tagStr;
					const outdent = Math.max(1, indent.length - tagStr.length);
					for (let i = 0; i < outdent; i++) {
						line += " ";
					}
				} else {
					line = indent;
				}

				const [decimalNumber, suffix] = splitStemmedStreetNumber(numberDeForce.number);
				
				const optionalyPrefixedDecimalNumStr = 
					(numberDeForce.activeQuantity === 0) ? `-${decimalNumber}` : `${decimalNumber}`;

				const optionalyPrefixedDecimalNumStrLength = optionalyPrefixedDecimalNumStr.length;
				const optionalyPrefixedDecimalNumStrIndent = Math.max(0, 5 - optionalyPrefixedDecimalNumStrLength);

				for (let i = 0; i < optionalyPrefixedDecimalNumStrIndent; i++) {
					line += " ";
				}
				line += optionalyPrefixedDecimalNumStr;
				line += " ";
				line += suffix;

				const suffixLength = suffix.length;
				const suffixOutdent = Math.max(1, 3 - suffixLength);

				for (let i = 0; i < suffixOutdent; i++) {
					line += " ";
				}
				
				for (const itemDeForce of numberDeForce.activeItemsDeForce()) {
					/*if (itemDeForce.needsPreparation) {
						line += "!";
					} else {
						line += " ";
					}*/
					
					let codeQuantityStr = " ";
					codeQuantityStr += `${itemDeForce.code}`;
					
					if (itemDeForce.activeQuantity < 1 || itemDeForce.activeQuantity > 1) {
						codeQuantityStr += ` x${itemDeForce.activeQuantity}`;
					}

					line += codeQuantityStr;
					
					const codeQuantityLength = codeQuantityStr.length;
					const codeQuantityOutdent = Math.max(0, 8 - codeQuantityLength);

					for (let i = 0; i < codeQuantityOutdent; i++) {
						line += " ";
					}
					
					if (itemDeForce.dayBits !== allweekBits) {
						line += " " + itemDeForce.days;
					}
					
					for (const remark of itemDeForce.activeRemarks) {
						line += " | " + remark; 
					}
					for (const remark of itemDeForce.passiveRemarks) {
						line += " |-" + remark; 
					}
					output(line);
					line = indent;
					line += "         ";
				}
				for (const itemDeForce of numberDeForce.passiveItemsDeForce()) {
					/*if (itemDeForce.needsPreparation) {
						line += "!";
					} else {
						line += " ";
					}*/
					let codeQuantityStr = "-";
					codeQuantityStr += `${itemDeForce.code}`;
					
					if (itemDeForce.passiveQuantity < 1 || itemDeForce.passiveQuantity > 1) {
						codeQuantityStr += ` x${itemDeForce.passiveQuantity}`;
					}

					line += codeQuantityStr;
					
					const codeQuantityLength = codeQuantityStr.length;
					const codeQuantityOutdent = Math.max(0, 8 - codeQuantityLength);

					for (let i = 0; i < codeQuantityOutdent; i++) {
						line += " ";
					}
					
					if (itemDeForce.dayBits !== allweekBits) {
						line += " " + itemDeForce.days;
					}
					
					for (const remark of itemDeForce.activeRemarks) {
						line += " | " + remark; 
					}
					for (const remark of itemDeForce.passiveRemarks) {
						line += " |-" + remark; 
					}
					output(line);
					line = indent;
					line += "         ";
				}
				/*for (const itemDeForce of numberDeForce.passiveItemsDeForce()) {
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
					output(line);
					line = indent;
					line += "        ";
				}*/
			}
		}
	}

}

//tourDeForce("8pt", "white", "black", "MDWDVZZ");

tourDeForce("16pt", "rgb(50,50,50)", "white");