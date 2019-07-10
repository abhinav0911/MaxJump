var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
var state;
var src;
var flag = 0;
var flag1 = 0;
var Timer;
var scr;
var level=2;
var ino="";
var uname="";
var score1=0;

const cells = document.querySelectorAll('.cell');
startGame();

function home(){
	flag=0;
	stopTimer();
	startGame();
}

function logout(){
	ino="";
	uname="";
	score1=0;
	document.getElementById("yourRank").style.display = "none";
	home();
	document.getElementById("stn").innerText = "";
	document.getElementById("lgt").style.display = "none";
	document.getElementById("lgn").style.display = "block";
}
function openForm() {
	document.getElementById("myForm").style.display = "block";
}

function cancel(){
	document.getElementById("myForm").style.display = "none";
}

function closeForm(form){
	ino = form.ino.value;
	uname= form.uname.value;
	// console.log("I-No.: " + ino + ", Username: "+uname);
	if(ino!="" && uname!=""){
		flag1=1;
		home();
		document.getElementById("myForm").style.display = "none";
		document.getElementById("stn").innerText = ("Hello "+uname);
		document.getElementById("lgn").style.display = "none";
		document.getElementById("lgt").style.display = "block";
	}
}

function setLevel1(){
	level=2;
	document.getElementById("Level").innerText = ('Level: 1');
	newGame();
}

function setLevel2(){
	level=4;
	document.getElementById("Level").innerText = ('Level: 2');
	newGame();
}

function setLevel3(){
	level=3;
	document.getElementById("Level").innerText = ('Level: 3');
	newGame();
}

function newGame() {
	flag=1;
	scr=0;
	startGame();
	stopTimer();
	onTimer();
}

function onTimer(){
	var sec=0, min=0;
    Timer = setInterval(function() {
		sec++;
		scr++;
		if(sec==60){
			sec=0;
			min++;
		}
		if(min==3){
			var v=cntTroops();
			score1=(20+2*(v.c2-v.c1));
			leaderBoard();
			document.querySelector(".endgame").style.display = "block";
			document.querySelector(".endgame .text").innerText = 'Tie Game!\nYour Score:'+(score1);
			document.getElementById("curPlayer").innerText = "Click on New Game";
			disBoard();
			stopTimer();
		}
		var str="0";
		str+=(min+':');
		if(sec/10<1)	str+="0";
		str+=sec;
    	document.getElementById("Timer").innerText = str;
	}, 1000);
}

function stopTimer(){
	clearTimeout(Timer);
}

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	if(flag1==0)
		document.getElementById("lgt").style.display = "none";
	origBoard = Array.from(Array(13).keys());
	state=false;
	for (let i = 0; i < 6; i++) {
		cells[i].innerText = 'O';
		origBoard[i] = 'O';
		if(flag==1)
			cells[i].addEventListener('click', turnClick, false);
	}
	cells[6].innerText = '';
	if(flag==1)
		cells[6].addEventListener('click', turnClick, false);
	for (let i = 7; i < 13; i++) {
		cells[i].innerText = 'X';
		origBoard[i] = 'X';
		if(flag==1)
			cells[i].addEventListener('click', turnClick, false);
	}
	if(flag==0){
		document.getElementById("curPlayer").innerText = "Click on New Game";
		document.getElementById("Level").innerText = "Level: 1";
	}
	else
		document.getElementById("curPlayer").innerText = "Current Player: Human ('O')";
	document.getElementById("Timer").innerText = '00:00';
	leaderBoard();
}

function turnClick(square){
	let cd=square.target.id;
	if(origBoard[cd]=='O'){
		state=true;
		src=cd;
	}
	else if(state==true){
		let d=makeMove(origBoard,huPlayer,src,cd);
		if((d.s1)!=-1){
			for(let id=0;id<13;id++){
				if(origBoard[id]=='O' || origBoard[id]=='X')
					document.getElementById(id).innerText = origBoard[id];
				else
					document.getElementById(id).innerText = '';
			}
			document.getElementById("curPlayer").innerText = "Current Player: AI ('X')";
			state=false;
			if(checkWin()){
				console.log("You Win!");
				score1=(48+2*(checkWin().c2)+240-scr);
				leaderBoard();
				document.querySelector(".endgame").style.display = "block";
				document.querySelector(".endgame .text").innerText = 'You Win!\nYour Score:'+score1;
				document.getElementById("curPlayer").innerText = "Click on New Game";
				disBoard();
				stopTimer();
			}
			else{
				setTimeout(function(){
					let move=bestSpot();
					let s=move.src;
					let t=move.tgt;
					//console.log(move.score);
					let d1=makeMove(origBoard,aiPlayer,s,t);
					for(let id=0;id<13;id++){
						if(origBoard[id]=='O' || origBoard[id]=='X')
							document.getElementById(id).innerText = origBoard[id];
						else
							document.getElementById(id).innerText = '';
					}
					document.getElementById("curPlayer").innerText = "Current Player: Human ('O')";
					if(checkWin()){
						console.log("You Lose!");
						score1=(6-(checkWin().c1));
						leaderBoard();
						document.querySelector(".endgame").style.display = "block";
						document.querySelector(".endgame .text").innerText = 'You Lose!\nYour Score:'+score1;
						document.getElementById("curPlayer").innerText = "Click on New Game";
						disBoard();
						stopTimer();
					}
				}, 1000);
			}
		} 
	} 
}

function cntTroops(){
	let c1=0;
	let c2=0;
	let score={};
	for(let i=0;i<13;i++){
		if(origBoard[i]=='X'){
			c1++;
		}
		else if(origBoard[i]=='O'){
			c2++;
		}
	}
	score.c1=c1;
	score.c2=c2;
	return score;
}
function checkWin() {
	let score=cntTroops();
	if(score.c1==0 || score.c2==0)
		return score;
	return false;
}

function disBoard(){
	for (let i = 0; i < 13; i++) {
		cells[i].innerText = '';
		origBoard[i]=i;
		cells[i].removeEventListener('click', turnClick, false);
	}
}
function bestSpot() {
	return minimax(origBoard, aiPlayer,level);
}

function diff(board){
	let c1=0;
	let c2=0;
	for(let i=0;i<13;i++){
		if(board[i]=='X'){
			c1++;
		}
		else if(board[i]=='O'){
			c2++;
		}
	}
	return (c1*30)/c2;
}

function minimax(board, player, depth) {
	if(checkWin(board) && player==huPlayer){
		return {score: 1800};
	}
	else if(checkWin(board) && player==aiPlayer){
		return {score: -1800};
	}
	else if(depth==0){
		return {score: diff(board)};
	}

	var moves=[];
	for(let i=0;i<13;i++){
		for(let j=0;j<13;j++){
			let d=makeMove(board,player,i,j);
			if(d.s1!=-1){
				var move={};
				move.src=i;
				move.tgt=j;
				if(player==aiPlayer){
					var result = minimax(board, huPlayer,depth-1);
					if(!result)
						move.score=diff(board);
					else
						move.score = result.score;
				} 
				else{
					var result = minimax(board, aiPlayer,depth-1);
					if(!result)
						move.score=diff(board);
					else
						move.score = result.score;
				}
				board[i]=player;
				board[j]=j;
				if((d.cid)!=-1){
					board[d.cid]=((player==aiPlayer)?'O':'X');
				}
				moves.push(move);
			}
		}
	}

	//return moves[Math.floor(Math.random() * moves.length)];
	var bestMove;
	if(player == aiPlayer) {
		var bestScore = Number.NEGATIVE_INFINITY;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} 
	else {
		var bestScore = Number.POSITIVE_INFINITY;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	let a=[];
	for(let i=0;i<moves.length;i++){
		if(moves[i].score==moves[bestMove].score){
			a.push(moves[i]);
		}
	}
	a.sort(() => Math.random() - 0.5);
	return a[0];
}

function makeMove(board, player, source, target){
	var d={};
	d.s1=-1;
	d.t1=-1;
	d.cid=-1;
	if(board[source]!=player)
		return d;
	let other;
	if(player==huPlayer)	other=aiPlayer;
	else	other=huPlayer;

	if(board[target]==target){
		if(target == 0){
			if(source==2 && board[1] == other){
				d.s1=2;
				d.t1=0;
				d.cid=1;
				board[2] = 2;
				board[1] = 1;
				board[target]=player;
			}
			else if(source==6 && board[3] == other){
				d.s1=6;
				d.t1=0;
				d.cid=3;
				board[6] = 6;
				board[3] = 3;
				board[target]=player;
			}
			else if(source==1){
				d.s1=1;
				d.t1=0;
				board[1] = 1;
				board[target]=player;
			}
			else if(source==3){
				d.s1=3;
				d.t1=0;
				board[3] = 3;
				board[target]=player;
			}
		}
		else if(target == 1){
			if(source==6 && board[4] == other){
				d.s1=6;
				d.t1=1;
				d.cid=4;
				board[6] = 6;
				board[4] = 4;
				board[target]=player;
			}
			else if(source==0){
				d.s1=0;
				d.t1=1;
				board[0] = 0;
				board[target]=player;
			}
			else if(source==2){
				d.s1=2;
				d.t1=1;
				board[2] = 2;
				board[target]=player;
			}
			else if(source==4){
				d.s1=4;
				d.t1=1;
				board[4] = 4;
				board[target]=player;
			}
		}
		else if(target == 2){
			if(source==0 && board[1] == other){
				d.s1=0;
				d.t1=2;
				d.cid=1;
				board[0] = 0;
				board[1] = 1;
				board[target]=player;
			}
			else if(source==6 && board[5] == other){
				d.s1=6;
				d.t1=2;
				d.cid=5;
				board[6] = 6;
				board[5] = 5;
				board[target]=player;
			}
			else if(source==1){
				d.s1=1;
				d.t1=2;
				board[1] = 1;
				board[target]=player;
			}
			else if(source==5){
				d.s1=5;
				d.t1=2;
				board[5] = 5;
				board[target]=player;
			}
		}
		else if(target == 3){
			if(source==5 && board[4] == other){
				d.s1=5;
				d.t1=3;
				d.cid=4;
				board[5] = 5;
				board[4] = 4;
				board[target]=player;
			}
			else if(source==9 && board[6] == other){
				d.s1=9;
				d.t1=3;
				d.cid=6;
				board[6] = 6;
				board[9] = 9;
				board[target]=player;
			}
			else if(source==0){
				d.s1=0;
				d.t1=3;
				board[0] = 0;
				board[target]=player;
			}
			else if(source==4){
				d.s1=4;
				d.t1=3;
				board[4] = 4;
				board[target]=player;
			}
			else if(source==6){
				d.s1=6;
				d.t1=3;
				board[6]=6;
				board[target]=player;
			}
		}
		else if(target == 4){
			if(source==8 && board[6] == other){
				d.s1=8;
				d.t1=4;
				d.cid=6;
				board[8] = 8;
				board[6] = 6;
				board[target]=player;
			}
			else if(source==1){
				d.s1=1;
				d.t1=4;
				board[1] = 1;
				board[target]=player;
			}
			else if(source==6){
				d.s1=6;
				d.t1=4;
				board[6] = 6;
				board[target]=player;
			}
			else if(source==3){
				d.s1=3;
				d.t1=4;
				board[3] = 3;
				board[target]=player;
			}
			else if(source==5){
				d.s1=5;
				d.t1=4;
				board[5]=5;
				board[target]=player;
			}
		}
		else if(target == 5){
			if(source==3 && board[4] == other){
				d.s1=3;
				d.t1=5;
				d.cid=4;
				board[3] = 3;
				board[4] = 4;
				board[target]=player;
			}
			else if(source==7 && board[6] == other){
				d.s1=7;
				d.t1=5;
				d.cid=6;
				board[7] = 7;
				board[6] = 6;
				board[target]=player;
			}
			else if(source==2){
				d.s1=2;
				d.t1=5;
				board[2] = 2;
				board[target]=player;
			}
			else if(source==4){
				d.s1=4;
				d.t1=5;
				board[4] = 4;
				board[target]=player;
			}
			else if(source==6){
				d.s1=6;
				d.t1=5;
				board[6]=6;
				board[target]=player;
			}
		}
		else if(target == 6){
			if(source==0 && board[3] == other){
				d.s1=0;
				d.t1=6;
				d.cid=3;
				board[0] = 0;
				board[3] = 3;
				board[target]=player;
			}
			else if(source==1 && board[4] == other){
				d.s1=1;
				d.t1=6;
				d.cid=4;
				board[1] = 1;
				board[4] = 4;
				board[target]=player;
			}
			else if(source==2 && board[5] == other){
				d.s1=2;
				d.t1=6;
				d.cid=5;
				board[5] = 5;
				board[2] = 2;
				board[target]=player;
			}
			else if(source==10 && board[7] == other){
				d.s1=10;
				d.t1=6;
				d.cid=7;
				board[10] = 10;
				board[7] = 7;
				board[target]=player;
			}
			else if(source==11 && board[8] == other){
				d.s1=11;
				d.t1=6;
				d.cid=8;
				board[11] = 11;
				board[8] = 8;
				board[target]=player;
			}
			else if(source==12 && board[9] == other){
				d.s1=12;
				d.t1=6;
				d.cid=9;
				board[12] = 12;
				board[9] = 9;
				board[target]=player;
			}
			else if(source==3){
				d.s1=3;
				d.t1=6;
				board[3] = 3;
				board[target]=player;
			}
			else if(source==4){
				d.s1=4;
				d.t1=6;
				board[4] = 4;
				board[target]=player;
			}
			else if(source==5){
				d.s1=5;
				d.t1=6;
				board[5] = 5;
				board[target]=player;
			}
			else if(source==7){
				d.s1=7;
				d.t1=6;
				board[7] = 7;
				board[target]=player;
			}
			else if(source==8){
				d.s1=8;
				d.t1=6;
				board[8] = 8;
				board[target]=player;
			}
			else if(source==9){
				d.s1=9;
				d.t1=6;
				board[9] = 9;
				board[target]=player;
			}
		}
		else if(target == 7){
			if(source==9 && board[8] == other){
				d.s1=9;
				d.t1=7;
				d.cid=8;
				board[9] = 9;
				board[8] = 8;
				board[target]=player;
			}
			else if(source==5 && board[6] == other){
				d.s1=5;
				d.t1=7;
				d.cid=6;
				board[6] = 6;
				board[5] = 5;
				board[target]=player;
			}
			else if(source==8){
				d.s1=8;
				d.t1=7;
				board[8] = 8;
				board[target]=player;
			}
			else if(source==10){
				d.s1=10;
				d.t1=7;
				board[10] = 10;
				board[target]=player;
			}
			else if(source==6){
				d.s1=6;
				d.t1=7;
				board[6]=6;
				board[target]=player;
			}
		}
		else if(target == 8){
			if(source==4 && board[6] == other){
				d.s1=4;
				d.t1=8;
				d.cid=6;
				board[4] = 4;
				board[6] = 6;
				board[target]=player;
			}
			else if(source==11){
				d.s1=11;
				d.t1=8;
				board[11] = 11;
				board[target]=player;
			}
			else if(source==6){
				d.s1=6;
				d.t1=8;
				board[6] = 6;
				board[target]=player;
			}
			else if(source==7){
				d.s1=7;
				d.t1=8;
				board[7] = 7;
				board[target]=player;
			}
			else if(source==9){
				d.s1=9;
				d.t1=8;
				board[9]=9;
				board[target]=player;
			}
		}
		else if(target == 9){
			if(source==7 && board[8] == other){
				d.s1=7;
				d.t1=9;
				d.cid=8;
				board[8] = 8;
				board[7] = 7;
				board[target]=player;
			}
			else if(source==3 && board[6] == other){
				d.s1=3;
				d.t1=9;
				d.cid=6;
				board[6] = 6;
				board[3] = 3;
				board[target]=player;
			}
			else if(source==12){
				d.s1=12;
				d.t1=9;
				board[12] = 12;
				board[target]=player;
			}
			else if(source==8){
				d.s1=8;
				d.t1=9;
				board[8] = 8;
				board[target]=player;
			}
			else if(source==6){
				d.s1=6;
				d.t1=9;
				board[6]=6;
				board[target]=player;
			}
		}
		else if(target == 10){
			if(source==12 && board[11] == other){
				d.s1=12;
				d.t1=10;
				d.cid=11;
				board[12] = 12;
				board[11] = 11;
				board[target]=player;
			}
			else if(source==6 && board[7] == other){
				d.s1=6;
				d.t1=10;
				d.cid=7;
				board[6] = 6;
				board[7] = 7;
				board[target]=player;
			}
			else if(source==11){
				d.s1=11;
				d.t1=10;
				board[11] = 11;
				board[target]=player;
			}
			else if(source==7){
				d.s1=7;
				d.t1=10;
				board[7] = 7;
				board[target]=player;
			}
		}
		else if(target == 11){
			if(source==6 && board[8] == other){
				d.s1=6;
				d.t1=11;
				d.cid=8;
				board[6] = 6;
				board[8] = 8;
				board[target]=player;
			}
			else if(source==12){
				d.s1=12;
				d.t1=11;
				board[12] = 12;
				board[target]=player;
			}
			else if(source==10){
				d.s1=10;
				d.t1=11;
				board[10] = 10;
				board[target]=player;
			}
			else if(source==8){
				d.s1=8;
				d.t1=11;
				board[8] = 8;
				board[target]=player;
			}
		}
		else if(target == 12){
			if(source==10 && board[11] == other){
				d.s1=10;
				d.t1=12;
				d.cid=11;
				board[10] = 10;
				board[11] = 11;
				board[target]=player;
			}
			else if(source==6 && board[9] == other){
				d.s1=6;
				d.t1=12;
				d.cid=9;
				board[6] = 6;
				board[9] = 9;
				board[target]=player;
			}
			else if(source==11){
				d.s1=11;
				d.t1=12;
				board[11] = 11;
				board[target]=player;
			}
			else if(source==9){
				d.s1=9;
				d.t1=12;
				board[9] = 9;
				board[target]=player;
			}
		}
	}
	return d;
}

function leaderBoard(){
// 	let port = process.env.PORT || 1234;
	var score=score1.toString();
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			
			// console.log(this.responseText);

			var myArr = JSON.parse(this.responseText);
			// console.log(myArr[0].ino);
			setTable(myArr);
		}
	};
	
	xhttp.open("GET", "https://maxjump.herokuapp.com/leaderboard?ino="+ino+"&uname="+uname+"&score="+score, true);
	xhttp.send();
}

function setTable(myArr){
	var k=50;
	if(ino!="" && uname!=""){
		document.getElementById("yourRank").style.display = "block";
		document.getElementById("yourRank").innerText=("Your Rank: "+myArr[5].score);
		console.log("Your Rank: "+myArr[5].score);
	}
	for(let i=0;i<5;i++){
		var ino1=myArr[i].ino;
		var un=myArr[i].uname;
		var sc=myArr[i].score;
		document.getElementById(k++).innerText=ino1;
		document.getElementById(k++).innerText=un;
		document.getElementById(k++).innerText=sc;
	}
}



