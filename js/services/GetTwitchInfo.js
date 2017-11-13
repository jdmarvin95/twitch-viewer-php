app.factory('GetTwitchInfo', ['$http', function($http) {
	var streamerArr = []
	var streamList = []
	var onlineList = []
	var nameSort = false
	var onlineSort = false
	var gameSort = false

	function sortByName(arr) {
		var tempArr = arr
		if(!nameSort) {
			tempArr.sort(function(a, b) {
				if(a.name.toLowerCase() < b.name.toLowerCase()) return -1
				if(a.name.toLowerCase() > b.name.toLowerCase()) return 1
				return 0
			})
			nameSort = true
		} else {
			tempArr.sort(function(a, b) {
				if(a.name.toLowerCase() > b.name.toLowerCase()) return -1
				if(a.name.toLowerCase() < b.name.toLowerCase()) return 1
				return 0
			})
			nameSort = false
		}
		onlineSort = false
		gameSort = false
		return tempArr
	}

	function sortByOnline(arr) {
		var tempArr = arr
		if(!onlineSort) {
			tempArr.sort(function(a, b) {
				var o1 = a.status.toLowerCase()
				var o2 = b.status.toLowerCase()
				var n1 = a.name.toLowerCase()
				var n2 = b.name.toLowerCase()

				if(o1 > o2) return -1
				if(o1 < o2) return 1
				if(n1 < n2) return -1
				if(n1 > n2) return 1
				return 0
			})
			onlineSort = true
		} else {
			tempArr.sort(function(a, b) {
				var o1 = a.status.toLowerCase()
				var o2 = b.status.toLowerCase()
				var n1 = a.name.toLowerCase()
				var n2 = b.name.toLowerCase()

				if(o1 < o2) return -1
				if(o1 > o2) return 1
				if(n1 < n2) return -1
				if(n1 > n2) return 1
				return 0
			})
			onlineSort = false
		}
		nameSort = false
		gameSort = false
		return tempArr
	}

	function sortByGame(arr) {
		var tempArr = arr
		if(!gameSort) {
			tempArr.sort(function(a, b) {
				var g1 = a.game.toLowerCase()
				var g2 = b.game.toLowerCase()
				var n1 = a.name.toLowerCase()
				var n2 = b.name.toLowerCase()

				if(g1 < g2) return -1
				if(g1 > g2) return 1
				if(n1 < n2) return -1
				if(n1 > n2) return 1
				return 0
			})
			var len = tempArr.length
			for(var i = 0; i < len; i++) {
				if(tempArr[i].game == '') {
					tempArr.push(tempArr.splice(i, 1)[0])
					i--
					len--
				}
			}
			gameSort = true
		} else {
			tempArr.sort(function(a, b) {
				var g1 = a.game.toLowerCase()
				var g2 = b.game.toLowerCase()
				var n1 = a.name.toLowerCase()
				var n2 = b.name.toLowerCase()

				if(g1 > g2) return -1
				if(g1 < g2) return 1
				if(n1 < n2) return -1
				if(n1 > n2) return 1
				return 0
			})
			var len = tempArr.length
			for(var i = 0; i < len; i++) {
				if(tempArr[i].game == '') {
					tempArr.push(tempArr.splice(i, 1)[0])
					i--
					len--
				}
			}
			gameSort = false
		}
		nameSort = false
		onlineSort = false
		return tempArr
	}

	function getDBData() {
		return $http.get('php/getRows.php').then(successCallback, errorCallback)
		function successCallback(data) {
			var response = data.data
			for(var i = 0; i < response.length; i++) {
				var obj = {
					name: response[i].Name,
					dispName: response[i].DisplayName,
					link: response[i].TwitchLink,
					logo: response[i].Logo
				}
				streamerArr.push(obj.name)
				streamList.push(obj)
			}
			getStreamData(streamerArr)
			return streamList
		}
		function errorCallback(data) {
			return data
		}
	}

	function getStreamData(arr) {
		var sArr = arr
		var channels = sArr.toString()
		var onArr = []
		var onNames = []
		var offArr = []
		var allArr = []

		return $http.get('https://api.twitch.tv/kraken/streams?channel=' + channels + '&client_id=iqs4zor9q0wcwvpuselud1811eg881')
		.then(function(response) {
			var onCount = 0
			for(var i = 0; i < sArr.length; i++) {
				for(var j = 0; j < response.data._total; j++) {
					if(sArr[i] == response.data.streams[j].channel.name) {
						var obj = {
							name: sArr[i],
							status: 'Online',
							game: response.data.streams[j].channel.game
						}
						onArr.push(obj)
						onNames.push(sArr[i])
						allArr.push(obj)
					}
				}
				if(!onNames.includes(sArr[i])) {
					var obj = {
						name: sArr[i],
						status: 'Offline',
						game: ''
					}
					offArr.push(obj)
					allArr.push(obj)
				}
			}
			onlineList = allArr
			combineLists(streamList, onlineList)
		})
	}

	function combineLists(arr, arr2) {
		var sList = arr
		var oList = arr2

		for(var i = 0; i < sList.length; i++) {
			sList[i].status = oList[i].status
			sList[i].game = oList[i].game
		}
	}

	function addToDB(str) {
		return $http.get('https://api.twitch.tv/kraken/users/' + str + '?client_id=iqs4zor9q0wcwvpuselud1811eg881')
		.then(function(response) {
			var data = {
				DisplayName: response.data.display_name,
				Name: response.data.name,
				ApiLink: 'https://api.twitch.tv/kraken/streams/' + response.data.name + '?client_id=iqs4zor9q0wcwvpuselud1811eg881',
				TwitchLink: 'https://www.twitch.tv/' + response.data.name,
				Logo: response.data.logo
			}
			var obj = {
				name: response.data.name,
				dispName: response.data.display_name,
				link: 'https://www.twitch.tv/' + response.data.name,
				logo: response.data.logo
			}

			$http.get('https://api.twitch.tv/kraken/streams/' + str + '?client_id=iqs4zor9q0wcwvpuselud1811eg881')
			.then(function(response) {
				if(response.data.stream != null) {
					obj.status = 'Online'
					obj.game = response.data.stream.channel.game
				} else {
					obj.status = 'Offline'
					obj.game = ''
				}
				streamerArr.push(obj.name)
				streamList.push(obj)
			})
			$http.post('php/addRow.php', data)
		}, function(response) {
			return response
		})
	}

	function removeFromDB(ind) {
		var data = {
			Name: streamerArr[ind]
		}
		$http.post('php/delRow.php', data)
		streamerArr.splice(ind, 1)
		streamList.splice(ind, 1)
	}

	return {
		getDBData: getDBData,
		addToDB: addToDB,
		removeFromDB: removeFromDB,
		streamerArr: streamerArr,
		streamList: streamList,
		sortByName: sortByName,
		sortByOnline: sortByOnline,
		sortByGame: sortByGame
	}
}])