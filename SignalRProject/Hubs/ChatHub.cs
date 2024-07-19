using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRProject.Data;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SignalRProject.Hubs
{
	public class ChatHub:Hub
	{
        private readonly ApplicationDbContext _dbcontext;

        public ChatHub(ApplicationDbContext dbContext)
        {
            _dbcontext = dbContext;
        }
        public  override Task OnConnectedAsync()
        {
            var userId=Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userId))
            {
                var userName = _dbcontext.Users.FirstOrDefault(e => e.Id == userId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserConnected", userName,userId,HubConnections.HasUser(userId)).GetAwaiter().GetResult();
                HubConnections.AddUserConnection(userId, Context.ConnectionId);
            }
            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (HubConnections.HasUserConnection(userId,Context.ConnectionId))
            {
                var userConnection = HubConnections.Users[userId];
                userConnection.Remove(Context.ConnectionId);
                
                HubConnections.Users.Remove(userId);
                if (userConnection.Any())
                {
                    HubConnections.Users.Add(userId, userConnection);
                }
                if (!string.IsNullOrEmpty(userId))
                {
                    var userName = _dbcontext.Users.FirstOrDefault(e => e.Id == userId).UserName;
                    Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserDisConnected", userName, userId, HubConnections.HasUser(userId)).GetAwaiter().GetResult();
                    HubConnections.AddUserConnection(userId, Context.ConnectionId);
                }
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendAddRoomMessage(int maxRoom,int roomId,string roomName)
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _dbcontext.Users.FirstOrDefault(e => e.Id == userId).UserName;
            await Clients.All.SendAsync("SendAddRoomMessage",maxRoom,roomId,roomName,userId,userName);
        }
        public async Task SendDeleteRoomMessage(int deleted,int selected,string roomName)
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _dbcontext.Users.FirstOrDefault(e => e.Id == userId).UserName;
            await Clients.All.SendAsync("SendDeleteRoomMessage", roomName, userId, userName);
        }
        public async Task SendMessagePublic(string publicMessage, string roomName, int roomId)
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _dbcontext.Users.FirstOrDefault(e => e.Id == userId).UserName;
            await Clients.All.SendAsync("SendMessagePublic", publicMessage,userId,userName,roomName,roomId);
        }
        public async Task sendPrivateMessage(string privateMessage, string userId, string userMail)
        {
            var userIdSender = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userNameSender = _dbcontext.Users.FirstOrDefault(e => e.Id == userIdSender).UserName;

            var user = _dbcontext.Users.FirstOrDefault(e => e.Id == userId);
            var AllUser = new string[] { userIdSender, user.Id };  
            await Clients.Users(AllUser).SendAsync("sendPrivateMessage",privateMessage,user.UserName,userNameSender);
        }

        public async Task SendOpenPrivateChat(string receivedId)
        {
            var senderId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var senderUserName = _dbcontext.Users.FirstOrDefault(e => e.Id == senderId).UserName;

            var reciverUserName=_dbcontext.Users.FirstOrDefault(e=>e.Id == receivedId).UserName;
            Clients.User(receivedId).SendAsync("SendOpenPrivateChat", senderId, senderUserName);
        }
        public async Task SendDeletePrivateChat(string receivedId)
        {
            var senderId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var senderUserName = _dbcontext.Users.FirstOrDefault(e => e.Id == senderId).UserName;

            var reciverUserName = _dbcontext.Users.FirstOrDefault(e => e.Id == receivedId).UserName;
            Clients.User(receivedId).SendAsync("SendDeletePrivateChat", senderUserName, reciverUserName);
        }
    }
}
