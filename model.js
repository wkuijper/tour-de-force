const streetNumberRegExp = new RegExp("^([1-9][0-9]*)( [A-Za-z])?$");

export function stemStreetNumber(streetNumber) {
    const match = streetNumberRegExp.exec(streetNumber);
    if (match === null) {
        throw new Error(`can't stem this street number: ${streetNumber}`)
    }
    const numericPart = match[1];
    const optionalLetterSuffix = match[2] ?? "";
    const trimmedUpperCasedSuffix = optionalLetterSuffix.trim().toUpperCase();
    const stemmed = numericPart + trimmedUpperCasedSuffix;
    return stemmed;
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

export class ItemInfos {

    _declareItemInfo(officialCode, name, itemInfo) {
        if (this.__officialCodeMap.has(officialCode)) {
            throw new Error(`duplicate offical item code: ${officialCode}`);
        }
        this.__officialCodeMap.set(officialCode, itemInfo);
        if (this.__nameMap.has(name)) {
            throw new Error(`duplicate item name: ${name}`);
        }
        this.__nameMap.set(name, itemInfo);
    }
    
    constructor(itemDefs) {
        this.__officialCodeMap = new Map();
        this.__nameMap = new Map();
        for (const itemDef of itemDefs) {
            const itemInfo = new ItemInfo(this, itemDef);
        }  
    }

    all() {
        return this.__officialCodeMap.values();
    }

    forOfficialCode(officialCode) {
        if (!this.__officialCodeMap.has(officialCode)) {
            throw new Error(`unknown official item code: ${officialCode}`);
        }
        return this.__officialCodeMap.get(officialCode);
    }
    
    forName(name) {
        if (!this.__nameMap.has(name)) {
            throw new Error(`unknown item name: ${name}`);
        }
        return this.__nameMap.get(name);
    }
}

export class ItemInfo {

    get officialCode() {
        return this.__officialCode;
    }

    get name() {
        return this.__name;
    }
    
    constructor(parent, itemDef) {
        this.__parent = parent;
        const {
            officialCode,
            name,
        } = itemDef;
        this.__officialCode = officialCode;
        this.__name = name;
        parent._declareItemInfo(officialCode, name, this);
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
        this.__addressMap = new Map();
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
            const officialCodePart = numberParts.length > 1 ? numberParts[1] : null;
            const remarkPart = numberParts.length > 2 ? numberParts[2] : null;
            const daysPart = numberParts.length > 3 ? numberParts[3] : null;
            const qtyPart = numberParts.length > 4 ? numberParts[4] : null;
            const address = this.__getOrDeclareAddress(street, numberPart, town);
            address.addItem(officialCodePart, remarkPart, daysPart, qtyPart);
        }
    }

    allAddresses() {
        return this.__addressMap.values();
    }

    __getOrDeclareAddress(street, unstemmedNumber, unstemmedTown) {
        const number = stemStreetNumber(unstemmedNumber);
        const town = stemTownName(unstemmedTown);
        const addressLine = `${street} ${number}, ${town}`;
        if (!this.__addressMap.has(addressLine)) {
            const address = new Address(this, addressLine, street, number, town);
            this.__addressMap.set(addressLine, address);
        }
        return this.__addressMap.get(addressLine);
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
    
    constructor(segment, line, street, number, town) {
        this.__segment = segment;
        this.__line = line;
        this.__street = street;
        this.__number = number;
        this.__town = town;
        this.__itemMap = new Map();
    }

    addItem(officialCode, remark, days, qty) {
        const item = new Item(this, officialCode, remark, days, qty);
    }

    _declareItem(item) {
        if (this.__itemMap.has(item.officialCode)) {
            throw new Error(`duplicate item for address: ${this.line}: ${item.officialCode}`);
        }
        this.__itemMap.set(item.officialCode, item);
    }

    allItems() {
        return this.__itemMap.values();
    }
}

export class Item {

    get officialCode() {
        return this.__officialCode;
    }

    get info() {
        return this.__info;
    }
    
    get remark() {
        return this.__remark ?? "";
    }
    
    get days() {
        return this.__days ?? "MDWDVZZ";
    }
    
    get qty() {
        return this.__qty ?? 1;
    }
    
    constructor(address, officialCode, remark, days, qty) {
        const itemInfos = address.segment.segments.itemInfos;
        const itemInfo = itemInfos.forOfficialCode(officialCode);
        this.__address = address;
        this.__officialCode = officialCode;
        this.__info = itemInfo;
        this.__remark = remark;
        this.__days = days;
        this.__qty = qty;
        address._declareItem(this);
    }
}

export class Tours {

    constructor(segments, tourDefs) {
        
    }
    
}

export class Tour {

    constructor(parent, tourDef) {
        
    }
    
}

export class DeForce {

    constructor(tour) {
        
    }
    
}

