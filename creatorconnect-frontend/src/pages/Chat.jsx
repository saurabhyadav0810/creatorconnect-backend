import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/useAuth";
import { createConversation, getConversations, getMessages } from "../api/chatApi";
import styles from "./Chat.module.css";

const SOCKET_URL = "http://localhost:3000";

const Chat = () => {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [draft, setDraft] = useState("");
    const [startUserId, setStartUserId] = useState("");
    const [error, setError] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const activeConversation = useMemo(() => {
        return conversations.find((c) => c._id === activeConversationId) || null;
    }, [conversations, activeConversationId]);

    const receiver = useMemo(() => {
        if (!activeConversation || !user) return null;
        return activeConversation.participants?.find((p) => p._id !== user._id) || null;
    }, [activeConversation, user]);

    useEffect(() => {
        const loadConversations = async () => {
            try {
                const response = await getConversations();
                if (response.success) {
                    setConversations(response.conversations || []);
                } else {
                    setError(response.message || "Failed to load conversations");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load conversations");
            } finally {
                setLoadingConversations(false);
            }
        };

        loadConversations();
    }, []);

    useEffect(() => {
        if (!user?._id) return;

        socketRef.current = io(SOCKET_URL, {
            withCredentials: true
        });

        socketRef.current.emit("register", user._id);

        socketRef.current.on("receive_message", (message) => {
            if (message?.conversation === activeConversationId) {
                setMessages((prev) => [...prev, message]);
            }
            setConversations((prev) =>
                prev.map((conv) =>
                    conv._id === message?.conversation
                        ? { ...conv, lastMessage: message }
                        : conv
                )
            );
        });

        socketRef.current.on("message_sent", (message) => {
            if (message?.conversation === activeConversationId) {
                setMessages((prev) => [...prev, message]);
            }
            setConversations((prev) =>
                prev.map((conv) =>
                    conv._id === message?.conversation
                        ? { ...conv, lastMessage: message }
                        : conv
                )
            );
        });

        socketRef.current.on("typing", ({ senderId }) => {
            if (senderId === receiver?._id) {
                setIsTyping(true);
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                typingTimeoutRef.current = setTimeout(() => {
                    setIsTyping(false);
                }, 1000);
            }
        });

        return () => {
            socketRef.current?.disconnect();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [user?._id, activeConversationId, receiver?._id]);

    useEffect(() => {
        if (!activeConversationId) return;

        setIsTyping(false);
        const loadMessages = async () => {
            setLoadingMessages(true);
            try {
                const response = await getMessages(activeConversationId);
                if (response.success) {
                    setMessages(response.messages || []);
                } else {
                    setError(response.message || "Failed to load messages");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load messages");
            } finally {
                setLoadingMessages(false);
            }
        };

        loadMessages();
    }, [activeConversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleStartConversation = async (event) => {
        event.preventDefault();
        if (!startUserId.trim()) return;

        try {
            const response = await createConversation(startUserId.trim());
            const conversation = response.conversation || response;
            if (conversation?._id) {
                setConversations((prev) => {
                    const exists = prev.find((c) => c._id === conversation._id);
                    return exists ? prev : [conversation, ...prev];
                });
                setActiveConversationId(conversation._id);
                setStartUserId("");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to start conversation");
        }
    };

    const handleSend = () => {
        if (!draft.trim() || !receiver?._id) return;
        socketRef.current?.emit("sendMessage", {
            senderId: user._id,
            receiverId: receiver._id,
            text: draft.trim()
        });
        setDraft("");
        setIsTyping(false);
    };

    const handleTyping = () => {
        if (receiver?._id && user?._id) {
            socketRef.current?.emit("typing", {
                senderId: user._id,
                receiverId: receiver._id
            });
        }
    };

    return (
        <div className={styles["chat-page"]}>
            <aside className={styles["chat-sidebar"]}>
                <div className={styles["chat-sidebar-header"]}>
                    <h2>Messages</h2>
                    <p>Pick a conversation or start a new one.</p>
                </div>

                <form className={styles["chat-start"]} onSubmit={handleStartConversation}>
                    <label htmlFor="start-user">Start by User ID</label>
                    <div className={styles["chat-start-row"]}>
                        <input
                            id="start-user"
                            type="text"
                            value={startUserId}
                            onChange={(event) => setStartUserId(event.target.value)}
                            placeholder="Paste user id"
                        />
                        <button type="submit">Start</button>
                    </div>
                </form>

                <div className={styles["chat-list"]}>
                    {loadingConversations ? (
                        <p className={styles["chat-placeholder"]}>Loading conversations...</p>
                    ) : conversations.length === 0 ? (
                        <p className={styles["chat-placeholder"]}>No conversations yet.</p>
                    ) : (
                        conversations.map((conv) => {
                            const participant = conv.participants?.find((p) => p._id !== user?._id) || conv.participants?.[0];
                            const preview = conv.lastMessage?.text || "Start chatting";
                            return (
                                <button
                                    key={conv._id}
                                    className={`${styles["chat-list-item"]} ${conv._id === activeConversationId ? styles.active : ""}`}
                                    onClick={() => setActiveConversationId(conv._id)}
                                >
                                    <div>
                                        <h4>{participant?.name || "Unknown"}</h4>
                                        <p>{preview}</p>
                                    </div>
                                    <span className={styles["chat-pill"]}>Chat</span>
                                </button>
                            );
                        })
                    )}
                </div>
            </aside>

            <section className={styles["chat-window"]}>
                {activeConversation ? (
                    <>
                        <header className={styles["chat-header"]}>
                            <div>
                                <h3>{receiver?.name || "Conversation"}</h3>
                                <span>{receiver?.email || ""}</span>
                            </div>
                        </header>

                        <div className={styles["chat-messages"]}>
                            {loadingMessages ? (
                                <p className={styles["chat-placeholder"]}>Loading messages...</p>
                            ) : messages.length === 0 ? (
                                <p className={styles["chat-placeholder"]}>No messages yet. Say hi!</p>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message._id}
                                        className={`${styles["chat-bubble"]} ${message.sender === user?._id ? styles.sent : styles.received}`}
                                    >
                                        <p>{message.text}</p>
                                        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                ))
                            )}
                            {isTyping && (
                                <div className={styles["typing-indicator"]}>
                                    <span>{receiver?.name || "User"} is typing...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <footer className={styles["chat-input"]}>
                            <input
                                type="text"
                                value={draft}
                                onChange={(event) => {
                                    setDraft(event.target.value);
                                    handleTyping();
                                }}
                                placeholder="Type a message..."
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                            <button onClick={handleSend}>Send</button>
                        </footer>
                    </>
                ) : (
                    <div className={styles["chat-empty"]}>
                        <h3>Pick a conversation</h3>
                        <p>Choose someone from the left or start a new chat.</p>
                        {error ? <span className={styles["chat-error"]}>{error}</span> : null}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Chat;
