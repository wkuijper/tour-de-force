const streetNumberRegExp = new RegExp("^(0|[1-9][0-9]*)( [0-9A-Za-z]+)?$");

export function stemStreetNumber(streetNumber) {
    const match = streetNumberRegExp.exec(streetNumber);
    if (match === null) {
        throw new Error(`can't stem this street number: ${streetNumber}`)
    }
    const numericPart = match[1];
    const optionalSuffix = match[2] ?? "";
    if (optionalSuffix === "") {
        return numericPart;
    }
    const trimmedUpperCasedSuffix = optionalSuffix.trim().toUpperCase();
    const stemmed = numericPart + "-" + trimmedUpperCasedSuffix;
    return stemmed;
}

const stemmedStreetNumberRegExp = new RegExp("^(0|[1-9][0-9]*)(-[0-9A-Z]+)?$");

export function unstemAndAlignStreetNumber(stemmedStreetNumber, numericPartWidth, interSpacing, alphanumericPartWidth) {
    const match = stemmedStreetNumberRegExp.exec(stemmedStreetNumber);
    if (match === null) {
        throw new Error(`can't unstem this street number: ${stemmedStreetNumber}`)
    }
    const numericPart = match[1];
    const optionalAlphanumericPart = match[2] ? match[2].slice(1) : "";
    const numericPartLength = numericPart.length;
    const indent = Math.max(0, numericPartWidth - numericPartLength);
    const unstemmedParts = [];
    for (let i = 0; i < indent; i++) {
        unstemmedParts.push(" ");
    }
    unstemmedParts.push(numericPart);
    for (let i = 0; i < interSpacing; i++) {
        unstemmedParts.push(" ");
    }
    const alphanumericPartLength = optionalAlphanumericPart.length;
    const outdent = Math.max(0, alphanumericPartWidth - alphanumericPartLength);
    unstemmedParts.push(optionalAlphanumericPart);
    for (let i = 0; i < outdent; i++) {
        unstemmedParts.push(" ");
    }
    const unstemmedStreetNumber = unstemmedParts.join("");
    return unstemmedStreetNumber;
}

export function stemTownName(town) {
    const townParts = town.split(" ");
    const numberOfTownParts = townParts.length;
    const stemmedTownParts = new Array(numberOfTownParts);
    for (let i = 0; i < numberOfTownParts; i++) {
        const townPart = townParts[i];
        const stemmedTownPart = stemTownWhitespaceSeparatedPart(townPart);
        stemmedTownParts[i] = stemmedTownPart;
    }
    const stemmed = stemmedTownParts.join(" ");
    return stemmed;
}

function stemTownWhitespaceSeparatedPart(wsseppart) {
    const townParts = wsseppart.split("-");
    const numberOfTownParts = townParts.length;
    const stemmedTownParts = new Array(numberOfTownParts);
    for (let i = 0; i < numberOfTownParts; i++) {
        const townPart = townParts[i];
        const stemmedTownPart = stemTownDashSeparatedPart(townPart);
        stemmedTownParts[i] = stemmedTownPart;
    }
    const stemmed = stemmedTownParts.join("-");
    return stemmed;
}

function stemTownDashSeparatedPart(townPart) {
    const townPartLetters = townPart.split("");
    const numberOfTownPartLetters = townPartLetters.length;
    const stemmedTownPartLetters = new Array(numberOfTownPartLetters);
    for (let i = 0; i < numberOfTownPartLetters; i++) {
        const townPartLetter = townPartLetters[i];
        const stemmedTownPartLetter = 
            i === 0 
                ? townPartLetter.toUpperCase() 
                : i === 1 && townPartLetter === "J" && stemmedTownPartLetters[0] === "I" 
                    ? "J" 
                    : townPartLetter.toLowerCase();
        stemmedTownPartLetters[i] = stemmedTownPartLetter;
    }
    const stemmed = stemmedTownPartLetters.join("");
    return stemmed;
}

const daysRegExp = new RegExp("^([mM])([dD])([wW])([dD])([vV])([zZ])([zZ])$");

export const mondayBit = 1 << 0;
export const tuesdayBit = 1 << 1;
export const wednesdayBit = 1 << 2;
export const thursdayBit = 1 << 3;
export const fridayBit = 1 << 4;
export const saturdayBit = 1 << 5;
export const sundayBit = 1 << 6;

export const weekdayBits = mondayBit | tuesdayBit | wednesdayBit | thursdayBit | fridayBit;
export const weekendBits = saturdayBit | sundayBit;
export const allweekBits = weekdayBits | weekendBits;

export function parseDayBits(days) {
    const match = daysRegExp.exec(days);
    if (match === null) {
        throw new Error(`can't parse these days: ${days}`)
    }
    const [_, ma, di, wo, dd, vr, za, zo] = match;
    let dayBits = 0;
    if (ma === "M") {
        dayBits |= mondayBit;
    }
    if (di === "D") {
        dayBits |= tuesdayBit;
    }
    if (wo === "W") {
        dayBits |= wednesdayBit;
    }
    if (dd === "D") {
        dayBits |= thursdayBit;
    }
    if (vr === "V") {
        dayBits |= fridayBit;
    }
    if (za === "Z") {
        dayBits |= saturdayBit;
    }
    if (zo === "Z") {
        dayBits |= sundayBit;
    }
    return dayBits;
}

export function unparseDayBits(bits) {
    const letters = ["m", "d", "w", "d", "v", "z", "z"];
    if ((bits & mondayBit) !== 0) {
        letters[0] = "M";
    }
    if ((bits & tuesdayBit) !== 0) {
        letters[1] = "D";
    }
    if ((bits & wednesdayBit) !== 0) {
        letters[2] = "W";
    }
    if ((bits & thursdayBit) !== 0) {
        letters[3] = "D";
    }
    if ((bits & fridayBit) !== 0) {
        letters[4] = "V";
    }
    if ((bits & saturdayBit) !== 0) {
        letters[5] = "Z";
    }
    if ((bits & sundayBit) !== 0) {
        letters[6] = "Z";
    }
    return letters.join("");
}

const qtyRegExp = new RegExp("^([0-9][0-9]*)$");

export function parseQuantity(qtyStr) {
    const match = qtyRegExp.exec(qtyStr);
    if (match === null) {
        throw new Error(`can't parse quantity: ${qtyStr}`)
    }
    const quantity = parseInt(qtyStr, 10);
    if (quantity === 0) {
        throw new Error(`quantity is zero`);
    }
    if (quantity > (1 << 30)) {
        throw new Error(`quantity is too large: ${qtyStr}`);
    }
    return quantity;
}

const purelyDecimalStreetNumberRegExp = new RegExp("^(0|[1-9][0-9]*)$");

export function parsePurelyDecimalStreetNumber(streetNumberStr) {
    const match = purelyDecimalStreetNumberRegExp.exec(streetNumberStr);
    if (match === null) {
        throw new Error(`can't parse purely decimal street number: ${streetNumberStr}`)
    }
    const streetNumber = parseInt(streetNumberStr, 10);
    //if (streetNumber === 0) {
    //    throw new Error(`street number is zero`);
    //}
    if (streetNumber > (1 << 30)) {
        throw new Error(`street number is too large: ${streetNumberStr}`);
    }
    return streetNumber;
}

export function validateStemmedStreetNumber(streetNumberStr) {
    const match = stemmedStreetNumberRegExp.exec(streetNumberStr);
    if (match === null) {
        throw new Error(`street number must be stemmed: ${streetNumberStr}`)
    }
    return streetNumberStr;
}

export class ItemInfos {

    _declareItemInfo(code, name, itemInfo) {
        if (this.__codeMap.has(code)) {
            throw new Error(`duplicate item code: ${code}`);
        }
        this.__codeMap.set(code, itemInfo);
        if (this.__nameMap.has(name)) {
            throw new Error(`duplicate item name: ${name}`);
        }
        this.__nameMap.set(name, itemInfo);
    }
    
    constructor(itemDefs) {
        this.__codeMap = new Map();
        this.__nameMap = new Map();
        for (const itemDef of itemDefs) {
            const itemInfo = new ItemInfo(this, itemDef);
        }
        const sortedItemInfos = [...this.__nameMap.values()];
        sortedItemInfos.sort((a, b) => a.order - b.order);
        this.__sortedItemInfos = sortedItemInfos;
    }

    all() {
        return this.__sortedItemInfos.values();
    }

    forCode(code) {
        if (!this.__codeMap.has(code)) {
            throw new Error(`unknown item code: ${code}`);
        }
        return this.__codeMap.get(code);
    }
    
    forName(name) {
        if (!this.__nameMap.has(name)) {
            throw new Error(`unknown item name: ${name}`);
        }
        return this.__nameMap.get(name);
    }
}

export class ItemInfo {

    get code() {
        return this.__code;
    }
    
    get code() {
        return this.__code;
    }
    
    get officialCode() {
        return this.__officialCode;
    }

    get name() {
        return this.__name;
    }
  
    get order() {
        return this.__order;
    }

    get needsPreparation() {
        return this.__needsPreparation;
    }
    
    get needsDelivery() {
        return this.__needsDelivery;
    }
    
    get needsPickup() {
        return this.__needsPickup;
    }
    
    constructor(parent, itemDef) {
        this.__parent = parent;
        const {
            code,
            officialCode,
            name,
            order,
            needsPreparation,
            needsDelivery,
            needsPickup,
        } = itemDef;
        this.__officialCode = officialCode;
        this.__code = code;
        this.__name = name;
        this.__order = order;
        this.__needsPreparation = needsPreparation;
        this.__needsDelivery = needsDelivery;
        this.__needsPickup = needsPickup;
        parent._declareItemInfo(code, name, this);
  }
}

export class Segments {

    get itemInfos() {
        return this.__itemInfos;
    }
    
    _declareSegment(officialName, name, segment) {
        if (this.__officialSegmentMap.has(officialName)) {
            throw new Error(`duplicate official segment name: ${officialName}`);
        }
        this.__officialSegmentMap.set(officialName, segment);
        if (this.__segmentMap.has(name)) {
            throw new Error(`duplicate segment name: ${name}`);
        }
        this.__segmentMap.set(name, segment);
    }

    constructor(itemInfos, segmentDefs) {
        this.__itemInfos = itemInfos;
        this.__officialSegmentMap = new Map();
        this.__segmentMap = new Map();
        this.__addressToSegmentMap = new Map();
        for (const segmentDef of segmentDefs) {
            const segment = new Segment(this, segmentDef);
        }    
    }

    forName(name) {
        if (!this.__segmentMap.has(name)) {
            throw new Error(`unknown segment name: ${name}`);
        }
        return this.__segmentMap.get(name);
    }

    all() {
        return this.__segmentMap.values();
    }
}

export class Segment {

    get officialName() {
        return this.__officialName;
    }

    get name() {
        return this.__name;
    }

    get segments() {
        return this.__segments;
    }
    
    constructor(segments, segmentDef) {
        const {
            officialSegment,
            segment,
            streets,
        } = segmentDef;
        this.__segments = segments;
        this.__officialName = officialSegment;
        this.__name = segment;
        this.__addressLineToAddressMap = new Map();
        segments._declareSegment(officialSegment, segment, this);
        for (const streetDef of streets) {
            this.__parseStreet(streetDef);
        }
    }

    __parseStreet(streetDef) {
        const {
            street,
            town,
            numbers
        } = streetDef;
        for (const numberDef of numbers) {
            const numberParts = numberDef.split("|").map((part) => part.trim());
            const numberPart = numberParts.length > 0 ? numberParts[0] : null;
            const codePart = numberParts.length > 1 ? numberParts[1] : null;
            const remarkPart = numberParts.length > 2 ? numberParts[2] : null;
            const daysPart = numberParts.length > 3 ? numberParts[3] : null;
            const qtyPart = numberParts.length > 4 ? numberParts[4] : null;
            const address = this.__getOrDeclareAddress(street, numberPart, town);
            address.addItem(codePart, remarkPart, daysPart, qtyPart);
        }
    }

    allAddresses() {
        return this.__addressLineToAddressMap.values();
    }

    __getOrDeclareAddress(street, unstemmedNumber, unstemmedTown) {
        const number = stemStreetNumber(unstemmedNumber);
        const town = stemTownName(unstemmedTown);
        const addressLine = `${street} ${number}, ${town}`;
        if (!this.__addressLineToAddressMap.has(addressLine)) {
            const address = new Address(this, addressLine, street, number, town);
            this.__addressLineToAddressMap.set(addressLine, address);
        }
        return this.__addressLineToAddressMap.get(addressLine);
    }

}

export class Address {

    get segment() {
        return this.__segment;
    }

    get line() {
        return this.__line;
    }
    
    get street() {
        return this.__street;
    }
    
    get number() {
        return this.__number;
    }
    
    get town() {
        return this.__town;
    }

    get dayBits() {
        return this.__dayBits;
    }

    get needsPreparation() {
        return this.__needsPreparation;
    }
    
    get needsDelivery() {
        return this.__needsDelivery;
    }
    
    get needsPickup() {
        return this.__needsPickup;
    }
    
    constructor(segment, line, street, number, town) {
        this.__segment = segment;
        this.__line = line;
        this.__street = street;
        this.__number = number;
        this.__town = town;
        this.__itemList = [];
        this.__dayBits = 0;
        this.__needsPreparation = false;
    }

    addItem(code, remark, days, qtyStr) {
        const item = new Item(this, code, remark, days, qtyStr, this.__itemList.length);
        this.__dayBits |= item.dayBits;
    }

    _declareItem(item) {
        this.__itemList.push(item);
        this.__needsPreparation = this.__needsPreparation || item.needsPreparation;
        this.__needsPickup = this.__needsPickup || item.needsPickup;
        this.__needsDelivery = this.__needsDelivery || item.needsDelivery;
    }

    allItems() {
        return this.__itemList.values();
    }
}

export class Item {

    get code() {
        return this.__code;
    }
    
    get code() {
        return this.__code;
    }

    get info() {
        return this.__info;
    }
    
    get remark() {
        return this.__remark;
    }
    
    get days() {
        return this.__days;
    }
    
    get dayBits() {
        return this.__dayBits;
    }
    
    get qtyStr() {
        return this.__qtyStr;
    }

    get order() {
        return this.__order;
    }
    
    get quantity() {
        return this.__quantity;
    }

    get needsPreparation() {
        return this.__info.needsPreparation;
    }

    get needsDelivery() {
        return this.__info.needsDelivery;
    }
    
    get needsPickup() {
        return this.__info.needsPickup;
    }
    
    constructor(address, code, remark, days, qtyStr, order) {
        const itemInfos = address.segment.segments.itemInfos;
        const itemInfo = itemInfos.forCode(code);
        this.__address = address;
        this.__code = code;
        this.__info = itemInfo;
        this.__remark = remark;
        this.__days = days;
        this.__dayBits = parseDayBits(days ?? "MDWDVZZ");
        this.__qtyStr = qtyStr;
        this.__order = order;
        this.__quantity = parseQuantity(qtyStr ?? "1");
        address._declareItem(this);
    }
}

export class Tours {

    get segments() {
        return this.__segments;
    }
    
    constructor(segments, tourDefs) {
        this.__segments = segments;
        this.__tourNameMap = new Map();
        for (const tourDef of tourDefs) {
            const tour = new Tour(this, tourDef);
        } 
    }

    _declareTour(tour) {
        if (this.__tourNameMap.has(tour.name)) {
            throw new Error(`duplicate tour name: ${tour.name}`);
        }
        this.__tourNameMap.set(tour.name, tour);
    }

    all() {
        return this.__tourNameMap.values();
    }
    
    forName(name) {
        return this.__tourNameMap.get(name);
    }
}

export class Tour {

    get name() {
        return this.__name;
    }

    get dayBits() {
        return this.__dayBits;
    }
    
    path() {
         return this.name;   
    }
    
    get tours() {
        return this.__tours;    
    }
    
    constructor(tours, tourDef) {
        this.__tours = tours;
        const {
            tour,
            days,
            segments,
            batchCuts,
            towns,
            legs,
        } = tourDef;
        this.__name = tour;
        this.__days = days;
        this.__dayBits = parseDayBits(days);

        this.__batchCutAddressLines = [...batchCuts];
        
        this.__servedSegments = segments.map((name) => tours.segments.forName(name));

        this.__addressLineToStreetPartNumberMap = new Map();
        
        this.__townToStreetsMap = new Map();
        this.__streetToTownMap = new Map();

        if (towns === undefined) {
            throw new Error(`missing towns in: ${this.path()}`);
        }
        for (const townDef of towns) {
            const {
                town,
                streets,
            } = townDef;
            if (town === undefined) {
                throw new Error(`missing town in: ${this.path()}`);
            }
            if (streets === undefined) {
                throw new Error(`missing streets in: ${this.path()}: town: ${town}`);
            }
            if (this.__townToStreetsMap.has(town)) {
                throw new Error(`duplicate town in: ${this.path()}: town: ${town}`);
            }
            const streetSet = new Set();
            for (const street of streets) {
                if (streetSet.has(street)) {
                    throw new Error(`duplicate street in: ${this.path()}: town: ${town}: street: ${street}`);
                }
                streetSet.add(street);
            }
            this.__townToStreetsMap.set(town, streetSet);
            for (const street of streetSet) {
                if (this.__streetToTownMap.has(street)) {
                    this.__streetToTownMap.set(street, null);
                } else {
                    this.__streetToTownMap.set(street, town);
                }
            }
        }
        
        this.__legs = legs.map((legDef, index) => this.__parseLeg(legDef, index));
        tours._declareTour(this);
    }

    __parseLeg(legDef, index) {
        return new Leg(this, legDef, index);
    }

    townForStreet(street) {
        const town = this.__streetToTownMap.get(street);
        if (town === undefined) {
            throw new Error(`undeclared street in: ${this.path()}: street: ${street}`);
        }
        if (town === null) {
            throw new Error(`ambiguous town for street in: ${this.path()}: street: ${street}`);
        }
        return town;
    }
    
    checkStreetAndTown(street, town) {
        if (!this.__townToStreetsMap.has(town)) {
            throw new Error(`undeclared town in: ${this.path()}: street: ${street}: town: ${town}`);
        }
        const streets = this.__townToStreetsMap.get(town);
        if (streets === undefined || !streets.has(street)) {
            throw new Error(`undeclared street/town in: ${this.path()}: street: ${street}: town: ${town}`);
        }
        return this.__streetToTownMap.get(street) === town;
    }

    _declareStreetPartNumber(streetPartNumber) {
        const addressLine = streetPartNumber.addressLine;
        if (this.__addressLineToStreetPartNumberMap.has(addressLine)) {
            const existingStreetPartNumber = this.__addressLineToStreetPartNumberMap.get(addressLine);
            throw new Error(`duplicate address in tour: ${addressLine}: first path: ${streetPartNumber.path()}: second path: ${existingStreetPartNumber.path()}`);
        }
        this.__addressLineToStreetPartNumberMap.set(addressLine, streetPartNumber);
    }

    allLegs() {
        return this.__legs.values();
    }

    servedSegments() {
        return this.__servedSegments.values();
    }

    streetPartNumberForAddressLine(addressLine) {
        return this.__addressLineToStreetPartNumberMap.get(addressLine);
    }

    allBatchCutAddressLines() {
        return this.__batchCutAddressLines.values();
    }
}

export class Leg {

    get tour() {
        return this.__tour;
    }

    get index() {
        return this.__index;
    }

    get desc() {
        return this.__desc;
    }
    
    path() {
        return this.tour.path() + `: ${this.desc}`;
    }
    
    constructor(tour, legDef, index) {
        this.__tour = tour;
        this.__index = index;
        const {
            desc,
            parts,
        } = legDef;
        this.__desc = desc;
        this.__streetParts = parts.map((partDef, index) => this.__parsePart(partDef, index));
    }

    __parsePart(partDef, index) {
        return new StreetPart(this, partDef, index);
    }

    _declareStreetPartNumber(streetPartNumber) {
        this.tour._declareStreetPartNumber(streetPartNumber);
    }
    
    allStreetParts() {
        return this.__streetParts.values();
    }
}

export class StreetPart {

    get leg() {
        return this.__leg;
    }

    get index() {
        return this.__index;
    }

    get street() {
        return this.__street;
    }

    get town() {
        return this.__town;
    }

    get townIsNecessary() {
        return this.__townIsNecessary;
    }

    path() {
        return this.leg.path() + `: part#${this.index}`;
    }
    
    constructor(leg, partDef, index) {
        this.__leg = leg;
        this.__index = index;
        const street = partDef.street;
        if (street === undefined) {
            throw new Error(`missing street in: ${leg.path()}: ${partDef}`);
        }
        let town = partDef.town;
        if (town === undefined) {
            town = leg.tour.townForStreet(street);
            this.__townIsNecessary = false;
        } else {
            this.__townIsNecessary = leg.tour.checkStreetAndTown(street, town);
        }
        this.__street = street;
        this.__town = town;
        const numbers = partDef.numbers;
        if (numbers === undefined) {
            throw new Error(`missing numbers in: ${leg.path()}: ${partDef}`);
        }

        this.__streetPartNumbers = [];
        
        const numberOrRanges = numbers.split(",");
        for (const numberOrRange of numberOrRanges) {
            this.__handleStreetNumberOrRange(numberOrRange);
        }
    }

    __handleStreetNumberOrRange(numberOrRangeStr) {
        const rangeParts = numberOrRangeStr.split("...");
        if (rangeParts.length > 1) {
            if (rangeParts.length > 2) {
                throw new Error(`malformed number range in: ${this.path()}: ${numberOrRangeStr}`);
            }
            const from = parsePurelyDecimalStreetNumber(rangeParts[0]);
            const to = parsePurelyDecimalStreetNumber(rangeParts[1]);
            if (from > to) {
                for (let i = from; i >= to; i -= 1) {
                    this.__handleStreetNumber(`${i}`);  
                }
            } else if (from < to) {
                for (let i = from; i >= to; i += 1) {
                    this.__handleStreetNumber(`${i}`);
                }
            } else if (from === to) {
                this.__handleStreetNumber(`${from}`);
            } else {
                throw new Error(`malformed number range in: ${this.path()}: ${numberOrRangeStr}`);
            }
            return;
        }
        const evenOddRangeParts = numberOrRangeStr.split("..");
        if (evenOddRangeParts.length > 1) {
            if (evenOddRangeParts.length > 2) {
                throw new Error(`malformed even/odd number range in: ${this.path()}: ${numberOrRangeStr}`);
            }
            const from = parsePurelyDecimalStreetNumber(evenOddRangeParts[0]);
            const to = parsePurelyDecimalStreetNumber(evenOddRangeParts[1]);
            if (from % 2 === to % 2) {
                // both even or both odd
                if (from > to) {
                    for (let i = from; i >= to; i -= 2) {
                        this.__handleStreetNumber(`${i}`);  
                    }
                } else if (from < to) {
                    for (let i = from; i <= to; i += 2) {
                        this.__handleStreetNumber(`${i}`);
                    }
                } else if (from === to) {
                    this.__handleStreetNumber(`${from}`);
                } else {
                    throw new Error(`malformed number range in: ${this.path()}: ${numberOrRangeStr}`);
                }
            } else {
                throw new Error(`even/odd number range mixes even/odd endpoints: fix endpoints or use ... instead in: ${this.path()}: ${numberOrRange}`);
            }
            return;
        }
        this.__handleStreetNumber(numberOrRangeStr);
    }

    __handleStreetNumber(numberStr) {
        const streetPartNumber = new StreetPartNumber(this, numberStr, this.__streetPartNumbers.length); 
        this.__streetPartNumbers.push(streetPartNumber);
    }

    _declareStreetPartNumber(streetPartNumber) {
        this.leg._declareStreetPartNumber(streetPartNumber);
    }

    allStreetPartNumbers() {
        return this.__streetPartNumbers.values();
    }
}

export class StreetPartNumber {

    get streetPart() {
        return this.__streetPart;
    }

    get number() {
        return this.__number;
    }

    get index() {
        return this.__index;
    }

    get street() {
        return this.__street;   
    }

    get town() {
        return this.__town;
    }

    get townIsNecessary() {
        return this.__streetPart.townIsNecessary;
    }
    
    get addressLine() {
        return this.__addressLine;
    }
    
    path() {
        return this.streetPart.leg.path() + `: #${this.index}`;
    }
    
    constructor(streetPart, number, index) {
        this.__streetPart = streetPart;
        try {
            validateStemmedStreetNumber(number);
        } catch (err) {
            throw new Error(`malformed street number in: ${this.path()}: ${err.toString()}`);
        }
        this.__number = number;
        this.__index = index;

        const street = streetPart.street;
        this.__street = street;

        const town = streetPart.town;
        this.__town = town;
        
        const addressLine = `${street} ${number}, ${town}`;
        this.__addressLine = addressLine;

        streetPart._declareStreetPartNumber(this);
    }
    
}

export class TourDeForce {

    get name() {
        return this.__tour.name;
    }

    get date() {
        return this.__date;
    }

    get days() {
        return this.__days;
    }

    get dateDays() {
        return this.__dateDays;
    }
    
    get dayBits() {
        return this.__dayBits;
    }
    
    get tour() {
        return this.__tour;
    }

    get activeQuantity() {
        return this.__activeQuantity;
    }
    
    activeQuantities() {
        return this.__activeQuantityMap.entries();
    }
    
    constructor(tour, date, days) {

        this.__activeQuantityMap = new Map();
        this.__activeQuantity = 0;
        
        this.__tour = tour;
        this.__date = date;
        
        const day = date.getDay();
        
        let dateDays = "mdwdvzz";
        if (day === 0) {
            dateDays = "Mdwdvzz";
        } else if (day === 1) {
            dateDays = "mDwdvzz";
        } else if (day === 2) {
            dateDays = "mdWdvzz";
        } else if (day === 3) {
            dateDays = "mdwDvzz";
        } else if (day === 4) {
            dateDays = "mdwdVzz";
        } else if (day === 5) {
            dateDays = "mdwdvZz";
        } else if (day === 6) {
            dateDays = "mdwdvzZ";
        }

        if (days === undefined) {
            days = dateDays;
        }
        
        this.__days = days;
        this.__dateDays = dateDays;
        
        const dayBits = parseDayBits(days);
        this.__dayBits = dayBits;
        
        const addressLineToAddressMap = new Map();
        this.__addressLineToAddressMap = addressLineToAddressMap;

        for (const segment of tour.servedSegments()) {
            for (const address of segment.allAddresses()) {
                const addressLine = address.line;
                if (addressLineToAddressMap.has(addressLine)) {
                    const existingAddress = addressLineToAddressMap.get(addressLine);
                    const existingSegment = existingAddress.segment;
                    throw new Error(`ambiguous address occuring in more than one segment: ${addressLine}: first segment: ${segment.name}: second segment: ${existingSegment.name}`);
                }
                addressLineToAddressMap.set(addressLine, address);
            }
        }

        const addressToStreetPartNumberMap = new Map();
        const streetPartNumberToAddressMap = new Map();
        const unassignedAddresses = [];

        for (const [addressLine, address] of addressLineToAddressMap.entries()) {
            const streetPartNumber = tour.streetPartNumberForAddressLine(addressLine);
            if (streetPartNumber === undefined) {
                unassignedAddresses.push(address);
            } else {
                addressToStreetPartNumberMap.set(address, streetPartNumber);
                streetPartNumberToAddressMap.set(streetPartNumber, address);
            }
        }
        
        this.__addressToStreetPartNumberMap = addressToStreetPartNumberMap;
        this.__streetPartNumberToAddressMap = streetPartNumberToAddressMap;
        this.__unassignedAddresses = unassignedAddresses;

        const legsDeForce = [];
        for (const leg of tour.allLegs()) {
            const legDeForce = new LegDeForce(this, leg);
            legsDeForce.push(legDeForce);
        }

        this.__legsDeForce = legsDeForce;

        const batches = [];

        const numberDeForceList = [...this.allNumbersDeForce()];
        
        const combinedBatch = new BatchDeForce(this, 0, "<= combined =>", numberDeForceList);
        
        batches.push(combinedBatch);

        const batchCutAddressLines = [...tour.allBatchCutAddressLines()];

        if (batchCutAddressLines.length > 0) {
            if (numberDeForceList.length === 0) {
                throw new Error(`batch cut address does not occur in tour de force: ${batchCutAddressLines[0]}`);
            }
            const lastAddressLine = numberDeForceList[numberDeForceList.length-1].addressLine;
            if (batchCutAddressLines.length === 0
                || batchCutAddressLines[batchCutAddressLines.length-1] !== lastAddressLine) {
                batchCutAddressLines.push(lastAddressLine);
            }
            let startIndex = 0;
            let endIndex = 0;
            for (const batchCutAddressLine of batchCutAddressLines) {
                while (numberDeForceList[endIndex].addressLine !== batchCutAddressLine) {
                    endIndex++;
                    if (endIndex >= numberDeForceList.length) {
                        throw new Error(`batch cut address does not occur in tour de force or it occurs before one of the preceding batch cut addresses: ${batchCutAddressLine}`)
                    }
                }
                endIndex++;
                const batchNumberDeForceList = numberDeForceList.slice(startIndex, endIndex);
                const batchDeForce = new BatchDeForce(this, batches.length, `<= ${batchCutAddressLine}`, batchNumberDeForceList);
                const firstNumberDeForce = numberDeForceList[startIndex];
                firstNumberDeForce._firstInBatch = batchDeForce;
                batches.push(batchDeForce);
                startIndex = endIndex;
            }
        } else if (numberDeForceList.length > 0) {
            const firstNumberDeForce = numberDeForceList[0];
            firstNumberDeForce._firstInBatch = combinedBatch;
        }
        this.__batchesDeForce = batches;
    }

    unassignedAddresses() {
        return this.__unassignedAddresses.values();
    }

    get numberOfUnassignedAddresses() {
        return this.__unassignedAddresses.length;
    }

    addressForStreetPartNumber(streetPartNumber) {
        return this.__streetPartNumberToAddressMap.get(streetPartNumber);
    }

    allLegsDeForce() {
        return this.__legsDeForce.values();
    }

    _increaseActiveQuantity(code, additionalCount) {
        if (!this.__activeQuantityMap.has(code)) {
            this.__activeQuantityMap.set(code, 0);
        }
        const prevCount = this.__activeQuantityMap.get(code);
        const nextCount = prevCount + additionalCount;
        this.__activeQuantityMap.set(code, nextCount);
        this.__activeQuantity += additionalCount;
    }
    
    *allNumbersDeForce() {
        for (const legDeForce of this.allLegsDeForce()) {
            yield* legDeForce.allNumbersDeForce();
        }
    }

    allBatchesDeForce() {
        return this.__batchesDeForce.values();
    }
}

export class LegDeForce {

    get tourDeForce() {
        return this.__tourDeForce;
    }

    get leg() {
        return this.__leg;
    }

    get desc() {
        return this.__leg.desc;
    }
    
    get activeQuantity() {
        return this.__activeQuantity;
    }
    
    activeQuantities() {
        return this.__activeQuantityMap.entries();
    }
    
    constructor(tourDeForce, leg) {
        this.__activeQuantityMap = new Map();
        this.__activeQuantity = 0;
        
        this.__tourDeForce = tourDeForce;
        this.__leg = leg;

        const partsDeForce = [];
        for (const streetPart of leg.allStreetParts()) {
            const partDeForce = new PartDeForce(this, streetPart);
            partsDeForce.push(partDeForce);
        }
        this.__partsDeForce = partsDeForce;
    }

    allPartsDeForce() {
        return this.__partsDeForce.values();
    }

    *allNumbersDeForce() {
        for (const partDeForce of this.allPartsDeForce()) {
            yield* partDeForce.allNumbersDeForce();
        }
    }
    
    _increaseActiveQuantity(code, additionalCount) {
        if (!this.__activeQuantityMap.has(code)) {
            this.__activeQuantityMap.set(code, 0);
        }
        const prevCount = this.__activeQuantityMap.get(code);
        const nextCount = prevCount + additionalCount;
        this.__activeQuantityMap.set(code, nextCount);
        this.__activeQuantity += additionalCount;
        this.__tourDeForce._increaseActiveQuantity(code, additionalCount);
    }
}

export class PartDeForce {

    get legDeForce() {
        return this.__legDeForce;
    }

    get streetPart() {
        return this.__streetPart;
    }

    get street() {
        return this.__streetPart.street;
    }

    get town() {
        return this.__streetPart.town;
    }

    get townIsNecessary() {
        return this.__streetPart.townIsNecessary;
    }

    get numberOfAddresses() {
        return this.__numbersDeForce.length;
    }

    get activeQuantity() {
        return this.__activeQuantity;
    }
    
    activeQuantities() {
        return this.__activeQuantityMap.entries();
    }
    
    constructor(legDeForce, streetPart) {
        this.__activeQuantityMap = new Map();
        this.__activeQuantity = 0;
        
        this.__legDeForce = legDeForce;
        this.__streetPart = streetPart;

        const numbersDeForce = [];
        const tourDeForce = legDeForce.tourDeForce;
        for (const streetPartNumber of streetPart.allStreetPartNumbers()) {
            const address = tourDeForce.addressForStreetPartNumber(streetPartNumber);
            if (address === undefined) {
                continue;
            }
            const numberDeForce = new NumberDeForce(this, streetPartNumber, address);
            numbersDeForce.push(numberDeForce);
        }
        this.__numbersDeForce = numbersDeForce;
    }

    allNumbersDeForce() {
        return this.__numbersDeForce.values();
    }
    
    _increaseActiveQuantity(code, additionalCount) {
        if (!this.__activeQuantityMap.has(code)) {
            this.__activeQuantityMap.set(code, 0);
        }
        const prevCount = this.__activeQuantityMap.get(code);
        const nextCount = prevCount + additionalCount;
        this.__activeQuantityMap.set(code, nextCount);
        this.__activeQuantity += additionalCount;
        this.__legDeForce._increaseActiveQuantity(code, additionalCount);
    }
}

export class NumberDeForce {

    get partDeForce() {
        return this.__partDeForce;
    }

    get streetPartNumber() {
        return this.__streetPartNumber;
    }

    get address() {
        return this.__address;
    }

    get street() {
        return this.__streetPartNumber.street;
    }
 
    get number() {
        return this.__streetPartNumber.number;
    }
    
    get town() {
        return this.__streetPartNumber.town;
    }
    
    get townIsNecessary() {
        return this.__streetPartNumber.townIsNecessary;
    }
    
    get addressLine() {
        return this.__streetPartNumber.addressLine;
    }
    
    get needsPreparation() {
        return this.__address.needsPreparation;
    }
    
    get needsDelivery() {
        return this.__address.needsDelivery;
    }
    
    get needsPickup() {
        return this.__address.needsPickup;
    }

    get activeQuantity() {
        return this.__activeQuantity;
    }
    
    activeQuantities() {
        return this.__activeQuantityMap.entries();
    }

    get firstInBatch() {
        return this._firstInBatch;
    }
    
    constructor(partDeForce, streetPartNumber, address) {
        this.__activeQuantityMap = new Map();
        this.__activeQuantities = 0;
        
        this.__partDeForce = partDeForce;
        this.__streetPartNumber = streetPartNumber;
        this.__address = address;

        const itemMap = new Map();
        for (const item of address.allItems()) {
            const code = item.code;
            if (!itemMap.has(code)) {
                itemMap.set(code, []);
            }
            itemMap.get(code).push(item);
        }

        const itemDeForceMap = new Map();
        for (const [code, itemList] of itemMap.entries()) {
            const itemDeForce = new ItemDeForce(this, itemList);
            itemDeForceMap.set(code, itemDeForce);
        }

        this.__itemDeForceMap = itemDeForceMap;

        const itemDeForceList = [...itemDeForceMap.values()];
        if (itemDeForceList.length > 1) {
            itemDeForceList.sort((a, b) => a.info.order - b.info.order);
        }
        
        this.__itemDeForceList = itemDeForceList;

        const activeItemDeForceList = [];
        const passiveItemDeForceList = [];
        for (const itemDeForce of itemDeForceList) {
            if (itemDeForce.activeQuantity <= 0) {
                passiveItemDeForceList.push(itemDeForce);
            } else {
                activeItemDeForceList.push(itemDeForce);
            }
        }

        this.__passiveItemDeForceList = passiveItemDeForceList;
        this.__activeItemDeForceList = activeItemDeForceList;

        this._firstInBatch = null;
    }
    
    allItemsDeForce() {
        return this.__itemDeForceList.values();
    }
  
    passiveItemsDeForce() {
        return this.__passiveItemDeForceList.values();
    }
    
    activeItemsDeForce() {
        return this.__activeItemDeForceList.values();
    }

    _increaseActiveQuantity(code, additionalCount) {
        if (!this.__activeQuantityMap.has(code)) {
            this.__activeQuantityMap.set(code, 0);
        }
        const prevCount = this.__activeQuantityMap.get(code);
        const nextCount = prevCount + additionalCount;
        this.__activeQuantityMap.set(code, nextCount);
        this.__activeQuantity += additionalCount;
        this.__partDeForce._increaseActiveQuantity(code, additionalCount);
    }
}

export class ItemDeForce {

    get numberDeForce() {
        return this.__numberDeForce;
    }

    allItems() {
        return this.__itemList.values();
    }

    activeItems() {
        return this.__activeItemList.values();
    }

    passiveItems() {
        return this.__passiveItemList.values();
    }

    get code() {
        return this.__code;
    }
    
    get officialCode() {
        return this.__officialCode;
    }

    get info() {
        return this.__info;
    }
    
    get activeRemarks() {
        return this.__activeRemarks.values();
    }
    
    get passiveRemarks() {
        return this.__passiveRemarks.values();
    }

    get activeQuantity() {
        return this.__activeQuantity;
    }
    
    get passiveQuantity() {
        return this.__passiveQuantity;
    }

    get unfilteredRemarks() {
        return this.__unfilteredRemarks.values();
    }

    get unfilteredQuantity() {
        return this.__unfilteredQuantity;
    }

    get days() {
        return this.__days;
    }

    get dayBits() {
        return this.__dayBits;
    }

    get needsPreparation() {
        return this.__needsPreparation;
    }
    
    get needsDelivery() {
        return this.__needsDelivery;
    }
    
    get needsPickup() {
        return this.__needsPickup;
    }
    
    constructor(numberDeForce, itemList) {
        this.__numberDeForce = numberDeForce;

        if (itemList.length > 1) {
            itemList.sort((a, b) => a.order - b.order);
        }
        
        this.__itemList = itemList;
        
        const firstItem = itemList[0];

        this.__code = firstItem.code;
        this.__info = firstItem.info;
        
        const tourDeForce = numberDeForce.partDeForce.legDeForce.tourDeForce;
        const tourDayBits = tourDeForce.dayBits;

        const unfilteredRemarks = [];
        let unfilteredQuantity = 0;
        let dayBits = 0;
        let needsPreparation = false;
        let needsDelivery = false;
        let needsPickup = false;

        for (const item of itemList) {
            const remark = item.remark;
            if (remark !== null) {
                unfilteredRemarks.push(remark);
            } 
            unfilteredQuantity += item.quantity;
            dayBits |= item.dayBits;
            needsPreparation = needsPreparation || item.needsPreparation;
            needsDelivery = needsDelivery || item.needsDelivery;
            needsPickup = needsPickup || item.needsPickup;
        }

        this.__dayBits = dayBits;
        this.__days = (dayBits === allweekBits ? null : unparseDayBits(dayBits));
        this.__needsPreparation = needsPreparation;
        this.__needsDelivery = needsDelivery;
        this.__needsPickup = needsPickup;
        
        this.__unfilteredRemarks = unfilteredRemarks;
        this.__unfilteredQuantity = unfilteredQuantity;
        
        const activeItemList = [];
        const passiveItemList = [];
        
        for (const item of itemList) {
            if ((item.dayBits & tourDayBits) === 0) {
                passiveItemList.push(item);
            } else {
                activeItemList.push(item);
            }
        }

        this.__passiveItemList = passiveItemList;
        this.__activeItemList = activeItemList;
        
        const activeRemarks = [];
        let activeQuantity = 0;

        for (const activeItem of activeItemList) {
            const activeRemark = activeItem.remark;
            if (activeRemark !== null) {
                activeRemarks.push(activeRemark);
            } 
            activeQuantity += activeItem.quantity;
        }

        this.__activeRemarks = activeRemarks;
        this.__activeQuantity = activeQuantity;

        const passiveRemarks = [];
        let passiveQuantity = 0;

        for (const passiveItem of passiveItemList) {
            const passiveRemark = passiveItem.remark;
            if (passiveRemark !== null) {
                passiveRemarks.push(passiveRemark);
            } 
            passiveQuantity += passiveItem.quantity;
        }

        this.__passiveRemarks = passiveRemarks;
        this.__passiveQuantity = passiveQuantity;

        this.__numberDeForce._increaseActiveQuantity(this.__code, activeQuantity);
    }
}

export class BatchDeForce {

    get tourDeForce() {
        return this.__tourDeForce;
    }

    get index() {
        return this.__index;
    }
    
    get title() {
        return this.__title;
    }

    get activeQuantity() {
        return this.__activeQuantity;
    }
    
    allNumbersDeForce() {
        return this.__numberDeForceList.values();
    }

    preparationNumbersDeForce() {
        return this.__preparationNumbers.values();
    }
    
    constructor(tourDeForce, index, title, numberDeForceList) {
        this.__tourDeForce = tourDeForce;
        this.__index = index;
        this.__title = title;
        this.__numberDeForceList = numberDeForceList;
        
        const activeQuantityMap = new Map();
        let activeQuantity = 0;
        const preparationNumbers = [];
        
        for (const numberDeForce of numberDeForceList) {
            if (numberDeForce.needsPreparation) {
                preparationNumbers.push(numberDeForce);
            }
            for (const itemDeForce of numberDeForce.activeItemsDeForce()) {
                const info = itemDeForce.info;
                if (info.officialCode === null) {
                    continue;
                }
                const code = info.code;
                const activeQuantity = itemDeForce.activeQuantity;
                if (!activeQuantityMap.has(code)) {
                    activeQuantityMap.set(code, 0);
                }
                activeQuantityMap.set(code, activeQuantityMap.get(code) + activeQuantity);
                this.__activeQuantity += activeQuantity;
            }
        }

        this.__activeQuantityMap = activeQuantityMap;
        this.__activeQuantity = activeQuantity;
        this.__preparationNumbers = preparationNumbers;
    }

    *activeQuantities(includeZeroes) {
        if (includeZeroes === undefined) {
            includeZeroes = false;
        }
        const itemInfos = this.__tourDeForce.tour.tours.segments.itemInfos;
        const activeQuantityMap = this.__activeQuantityMap;
        for (const itemInfo of itemInfos.all()) {
            const key = itemInfo.code;
            const value = activeQuantityMap.get(key);
            if (value === undefined) {
                if (includeZeroes) {
                    yield [key, 0];
                }
            } else {
                yield [key, value];
            }
        }
    }
}