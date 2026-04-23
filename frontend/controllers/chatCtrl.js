app.controller("ChatCtrl", function ($scope, $http, AuthService, $timeout, $routeParams, $location) {

    if (!AuthService.isLoggedIn()) {
        $location.path("/login");
        return;
    }

    $scope.currentUser = AuthService.getUsername();
    $scope.conversations = [];
    $scope.messages = [];
    $scope.selectedUser = null;
    $scope.chat = { message: "" };
    $scope.isConnected = false;

    // Initialize Socket.io
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
        console.log("Connected to Socket.io ID:", socket.id);
        $scope.$apply(() => {
            $scope.isConnected = true;
        });
        // Join my own room to receive messages
        socket.emit("join", $scope.currentUser);
    });

    socket.on("receiveMessage", (data) => {
        console.log("Message Received:", data);
        $scope.$apply(() => {
            // If chatting with this user, append message
            if ($scope.selectedUser === data.sender) {
                $scope.messages.push({
                    sender: data.sender,
                    text: data.message,
                    timestamp: new Date()
                });
                scrollToBottom();
            }
            // Refresh conversations to show new last message/order
            loadConversations();
        });
    });

    // Load Conversations
    function loadConversations() {
        $http.get("http://localhost:5000/api/chat/conversations/" + $scope.currentUser)
            .then(res => {
                $scope.conversations = res.data; // List of { otherUser, lastMessage }
            })
            .catch(err => console.error("Error loading conversations", err));
    }

    // Load Messages for selected user
    $scope.selectUser = function (user) {
        console.log("Selecting user:", user);
        if (!user) {
            console.error("No user provided to selectUser");
            return;
        }
        $scope.selectedUser = user;

        // Fetch history
        $http.get(`http://localhost:5000/api/chat/messages/${$scope.currentUser}/${user}`)
            .then(res => {
                console.log("Messages loaded:", res.data.length);
                $scope.messages = res.data; // Array of { sender, text, timestamp }
                scrollToBottom();
            })
            .catch(err => console.error("Error loading messages", err));
    };

    // Send Message
    $scope.sendMessage = function () {
        if (!$scope.chat.message.trim() || !$scope.selectedUser) return;

        const msgText = $scope.chat.message;

        // 1. Emit to Server (Real-time and DB save)
        socket.emit("sendMessage", {
            sender: $scope.currentUser,
            recipient: $scope.selectedUser,
            message: msgText
        });

        // 2. Optimistic UI Update
        $scope.messages.push({
            sender: $scope.currentUser,
            text: msgText,
            timestamp: new Date()
        });

        $scope.chat.message = "";
        scrollToBottom();
        loadConversations(); // Update side list last message
    };

    // Delete Chat
    $scope.deleteChat = function () {
        if (!confirm("Are you sure you want to delete this conversation? It will be removed for BOTH sides.")) return;

        $http.delete(`http://localhost:5000/api/chat/messages/${$scope.currentUser}/${$scope.selectedUser}`)
            .then(res => {
                alert("Conversation deleted.");
                $scope.messages = [];
                $scope.selectedUser = null;
                $scope.chat.message = "";
                loadConversations();
            })
            .catch(err => {
                console.error("Error deleting chat", err);
                alert("Failed to delete chat: " + (err.data?.message || err.message));
            });
    };

    function scrollToBottom() {
        $timeout(() => {
            const chatContainer = document.getElementById("chatMessages");
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 100);
    }

    // Initial Load
    loadConversations();

    // If URL has ?user=xxx param, start chat immediately
    if ($routeParams.user) {
        $scope.selectUser($routeParams.user);
    }

    // Cleanup
    $scope.$on('$destroy', function () {
        socket.disconnect();
    });

});
