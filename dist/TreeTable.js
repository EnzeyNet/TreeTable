(function (angular) {
	"use strict";

	var module = angular.module('net.enzey.treetable', []);

	var createSet = function() {
		var set = [];
		set.contains = function(obj) {
			if (this.indexOf(obj) === -1) {
				return false;
			}
			return true;
		};
		var origPush = set.push;
		set.push = function(obj) {
			if (!this.contains(obj)) {
				origPush.call(this, obj);
			}
		};
		set.remove = function(obj) {
			var indexOf = this.indexOf(obj);
			if (this.contains(obj)) {
				this.splice(indexOf, 1);
			}
		};

		return set;
	};

	var getRootNodes = function(parentNodes, childNodes) {
		var rootNodes = [];
		var allParentNodes = Object.keys(parentNodes);

		var i = allParentNodes.length;
		while (i--) {
			if (!childNodes[ allParentNodes[i] ]) {
				rootNodes.push( parentNodes[allParentNodes[i]] );
			}
		}

		return rootNodes;
	};

	module.directive('nzTreetable', function ($parse, $sce, $timeout, $filter) {
		return {
			scope: true,
			compile: function($element, attrs){
				$element.find('tr').attr('ng-repeat', 'row in treeTableObjDisplayArray | limitTo: 300');
				var attrPath = {
					parentNodeId: 'parentId',
					childNodeId: 'childId',
					nodeId: 'id'
				};

				return {
					pre :function (scope, element, attrs) {
						var uniqueSpacer = "\u0099";
						scope.treeTableObjDisplayArray = [];
						var orderBy = '';
						var getChildrenFn = $parse(attrs.getChildrenFn)(scope);

						if (angular.isDefined(attrs.parentNodeId)) {
							attrPath.parentNodeId = $parse(attrs.parentNodeId)(scope);
						}
						var parseParentNodeId = $parse(attrPath.parentNodeId);

						if (angular.isDefined(attrs.childNodeId)) {
							attrPath.childNodeId = $parse(attrs.childNodeId)(scope);
						}
						var parseChildNodeId = $parse(attrPath.childNodeId);

						if (angular.isDefined(attrs.nodeId)) {
							attrPath.nodeId = $parse(attrs.nodeId)(scope);
						}
						var parseNodeId = $parse(attrPath.nodeId);

						if (angular.isDefined(attrs.orderBy)) {
							attrs.$observe('orderBy', function(newVal, oldVal) {
								orderBy = newVal;
								scope.buildTreeTable();
							});
						}

						var links;
						var nodes;
						$parse(attrs.getInitial)(scope)().then(function(data) {
							links = data.links;
							nodes = data.nodes;
							scope.buildTreeTable();
						});

						var collapsedRowIds = createSet();

						scope.collapseRow = function(row) {
							// Force update of current row
							prevTree[row.id] = angular.extend({}, prevTree[row.id]);
							if (!collapsedRowIds.contains(row.id)) {
								collapsedRowIds.push(row.id);
								scope.buildTreeTable();
							}
						};

						var findRowsForNode = function(node) {
							var nodeId = parseNodeId(node);
							var rowIds = [];
							var keys = Object.keys(prevTree);

							var i = keys.length;
							while (i--) {
								var key = keys[i];
								if (parseNodeId(prevTree[key].node) === nodeId) {
									rowIds.push(key);
								}
							}

							return rowIds;
						}

						scope.expandRow = function(row) {
							if (!row.isLoading) {
								// Force update of current row
								prevTree[row.id] = angular.extend({}, prevTree[row.id]);
								if (row.hasChildren && !collapsedRowIds.contains(row.id)) {
									row.isLoading = true;
									var rowIdsOfSameNode = findRowsForNode(row.node);
									var i = rowIdsOfSameNode.length;
									while (i--) {
										var rowId = rowIdsOfSameNode[i];
										prevTree[rowId] = angular.extend({}, prevTree[rowId]);
										prevTree[rowId].isLoading = true;
										if (prevTree[rowId].id !== row.id) {
											collapsedRowIds.push(prevTree[rowId].id);
										}
									}

									getChildrenFn(row.node).then(function(returnedObjs) {
										if (returnedObjs) {
											// Merge results with existing objects
											links.push.apply(links, returnedObjs.links);
											nodes.push.apply(nodes, returnedObjs.nodes);

											var i = rowIdsOfSameNode.length;
											while (i--) {
												var rowId = rowIdsOfSameNode[i];
												prevTree[rowId] = angular.extend({}, prevTree[rowId]);
												prevTree[rowId].isLoading = false;
												if (prevTree[rowId].id !== row.id) {
													collapsedRowIds.push(prevTree[rowId].id);
												}
											};

											row.isLoading = false;
											collapsedRowIds.remove(row.id);
											scope.buildTreeTable();
										}
									});
								} else {
									collapsedRowIds.remove(row.id);
								}

								scope.buildTreeTable();
							}
						};

						var prevTree = {};
						scope.buildTreeTable = function() {
							if (!nodes || !links) {return;}

							var startTime = new Date();
							scope.treeTableObjDisplayArray.length = 0;
							var nodesMap = {};

							var iNodes = nodes.length;
							while (iNodes--) {
								var node = nodes[iNodes];
								nodesMap[ parseNodeId(node) ] = node;
							}

							var linksByParent = {};
							var linksByChild = {};

							var iLinks = links.length;
							while (iLinks--) {
								var link = links[iLinks];
								var parentId = parseParentNodeId(link);
								if (nodesMap[parentId]) {
									if (!linksByParent[parentId]) {
										linksByParent[parentId] = [];
									}
									linksByParent[parentId].push(link);
								}
								var childId = parseChildNodeId(link);
								if (nodesMap[childId]) {
									if (!linksByChild[childId]) {
										linksByChild[childId] = [];
									}
									linksByChild[childId].push(link);
								}
							}

							var resolveChildren;
							resolveChildren = function(row) {
								var nodeId = parseNodeId(row.node);
								if (row.id) {
									row.id += uniqueSpacer + nodeId + uniqueSpacer + row.link.id;
								} else {
									row.id = nodeId + uniqueSpacer + 'root';
								}
								if (prevTree[row.id]) {
									prevTree[row.id].children = null;
									row.isLoading = prevTree[row.id].isLoading;
									row = angular.extend(prevTree[row.id], row);
								}
								if (collapsedRowIds.contains(row.id)) {
									row.hasChildren = true;
									row.isExpanded = false;
								} else {
									var childLinks = linksByParent[ nodeId ];
									if (childLinks) {
										row.children = [];

										var iChildLinks = childLinks.length;
										while (iChildLinks--) {
											var link = childLinks[iChildLinks];
											var childNode = nodesMap[ parseChildNodeId(link) ];
											if (childNode) {
												row.children.push(resolveChildren(
													{
														node: childNode,
														link: link,
														level: row.level + 1,
														id: row.id,
														parent: row
													}
												));
											}
										}
									}
									if (row.children) {
										row.hasChildren = true;
										if (row.children.length > 0) {
											row.isExpanded = true;
										}
									}
								}

								return row;
							};

							// Find root Nodes
							var rootNodes = getRootNodes(nodesMap, linksByChild);

							var treeStructure = [];

							var iRootNodes = rootNodes.length;
							while (iRootNodes--) {
								var node = rootNodes[iRootNodes];
								treeStructure.push( resolveChildren( {node: node, link: null, level: 0} ) );
							}

							var filterOrderBy = $filter('orderBy');
							var predReverse = false;
							var flattenTree;
							flattenTree = function(row) {
								prevTree[row.id] = row;
								scope.treeTableObjDisplayArray.push(row);
								if (row.children) {
									row.children = filterOrderBy(row.children, orderBy, predReverse);

									var iRowChildren = row.children.length;
									while (iRowChildren--) {
										var childRow = row.children[iRowChildren];
										flattenTree(childRow);
									}
								}
							};
							treeStructure = filterOrderBy(treeStructure, orderBy, predReverse);
							treeStructure.forEach(flattenTree);

							var endTime = new Date();
						};

					}
				};
			}
		}
	});

	module.directive('treetableIndent', function ($compile) {
		return {
			link: {
				post: function (scope, element, attrs) {
					var indentElem = angular.element('<div style="padding-left: ' + scope.row.level + 'em; padding-right: 1em; display: inline;"></div>');

					var iconElem = angular.element('<div style="display: inline; border-radius: 100%; font-weight: bold; font-size: 1em; cursor: pointer"></div>');
					if (scope.row.hasChildren) {
						if (scope.row.isLoading) {
							iconElem.text('\u23F0');
						} else if (scope.row.isExpanded) {
							iconElem.text('\u02C5');
							iconElem.attr('ng-click', 'collapseRow(row)');
						} else {
							iconElem.text('\u02C3');
							iconElem.attr('ng-click', 'expandRow(row)');
						}
					} else {
						iconElem.text('\u02C5');
						iconElem.css('visibility', 'none');
						iconElem.css('opacity', '0');
					}
					indentElem.append(iconElem);

					element.prepend( $compile(indentElem)(scope) );
				}
			}
		}
	});

})(angular);
