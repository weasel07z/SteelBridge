// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, set, onValue, query, orderByChild } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVLdga-K3mays-RQmEnIbUzUSY8JxH5x0",
  authDomain: "steel-bridge.firebaseapp.com",
  projectId: "steel-bridge",
  storageBucket: "steel-bridge.appspot.com",
  messagingSenderId: "118916526604",
  appId: "1:118916526604:web:9c931c34d48948287c7429",
  measurementId: "G-L2Q8JCLFNX",
  databaseURL: "https://steel-bridge-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const northScores = query(ref(db, 'North'), orderByChild('cost'));
const southScores = query(ref(db, 'South'), orderByChild('cost'));

function addScore(name, cost, direction) {
    if (name == "" || cost == "") return;
    if (direction == "South") {
        set(ref(db, 'South/' + name), {
            username: name,
            cost: cost
        });
    } else if (direction == "North") {
        set(ref(db, 'North/' + name), {
            username: name,
            cost: cost
        });
    }
}
function resetDatabase() {
    set(ref(db, 'North'), {});
    set(ref(db, 'South'), {});
    printLeaderboard();
}

document.getElementById("uploadButton").addEventListener("click", () => {
    if(window.isResetConfirmed == true) {
        resetDatabase();
    } else if(document.getElementById("name").value == "RESET") {
        return;
    }else {
        setTimeout(function() {
            var name = document.getElementById("name").value;
            var direction = document.getElementById("bridgeSide").value;
            var cost = parseInt(document.getElementById("cost").innerHTML);
            
            addScore(name, cost, direction);
        }, 200);
    }
    printLeaderboard();
});
export function printLeaderboard() {
    // North Scores
    onValue(northScores, function(snapshot) {
        var northLeaderboard = document.getElementById('northLeaderboardList');
        northLeaderboard.innerHTML = '';

        snapshot.forEach(function(childSnapshot) {
            var data = childSnapshot.val();
            var playerName = data.username;
            var playerPoints = data.cost;
            playerName = playerName.substring(0, 30);
            var li = document.createElement('li');
            li.innerHTML = '<span>' + playerName + '</span><span>$' + playerPoints + '</span>';
            northLeaderboard.append(li);
        });
    });

    // South Scores
    onValue(southScores, function(snapshot) {
        var southLeaderboard = document.getElementById('southLeaderboardList');
        southLeaderboard.innerHTML = '';

        snapshot.forEach(function(childSnapshot) {
            var data = childSnapshot.val();
            var playerName = data.username;
            var playerPoints = data.cost;
            playerName = playerName.substring(0, 30);
            var li = document.createElement('li');
            li.innerHTML = '<span>' + playerName + '</span><span>$' + playerPoints + '</span>';
            southLeaderboard.append(li);
        });
    });
}

printLeaderboard();

