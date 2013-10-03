module.exports = function(location) {    //This module was originally called NodeTree.js, as I think of each JSON file    //as a node in a connected tree.    //Nodes are not related to nodejs; rather they define points of interest    //on a heirarchical JSON tree. If a node is a child node, it will    //inherit any properties that are not defined specifically for the child,    //but are defined by the parent.        //Thus far, nodes must have the following properties, along with any other    //user-defined properties:    //    Note that any parent property can be overwritten with the value "!none"    //    to be a non-specified value on a child.    //type - the identifying name of the node, which matches the .json file name    //parentType - the identifying name of the parent this node inherits from    //chance - the relative probability of a given node type being generated,    //    relative to every other "chance" property, and also only relative to    //    "sibling" node types. Example: a school is 30, a house is 90. A house    //    is three times more likely to occur than a school.    //    If there is no chance property, a default of "10" is used.    this.tree = {}; //We keep our complete, exclusive heirarchy here    this.branches = {}; //Which references our recursive, unsorted node types        var path = require('path');        var nodes_location = location;            this.buildBranch = function(node) {    //This function finds a node type, looks to see if it has a prototype,    //and calls the parents recursively to build a "branch"        var parsedNode = require(nodes_location + node);                var type = parsedNode.type;                console.log("Creating new branch '" + type + "'.");                if (parsedNode.hasOwnProperty("parentType")) {            //If the parent is undefined, we need to build that branch,            //from the top to the bottom. If that branch exists, we just glom on            //automatically            if (this.branches[parsedNode.parentType] == undefined) {                this.buildBranch(parsedNode.parentType + ".json");            }            //Now that we have the parent, inherit all of the properties that            //aren't overridden            for (property in this.branches[parsedNode.parentType]) {                if (property === "children"                    || this.branches[parsedNode.parentType][property] === '!none'                    ) continue;                if (!parsedNode.hasOwnProperty(property)) {                    parsedNode[property] = this.branches[parsedNode.parentType][property];                }            }            this.branches[type] = parsedNode;            if(!this.branches[parsedNode.parentType].hasOwnProperty("children")) {                this.branches[parsedNode.parentType].children = {};            }            //Then assign this branch to the hash for quick reference            this.branches[parsedNode.parentType].children[type] = this.branches[type];            console.log("Built branch '" + this.branches[type].type + "' with parent '" + this.branches[parsedNode.parentType].type + "'.");        } else {            //Since this node has no parent, it belongs in the root of the tree,            //which references the branch in the hash.            if (!parsedNode.hasOwnProperty('shape')) {                parsedNode.shape = 'random';            }            this.branches[type] = parsedNode;            this.tree[type] = this.branches[type];            console.log("Built trunk with '" + this.tree[type].type + "'.");        }    }    this.getNode = function(type) {    //This function finds a node type, looks it up, and returns it.        var parsedNode = this.branches[type];                return parsedNode;    }    this.walkTypes = function(branch) {    //This function walks through the given branch of the NodeTree, constructs    //an array consisting of children's chance property, randomly picks one,    //and runs itself on that branch. When it finds no children, it returns.        //It is suggested to always call this function by passing in the NodeTree    //object itself, as that was how it was built to work.            var currBranch = {};        var chanceArray = [];        var returnType = {};            //The "parent" branch treats its children, the basic branches, a bit        //differently than most branches do, so we have to start with a tiny        //bit of trickery.        if (this.tree == branch) { //On the first submission of walkType, the        //entire tree should be submitted.            currBranch.children = this.tree;        } else {            currBranch = branch;        }                 //Now we build an array with slots in it to correspond to the chance        //given to a nodeType.        if (currBranch.hasOwnProperty("children")) {            for (childBranch in currBranch.children) {                if (currBranch.children[childBranch].hasOwnProperty("chance")) {                    for (var i=0; i < currBranch.children[childBranch].chance; i++) {                        chanceArray.push(childBranch);                    }                } else {                    for (var i=0; i < 10; i++) {                        chanceArray.push(childBranch);                    }                }            }            //...and then we pick from that array, and walk if it is found.            if (chanceArray.length > 0) {                findType = chanceArray[Math.floor(Math.random()*(chanceArray.length))];                if (this.branches[findType]) {                    //We find a branch, so we walk it                    returnType = this.walkTypes(this.branches[findType]);                } else {                    console.log('returnType in walkTypes not found for ' + findType);                }            } else {                //No possible chance for nodeType children; basically an error                returnType = branch;            }        } else {            //No possible children for nodeType            findType = branch;        }        return findType;    }        return this;};