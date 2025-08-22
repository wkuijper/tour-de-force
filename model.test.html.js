import { TestReport } from "./html.test.js";
import { test } from "./model.test.js";

const report = new TestReport(document.body, "Model Tests");

test(report);