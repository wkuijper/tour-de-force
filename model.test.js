import { itemInfoDefs } from "./items.js";

import { ItemInfos } from "./model.js";

export function test(report) {
    report.startSection("ItemInfos", "Item Infos", "1edebcb739da99e07e273431b79849725d66e1887261c8a54fd89b6bc9b20e09");
    testItemInfos(report);  
    report.endSection("ItemInfos");
    
	report.expandPath("/infos");
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