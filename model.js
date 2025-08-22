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

    get _itemInfos() {
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
    
}

export class Segment {

    constructor(parent, segmentDef) {
        const {
            officialSegment,
            segment,
            streets,
        } = segmentDef;
        this.__parent = parent;
        this.__officialName = officialSegment;
        this.__name = segment;
        this.__addressMap = new Map();
        parent._declareSegment(officialSegment, segment, this);
        for (const street of streets) {
            this.__parseStreet(streetDef);
        }
    }

    __parseStreet(streetDef) {
        const itemInfos = this.__parent._itemInfos;
        const {
            street,
            town,
            numbers
        } = streetDef;
        for (const numberDef of numbers) {
            const numberParts = numberDef.split("|").map((part) => part.strip());
            console.log(numberParts);
        }
    }
}

export class Address {

    constructor(segment, street, number, town) {
        this.__segment = segment;
        this.__street = street;
        this.__number = number;
        this.__town = town;
        this.__itemMap = new Map();
    }
    
}

export class Item {

    constructor(address, info, qty, days, remark) {
        this.__address = address;
        this.__info = info;
        this.__qty = qty;
        this.__days = days;
        this.__remark = remark;
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

