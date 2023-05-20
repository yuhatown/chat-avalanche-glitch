//socket.io 팩키지 참조
const SocketIO = require("socket.io");



//socket.js모듈 기능정의
module.exports =(server)=>{

    //서버 소켓 연결객체를 생성
    const io = SocketIO(server, {path:"/socket.io"});
    
    // 웹브라우저와 웹서버의 socket.js가 연결이 될때 발생되는 connection
    io.on("connection", (socket)=>{

        // 웹브라우저(채팅클라이언트)에서 broadcast라는 이름으로 데이터를 보내오면
        // 해당 데이터를 수신하는 서버측 이벤트 수신기
        socket.on("broadcast", function(msg){

            // 모든 socket.js에 연결된 사용자(웹브라우저/채팅클라이언트)에게 receiveAll 이름으로
            // 서버측에서 메시지를 보낸다. 
            io.emit("receiveAll", msg);
            //socket.broadcast.emit("receive",msg);
       
        });

        // 서버 socket.js내 broadcast1이라는 서버 이벤트수신기 기능을 정의한다.
        socket.on('broadcast1', function(msgData) {

            var sendMsg = `[${msgData.nickName}]님이 {${msgData.msg}}라고 메시지를 보냈습니다.`;
            io.emit("receiveAll", sendMsg);

        });


        // 클라이언트에서 3개의 파라메터(매개변수)전달해오니까... 3개의 매개변수를 정의하자
        socket.on('broadcast2', function(nick, msg, sample) {


            var  sendMsg = `[${nick}]님이 {${msg}}라고 메시지를 보냈습니다.${sample}`;
            // var  sendMsg = `[${nick}]님이 {${msg}}라고 메시지를 보냈습니다.` +  sample;



            // 클라이언트 이벤트 수신기명은 receiveData로 보낸다.
            io.emit("receiveData", sendMsg);

        });

        // broadcast3 이벤트 수신기 정의
        socket.on('broadcast3', function(nick, msg, sample) {
            // 클라이언트 이벤트 수신기명을 sampleEven로 보낸다. 
            io.emit("sampleEvent", nick, msg, sample)
        })

        socket.on('entry', function(roomId, nickName){

            // 채팅방 사용자 입장처리하기
            // roomId 채팅방을 없으면 만들고, 있으면 기존 채팅방을 사용한다. 
            // 현재 연결 사용자의 ConnectionID를 해당 채널의 사용자로 자동 등록해준다. 
            socket.join(roomId.toString());

            // 현재 입장 사용자에게만 메시지를 전송한다.
            // socket.emit('클라이언트 이벤트수신기명, 데이터...') 메소드는 현재 연결 사용자 한명에게만 메시지를 보낸다. 
            socket.emit("entryok",`본인 채팅방 입장완료!!! ${nickName} 님으로 입장했습니다.`);

            // 현재 접속자를 제외한 같은 채팅방내 모든 사용자에게 메시지 발송
            // socket.to(roomId).emit() 해당 채널 Id 사용자 중 나를 뺀 현재 채팅방에 접속해있는 모든 사람에게 메시지를 보낸다. 
            socket.to(roomId).emit("entryok",`${nickName} 님이 채팅방에 입장했습니다`);
         })
         
        // 서버 그룹채팅 메시지 수신 및 발신 이벤트 수신기
        socket.on('groupMsg', function(channelId, nickName, msg) {

            // 해당 채팅방내 모든 접속자들에게 그룹 메시지를 보낸다. 
            var msg = ` ${nickName}: ${msg} `;
            io.to(channelId).emit("getGroupMsg",channelId, nickName, msg);
        })
    
    });
}