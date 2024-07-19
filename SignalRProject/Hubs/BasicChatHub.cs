using Microsoft.AspNetCore.SignalR;
using SignalRProject.Data;

namespace SignalRProject.Hubs
{
    public class BasicChatHub:Hub
    {
        private readonly ApplicationDbContext _dbcontext;

        public BasicChatHub(ApplicationDbContext dbContext) 
        {
            _dbcontext=dbContext;
        }
        public async Task PushMessageToAll(string user,string message)
        {
            await Clients.All.SendAsync("receivedMessage",user,message);
        }

        public async Task SendMessage (string sender,string reciver, string message)
        {
            var userId=_dbcontext.Users.FirstOrDefault(e=>e.Email.ToLower()==reciver.ToLower()).Id;
            if (!string.IsNullOrEmpty(userId))
            {
                await Clients.User(userId).SendAsync("receivedMessage", sender, message);

            }
        }

    }
}
