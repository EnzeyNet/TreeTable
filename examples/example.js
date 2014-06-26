(function (angular) {
	"use strict";

	var module = angular.module('net.enzey.example', ['net.enzey.treetable']);

	module.controller('treetableController', function ($scope, $q, $timeout, $sce) {

		$scope.doStuff = function(node) {
			var deferred = $q.defer();

			if (node.idy == 7) {
				deferred.resolve({
					nodes: [
						{
							idy: 13,
							name: 'node13',
							myValue: 'dfdfgh'
						}
					],
					links: [
						{
							parentId: 7,
							childId: 13,
						},
					]
				});
			} else {
				deferred.resolve();
			}
			return deferred.promise;
		};

		$scope.nodes = [
			{
				idy: 1,
				name: 'node1',
				myValue: 658
			},
			{
				idy: 2,
				name: 'node2',
				myValue: 890
			},
			{
				idy: 3,
				name: 'node3',
				myValue: 456
			},
			{
				idy: 4,
				name: 'node4',
				myValue: 7589
			},
			{
				idy: 5,
				name: 'node5',
				myValue: 486
			},
			{
				idy: 6,
				name: 'node6',
				myValue: 7896
			},
			{
				idy: 7,
				name: 'node7',
				myValue: 56
			},
			{
				idy: 8,
				name: 'node8',
				myValue: 7896
			},
			{
				idy: 9,
				name: 'node9',
				myValue: 234526
			}
		];

		$scope.links = [
			{
				id: 1,
				parentId: 1,
				childId: 2,
			},
			{
				id: 2,
				parentId: 1,
				childId: 3,
			},
			{
				id: 3,
				parentId: 1,
				childId: 9,
			},
			{
				id: 4,
				parentId: 2,
				childId: 4,
			},
			{
				id: 5,
				parentId: 3,
				childId: 4,
			},
			{
				id: 6,
				parentId: 3,
				childId: 4,
			},
			{
				id: 7,
				parentId: 3,
				childId: 4,
			},
			{
				id: 8,
				parentId: 3,
				childId: 4,
			},
			{
				id: 9,
				parentId: 3,
				childId: 4,
			},
			{
				id: 10,
				parentId: 3,
				childId: 4,
			},
			{
				id: 11,
				parentId: 3,
				childId: 4,
			},
			{
				id: 12,
				parentId: 3,
				childId: 4,
			},
			{
				id: 13,
				parentId: 3,
				childId: 4,
			},
			{
				id: 14,
				parentId: 3,
				childId: 4,
			},
			{
				id: 15,
				parentId: 3,
				childId: 4,
			},
			{
				id: 16,
				parentId: 3,
				childId: 4,
			},
			{
				id: 17,
				parentId: 3,
				childId: 7,
			},
			{
				id: 18,
				parentId: 4,
				childId: 5,
			},
			{
				id: 19,
				parentId: 4,
				childId: 6,
			},
			{
				id: 20,
				parentId: 4,
				childId: 6,
			},
			{
				id: 21,
				parentId: 4,
				childId: 6,
			},
			{
				id: 22,
				parentId: 4,
				childId: 6,
			},
			{
				id: 23,
				parentId: 4,
				childId: 6,
			},
			{
				id: 24,
				parentId: 4,
				childId: 6,
			},
			{
				id: 25,
				parentId: 4,
				childId: 6,
			},
			{
				id: 26,
				parentId: 4,
				childId: 6,
			},
			{
				id: 27,
				parentId: 4,
				childId: 6,
			},
			{
				id: 28,
				parentId: 4,
				childId: 6,
			},
			{
				id: 29,
				parentId: 4,
				childId: 6,
			},
			{
				id: 30,
				parentId: 4,
				childId: 6,
			},
			{
				id: 31,
				parentId: 4,
				childId: 6,
			},
			{
				id: 32,
				parentId: 4,
				childId: 6,
			},
			{
				id: 33,
				parentId: 4,
				childId: 6,
			},
			{
				id: 34,
				parentId: 4,
				childId: 6,
			},
			{
				id: 35,
				parentId: 4,
				childId: 6,
			},
			{
				id: 36,
				parentId: 4,
				childId: 6,
			},
			{
				id: 37,
				parentId: 8,
				childId: 3,
			},
			{
				id: 38,
				parentId: 7,
			},
		];
	});

})(angular);
