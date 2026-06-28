import {setScore, watchContext} from '../libs/yzLeaderboard'

//排行榜
type LeaderBoardWrapper = Record<string, any>;

var LeaderBoardWrap: LeaderBoardWrapper = {}


LeaderBoardWrap.setScore = function(name, score, callback) {
    
    if (fbInTools.usefbIn) {
        //yz
        /*FBInstant.getLeaderboardAsync(name)
        .then(function(leaderboard) {
            return leaderboard.setScoreAsync(score, "");
        })
        .then(function(entry) {
            if (callback != null) callback(true)
        });*/
        setScore(score)
    }
}

LeaderBoardWrap.Init = function() {
    if (fbInTools.usefbIn) {
        watchContext()
    }
}

export default LeaderBoardWrap
