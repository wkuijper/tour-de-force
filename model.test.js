import { itemInfoDefs } from "./items.js";
import { segmentDefs } from "./pannenkoek.js";

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
	parseNumQty,
} from "./model.js";

export function test(report) {
    report.startSection("ItemInfos", "Item Infos", "1edebcb739da99e07e273431b79849725d66e1887261c8a54fd89b6bc9b20e09");
    testItemInfos(report);  
    report.endSection("ItemInfos");

	report.startSection("stemmingParsing", "Stemming and Parsing", "c5c7a7b2c8839e59e393527a1f2cdfa849d4532480487d22e52bb04f42053d6c");
    testStemmingParsing(report);  
    report.endSection("stemmingParsing");
	
	report.startSection("Segments", "Segments", "4720140cc18f83faa5d46667a7834ecef55d28202c24d43ccdc0059baa77521e");
    testSegments(report);  
    report.endSection("Segments");

	report.startSection("Tours", "Tours", "f06e111c293ffa4af4a081aff170a5c74bbb82a86af454d6271aa5523dcb9e2c");
    testTours(report);  
    report.endSection("Tours");

	report.startSection("TourDeForce", "TourDeForce", "");
    testTourDeForce(report);  
    report.endSection("TourDeForce");
    
	report.expandPath("/TourDeForce");
}

export function testItemInfos(report) {
	const outputLine = report.outputLine;

	const itemInfos = new ItemInfos(itemInfoDefs);

	for (const itemInfo of itemInfos.all()) {
		outputLine(`${itemInfo.officialCode}: ${itemInfo.name}`);
	}
	
	const telegraaf = itemInfos.forOfficialCode("TEL");
	outputLine(`itemInfos.forOfficialCode("TEL") => ${telegraaf.officialCode}: ${telegraaf.name}`);

	try {
		const noTelegraaf = itemInfos.forOfficialCode("Tel");
		outputLine(`itemInfos.forOfficialCode("Tel") => ${noTelegraaf.officialCode}: ${noTelegraaf.name}`);
	} catch (err) {
		outputLine(`itemInfos.forOfficialCode("Tel") => ${err}`);
	}
	
	const trouw = itemInfos.forName("Trouw");
	outputLine(`itemInfos.forName("Trouw") => ${trouw.officialCode}: ${trouw.name}`);

	try {
		const noTrouw = itemInfos.forName("trouw");
		outputLine(`itemInfos.forName("trouw") => ${noTrouw.officialCode}: ${noTrouw.name}`);
	} catch (err) {
		outputLine(`itemInfos.forName("trouw") => ${err}`);
	}
}

function testStemmingParsing(report) {
	const outputLine = report.outputLine;

	report.startSection("streetNumbers", "Street Numbers", "e446834bc6b450f3a93a117e0f8e2bb44eaca42a372da6f67950c14e59481e79");

	const testStreetNumber = (from, to) => {
		try {
			const stemmed = stemStreetNumber(from);
			if (stemmed !== to) {
				outputLine(`stemStreetNumber(${from}) => ${stemmed} !== ${to}`);
			} else {
				outputLine(`stemStreetNumber(${from}) => ${stemmed}`);
			}
		} catch (err) {
			const errStr = err.toString();
			if (to !== errStr) {
				outputLine(`stemStreetNumber(${from}) => ${errStr} !== ${to}`);
			} else {
				outputLine(`stemStreetNumber(${from}) => ${errStr}`);
			}
		}
	}
	
	testStreetNumber("0", "Error: can't stem this street number: 0");
	testStreetNumber("1", "1");
	testStreetNumber("10", "10"),
	testStreetNumber("A", "Error: can't stem this street number: A"),
	testStreetNumber("10 a", "10A"),
	testStreetNumber("10 B", "10B"),
	testStreetNumber("10 AA", "Error: can't stem this street number: 10 AA"),
	
	report.endSection("streetNumbers");

	report.startSection("townNames", "Town Name", "b3ab215cc4cb758cc05698b3c67f5474b219ad50a9752a3bbeb5949c2aefac76");
	
	const testTownName = (from, to) => {
		try {
			const stemmed = stemTownName(from);
			if (stemmed !== to) {
				outputLine(`stemTownName(${from}) => ${stemmed} !== ${to}`, true);
			} else {
				outputLine(`stemTownName(${from}) => ${stemmed}`);
			}
		} catch (err) {
			const errStr = err.toString();
			if (to !== errStr) {
				outputLine(`stemTownName(${from}) => ${errStr} !== ${to}`);
			} else {
				outputLine(`stemTownName(${from}) => ${errStr}`);
			}
		}
	}
	
	testTownName("BORNE", "Borne");
	testTownName("'S-GRAVENHAGE", "'s-Gravenhage");
	testTownName("IJSELMUIDE", "IJselmuide");
	testTownName("IPELOO", "Ipeloo");
	
	report.endSection("townNames");

	report.startSection("dayBits", "Day Bits", "6b65f3974e03e7daf38a574840d92b209f8ac988ea131c6b3e458d3d9e4b4060");

	const testParseDayBits = (from, to) => {
		try {
			const bits = parseDayBits(from);
			if (bits !== to) {
				outputLine(`parseDayBits(${from}) => ${bits} !== ${to}`);
			} else {
				outputLine(`parseDayBits(${from}) => ${bits}`);
			}
		} catch (err) {
			const errStr = err.toString();
			if (to !== errStr) {
				outputLine(`parseDayBits(${from}) => ${errStr} !== ${to}`);
			} else {
				outputLine(`parseDayBits(${from}) => ${errStr}`);
			}
		}
	}
	
	testParseDayBits("Mdwdvzz", mondayBit);
	testParseDayBits("mDwdvzz", tuesdayBit);
	testParseDayBits("mdWdvzz", wednesdayBit);
	testParseDayBits("mdwDvzz", thursdayBit);
	testParseDayBits("mdwdVzz", fridayBit);
	testParseDayBits("mdwdvZz", saturdayBit);
	testParseDayBits("mdwdvzZ", sundayBit);
	
	testParseDayBits("MDWDVzz", weekdayBits);
	testParseDayBits("MDWDVZz", weekdayBits | saturdayBit);
	testParseDayBits("mdwdvZZ", weekendBits);
	testParseDayBits("MDWDVZZ", allweekBits);
	
	testParseDayBits("XDWDVZZ", "Error: can't parse these days: XDWDVZZ");
	
	const testUnparseDayBits = (from, to) => {
		try {
			const days = unparseDayBits(from);
			if (days !== to) {
				outputLine(`unparseDayBits(${from}) => ${days} !== ${to}`);
			} else {
				outputLine(`unparseDayBits(${from}) => ${days}`);
			}
		} catch (err) {
			const errStr = err.toString();
			if (to !== errStr) {
				outputLine(`unparseDayBits(${from}) => ${errStr} !== ${to}`);
			} else {
				outputLine(`unparseDayBits(${from}) => ${errStr}`);
			}
		}
	}
	
	testUnparseDayBits(mondayBit, "Mdwdvzz");
	testUnparseDayBits(tuesdayBit, "mDwdvzz");
	testUnparseDayBits(wednesdayBit, "mdWdvzz");
	testUnparseDayBits(thursdayBit, "mdwDvzz");
	testUnparseDayBits(fridayBit, "mdwdVzz");
	testUnparseDayBits(saturdayBit, "mdwdvZz");
	testUnparseDayBits(sundayBit, "mdwdvzZ");
	
	testUnparseDayBits(weekdayBits, "MDWDVzz");
	testUnparseDayBits(weekdayBits | saturdayBit, "MDWDVZz");
	testUnparseDayBits(weekendBits, "mdwdvZZ");
	testUnparseDayBits(allweekBits, "MDWDVZZ");
	
	report.endSection("dayBits");

	report.startSection("numQty", "Numeric Quantity", "6dde8d8a61ea3996b0993e024c7df573c5145f38317b056f334cdf2144e97a4a");

	const testParseNumQty = (from, to) => {
		try {
			const numQty = parseNumQty(from);
			if (numQty !== to) {
				outputLine(`parseNumQty(${from}) => ${numQty} !== ${to}`);
			} else {
				outputLine(`parseNumQty(${from}) => ${numQty}`);
			}
		} catch (err) {
			const errStr = err.toString();
			if (to !== errStr) {
				outputLine(`parseNumQty(${from}) => ${errStr} !== ${to}`);
			} else {
				outputLine(`parseNumQty(${from}) => ${errStr}`);
			}
		}
	}
	
	testParseNumQty("+1", "Error: can't parse quantity: +1");
	testParseNumQty("-1", "Error: can't parse quantity: -1");
	testParseNumQty("0", "Error: quantity is zero");
	testParseNumQty("1", 1);
	testParseNumQty("2", 2);
	testParseNumQty("12", 12);
	
	report.endSection("numQty");
}

const testSegmentDefs = [
	{
		officialSegment: "ZENDEREN LR (57604104)",
        segment: "Zenderen LR",
        streets: [
            {
                street: "Oonksweg",
                town: "Borne",
                numbers: [
                    "  42   | HFD",
                    "  50   | TT HE",
                ],
            },
            {
                street: "Loodijk", 
                town: "Borne",
                numbers: [
                    "   1   | HFD",
                    "   3   | TT HE",
                    "   2   | TT HE",
                ],
            },
            {
                street: "Meester Thienweg", 
                town: "Zenderen",
                numbers: [
                    "   1   | TT HE",
                    "   4   | TT HE",
                ],
            },
            {
                street: "Esweg",
                town: "Zenderen",
                numbers: [
                    "   1   | TT HE",
                    "   4   | TEL",
                    "   4   | TT HE",
                    "   6   | TT HE",
                ],
            },
        ],
	},
	{
        officialSegment: "BORNE WEST 41 (3762241)",
        segment: "Borne West 41",
        streets: [
            {
                street: "Oonksweg",
                town: "Borne",
                numbers: [
                    "  34 A | TT HE",
                ],
            },
            {
                street: "Hanzestraat", 
                town: "Borne",
                numbers: [
                    "  21   | HFD | Kok | MDWDVzz",
                    "  21   | TEL | Senator BE Kok",
                    "  37   | TT HE",
                ],
            },
            {
                street: "Gildestraat", 
                town: "Borne",
                numbers: [
                    "  22   | TT HE",
                    "  31   | TT HE",
                    "  13   | TEL",
                ],
            },
            {
                street: "Oonksweg",
                town: "Borne",
                numbers: [
                    "   4   | TT HE",
                    "  25   | TT HE",
                ],
            },
            {
                street: "Prins Bernhardlaan",
                town: "Borne",
                numbers: [
                    "  61   | TT HE",
                ],
            },
        ],
    },
];

export function testSegments(report) {
	const outputLine = report.outputLine;

	const itemInfos = new ItemInfos(itemInfoDefs);

	const segments = new Segments(itemInfos, testSegmentDefs);

	for (const segment of segments.all()) {
		outputLine(`${segment.name}`);
		for (const address of segment.allAddresses()) {
			const {
				street,
				number,
				town,
			} = address;
			outputLine(`    ${street} ${number}, ${town}`);
			for (const item of address.allItems()) {
				const {
					officialCode,
					info,
					remark,
					days,
					dayBits,
					qty,
					numQty,
				} = item;
				outputLine(`        ${officialCode} (${info.name}) | ${remark} | ${days} (${unparseDayBits(dayBits)}) | ${qty} (${numQty})`);
			}
		}
	}
}

const testTourDefs = [
	{
		tour: "Doordeweekse Pannenkoek",
        days: "MDWDVzz",
        segments: [
            "Zenderen LR",
            "Borne West 41",
        ],
        towns: [
            {
                town: "Borne",
                streets: [
					"Prins Bernhardlaan",
					"Gildestraat",
					"Hanzestraat",
					"Loodijk",
					"Oonksweg",
                ],
            },
            {
                town: "Zenderen",
                streets: [
					"Meester Thienweg",
					"Esweg",
                ],
            },
        ],
        legs: [
            {
                desc: "Esweg",
                parts: [
                    {
                        street: "Esweg",
                        numbers: "1"          
                    },
                ],
            },
            {
                desc: "Esweg & Meester Thienweg",
                parts: [
                    {
                        street: "Esweg",
                        numbers: "8,6,4,2",
                    },
                    {
                        street: "Meester Thienweg",
                        numbers: "3,6,4,1",
                    },
                ],
            },
            {
                desc: "Loodijk & Oonksweg",
                parts: [
                    {
                        street: "Loodijk",
                        numbers: "2,1A,1",
                    },
                    {
                        street: "Oonksweg",
                        numbers: "50,42",
                    },
                ],
            },
            // switch to industrieterrein
            {
                desc: "Oonksweg & Hanzestraat",
                parts: [
                    {
                        street: "Oonksweg",
                        numbers: "35,35A,34,34A,36,36A,38A,38B,38,33,33A",
                    },
                    {
                        street: "Hanzestraat",
                        numbers: "2,4,1,6B,8,10,3,5,7,9,12",
                    },
                ],
            },
            {
                desc: "Hanzestraat",
                parts: [
                    {
                        street: "Hanzestraat",
                        numbers: "17,19,12A,12B,14,21,21A,21B,16,23,18,25,25A,25B,25C,25D,20,22,27,29,29A,31,33,24,24A,24B,35,37,37A",
                    },
                ],
            },
            {
                desc: "Gildestraat & Oonksweg",
                parts: [
                    {
                        street: "Gildestraat",
                        numbers: "31,22,29,16,16A,18,20,14,14A,14B,27,27A,12,25,23..15,10,10A,13,8,8A,11,11A,6,6A,9,4,4A,7,7A,2,5",
                    },
                    {
                        street: "Oonksweg",
                        numbers: "24,24A,26,26A,28,28A,28B,28C,28D,28E,28F,28G,29,29A,29B,29C,25A,25,21,12,12A,10A,10,6,4,2",
                    },
                ],
            },
            {
                desc: "Prins Bernhardlaan",
                parts: [
                    {
                        street: "Prins Bernhardlaan",
                        numbers: "138,140,142,144,144A,57,59,146A,146,146C,146D,61,148,63,65A,65,67",
                    },
                ],
            },
		],
	}
];

export function testTours(report) {
	const outputLine = report.outputLine;

	const itemInfos = new ItemInfos(itemInfoDefs);

	const segments = new Segments(itemInfos, testSegmentDefs);

	const tours = new Tours(segments, testTourDefs);

	for (const tour of tours.all()) {
		outputLine(`${tour.name}:`)
		for (const leg of tour.allLegs()) {
			outputLine(`    ${leg.desc}:`)
			for (const streetPart of leg.allStreetParts()) {
				outputLine(`            ${streetPart.street}, ${streetPart.town}:`)
				for (const streetPartNumber of streetPart.allStreetPartNumbers()) {
					outputLine(`                ${streetPartNumber.addressLine}`)
				}
			}
		}
	}
}

export function testTourDeForce(report) {
	const outputLine = report.outputLine;

	const itemInfos = new ItemInfos(itemInfoDefs);

	const segments = new Segments(itemInfos, testSegmentDefs);

	const tours = new Tours(segments, testTourDefs);

	const tour = tours.forName("Doordeweekse Pannenkoek");

	const tourDeForce = new TourDeForce(tour, "mdwdvZz");

	console.log(tourDeForce);
	
	for (const legDeForce of tourDeForce.allLegsDeForce()) {
		outputLine(`  ========================================`)
		outputLine(`  ${legDeForce.desc}:`);
		for (const partDeForce of legDeForce.allPartsDeForce()) {
			if (partDeForce.numberOfAddresses <= 0) {
				continue;
			}
			outputLine(`    ----------------------------------------`)
			if (partDeForce.townIsNecessary) {
				outputLine(`    ${partDeForce.street}, ${partDeForce.town}:`)
			} else {
				outputLine(`    ${partDeForce.street}:`)
			}
			for (const numberDeForce of partDeForce.allNumbersDeForce()) {
				const unstemmedAndAlignedStreetNumber = unstemAndAlignStreetNumber(numberDeForce.number, 3, 1, 4);
				const indent = "      ";
				let line = indent;
				line += unstemmedAndAlignedStreetNumber;
				for (const itemDeForce of numberDeForce.activeItemsDeForce()) {
					line += ` ${itemDeForce.officialCode}`;
					if (itemDeForce.filteredNumQty < 1 || itemDeForce.filteredNumQty > 1) {
						line += ` (${itemDeForce.filteredNumQty}x)`;
					}
					for (const remark of itemDeForce.filteredRemarks) {
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
					line += `-${itemDeForce.officialCode}`;
					if (itemDeForce.filteredNumQty < 1 || itemDeForce.filteredNumQty > 1) {
						line += ` (${itemDeForce.filteredNumQty}x)`;
					}
					for (const remark of itemDeForce.filteredRemarks) {
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

	for (const [officialCode, count] of tourDeForce.filteredItemCounts()) {
		outputLine(`${officialCode}: ${count}`);		
	}
}