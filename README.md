JSONAutoTree
===========

Automatically creates a branching network of inheriting nodes based off of JSON files that list parents.

This module was originally called NodeTree.js, as I think of each JSON file as a node in a connected tree.

Nodes are not related to node.js; rather they define points of interest on a heirarchical JSON tree. If a node is a child node, it will inherit any properties that are not defined specifically for the child, but are defined by the parent.

# Node Properties

With JSONAutoTree, a given folder is parsed for JSON files and a heirarchical tree is built from them based off of a minimal number of properties. All children inherit properties from their parents unless specifically overwritten. After the tree is built, information about a given node type can be called with a function, or the tree can be walked randomly.
        
Note that any parent property can be overwritten with the value "!none" to be a non-specified value on a child.

Other than the following properties, any other properties you assign to a node type will only be used for inheritance purposes.

## Required Properties

Thus far, nodes MUST have the following properties, which CANNOT be overwritten without seriously jeopardizing how it builds the tree:

* type - the identifying name of the node, which matches the .json file name

## Optional Properties

The following properties are optional, and are also reserved. If you use the following properties for your own functionality, they may jeopardize or change the functionality of the base module:

* parentType - the identifying name of the parent this node inherits from
* chance - the relative probability of a given node type being generated, relative to every other "chance" property by its "sibling" node types. Example: a school is 30, a house is 90. A house is three times more likely to occur than a school. If there is no chance property, a default of "10" is used.
