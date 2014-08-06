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
| parent-node-id | The location within the 'link' object to its parent node's unique identifier. Default: 'parentId' |
| child-node-id | The location within the 'link' object to its child node's unique identifier. Default: 'childId' |
| order-by | A string or array to sort the objects by. Same syntax as the orderBy for ng-repeat. |
| expand-indicator-template | A template for the expand indicator that is displayed if a node has unexpanded children. |
| collapse-indicator-template | A template for the collapse indicator that is displayed if a node has expanded children. |
| loading-indicator-template | A template for the loading indicator that is displayed while the get-children-fn is being resolved. |

####Indicating a node has children
Any node that is referenced by a link's parent id will be rendered as if it has children, by displaying the expand / collapse icon. Passing a link that has no child id indicates that the node has childen that are not loaded and the _get-children-fn_ needs to be called for the node when the expander is clicked.


#####Example Directive Usage
```html
<table>
	<tbody nz-treetable
		get-initial="initialObjs" get-children-fn="doStuff"
		node-id="'myChildId'" parent-node-id="'myParentd'" child-node-id="'myId'"
		order-by="node.myValue">

		<tr>
			<td treetable-indent></div><span>{{row.node.name}}</span></td>
			<td><input ng-model="row.node.myValue"></input></td>
		</tr>
	</tbody>
</table>
```

get-initial definition example
```javascript
get-initial = function() {
	var deferred = $q.defer();
	deferred.resolve({
		nodes: nodesArray,
		links: linksArray
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
