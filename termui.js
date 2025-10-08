/** Term UI is a particular, simplified retro-term-style type of 
 * user interface based on the following assumptions:
 *
 *   - All UI is comprised of mono-spaced text embelished with
 *     color, colored backgrounds and colored borders.
 *   - All UI is comprised of lines which are, in turn comprised 
 *     of fields
 *   - Lines can grow indefinitely in horizontal direction
 *   - Fields are generally sized but can grow flexibly when their
 *     contents surpass their pre-set sizes
 *   - When fields grow past their horizontal size they push all 
 *     the following fields to the right, growing the line in 
 *     horizontal direction.
 *   - No vertical wrapping is provided.
 *   - Fast, flexible grouping, collapsing and expanding of lines 
 *     is provided.
 */

export class TUIDoc {
    
    get rootGroup() {
        return this.__rootGroup;
    }
    
    constructor(parentContainer, id) {
        const div = document.createElement("div");
        div.classList.add("tui-doc");
        div.id = id;
        parentContainer.appendChild(div);
        this.__div = div;
        const rootGroup = new TUIGroup(this, div);
        this.__rootGroup = rootGroup;
    }
    
}

export class TUIGroup {

    constructor(parent, parentContainer, id) {
        this.__parent = parent;
        this.__parentContainer = parentContainer;
        this.__id = id;
        const div = document.createElement("div");
        div.classList.add("tui-group");
        div.id = id;
        this.__headerLine = new TUILine(this, div);
        const subDiv = document.createElement("div");
        subDiv.classList.add("tui-group-sub");
        div.appendChild(subDiv);
        this.__subDiv = subDiv;
        this.__div = div;
        parentContainer.appendChild(div);
        this.__groupsAndLines = [];
    }

    addGroup(id) {
        const group = new TUIGroup(this, this.__subDiv, id);
        this.__groupsAndLines.push(group);
        return group;
    }

    addLine(id) {
        const line = new TUILine(this, this.__subDiv, id);
        this.__groupsAndLines.push(line);
        return line;
    }
    
}

export class TUILine {

    constructor(parent, parentContainer, id) {
        this.__parent = parent;
        this.__parentContainer = parentContainer;
        this.__id = id;
        const div = document.createElement("div");
        div.classList.add("tui-line");
        div.id = id;
        this.__div = div;
        parentContainer.appendChild(div);
        this.__fields = [];
    }

    addField(id, text, width, align) {
        if (text === undefined) {
            text = "";
        }
        if (width === undefined) {
            width = 0;
        }
        if (align === undefined) {
            align = "left";
        }
        const field = new TUIField(this, this.__div, id, text, width, align);
        this.__fields.push(field);
        return field;
    }
}

export class TUIField {

    __setText(text) {
        if (typeof text !== "string") {
            throw new Error(`unexpected value: text: ${text}`);
        }
        this.__text = text;
        const characters = [...text];
        this.__characters = characters;
        const numberOfCharacters = characters.length;
        for (let i = 0; i < numberOfCharacters; i++) {
            const character = characters[i];
            const charCode = character.charCodeAt(0);
            if (charCode < 32) {
                throw new Error(`unexpected non-printable character with ascii code: ${charCode}: at index: ${i}: in text: ${text}`);
            }
        }
    }

    setText(text) {
        if (text === this.__text) {
            return;
        }
        this.__setText(text);
        this.__update();
        return this;
    }
    
    get text() {
        return this.__text;
    }

    __setWidth(width) {
        if (width < 0 || !Number.isFinite(width)) {
            throw new Error(`unexpected value: width: ${width}`);
        }
        this.__width = width;
    }

    setWidth(width) {
        if (width === this.__width) {
            return;
        }
        this.__setWidth(width);
        this.__update();
        return this;
    }

    get width() {
        return this.__width;
    }

    __setAlign(align) {
        if (align !== "left" && align !== "right") {
            throw new Error(`unexpected value: align: ${align}`);
        }
        this.__align = align;
    }

    setAlign(align) {
        if (align === this.__align) {
            return;
        }
        this.__setAlign(align);
        this.__update();
        return this;
    }
    
    get align() {
        return this.__align;
    }

    __update() {
        const numberOfCharacters = this.__characters.length;
        let alignedText = "";
        switch(this.__align) {
            case "left":
                if (true) {
                    alignedText += this.__text;
                    const outdent = Math.max(0, this.__width - numberOfCharacters);
                    for (let i = 0; i < outdent; i++) {
                        alignedText += " ";                        
                    }
                }
                break;
            case "right":
                if (true) {
                    const indent = Math.max(0, this.__width - numberOfCharacters);
                    for (let i = 0; i < indent; i++) {
                        alignedText += " ";                        
                    }
                    alignedText += this.__text;
                }
                break;
            default:
                throw new Error(`invariant violation`);
        }
        this.__alignedText = alignedText;
        this.__pre.innerText = alignedText;
    }
    
    constructor(parent, parentContainer, id, text, width, align) {
        this.__parent = parent;
        this.__parentContainer = parentContainer;
        this.__id = id;
        const pre = document.createElement("pre");
        pre.classList.add("tui-field");
        pre.id = id;
        this.__pre = pre;
        parentContainer.appendChild(pre);
        this.__text = "";
        this.__align = "left";
        this.__width = 0;
        this.__characters = [];
        this.__alignedText = "";
        this.__setText(text);
        this.__setWidth(width);
        this.__setAlign(align);
        this.__update();
    }

    addField(id, text, width, align) {
        return this.__parent.addField(id, text, width, align);
    }
}

