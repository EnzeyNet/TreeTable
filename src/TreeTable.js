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

	module.directive('nzTreetable', function ($parse, $sce, $timeout) {
		return {
			scope: true,
			compile: function(element, attrs){
				element.find('tr').attr('ng-repeat', 'row in treeTableObjDisplayArray');
				var attrPath = {
					parentNodeId: 'parentId',
					childNodeId: 'childId',
					nodeId: 'id'
				};

				return function (scope, element, attrs) {
					var uniqueSpacer = "\u000A\u0099\u000D";
					scope.treeTableObjDisplayArray = [];
					var getChildrenFn = $parse(attrs.getChildrenFn)(scope);
					if (angular.isDefined(attrs.parentNodeId)) {
						attrPath.parentNodeId = $parse(attrs.parentNodeId)(scope);
					}
					if (angular.isDefined(attrs.childNodeId)) {
						attrPath.childNodeId = $parse(attrs.childNodeId)(scope);
					}
					if (angular.isDefined(attrs.nodeId)) {
						attrPath.nodeId = $parse(attrs.nodeId)(scope);
					}

					var links = $parse(attrs.links)(scope);
					var nodes = $parse(attrs.nodes)(scope);

					var collapsedRowIds = createSet();

					scope.collapseRow = function(row) {
						// Force update of current row
						prevTree[row.id] = angular.extend({}, prevTree[row.id]);
						if (!collapsedRowIds.contains(row.id)) {
							collapsedRowIds.push(row.id);
							buildTreeTable();
						}
					};

					scope.expandRow = function(row) {
						if (!row.isLoading) {
							// Force update of current row
							prevTree[row.id] = angular.extend({}, prevTree[row.id]);
							if (row.hasChildren && !collapsedRowIds.contains(row.id)) {
								row.isLoading = true;
								getChildrenFn(row.node).then(function(returnedObjs) {
									if (returnedObjs) {
										if ( angular.isArray(returnedObjs.links) ) {
											links.push.apply(links, returnedObjs.links);
										}
										if ( angular.isArray(returnedObjs.nodes) ) {
											nodes.push.apply(nodes, returnedObjs.nodes);
										}
										row.isLoading = false;
										collapsedRowIds.remove(row.id);
										buildTreeTable();
									}
								});
							} else {
								collapsedRowIds.remove(row.id);
								buildTreeTable();
							}
						}
					};

					var prevTree = {};
					var buildTreeTable = function() {
						var startTime = new Date();
						scope.treeTableObjDisplayArray.length = 0;
						var nodesMap = {};
						nodes.forEach(function(node) {
							nodesMap[ $parse(attrPath.nodeId)(node) ] = node;
						});

						var linksByParent = {};
						var linksByChild = {};

						links.forEach(function(link) {
							var parentId = $parse(attrPath.parentNodeId)(link);
							if (nodesMap[parentId]) {
								if (!linksByParent[parentId]) {
									linksByParent[parentId] = [];
								}
								linksByParent[parentId].push(link);
							}
							var childId = $parse(attrPath.childNodeId)(link);
							if (nodesMap[childId]) {
								if (!linksByChild[childId]) {
									linksByChild[childId] = [];
								}
								linksByChild[childId].push(link);
							}
						});

						// Find root Nodes
						var rootNodes = [];

						var allParentNodes = Object.keys(linksByParent);
						var allchildNodes = Object.keys(linksByChild);

						allParentNodes.forEach(function(nodeId) {
							var indexof = allchildNodes.indexOf(nodeId);
							if (indexof === -1) {
								rootNodes.push(nodesMap[nodeId]);
							}
						});

						var resolveChildren;
						resolveChildren = function(row) {
							var nodeId = $parse(attrPath.nodeId)(row.node);
							if (row.id) {
								row.id += uniqueSpacer + nodeId + uniqueSpacer + row.link.id;
							} else {
								row.id = nodeId + uniqueSpacer + 'root';
							}
							if (prevTree[row.id]) {
								prevTree[row.id].children = null;
								row = angular.extend(prevTree[row.id], row);
							}
							if (!collapsedRowIds.contains(row.id)) {
								var childLinks = linksByParent[ nodeId ];
								if (childLinks) {
									row.children = [];
									childLinks.forEach(function(link) {
										var childNode = nodesMap[ $parse(attrPath.childNodeId)(link) ];
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
									});
								}
								if (row.children) {
									row.hasChildren = true;
									if (row.children.length > 0) {
										row.isExpanded = true;
									}
								}
							} else {
								row.hasChildren = true;
								row.isExpanded = false;
								collapsedRowIds.push(row.id);
							}

							return row;
						};

						var treeStructure = [];
						rootNodes.forEach(function(node) {
							treeStructure.push( resolveChildren( {node: node, link: null, level: 0} ) );
						});

						var flattenTree;
						flattenTree = function(row) {
							prevTree[row.id] = row;
							scope.treeTableObjDisplayArray.push(row);
							if (row.children) {
								row.children.forEach(function(childRow) {
									flattenTree(childRow);
								});
							}
						};
						treeStructure.forEach(function(row) {
							flattenTree(row);
						});

						var endTime = new Date();
					};

					buildTreeTable();

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
						if (scope.row.isExpanded) {
							iconElem.text('\u02C5');
							iconElem.attr('ng-click', 'collapseRow(row)');
						} else {
							iconElem.text('\u02C3');
							iconElem.attr('ng-click', 'expandRow(row)');
						}
						/*
						iconElem.text('\u02C5');
						iconElem.attr('ng-click', 'collapseRow(row)');
						iconElem.attr('ng-show', 'row.isExpanded');
						indentElem.append(iconElem);

						iconElem = angular.element('<div style="display: inline; border-radius: 100%; font-weight: bold; font-size: 1em; cursor: pointer"></div>');
						iconElem.text('\u02C3');
						iconElem.attr('ng-click', 'expandRow(row)');
						iconElem.attr('ng-hide', 'row.isExpanded');
						*/
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
