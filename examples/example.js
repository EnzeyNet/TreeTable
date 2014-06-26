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
				parentId: 1,
				childId: 2,
			},
			{
				parentId: 1,
				childId: 3,
			},
			{
				parentId: 1,
				childId: 9,
			},
			{
				parentId: 2,
				childId: 4,
			},
			{
				parentId: 3,
				childId: 4,
			},
			{
				parentId: 3,
				childId: 7,
			},
			{
				parentId: 4,
				childId: 5,
			},
			{
				parentId: 4,
				childId: 6,
			},
			{
				parentId: 8,
				childId: 3,
			},
			{
				parentId: 7,
			},
		];
	});

})(angular);
