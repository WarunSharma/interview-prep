
/*
Composite Pattern: It is a structural design pattern that lets you compose objects into tree structures 
and then work with these structures as if they were individual objects.
*/

class File {
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }

    getSize() {
        return this.size;
    }
}

class Folder {
    constructor(name) {
        this.name = name;
        this.children = [];
    }

    add(child) {
        this.children.push(child);
    }

    getSize() {
        return this.children.reduce(
            (total, child) => total + child.getSize(),
            0
        );
    }
}

// Usage
const file1 = new File('file1.txt', 100);
const file2 = new File('file2.txt', 200);
const folder1 = new Folder('folder1');
folder1.add(file1);
folder1.add(file2);
console.log(folder1.getSize()); // Output: 300