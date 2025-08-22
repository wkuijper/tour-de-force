import { itemInfoDefs } from "./items.js";
import { segmentDefs } from "./pannenkoek.js";

import { 
	ItemInfos, 
	Segments,
	stemStreetNumber,
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
} from "./model.js";

export function test(report) {
    report.startSection("ItemInfos", "Item Infos", "1edebcb739da99e07e273431b79849725d66e1887261c8a54fd89b6bc9b20e09");
    testItemInfos(report);  
    report.endSection("ItemInfos");

	report.startSection("stemmingParsing", "Stemming and Parsing", "5085633cb8c0e970ca4efdcdb5aae4f25209f0da7bf69c0fe1025ac44aa5228b");
    testStemmingParsing(report);  
    report.endSection("stemmingParsing");
	
	report.startSection("Segments", "Segments", "");
    testSegments(report);  
    report.endSection("Segments");
    
	report.expandPath("/Segments");
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

	report.startSection("dayBits", "Day Bits", "9d1b198ea99a536a7074553d273bf102824473d89463f04d0869f02f835423d4");

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
                    "  34   | TT HE",
                ],
            },
            {
                street: "Hanzestraat",
                town: "Borne",
                numbers: [
                    "  21   | HFD | Kok | MDWDVz",
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
					qty,
				} = item;
				outputLine(`        ${officialCode} (${info.name}) | ${remark} | ${days} | ${qty}`);
			}
		}
	}
}