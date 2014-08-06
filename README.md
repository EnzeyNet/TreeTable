TreeTable
=========

Native AngularJS TreeTable

Angular Module: net.enzey.treetable

Directive Name: nzTreetable

Live Example: http://EnzeyNet.github.io/TreeTable

| directive params | description |
| -------- | ---------------- | ----------- |
| get-initial | A promise that return the initial set of nodes and links. |
| get-children-fn | A promise that is called to retrieve children that are not loaded yet. |
| node-id | The location within the 'node' object to its unique identifier. Default: 'id' |
| link-id | The location within the 'link' object to its unique identifier. Default: 'id' |
| parent-node-id | The location within the 'link' object to its parent node's unique identifier. Default: 'parentId' |
| child-node-id | The location within the 'link' object to its child node's unique identifier. Default: 'childId' |
| order-by | A string or array to sort the objects by. Same syntax as the orderBy for ng-repeat. |
| order-reverse | (boolean) If the table should be sorted in reverse order. Default: false |
| expand-indicator-template | A template for the expand indicator that is displayed if a node has unexpanded children. |
| collapse-indicator-template | A template for the collapse indicator that is displayed if a node has expanded children. |
| loading-indicator-template | A template for the loading indicator that is displayed while the get-children-fn is being resolved. |

To create the indented structure of the tree and expose the expand / collapse glyphs add the _treetable-indent_ directive to any TD element.

#### Data Model
To denote a node that has children that are not yet loaded return a link object that has a parent-node-id but no child-node-id: {parentPartId: 123}
When this node is expected the node object will be passed to _get-children-fn_.

The return from get-initial and get-children-fn should be an object with an array of the node under the 'nodes' key and an array of links under the 'links' key:
```javascript
{
	nodes: NODE_ARRAY,
	links: LINK_ARRAY,
}
```

The data model for each row contains the exact node and link objects as they were given to the directive and looks like:
```javascript
{
	row : {
		node: NODE_OBJ,
		link: LINK_OBJ
	}
}
```
To access data on the node object you would do {{row.node.ATTRIBUE}} and likewise for the link object {{row.node.ATTRIBUTE}}


#####Example Directive Usage
```html
<table>
	<tbody nz-treetable
		get-initial="initialObjs" get-children-fn="doStuff"
		node-id="'partId'" link-id="'linkId'" parent-node-id="'parentPartId'" child-node-id="'childPartId'"
		order-by="node.myValue">

		<tr>
			<td treetable-indent></div><span>{{row.node.name}}</span></td>
			<td>{{row.link.nodeAttribute1}}</td>
		</tr>
	</tbody>
</table>
```

get-initial definition example
```javascript
get-initial = function() {
	var deferred = $q.defer();
	deferred.resolve({
		nodes: [
			{
				name: 'Part 1',
				partId: 1,
				weight: '32',
				nodeAttribute1: 'moreInfo'
			},
			{
				name: 'Part 2',
				partId: 2,
				weight: '16',
				nodeAttribute1: 'moreInfo'
			},
			{
				name: 'Part 3',
				partId: 3,
				weight: '12',
				nodeAttribute1: 'moreInfo'
			},
			{
				name: 'Part 4',
				partId: 4,
				weight: '9',
				nodeAttribute1: 'moreInfo'
			}
		],
		links: [
			{
				linkId: 1,
				parentPartId: 1,
				childPartId: 2,
				linkAttribute1: 'moreInfo'
			},
			{
				linkId: 2,
				parentPartId: 1,
				childPartId: 3,
				linkAttribute1: 'moreInfo'
			},
			{
				linkId: 3,
				parentPartId: 2,
				childPartId: 4,
				linkAttribute1: 'moreInfo'
			},
			{
				linkId: 14,
				parentPartId: 3,
				childPartId: 4,
				linkAttribute1: 'moreInfo'
			}
		]
	});

	return deferred.promise;
};
```

get-children-fn definition example
```javascript
get-children-fn = function(node) {
	var deferred = $q.defer();
	deferred.resolve({
		nodes: nodesArray,
		links: linksArray
	});

	return deferred.promise;
};
```
