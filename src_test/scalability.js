/*global describe,expect,it,beforeEach,inject,afterEach*/

describe('Tree Table Scalability Tests', function() {

    'use strict';

    var scope;
    var compile;
    var rootScope;

    beforeEach(module('net.enzey.treetable'));

	var idIndex = 0;
	var getNextId = function() {
		return idIndex++;
	};

	var generateTreeLevel;
	generateTreeLevel = function(count, moreLevels, parentId) {
		var links = [];
		for (var i=0; i < count; i++) {
			var link = {id: 'L' + getNextId(), childId: 'N' + getNextId(), parentId: parentId,};
			links.push(link);
			if (moreLevels > 0) {
				var nextLevel = generateTreeLevel(count, moreLevels - 1, link.childId);
				nextLevel.forEach(function(thisLink) {
					links.push(thisLink);
				});
			}
		}

		return links;
	};

	var genNodes = function(links) {
		var nodeIdToNode = {};
		links.forEach(function(link) {
			if (!nodeIdToNode[link.childId]) {
				nodeIdToNode[link.childId] = {id: link.childId};
			}
			if (link.parentId && !nodeIdToNode[link.parentId]) {
				nodeIdToNode[link.parentId] = {id: link.parentId};
			}
		});

		return Object.keys(nodeIdToNode).map(function(v) { return nodeIdToNode[v]; });
	};

	var depth = 7;
	var breath = 5;
	var links10to5 = generateTreeLevel(breath, depth);
	var testData = {
		links: links10to5,
		nodes: genNodes(links10to5),
	};

    beforeEach(inject(function($rootScope, $compile, $document) {
        scope = $rootScope.$new();
        compile = $compile;
        rootScope = $rootScope;

		var objCount = 0;
		for (var i = depth+1; i > 0; i--) {
			objCount += Math.pow(breath, i);
		}

		expect(testData.links.length).toBe(objCount);
		expect(testData.nodes.length).toBe(objCount);
    }));

    it('test', inject(function($q) {
		scope.getInitial = function() {
			var deferred = $q.defer();
			deferred.resolve(testData);
			return deferred.promise;
		}
		var startTime = new Date().getTime();
		var elem = compile('<div nz-treetable get-initial="getInitial"></div>')(scope);
		scope.$digest();
		var endTime = new Date().getTime();

        expect( endTime - startTime ).toBeLessThan(1000);

		var startTime2 = new Date().getTime();
		elem.scope().buildTreeTable();
		var endTime2 = new Date().getTime();

        expect( endTime2 - startTime2 ).toBeLessThan(1000);
    }));

});
