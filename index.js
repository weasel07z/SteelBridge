// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, set, onValue, get, child, query, orderByChild } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const topScores = query(ref(db, 'Scores'), orderByChild('points'));

function addScore(name, points){
    if(name == "" || points == "") return;
    set(ref(db, 'Scores/' + name), {
        username: name,
        points: points
    });
}
document.getElementById("uploadButton").addEventListener("click", () => {
    // Dynamically load and execute the script.js file when the button is clicked
    import('./script.js').then((module) => {
        module.readCSV(); // Assuming script.js exports a function called runScript
    }).catch(error => {
        console.error('Error loading script.js:', error);
    });
});
// document.getElementById("uploadButton").addEventListener("click", () => {
//     // var name = document.getElementById("name").value;
//     // var points = parseInt(document.getElementById("score").value);
//     // console.log(name, points);
//     // addScore(name,points);
//     // printLeaderboard();

// });

console.log(app);

export function printLeaderboard(){
    onValue(topScores, function(snapshot) {
        var leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';

        snapshot.forEach(function(childSnapshot) {
            var data = childSnapshot.val();
            var playerName = data.username;
            var playerPoints = data.points;
            playerName = playerName.substring(0,30);
            var li = document.createElement('li');
            li.innerHTML = '<span id="words">' + playerName + '</span><span>' + playerPoints + ' points</span>';
            leaderboardList.prepend(li);
        });
    });
}
printLeaderboard();