

let _lastContextId = null;
let _contextLeaderBoard = null;
let _lastContextualScore = 0;
let _current_sore = 0;

function wait(duration = 100) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, duration);
	})
}

export function setScore(value){
	_current_sore = value;
}

export async function watchContext(){
	let playerName = FBInstant.player.getName();
	while(true){
		let contextId = FBInstant.context.getID();
		if(contextId){
			let rankName = `context.${contextId}`
			if(contextId != _lastContextId){
				console.log("context change detected");
				try{
					_lastContextId = contextId;
					_contextLeaderBoard = await FBInstant.getLeaderboardAsync(rankName);
					let entry = await _contextLeaderBoard.getPlayerEntryAsync();
					_lastContextualScore = entry?entry.getScore():0;
					await _contextLeaderBoard.setScoreAsync(_lastContextualScore, "");
					await FBInstant.updateAsync({action: 'LEADERBOARD',name: rankName,text:`${playerName} joined this game`})
				}catch(e){
					console.log("rank msg failed:",e);
				}
			}

			if(_contextLeaderBoard && _current_sore > _lastContextualScore){
				try{
					console.log("score change detected")
					await _contextLeaderBoard.setScoreAsync(_current_sore,"");
					await FBInstant.updateAsync({action: 'LEADERBOARD',name: rankName});
					_lastContextualScore = _current_sore;
				}catch(e){
					console.log("score changed update failed:",e);
				}
			}
		}
		await wait(3000);
	}
}
