import {
    TUIDoc,
    TUIGroup,
    TUILine,
    TUIField,
} from "./termui.js";

export function test(container) {
    const doc = new TUIDoc(container, "doc");
    const line = doc.rootGroup.addLine();
    line
        .addField("product-header", "Product", 10, "left")
        .addField("separator-header", " | ")
        .addField("amount-header", "Amount", 10, "right");

    doc.rootGroup.addLine(`horizontal-line`).addField("horizontal-line-field", "-----------+-----------");

    const testData = [
        ["HE", 80],
        ["FD", 4],
        ["VK", 2],
        ["NRC", 1],
        ["AD", 2],
    ];

    const numberOfTestItems = testData.length;
    for (let i = 0; i < numberOfTestItems; i++) {
        const [code, amount] = testData[i];
        const line = doc.rootGroup.addLine(`item-line-${i}`);
        line
            .addField(`code-field-${i}`, code, 10, "left")
            .addField(`separator-field-${i}`, " | ")
            .addField(`amount-field-${i}`, `${amount}`, 10, "right");
    }
}